const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
]);
const HOSTED_VIDEO_EXTENSION = /\.(mp4|webm|mov)$/i;

function validYouTubeId(value: string | null | undefined): string | null {
  if (!value) return null;
  const candidate = value.trim();
  return YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
}

export function getYouTubeVideoId(sourceUrl: string): string | null {
  const value = sourceUrl.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;

    const host = url.hostname.toLowerCase();
    if (host === "youtu.be") {
      return validYouTubeId(url.pathname.split("/").filter(Boolean)[0]);
    }

    if (!YOUTUBE_HOSTS.has(host)) return null;

    if (url.pathname === "/watch") {
      return validYouTubeId(url.searchParams.get("v"));
    }

    const [kind, id] = url.pathname.split("/").filter(Boolean);
    if (kind === "shorts" || kind === "embed" || kind === "live") {
      return validYouTubeId(id);
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubePrivacyEmbedUrl(
  sourceUrl: string,
  autoplay = false,
): string | null {
  const id = getYouTubeVideoId(sourceUrl);
  if (!id) return null;

  const params = new URLSearchParams({ rel: "0" });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function getYouTubePosterUrl(sourceUrl: string): string | null {
  const id = getYouTubeVideoId(sourceUrl);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function isSafeHostedVideoUrl(sourceUrl: string): boolean {
  const value = sourceUrl.trim();
  if (!value) return false;

  if (value.startsWith("/")) {
    return HOSTED_VIDEO_EXTENSION.test(value.split(/[?#]/, 1)[0] ?? "");
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && HOSTED_VIDEO_EXTENSION.test(url.pathname);
  } catch {
    return false;
  }
}
