import { NextResponse } from "next/server";

import { applyAuthCookies, farmitAuthed, jsonError } from "@/lib/farmit";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: Request, context: RouteContext, method: string) {
  try {
    const { path } = await context.params;
    const query = new URL(request.url).searchParams.toString();
    const target = `/api/v1/admin/${path.join("/")}${query ? `?${query}` : ""}`;
    const init: RequestInit = { method };
    if (method !== "GET" && method !== "HEAD") {
      init.body = await request.text();
    }
    const result = await farmitAuthed<unknown>(target, init);
    const response = NextResponse.json({ success: true, data: result.data });
    if (result.tokens) applyAuthCookies(response, result.tokens);
    return response;
  } catch (error) {
    return jsonError(error);
  }
}

export async function GET(request: Request, context: RouteContext) {
  return proxy(request, context, "GET");
}

export async function POST(request: Request, context: RouteContext) {
  return proxy(request, context, "POST");
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxy(request, context, "PATCH");
}
