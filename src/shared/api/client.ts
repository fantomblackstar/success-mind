import { routes } from "@/shared/lib/routes";

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data as T;
}

export function trackEvent(step: string, metadata?: Record<string, unknown>) {
  return apiFetch(routes.api.funnelEvents, {
    method: "POST",
    body: JSON.stringify({ step, metadata }),
  }).catch(console.error);
}

export function initSession(search = "") {
  return apiFetch<{ sessionId: string }>(`${routes.api.funnelSession}${search}`, {
    method: "POST",
  });
}
