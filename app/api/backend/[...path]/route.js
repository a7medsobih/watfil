import { revalidateTag } from "next/cache";

import { apiClient, buildUrl } from "@/lib/api/client";
import { cacheTags, companyTag } from "@/lib/cache";
import { env } from "@/lib/env";

/** Node runtime — needs full `fetch` + `revalidateTag` (not Edge). */
export const runtime = "nodejs";
/** Allow slow upstream without hanging forever (Vercel Pro default is higher). */
export const maxDuration = 30;

const ALLOWED_PREFIXES = [
  "public/",
  "customer/",
  "cart",
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
    revalidateTag(cacheTags.companies, "max");
    return;
  }

  // Customer company rating → refresh that company + list.
  const ratingMatch = path.match(/^customer\/companies\/([^/]+)\/rating$/);
  if (ratingMatch) {
    revalidateTag(cacheTags.companies, "max");
    revalidateTag(companyTag(ratingMatch[1]), "max");
    return;
  }

  // Unified likes (POST/DELETE /customer/likes) → bust product/company lists
  // so is_liked / likes_count on cached public payloads refresh.
  if (path === "customer/likes" || path.startsWith("customer/likes/")) {
    revalidateTag(cacheTags.products, "max");
    revalidateTag(cacheTags.companies, "max");
  }
}

async function proxyRequest(request, context) {
  const { path } = await context.params;
  const segments = Array.isArray(path) ? path : [];

  if (!segments.length || !isAllowedPath(segments)) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  if (!apiClient.baseUrl) {
    console.error(
      "[api/backend] NEXT_PUBLIC_API_URL is not configured — set it in Vercel Environment Variables",
    );
    return Response.json(
      { message: "NEXT_PUBLIC_API_URL is not configured" },
      { status: 500 },
    );
  }

  const incomingUrl = new URL(request.url);
  const targetPath = `/${segments.join("/")}`;
  const targetUrl = buildUrl(targetPath);

  // Preserve query string from the browser request (including repeated keys
  // like product_ids[]=1&product_ids[]=2 — `set` would collapse them).
  const url = new URL(targetUrl);
  incomingUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const authorization = request.headers.get("authorization");
  if (authorization) headers.Authorization = authorization;

  const method = request.method.toUpperCase();
  const isMutation = method !== "GET" && method !== "HEAD";
  const joinedPath = segments.join("/");
  // Personalized customer likes must never be cached (even if a caller
  // forgets cache: 'no-store' on the upstream fetchFromAPI options).
  const isCustomerLikes = joinedPath === "customer/likes" ||
    joinedPath.startsWith("customer/likes/");

  const init = {
    method,
    headers,
    // Non-GET must never be cached. GET through BFF is also no-store
    // (browser/proxy traffic is often personalized).
    cache: "no-store",
  };

  // Explicit guard for likes endpoints (documentation + future-proofing).
  if (isCustomerLikes) {
    init.cache = "no-store";
  }

  if (isMutation) {
    init.body = await request.text();
  }

  // Server-side fetch omits the browser Origin, so Laravel Sanctum
  // does not treat this as a stateful SPA request (avoids CSRF 419).
  const controller = new AbortController();
  const timeoutMs = 12_000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let upstream;
  try {
    upstream = await fetch(url.toString(), {
      ...init,
      signal: controller.signal,
    });
  } catch (cause) {
    clearTimeout(timer);
    const timedOut = controller.signal.aborted;
    console.error(`[api/backend] upstream ${timedOut ? "timeout" : "error"}`, {
      path: joinedPath,
      method,
      timeoutMs,
      message: cause?.message,
    });
    return Response.json(
      {
        message: timedOut
          ? `Upstream API timed out after ${timeoutMs}ms`
          : "Upstream API unreachable",
      },
      { status: timedOut ? 504 : 502 },
    );
  }
  clearTimeout(timer);

  const contentType = upstream.headers.get("content-type") || "application/json";
  const body = await upstream.arrayBuffer();

  if (!upstream.ok) {
    console.error(`[api/backend] ${method} /${joinedPath} ← ${upstream.status}`);
  }

  // Surface order create request/response in the Next.js terminal (dev).
  if (
    env.isDev &&
    joinedPath === "customer/orders" &&
    method === "POST"
  ) {
    try {
      const requestText = typeof init.body === "string" ? init.body : "";
      const responseText = new TextDecoder().decode(body);
      console.info(
        `[checkout] POST /customer/orders body →`,
        requestText.slice(0, 2000),
      );
      if (!upstream.ok) {
        console.error(
          `[checkout] POST /customer/orders ← ${upstream.status}`,
          responseText.slice(0, 2000),
        );
      }
    } catch {
      // ignore decode/log errors
    }
  }

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
