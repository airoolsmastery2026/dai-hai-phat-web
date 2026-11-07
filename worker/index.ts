import handler from "vinext/server/fetch-handler";

type GodotR2Object = {
  body: ReadableStream;
  httpMetadata?: {
    contentType?: string;
    cacheControl?: string;
    contentEncoding?: string;
    contentLanguage?: string;
    contentDisposition?: string;
  };
  httpEtag?: string;
};

type GodotR2Bucket = {
  get(key: string): Promise<GodotR2Object | null>;
};

type CloudflareEnv = {
  DHP_GODOT_R2?: GodotR2Bucket;
};

const GODOT_PREFIX = "/godot/gate-configurator/";

function contentTypeFor(pathname: string): string {
  if (pathname.endsWith(".wasm")) return "application/wasm";
  if (pathname.endsWith(".pck")) return "application/octet-stream";
  if (pathname.endsWith(".js")) return "application/javascript";
  if (pathname.endsWith(".json")) return "application/json";
  if (pathname.endsWith(".html")) return "text/html; charset=utf-8";
  return "application/octet-stream";
}

async function serveGodot(request: Request, env: CloudflareEnv): Promise<Response> {
  const url = new URL(request.url);
  if (!env.DHP_GODOT_R2) {
    return new Response("Godot R2 binding is not configured.", { status: 503 });
  }

  const key = url.pathname.slice(GODOT_PREFIX.length) || "index.html";
  const object = await env.DHP_GODOT_R2.get(key);
  if (!object) return new Response("Godot asset not found.", { status: 404 });

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType ?? contentTypeFor(url.pathname));
  headers.set("Cache-Control", object.httpMetadata?.cacheControl ?? "public, max-age=31536000, immutable");
  if (object.httpMetadata?.contentEncoding) headers.set("Content-Encoding", object.httpMetadata.contentEncoding);
  if (object.httpMetadata?.contentLanguage) headers.set("Content-Language", object.httpMetadata.contentLanguage);
  if (object.httpMetadata?.contentDisposition) headers.set("Content-Disposition", object.httpMetadata.contentDisposition);
  if (object.httpEtag) headers.set("ETag", object.httpEtag);

  return new Response(request.method === "HEAD" ? null : object.body, { status: 200, headers });
}

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if ((request.method === "GET" || request.method === "HEAD") && url.pathname.startsWith(GODOT_PREFIX)) {
      return serveGodot(request, env);
    }
    return handler.fetch(request, env, ctx);
  },
};
