"use client";

import {
  useCallback,
  useEffect,
  useMemo,
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

const STORAGE_KEY = "dhp-ai-sales-engine-v1";
const IMAGE_DATABASE = "dhp-ai-sales-engine-images-v1";
const IMAGE_STORE = "session-images";
const serverSession = createAIConversation();
const listeners = new Set<() => void>();
let clientSession: ConversationSession | null = null;

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

function readClientSession(): ConversationSession {
  if (clientSession) return clientSession;
  clientSession = restoreAIConversation(window.sessionStorage.getItem(STORAGE_KEY));
  return clientSession;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeClientSession(next: ConversationSession) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  clientSession = next;
  listeners.forEach((listener) => listener());
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
  const [error, setError] = useState<string | null>(null);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [evidenceRevision, setEvidenceRevision] = useState(0);
  const [evidenceResult, setEvidenceResult] = useState<EvidenceResult | null>(null);

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

  const commitAnswer = useCallback((value: string | StoredImage[]) => {
    setError(null);
    try {
      writeClientSession(answerConversation(readClientSession(), value));
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
      writeClientSession(next);
    } catch (caughtError) {
      void removeSessionImages(current.id);
      setError(caughtError instanceof Error ? caughtError.message : "Không thể ghi nhận ảnh.");
    } finally {
      setIsProcessingImages(false);
    }
  }, []);

  const reset = useCallback(() => {
    const currentId = readClientSession().id;
    setError(null);
    try {
      writeClientSession(createAIConversation());
    } catch {
      setError("Không thể khởi tạo hồ sơ mới trong phiên trình duyệt.");
      return;
    }
    void removeSessionImages(currentId).catch(() => {
      setError("Không thể xóa dữ liệu ảnh của phiên trước.");
    });
  }, []);

  const retryEvidence = useCallback(() => {
    setEvidenceRevision((revision) => revision + 1);
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

  return {
    session,
    question,
    error,
    isProcessingImages,
    evidence: evidenceIsCurrent ? evidenceResult?.data ?? null : null,
    evidenceError: evidenceIsCurrent ? evidenceResult?.error ?? null : null,
    evidenceStatus,
    answer: commitAnswer,
    addImages,
    retryEvidence,
    reset,
  };
}
