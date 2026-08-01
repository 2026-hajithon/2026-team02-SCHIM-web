const DEPLOYED_API_URL = "https://two026-team02-schim-server.onrender.com";
const ANONYMOUS_TOKEN_KEY = "schim.anonymousToken";

const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl = (
  configuredApiUrl || (import.meta.env.DEV ? "" : DEPLOYED_API_URL)
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN_ERROR", body = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

export function getAnonymousToken() {
  return window.localStorage.getItem(ANONYMOUS_TOKEN_KEY);
}

export function setAnonymousToken(token) {
  window.localStorage.setItem(ANONYMOUS_TOKEN_KEY, token);
}

export function clearAnonymousToken() {
  window.localStorage.removeItem(ANONYMOUS_TOKEN_KEY);
}

function resolveApiUrl(path) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}

async function parseResponseBody(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

export async function apiRequest(path, { auth = true, ...requestInit } = {}) {
  const headers = new Headers(requestInit.headers);

  if (auth) {
    const token = getAnonymousToken();

    if (!token) {
      throw new ApiError("사용자 인증 정보가 필요해요.", {
        status: 401,
        code: "AUTH_REQUIRED",
      });
    }

    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;

  try {
    response = await fetch(resolveApiUrl(path), {
      ...requestInit,
      headers,
    });
  } catch (error) {
    throw new ApiError("서버에 연결할 수 없어요.", {
      code: "NETWORK_ERROR",
      body: error,
    });
  }

  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(body?.message ?? "요청을 처리하지 못했어요.", {
      status: response.status,
      code: body?.code ?? "HTTP_ERROR",
      body,
    });
  }

  return body;
}
