import { NextResponse } from "next/server";

import { applyAuthCookies, farmitAuthed, jsonError } from "@/lib/farmit";
import type { AuthUser } from "@/lib/types";

export async function GET() {
  try {
    const result = await farmitAuthed<AuthUser>("/api/v1/auth/me");
    const response = NextResponse.json({ success: true, data: result.data });
    if (result.tokens) applyAuthCookies(response, result.tokens);
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
