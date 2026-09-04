import { NextResponse } from "next/server";

import { applyAuthCookies, farmitLogin, jsonError } from "@/lib/farmit";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string;
      password?: string;
    } | null;
    const email = body?.email?.trim() ?? "";
    const password = body?.password ?? "";
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Email and password are required." },
        },
        { status: 400 }
      );
    }

    const tokens = await farmitLogin(email, password);
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
