type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

export class FarmitApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "FarmitApiError";
  }
}

function getApiUrl() {
  return process.env.FARMIT_API_URL ?? "http://localhost:8080";
}

async function readEnvelope<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !body?.success) {
    throw new FarmitApiError(
      response.status,
      body?.error?.code ?? "INTERNAL_ERROR",
      body?.error?.message ?? "FarmIT API request failed."
    );
  }
  return body.data as T;
}

export async function farmitPost<T>(path: string, body: unknown, accessToken?: string) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return readEnvelope<T>(response);
}

export function jsonError(error: unknown) {
  if (error instanceof FarmitApiError) {
    return Response.json(
      { success: false, error: { code: error.code, message: error.message } },
      { status: error.status }
    );
  }
  const message =
    error instanceof TypeError
      ? "Could not reach FarmIT. Is the API running on port 8080?"
      : "Something went wrong.";
  return Response.json(
    { success: false, error: { code: "INTERNAL_ERROR", message } },
    { status: 502 }
  );
}
