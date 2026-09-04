import { farmitPublic, jsonError } from "@/lib/farmit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      token?: string;
      password?: string;
    } | null;
    const token = body?.token?.trim() ?? "";
    const password = body?.password ?? "";
    if (!token || password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Choose a password with at least 8 characters.",
          },
        },
        { status: 400 }
      );
    }
    await farmitPublic("/api/v1/auth/reset-password", { token, password });
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    return jsonError(error);
  }
}
