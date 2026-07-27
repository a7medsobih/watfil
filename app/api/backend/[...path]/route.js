import { revalidateTag } from "next/cache";

import { apiClient, buildUrl } from "@/lib/api/client";
import { cacheTags, companyTag, productTag } from "@/lib/cache";

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

/**
 * After successful mutations, bust related ISR/fetch tags when we can
 * infer what changed from the proxied path.
 */
function revalidateAfterMutation(method, segments, ok) {
  if (!ok) return;
  if (method === "GET" || method === "HEAD") return;

  const path = segments.join("/");

  // Company join request submitted (admin approval is external; still
  // refresh companies list so new pending state can surface).
  if (path === "public/company-join-requests") {
    revalidateTag(cacheTags.companies);
    return;
  }

  // Customer company rating → refresh that company + list.
  const ratingMatch = path.match(/^customer\/companies\/([^/]+)\/rating$/);
  if (ratingMatch) {
    revalidateTag(cacheTags.companies);
    revalidateTag(companyTag(ratingMatch[1]));
    return;
  }

  // Company like → soft refresh company caches.
  const companyLikeMatch = path.match(/^customer\/companies\/([^/]+)\/like$/);
  if (companyLikeMatch) {
    revalidateTag(companyTag(companyLikeMatch[1]));
    return;
  }

  // Product likes → soft refresh product tag when id is present.
  const catalogLikeMatch = path.match(
    /^customer\/products\/catalog\/([^/]+)\/like$/,
  );
  if (catalogLikeMatch) {
    revalidateTag(productTag(catalogLikeMatch[1]));
    return;
  }

  const companyProductLikeMatch = path.match(
    /^customer\/companies\/([^/]+)\/products\/([^/]+)\/like$/,
  );
  if (companyProductLikeMatch) {
    revalidateTag(companyTag(companyProductLikeMatch[1]));
    revalidateTag(productTag(companyProductLikeMatch[2]));
  }
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

  const method = request.method.toUpperCase();
  const isMutation = method !== "GET" && method !== "HEAD";

  const init = {
    method,
    headers,
    // Non-GET must never be cached. GET through BFF is also no-store
    // (browser/proxy traffic is often personalized).
    cache: "no-store",
  };

  if (isMutation) {
    init.body = await request.text();
  }

  // Server-side fetch omits the browser Origin, so Laravel Sanctum
  // does not treat this as a stateful SPA request (avoids CSRF 419).
  const upstream = await fetch(url.toString(), init);
  const contentType = upstream.headers.get("content-type") || "application/json";
  const body = await upstream.arrayBuffer();

  revalidateAfterMutation(method, segments, upstream.ok);

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
