import { NextRequest, NextResponse } from "next/server";

import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/types";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession =
    Boolean(request.cookies.get(ACCESS_COOKIE)?.value) ||
    Boolean(request.cookies.get(REFRESH_COOKIE)?.value);
  const isPublic =
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  if (!hasSession && !isPublic) {
    const login = new URL("/login", request.url);
    return NextResponse.redirect(login);
  }

  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
