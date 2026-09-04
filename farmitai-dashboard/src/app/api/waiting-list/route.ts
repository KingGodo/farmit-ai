import { NextResponse } from "next/server";

import { applyAuthCookies, farmitAuthed, jsonError } from "@/lib/farmit";
import type { PaginatedWaitingList } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams.toString();
    const path = `/api/v1/admin/waiting-list${query ? `?${query}` : ""}`;
    const result = await farmitAuthed<PaginatedWaitingList>(path);
    const response = NextResponse.json({ success: true, data: result.data });
    if (result.tokens) applyAuthCookies(response, result.tokens);
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
