import { apiClient, buildUrl } from "@/lib/api/client";

const ALLOWED_PREFIXES = [
  "public/",
  "customer/",
  "cart",
  "compare",
  "search",
];

function isAllowedPath(pathSegments) {
  const joined = pathSegments.join("/");
  return ALLOWED_PREFIXES.some(
    (prefix) => joined === prefix.replace(/\/$/, "") || joined.startsWith(prefix),
  );
}

async function proxyRequest(request, context) {
  const { path } = await context.params;
  const segments = Array.isArray(path) ? path : [];

  if (!segments.length || !isAllowedPath(segments)) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  if (!apiClient.baseUrl) {
    return Response.json(
      { message: "NEXT_PUBLIC_API_URL is not configured" },
      { status: 500 },
    );
  }

  const incomingUrl = new URL(request.url);
  const targetPath = `/${segments.join("/")}`;
  const targetUrl = buildUrl(targetPath);

  // Preserve query string from the browser request.
  const url = new URL(targetUrl);
  incomingUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const authorization = request.headers.get("authorization");
  if (authorization) headers.Authorization = authorization;

  const init = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  // Server-side fetch omits the browser Origin, so Laravel Sanctum
  // does not treat this as a stateful SPA request (avoids CSRF 419).
  const upstream = await fetch(url.toString(), init);
  const contentType = upstream.headers.get("content-type") || "application/json";
  const body = await upstream.arrayBuffer();

  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": contentType,
    },
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
