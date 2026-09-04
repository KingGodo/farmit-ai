import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { clearAuthCookies } from "@/lib/farmit";
import { ACCESS_COOKIE, REFRESH_COOKIE, getApiUrl } from "@/lib/types";

export async function POST() {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;

  if (access && refresh) {
    await fetch(`${getApiUrl()}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({ refreshToken: refresh }),
    }).catch(() => undefined);
  }

  return clearAuthCookies(NextResponse.json({ success: true, data: null }));
}
