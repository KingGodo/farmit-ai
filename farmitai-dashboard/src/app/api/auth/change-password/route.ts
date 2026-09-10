import { NextResponse } from "next/server";

import { applyAuthCookies, farmitAuthed, jsonError } from "@/lib/farmit";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      currentPassword?: string;
      newPassword?: string;
    } | null;
    const currentPassword = body?.currentPassword ?? "";
    const newPassword = body?.newPassword ?? "";
    if (!currentPassword || newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Enter your current password and a new password of at least 8 characters.",
          },
        },
        { status: 400 }
      );
    }
    const result = await farmitAuthed<null>("/api/v1/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const response = NextResponse.json({ success: true, data: result.data });
    if (result.tokens) applyAuthCookies(response, result.tokens);
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
