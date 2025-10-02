// API client: base URL and fetch helpers

export const API_BASE_URL = "https://crowdshipping-ruby.vercel.app/api/v1";

// API configuration
export const API_KEY = "TTPK_26369a22-f01f-4dcd-b494-3ac058f9ed19";

export type Query = Record<
  string,
  string | number | boolean | undefined | null
>;

export type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  query?: Query;
  body?: unknown;
  token?: string | null;
};

const buildUrl = (path: string, query?: Query) => {
  const base = API_BASE_URL.replace(/\/$/, "");
  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(base + cleanedPath);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }
  return url.toString();
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", headers, query, body, token } = options;
  const url = buildUrl(path, query);

  const requestHeaders: Record<string, string> = {
    Accept: "application/json, text/plain;q=0.9,*/*;q=0.8",
    "x-api-key": API_KEY,
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const res = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = (isJson && text ? JSON.parse(text) : (text as unknown)) as T;

  if (!res.ok) {
    // Build a richer error object that carries parsed response data
    const error: any = new Error(`API error ${res.status} ${res.statusText}`);
    error.status = res.status;
    error.statusText = res.statusText;
    try {
      error.data = isJson && text ? JSON.parse(text) : text;
    } catch {
      error.data = text;
    }
    throw error as Error;
  }

  return data;
}

export const get = <T = unknown>(
  path: string,
  query?: Query,
  headers?: Record<string, string>,
  token?: string | null
) => apiFetch<T>(path, { method: "GET", query, headers, token });

export const post = <T = unknown>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
  token?: string | null
) => apiFetch<T>(path, { method: "POST", body, headers, token });

export const put = <T = unknown>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
  token?: string | null
) => apiFetch<T>(path, { method: "PUT", body, headers, token });

export const patch = <T = unknown>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
  token?: string | null
) => apiFetch<T>(path, { method: "PATCH", body, headers, token });

export const del = <T = unknown>(
  path: string,
  headers?: Record<string, string>,
  token?: string | null
) => apiFetch<T>(path, { method: "DELETE", headers, token });
