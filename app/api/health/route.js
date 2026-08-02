import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api/client";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 15;

/**
 * Liveness + optional upstream reachability for Vercel Function Logs.
 * GET /api/health
 * GET /api/health?upstream=1 — also probes NEXT_PUBLIC_API_URL
 */
export async function GET(request) {
  const url = new URL(request.url);
  const checkUpstream = url.searchParams.get("upstream") === "1";

  const payload = {
    status: "ok",
    hasApiUrl: Boolean(apiClient.baseUrl),
    apiHost: apiClient.baseUrl
      ? (() => {
          try {
            return new URL(apiClient.baseUrl).host;
          } catch {
            return "invalid";
          }
        })()
      : null,
    env: env.isProd ? "production" : env.isDev ? "development" : "other",
  };

  if (!checkUpstream) {
    return NextResponse.json(payload);
  }

  if (!apiClient.baseUrl) {
    return NextResponse.json(
      {
        ...payload,
        status: "misconfigured",
        upstream: { ok: false, error: "NEXT_PUBLIC_API_URL is not set" },
      },
      { status: 500 },
    );
  }

  const startedAt = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8_000);
    const upstream = await fetch(`${apiClient.baseUrl}/public/governorates`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    payload.upstream = {
      ok: upstream.ok,
      status: upstream.status,
      ms: Date.now() - startedAt,
      contentType: upstream.headers.get("content-type"),
    };

    if (!upstream.ok) {
      console.error("[api/health] upstream not ok", payload.upstream);
      return NextResponse.json(
        { ...payload, status: "degraded" },
        { status: 502 },
      );
    }

    return NextResponse.json(payload);
  } catch (cause) {
    console.error("[api/health] upstream unreachable", cause?.message);
    return NextResponse.json(
      {
        ...payload,
        status: "degraded",
        upstream: {
          ok: false,
          ms: Date.now() - startedAt,
          error: cause?.message || "fetch failed",
        },
      },
      { status: 502 },
    );
  }
}
