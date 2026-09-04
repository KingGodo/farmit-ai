import { NextResponse } from "next/server";

import { applyAuthCookies, farmitAuthed, jsonError } from "@/lib/farmit";
import type { WaitingListItem } from "@/lib/types";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const result = await farmitAuthed<WaitingListItem>(`/api/v1/admin/waiting-list/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    const response = NextResponse.json({ success: true, data: result.data });
    if (result.tokens) applyAuthCookies(response, result.tokens);
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
