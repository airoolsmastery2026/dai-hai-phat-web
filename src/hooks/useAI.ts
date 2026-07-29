"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  answerConversation,
  createAIConversation,
  getConversationQuestion,
  restoreAIConversation,
  type ConversationSession,
  type StoredImage,
} from "@/lib/ai";
import type {
  ProposalEvidenceRequest,
  ProposalEvidenceResponse,
} from "@/lib/ai/catalog";
import {
  createProjectAnalysisRequest,
  type ProjectAnalysisRequest,
  type ProjectAnalysisResponse,
} from "@/lib/ai/analysis";
import {
  createCRMHandoffRequest,
  type CRMHandoffResponse,
} from "@/lib/ai/handoff";
import { readAIDraft, serializeAIDraft } from "@/lib/ai/persistence";

const DRAFT_STORAGE_KEY = "dhp-ai-sales-engine-draft-v1";
const LEGACY_SESSION_STORAGE_KEY = "dhp-ai-sales-engine-v1";
const IMAGE_DATABASE = "dhp-ai-sales-engine-images-v1";
const IMAGE_STORE = "session-images";
const HANDOFF_TIMEOUT_MS = 20_000;
const serverSession = createAIConversation();
const listeners = new Set<() => void>();
let clientSession: ConversationSession | null = null;
let pendingDraftMigration: ConversationSession | null = null;
let pendingDraftRemoval = false;
let pendingImageRemovalSessionId: string | null = null;
let browserStorageUnavailable = false;

interface EvidenceResult {
  key: string;
  revision: number;
  data: ProposalEvidenceResponse | null;
  error: string | null;
}

interface EvidenceApiResponse {
  evidence?: ProposalEvidenceResponse;
  error?: string;
}

interface AnalysisResult {
  key: string;
  revision: number;
  data: ProjectAnalysisResponse | null;
  error: string | null;
}

interface AnalysisApiResponse {
  analysis?: ProjectAnalysisResponse;
  error?: string;
}

interface HandoffApiResponse {
  handoff?: CRMHandoffResponse;
  error?: string;
}

function readClientSession(): ConversationSession {
  if (clientSession) return clientSession;

  let persistedDraft: string | null = null;
  try {
    persistedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
  } catch {
    browserStorageUnavailable = true;
  }

  const draft = readAIDraft(persistedDraft);
  if (draft.status === "ready") {
    clientSession = restoreAIConversation(JSON.stringify(draft.session));
    return clientSession;
  }
  if (draft.status === "expired") {
    pendingDraftRemoval = true;
    pendingImageRemovalSessionId = draft.sessionId;
  } else if (draft.status === "invalid") {
    pendingDraftRemoval = true;
  }

  let legacySession: string | null = null;
  try {
    legacySession = window.sessionStorage.getItem(LEGACY_SESSION_STORAGE_KEY);
  } catch {
    browserStorageUnavailable = true;
  }
  if (legacySession) {
    clientSession = restoreAIConversation(legacySession);
    pendingDraftMigration = clientSession;
    return clientSession;
  }

  clientSession = createAIConversation();
  return clientSession;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeClientSession(next: ConversationSession): boolean {
  let saved = false;
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, serializeAIDraft(next));
    window.sessionStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
    saved = true;
  } catch {
    browserStorageUnavailable = true;
  }
  clientSession = next;
  listeners.forEach((listener) => listener());
  return saved;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Không thể lưu ảnh trong trình duyệt."));
  });
}

function openImageDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(IMAGE_DATABASE, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      const store = database.createObjectStore(IMAGE_STORE, { keyPath: "storageKey" });
      store.createIndex("sessionId", "sessionId");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Không thể mở bộ nhớ ảnh."));
  });
}

function transactionCompleted(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("Không thể hoàn tất lưu ảnh."));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("Quá trình lưu ảnh đã bị dừng."));
  });
}

async function replaceSessionImages(
  sessionId: string,
  files: readonly File[],
  images: readonly StoredImage[],
) {
  const database = await openImageDatabase();
  try {
    const transaction = database.transaction(IMAGE_STORE, "readwrite");
    const store = transaction.objectStore(IMAGE_STORE);
    const existingKeys = await requestResult(
      store.index("sessionId").getAllKeys(IDBKeyRange.only(sessionId)),
    );
    existingKeys.forEach((key) => store.delete(key));
    files.forEach((file, index) => {
      store.put({
        storageKey: images[index].storageKey,
        sessionId,
        file,
        storedAt: Date.now(),
      });
    });
    await transactionCompleted(transaction);
  } finally {
    database.close();
  }
}

async function removeSessionImages(sessionId: string) {
  const database = await openImageDatabase();
  try {
    const transaction = database.transaction(IMAGE_STORE, "readwrite");
    const store = transaction.objectStore(IMAGE_STORE);
    const keys = await requestResult(
      store.index("sessionId").getAllKeys(IDBKeyRange.only(sessionId)),
    );
    keys.forEach((key) => store.delete(key));
    await transactionCompleted(transaction);
  } finally {
    database.close();
  }
}

export function useAI() {
  const session = useSyncExternalStore(subscribe, readClientSession, () => serverSession);
  const [error, setError] = useState<string | null>(() =>
    browserStorageUnavailable
      ? "Hồ sơ vẫn dùng được trong phiên hiện tại nhưng trình duyệt không cho phép tự lưu."
      : null,
  );
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [evidenceRevision, setEvidenceRevision] = useState(0);
  const [evidenceResult, setEvidenceResult] = useState<EvidenceResult | null>(null);
  const [analysisRevision, setAnalysisRevision] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [handoffStatus, setHandoffStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [handoffError, setHandoffError] = useState<string | null>(null);
  const [handoff, setHandoff] = useState<CRMHandoffResponse | null>(null);
  const handoffControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (pendingDraftRemoval) {
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        browserStorageUnavailable = true;
      }
      pendingDraftRemoval = false;
    }

    if (pendingDraftMigration) {
      const migrated = pendingDraftMigration;
      pendingDraftMigration = null;
      writeClientSession(migrated);
    }

    const expiredSessionId = pendingImageRemovalSessionId;
    pendingImageRemovalSessionId = null;
    if (expiredSessionId) {
      void removeSessionImages(expiredSessionId).catch(() => {
        setError("Không thể xóa ảnh của bản nháp đã hết hạn.");
      });
    }
  }, []);

  const evidenceQuery = useMemo<ProposalEvidenceRequest | null>(() => {
    if (
      !session.visitedStates.includes("SIMILAR_PROJECT_SEARCH") ||
      !session.memory.service
    ) {
      return null;
    }

    return {
      service: session.memory.service,
      material: session.memory.material,
      style: session.memory.style,
      projectType: session.memory.projectType,
      dimensions: session.memory.dimensions,
      keywords: session.memory.priority ? [session.memory.priority] : undefined,
      limit: 6,
    };
  }, [
    session.memory.dimensions,
    session.memory.material,
    session.memory.priority,
    session.memory.projectType,
    session.memory.service,
    session.memory.style,
    session.visitedStates,
  ]);
  const evidenceKey = useMemo(
    () => (evidenceQuery ? JSON.stringify(evidenceQuery) : null),
    [evidenceQuery],
  );
  const analysisQuery = useMemo<ProjectAnalysisRequest | null>(() => {
    if (!session.visitedStates.includes("ANALYSIS")) return null;
    return createProjectAnalysisRequest(session.memory);
  }, [session.memory, session.visitedStates]);
  const analysisKey = useMemo(
    () => (analysisQuery ? JSON.stringify(analysisQuery) : null),
    [analysisQuery],
  );

  useEffect(() => {
    if (!evidenceKey || !evidenceQuery) return;

    const controller = new AbortController();
    let active = true;

    const loadEvidence = async () => {
      try {
        const response = await fetch("/api/ai/proposal-evidence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: evidenceKey,
          signal: controller.signal,
        });
        const payload = (await response.json()) as EvidenceApiResponse;
        if (!response.ok || !payload.evidence) {
          throw new Error(payload.error || "Không thể đối chiếu Knowledge Base.");
        }
        if (active) {
          setEvidenceResult({
            key: evidenceKey,
            revision: evidenceRevision,
            data: payload.evidence,
            error: null,
          });
        }
      } catch (caughtError) {
        if (!active || controller.signal.aborted) return;
        setEvidenceResult({
          key: evidenceKey,
          revision: evidenceRevision,
          data: null,
          error:
            caughtError instanceof Error
              ? caughtError.message
              : "Không thể đối chiếu Knowledge Base.",
        });
      }
    };

    void loadEvidence();
    return () => {
      active = false;
      controller.abort();
    };
  }, [evidenceKey, evidenceQuery, evidenceRevision]);

  useEffect(() => {
    if (!analysisKey || !analysisQuery) return;

    const controller = new AbortController();
    let active = true;

    const loadAnalysis = async () => {
      try {
        const response = await fetch("/api/ai/project-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: analysisKey,
          signal: controller.signal,
        });
        const payload = (await response.json()) as AnalysisApiResponse;
        if (!response.ok || !payload.analysis) {
          throw new Error(
            payload.error || "Không thể phân tích hồ sơ bằng Gemini.",
          );
        }
        if (active) {
          setAnalysisResult({
            key: analysisKey,
            revision: analysisRevision,
            data: payload.analysis,
            error: null,
          });
        }
      } catch (caughtError) {
        if (!active || controller.signal.aborted) return;
        setAnalysisResult({
          key: analysisKey,
          revision: analysisRevision,
          data: null,
          error:
            caughtError instanceof Error
              ? caughtError.message
              : "Không thể phân tích hồ sơ bằng Gemini.",
        });
      }
    };

    void loadAnalysis();
    return () => {
      active = false;
      controller.abort();
    };
  }, [analysisKey, analysisQuery, analysisRevision]);

  const commitAnswer = useCallback((value: string | StoredImage[]) => {
    setError(null);
    try {
      const saved = writeClientSession(
        answerConversation(readClientSession(), value),
      );
      if (!saved) {
        setError(
          "Dữ liệu đã được ghi nhận trong phiên này nhưng chưa thể tự lưu trên thiết bị.",
        );
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Không thể ghi nhận dữ liệu.");
    }
  }, []);

  const addImages = useCallback(async (files: FileList | null) => {
    if (!files) return;
    setError(null);
    setIsProcessingImages(true);
    const selectedFiles = Array.from(files);
    const current = readClientSession();
    const images = selectedFiles.map<StoredImage>((file, index) => ({
      storageKey: `${current.id}:${index}:${file.lastModified}`,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));

    try {
      const next = answerConversation(current, images);
      await replaceSessionImages(current.id, selectedFiles, images);
      if (!writeClientSession(next)) {
        setError(
          "Ảnh đã được ghi nhận trong phiên này nhưng hồ sơ chưa thể tự lưu trên thiết bị.",
        );
      }
    } catch (caughtError) {
      void removeSessionImages(current.id);
      setError(caughtError instanceof Error ? caughtError.message : "Không thể ghi nhận ảnh.");
    } finally {
      setIsProcessingImages(false);
    }
  }, []);

  const reset = useCallback(() => {
    const currentId = readClientSession().id;
    handoffControllerRef.current?.abort();
    handoffControllerRef.current = null;
    setError(null);
    setHandoff(null);
    setHandoffError(null);
    setHandoffStatus("idle");
    if (!writeClientSession(createAIConversation())) {
      setError(
        "Đã khởi tạo hồ sơ mới trong phiên này nhưng trình duyệt không cho phép tự lưu.",
      );
    }
    void removeSessionImages(currentId).catch(() => {
      setError("Không thể xóa dữ liệu ảnh của phiên trước.");
    });
  }, []);

  const retryEvidence = useCallback(() => {
    setEvidenceRevision((revision) => revision + 1);
  }, []);
  const retryAnalysis = useCallback(() => {
    setAnalysisRevision((revision) => revision + 1);
  }, []);
  const submitHandoff = useCallback(async () => {
    if (handoffControllerRef.current) return;

    const sessionId = readClientSession().id;
    const controller = new AbortController();
    handoffControllerRef.current = controller;
    const timeout = window.setTimeout(
      () => controller.abort(),
      HANDOFF_TIMEOUT_MS,
    );

    setHandoffStatus("submitting");
    setHandoffError(null);
    try {
      const body = createCRMHandoffRequest(readClientSession());
      const response = await fetch("/api/crm/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const payload = (await response.json()) as HandoffApiResponse;
      if (!response.ok || !payload.handoff) {
        throw new Error(payload.error || "Chưa thể bàn giao hồ sơ.");
      }
      if (readClientSession().id !== sessionId) return;
      setHandoff(payload.handoff);
      setHandoffStatus("success");
    } catch (caughtError) {
      if (readClientSession().id !== sessionId) return;
      setHandoffError(
        caughtError instanceof Error && caughtError.name === "AbortError"
          ? "Kết nối phản hồi quá lâu. Hồ sơ vẫn được giữ trên thiết bị."
          : caughtError instanceof Error
            ? caughtError.message
            : "Chưa thể bàn giao hồ sơ.",
      );
      setHandoffStatus("error");
    } finally {
      window.clearTimeout(timeout);
      if (handoffControllerRef.current === controller) {
        handoffControllerRef.current = null;
      }
    }
  }, []);

  const question = useMemo(() => getConversationQuestion(session), [session]);
  const evidenceIsCurrent =
    Boolean(evidenceKey) &&
    evidenceResult?.key === evidenceKey &&
    evidenceResult.revision === evidenceRevision;
  const evidenceStatus: "idle" | "loading" | "ready" | "empty" | "error" = !evidenceKey
    ? "idle"
    : !evidenceIsCurrent
      ? "loading"
      : evidenceResult?.error
        ? "error"
        : evidenceResult?.data?.images.length
          ? "ready"
          : "empty";
  const analysisIsCurrent =
    Boolean(analysisKey) &&
    analysisResult?.key === analysisKey &&
    analysisResult.revision === analysisRevision;
  const analysisStatus: "idle" | "loading" | "ready" | "error" = !analysisKey
    ? "idle"
    : !analysisIsCurrent
      ? "loading"
      : analysisResult?.error
        ? "error"
        : "ready";

  return {
    session,
    question,
    error,
    isProcessingImages,
    evidence: evidenceIsCurrent ? evidenceResult?.data ?? null : null,
    evidenceError: evidenceIsCurrent ? evidenceResult?.error ?? null : null,
    evidenceStatus,
    analysis: analysisIsCurrent ? analysisResult?.data ?? null : null,
    analysisError: analysisIsCurrent ? analysisResult?.error ?? null : null,
    analysisStatus,
    answer: commitAnswer,
    addImages,
    retryEvidence,
    retryAnalysis,
    handoff,
    handoffError,
    handoffStatus,
    submitHandoff,
    reset,
  };
}
