"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GateSelection = {
  width?: number;
  height?: number;
  slatCount?: number;
  material?: string;
  color?: string;
};

type GodotMessage = {
  type?: string;
  payload?: GateSelection;
};

type Props = {
  configuratorUrl?: string;
};

const STORAGE_KEY = "dhp-gate-configurator-selection";

export function GodotGateConfigurator({ configuratorUrl }: Props) {
  const [selection, setSelection] = useState<GateSelection | null>(null);
  const [loaded, setLoaded] = useState(false);

  const consultationHref = useMemo(() => {
    const params = new URLSearchParams({ service: "cua-cong", ai: "1" });
    if (selection) params.set("configurator", JSON.stringify(selection));
    return `/ai-tu-van?${params.toString()}`;
  }, [selection]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<GodotMessage>) => {
      if (!configuratorUrl) return;

      const expectedOrigin = new URL(configuratorUrl, window.location.href).origin;
      if (event.origin !== expectedOrigin) return;
      if (event.data?.type !== "dhp:gate-selection" || !event.data.payload) return;

      setSelection(event.data.payload);
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(event.data.payload));
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [configuratorUrl]);

  if (!configuratorUrl) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)]">
        <h2 className="text-xl font-bold text-[var(--color-text)]">Cấu hình cổng 3D đang ở chế độ chuẩn bị</h2>
        <p className="mt-[var(--space-3)] text-[var(--color-text-muted)]">
          Bản Godot chạy độc lập và chỉ được tải khi có Web export URL. Website vẫn hoạt động bình thường, không kéo engine 3D vào bundle chính.
        </p>
        <Link
          href="/ai-tu-van?service=cua-cong&ai=1"
          className="mt-[var(--space-5)] inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-5)] font-semibold text-white"
        >
          Tư vấn cửa cổng
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-[var(--space-5)]">
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-black">
        {!loaded && (
          <div className="flex min-h-[420px] items-center justify-center p-[var(--space-6)] text-center text-white">
            Đang tải bộ cấu hình 3D…
          </div>
        )}
        <iframe
          src={configuratorUrl}
          title="Bộ cấu hình cửa cổng 3D Đại Hải Phát"
          loading="lazy"
          className={`h-[70vh] min-h-[520px] w-full ${loaded ? "block" : "hidden"}`}
          onLoad={() => setLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-downloads"
          allow="fullscreen"
        />
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-5)]">
        <p className="text-sm text-[var(--color-text-muted)]">
          Phối cảnh chỉ dùng để trao đổi phương án. Kích thước, vật liệu, kết cấu và giá chính thức phải được kỹ sư Đại Hải Phát xác nhận.
        </p>
        {selection && (
          <p className="mt-[var(--space-3)] font-medium text-[var(--color-text)]">
            Đã nhận cấu hình từ 3D. Tiếp tục với trợ lý tư vấn để lập hồ sơ.
          </p>
        )}
        <Link
          href={consultationHref}
          className="mt-[var(--space-4)] inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-5)] font-semibold text-white"
        >
          Gửi cấu hình để được tư vấn
        </Link>
      </div>
    </div>
  );
}
