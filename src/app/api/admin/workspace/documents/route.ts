import { isSameOriginRequest } from "@/lib/server/api-security";
import {
  ingestWorkspaceDocument,
  listWorkspaceDocuments,
  WorkspaceDocumentValidationError,
  type WorkspaceDocument,
} from "@/lib/server/workspace-documents";
import {
  SupabaseRestError,
  SupabaseServerConfigurationError,
} from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 4 * 1024 * 1024 + 256 * 1024;

function errorResponse(message: string, status: number): Response {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    },
  );
}

function publicDocument(document: WorkspaceDocument) {
  return {
    id: document.id,
    filename: document.filename,
    mimeType: document.mimeType,
    byteSize: document.byteSize,
    sha256: document.sha256,
    extractionStatus: document.extractionStatus,
    promotedToKnowledge: document.promotedToKnowledge,
    createdAt: document.createdAt,
  };
}

export async function GET(): Promise<Response> {
  try {
    const documents = await listWorkspaceDocuments(30);
    return Response.json(
      { documents: documents.map(publicDocument) },
      {
        headers: {
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
        },
      },
    );
  } catch (error) {
    if (error instanceof SupabaseServerConfigurationError) {
      return errorResponse("Document Inbox chưa được cấu hình trên server.", 503);
    }
    return errorResponse("Không thể tải Document Inbox.", 502);
  }
}

export async function POST(request: Request): Promise<Response> {
  const requestHost = new URL(request.url).host;
  if (!isSameOriginRequest(request.headers, requestHost)) {
    return errorResponse("Nguồn upload không hợp lệ.", 403);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return errorResponse("Tệp upload vượt giới hạn của Workspace Document Inbox.", 413);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
    return errorResponse("Upload phải dùng multipart/form-data.", 415);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse("Không thể đọc dữ liệu upload.", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return errorResponse("Không tìm thấy tệp upload.", 400);
  }

  try {
    const result = await ingestWorkspaceDocument(file);
    return Response.json(
      {
        document: publicDocument(result.document),
        duplicate: result.duplicate,
      },
      {
        status: result.duplicate ? 200 : 201,
        headers: {
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
        },
      },
    );
  } catch (error) {
    if (error instanceof WorkspaceDocumentValidationError) {
      return errorResponse(error.message, 400);
    }
    if (error instanceof SupabaseServerConfigurationError) {
      return errorResponse("Document Inbox chưa được cấu hình trên server.", 503);
    }
    if (error instanceof SupabaseRestError) {
      return errorResponse("Không thể lưu metadata tài liệu.", 502);
    }
    return errorResponse("Không thể ingest tài liệu lúc này.", 502);
  }
}
