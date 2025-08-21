// API client: base URL and fetch helpers

export const API_BASE_URL = "https://example.com/api";

export type Query = Record<
  string,
  string | number | boolean | undefined | null
>;

export type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  query?: Query;
  body?: unknown;
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
  const { method = "GET", headers, query, body } = options;
  const url = buildUrl(path, query);

  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/json, text/plain;q=0.9,*/*;q=0.8",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = (isJson && text ? JSON.parse(text) : (text as unknown)) as T;

  if (!res.ok) {
    const error = new Error(
      `API error ${res.status} ${res.statusText}` + (text ? `: ${text}` : "")
    );
    throw error;
  }

  return data;
}

export const get = <T = unknown>(
  path: string,
  query?: Query,
  headers?: Record<string, string>
) => apiFetch<T>(path, { method: "GET", query, headers });

export const post = <T = unknown>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>
) => apiFetch<T>(path, { method: "POST", body, headers });

export const put = <T = unknown>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>
) => apiFetch<T>(path, { method: "PUT", body, headers });

export const patch = <T = unknown>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>
) => apiFetch<T>(path, { method: "PATCH", body, headers });

export const del = <T = unknown>(
  path: string,
  headers?: Record<string, string>
) => apiFetch<T>(path, { method: "DELETE", headers });
