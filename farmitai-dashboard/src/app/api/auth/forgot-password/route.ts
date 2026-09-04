import { farmitPublic, jsonError } from "@/lib/farmit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { email?: string } | null;
    const email = body?.email?.trim() ?? "";
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Enter your email address." },
        },
        { status: 400 }
      );
    }
    await farmitPublic("/api/v1/auth/forgot-password", { email });
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    return jsonError(error);
  }
}
