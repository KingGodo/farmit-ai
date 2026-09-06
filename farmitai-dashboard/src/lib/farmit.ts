import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE,
  ApiEnvelope,
  FarmitApiError,
  REFRESH_COOKIE,
  TokenPayload,
  getApiUrl,
} from "@/lib/types";

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export function applyAuthCookies(response: NextResponse, tokens: TokenPayload) {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...cookieBase,
    maxAge: tokens.expiresInSeconds,
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...cookieBase,
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { ...cookieBase, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...cookieBase, maxAge: 0 });
  return response;
}

async function readEnvelope<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !body?.success) {
    throw new FarmitApiError(
      response.status,
      body?.error?.code ?? "INTERNAL_ERROR",
      body?.error?.message ?? "FarmIt API request failed."
    );
  }
  return body.data;
}

export async function farmitLogin(email: string, password: string) {
  const response = await fetch(`${getApiUrl()}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return readEnvelope<TokenPayload>(response);
}

export async function farmitPublic(path: string, body: unknown) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return readEnvelope<unknown>(response);
}

async function farmitRefresh(refreshToken: string) {
  const response = await fetch(`${getApiUrl()}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  return readEnvelope<TokenPayload>(response);
}

export async function farmitAuthed<T>(
  path: string,
  init: RequestInit = {}
): Promise<{ data: T; tokens?: TokenPayload }> {
  const jar = await cookies();
  let access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;

  if (!access && !refresh) {
    throw new FarmitApiError(401, "UNAUTHENTICATED", "Sign in required.");
  }

  const send = (token: string) =>
    fetch(`${getApiUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });

  let response = access
    ? await send(access)
    : new Response(null, { status: 401 });

  let tokens: TokenPayload | undefined;
  if (response.status === 401 && refresh) {
    tokens = await farmitRefresh(refresh);
    response = await send(tokens.accessToken);
  }

  const data = await readEnvelope<T>(response);
  return { data, tokens };
}

export function jsonError(error: unknown) {
  if (error instanceof FarmitApiError) {
    return NextResponse.json(
      { success: false, error: { code: error.code, message: error.message } },
      { status: error.status }
    );
  }
  const message =
    error instanceof TypeError
      ? "Could not reach FarmIt API. Is it running on port 8080?"
      : "Something went wrong.";
  return NextResponse.json(
    { success: false, error: { code: "INTERNAL_ERROR", message } },
    { status: 502 }
  );
}
