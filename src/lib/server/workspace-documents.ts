import { createHash, randomUUID } from "node:crypto";

import {
  getSupabaseServerConfig,
  SupabaseRestError,
  supabaseRestRequest,
} from "@/lib/server/supabase-rest";

const WORKSPACE_BUCKET = "dhp-workspace-documents";
const MAX_BINARY_BYTES = 4 * 1024 * 1024;
const MAX_TEXT_BYTES = 512 * 1024;
const REQUEST_TIMEOUT_MS = 15_000;

const MIME_BY_EXTENSION: Record<string, readonly string[]> = {
  txt: ["text/plain"],
  md: ["text/markdown", "text/plain"],
  csv: ["text/csv", "text/plain", "application/vnd.ms-excel"],
  json: ["application/json", "text/plain"],
  pdf: ["application/pdf"],
  xls: ["application/vnd.ms-excel"],
  xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  webp: ["image/webp"],
};

const TEXT_EXTENSIONS = new Set(["txt", "md", "csv", "json"]);

export type WorkspaceDocumentExtractionStatus = "extracted" | "pending_extraction" | "failed";

interface WorkspaceDocumentRow {
  id: string;
  filename: string;
  mime_type: string;
  byte_size: number;
  sha256: string;
  storage_bucket: string;
  storage_path: string;
  source: string;
  extraction_status: WorkspaceDocumentExtractionStatus;
  extracted_text: string | null;
  extraction_error: string | null;
  promoted_to_knowledge: boolean;
  promoted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceDocument {
  id: string;
  filename: string;
  mimeType: string;
  byteSize: number;
  sha256: string;
  extractionStatus: WorkspaceDocumentExtractionStatus;
  extractedText: string | null;
  promotedToKnowledge: boolean;
  createdAt: string;
}

export class WorkspaceDocumentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkspaceDocumentValidationError";
  }
}

function toDocument(row: WorkspaceDocumentRow): WorkspaceDocument {
  return {
    id: row.id,
    filename: row.filename,
    mimeType: row.mime_type,
    byteSize: Number(row.byte_size),
    sha256: row.sha256,
    extractionStatus: row.extraction_status,
    extractedText: row.extracted_text,
    promotedToKnowledge: row.promoted_to_knowledge,
    createdAt: row.created_at,
  };
}

function extensionOf(filename: string): string {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] ?? "";
}

function safeFilename(filename: string): string {
  const base = filename
    .split(/[\\/]/)
    .pop()
    ?.trim()
    .replace(/[^a-zA-Z0-9._ -]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 160);
  if (!base || base === "." || base === "..") {
    throw new WorkspaceDocumentValidationError("Tên tệp không hợp lệ.");
  }
  return base;
}

function validateFile(file: File): { extension: string; filename: string; maxBytes: number } {
  const filename = safeFilename(file.name);
  const extension = extensionOf(filename);
  const allowedMimeTypes = MIME_BY_EXTENSION[extension];
  if (!allowedMimeTypes) {
    throw new WorkspaceDocumentValidationError(
      "Chỉ hỗ trợ TXT, MD, CSV, JSON, PDF, XLS, XLSX, JPG, PNG và WEBP.",
    );
  }
  if (!allowedMimeTypes.includes(file.type)) {
    throw new WorkspaceDocumentValidationError("MIME type của tệp không khớp định dạng được phép.");
  }
  const maxBytes = TEXT_EXTENSIONS.has(extension) ? MAX_TEXT_BYTES : MAX_BINARY_BYTES;
  if (file.size <= 0 || file.size > maxBytes) {
    const mb = maxBytes / (1024 * 1024);
    throw new WorkspaceDocumentValidationError(`Tệp vượt giới hạn ${mb} MB cho định dạng này.`);
  }
  return { extension, filename, maxBytes };
}

function storageObjectUrl(baseUrl: string, path: string): URL {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return new URL(`/storage/v1/object/${encodeURIComponent(WORKSPACE_BUCKET)}/${encodedPath}`, baseUrl);
}

async function uploadStorageObject(path: string, mimeType: string, bytes: ArrayBuffer): Promise<void> {
  const config = getSupabaseServerConfig();
  const response = await fetch(storageObjectUrl(config.url, path), {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
      "content-type": mimeType,
      "x-upsert": "false",
    },
    body: bytes,
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Workspace storage upload failed with HTTP ${response.status}.`);
  }
}

async function deleteStorageObject(path: string): Promise<void> {
  const config = getSupabaseServerConfig();
  try {
    await fetch(storageObjectUrl(config.url, path), {
      method: "DELETE",
      headers: {
        apikey: config.serviceRoleKey,
        authorization: `Bearer ${config.serviceRoleKey}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    // Cleanup failure is intentionally swallowed; metadata insertion failure remains primary.
  }
}

async function findDocumentByHash(sha256: string): Promise<WorkspaceDocument | null> {
  const query = new URLSearchParams({
    sha256: `eq.${sha256}`,
    select: "id,filename,mime_type,byte_size,sha256,storage_bucket,storage_path,source,extraction_status,extracted_text,extraction_error,promoted_to_knowledge,promoted_at,created_at,updated_at",
    limit: "1",
  });
  const rows = await supabaseRestRequest<WorkspaceDocumentRow[]>("dhp_workspace_documents", {
    query,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  return rows[0] ? toDocument(rows[0]) : null;
}

export async function ingestWorkspaceDocument(file: File): Promise<{ document: WorkspaceDocument; duplicate: boolean }> {
  const { extension, filename } = validateFile(file);
  const bytes = await file.arrayBuffer();
  const sha256 = createHash("sha256").update(Buffer.from(bytes)).digest("hex");

  const existing = await findDocumentByHash(sha256);
  if (existing) return { document: existing, duplicate: true };

  const id = randomUUID();
  const storagePath = `documents/${id}/${filename}`;
  const extractedText = TEXT_EXTENSIONS.has(extension)
    ? new TextDecoder("utf-8", { fatal: false }).decode(bytes)
    : null;
  const extractionStatus: WorkspaceDocumentExtractionStatus = extractedText === null
    ? "pending_extraction"
    : "extracted";

  await uploadStorageObject(storagePath, file.type, bytes);

  try {
    const rows = await supabaseRestRequest<WorkspaceDocumentRow[]>("dhp_workspace_documents", {
      method: "POST",
      prefer: "return=representation",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: {
        id,
        filename,
        mime_type: file.type,
        byte_size: file.size,
        sha256,
        storage_bucket: WORKSPACE_BUCKET,
        storage_path: storagePath,
        source: "admin-workspace-upload",
        extraction_status: extractionStatus,
        extracted_text: extractedText,
        extraction_error: null,
        promoted_to_knowledge: false,
        promoted_at: null,
      },
    });
    const row = rows[0];
    if (!row) throw new Error("Workspace document metadata insert returned no row.");
    return { document: toDocument(row), duplicate: false };
  } catch (error) {
    await deleteStorageObject(storagePath);
    if (error instanceof SupabaseRestError && error.status === 409) {
      const duplicate = await findDocumentByHash(sha256);
      if (duplicate) return { document: duplicate, duplicate: true };
    }
    throw error;
  }
}

export async function listWorkspaceDocuments(limit = 30): Promise<WorkspaceDocument[]> {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
  const query = new URLSearchParams({
    select: "id,filename,mime_type,byte_size,sha256,storage_bucket,storage_path,source,extraction_status,extracted_text,extraction_error,promoted_to_knowledge,promoted_at,created_at,updated_at",
    order: "created_at.desc",
    limit: String(safeLimit),
  });
  const rows = await supabaseRestRequest<WorkspaceDocumentRow[]>("dhp_workspace_documents", {
    query,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  return rows.map(toDocument);
}
