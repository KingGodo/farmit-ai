import { NextResponse } from "next/server";

import { applyAuthCookies, farmitRegister, jsonError } from "@/lib/farmit";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string;
      phone?: string;
      password?: string;
    } | null;
    const email = body?.email?.trim() ?? "";
    const phone = body?.phone?.trim() ?? "";
    const password = body?.password ?? "";
    if (!email || !phone || password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email, phone, and a password of at least 8 characters are required.",
          },
        },
        { status: 400 }
      );
    }

    const tokens = await farmitRegister(email, phone, password);
    if (!tokens.user.roles.includes("ADMIN")) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "FORBIDDEN", message: "This account cannot access the admin dashboard." },
        },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ success: true, data: tokens.user });
    return applyAuthCookies(response, tokens);
  } catch (error) {
    return jsonError(error);
  }
}
