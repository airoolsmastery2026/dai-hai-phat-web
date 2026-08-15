interface CrossfadeImage {
  imageBase64: string;
  mimeType: string;
}

function imageDataUrl(image: CrossfadeImage): string {
  return `data:${image.mimeType};base64,${image.imageBase64}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Không thể đọc ảnh để dựng chuyển cảnh."));
    image.src = src;
  });
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  zoom: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom;
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height,
  );
}

export async function buildCrossfadeVideo(
  raw: CrossfadeImage,
  finished: CrossfadeImage,
): Promise<Blob> {
  if (typeof MediaRecorder === "undefined") {
    throw new Error(
      "Trình duyệt này chưa hỗ trợ tạo video preview. Hai ảnh vẫn dùng được bình thường.",
    );
  }

  const [rawImage, finishedImage] = await Promise.all([
    loadImage(imageDataUrl(raw)),
    loadImage(imageDataUrl(finished)),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ dựng chuyển cảnh.");

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };
  const stopped = new Promise<Blob>((resolve) => {
    recorder.onstop = () =>
      resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
  });

  recorder.start();
  const holdStart = 800;
  const fadeDuration = 3_200;
  const holdEnd = 800;
  const total = holdStart + fadeDuration + holdEnd;
  const startedAt = performance.now();

  await new Promise<void>((resolve) => {
    const frame = (now: number) => {
      const elapsed = now - startedAt;
      context.globalAlpha = 1;
      if (elapsed < holdStart) {
        drawCover(context, rawImage, canvas.width, canvas.height, 1);
      } else if (elapsed < holdStart + fadeDuration) {
        const progress = (elapsed - holdStart) / fadeDuration;
        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        drawCover(context, rawImage, canvas.width, canvas.height, 1 + 0.04 * eased);
        context.globalAlpha = eased;
        drawCover(context, finishedImage, canvas.width, canvas.height, 1.04);
        context.globalAlpha = 1;
      } else if (elapsed < total) {
        drawCover(context, finishedImage, canvas.width, canvas.height, 1.04);
      } else {
        recorder.stop();
        resolve();
        return;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });

  return stopped;
}
