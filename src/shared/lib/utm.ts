import type { UtmPayload } from "@server/common/types";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

function normalizeHostname(hostname: string) {
  return hostname.replace(/^www\./, "").toLowerCase();
}

function isLocalHost(hostname: string) {
  const host = normalizeHostname(hostname);
  return LOCAL_HOSTS.has(host) || host.endsWith(".localhost");
}

function isVercelHost(hostname: string) {
  const host = normalizeHostname(hostname);
  return host === "vercel.app" || host.endsWith(".vercel.app");
}

export function isDirectHost(hostname: string) {
  return isLocalHost(hostname) || isVercelHost(hostname);
}

export function normalizeStoredSource(source: string) {
  const value = source.trim().toLowerCase();
  if (!value || value === "unknown") return "direct";
  if (isDirectHost(value)) return "direct";
  return value;
}

export function normalizeSource(
  utmSource: string | null | undefined,
  referrer?: string | null,
  requestHost?: string | null,
) {
  if (utmSource?.trim()) {
    const normalized = utmSource.trim().toLowerCase();
    if (isDirectHost(normalized)) return "direct";
    return normalized;
  }

  if (referrer) {
    try {
      const host = normalizeHostname(new URL(referrer).hostname);
      if (isDirectHost(host)) return "direct";
      if (requestHost && host === normalizeHostname(requestHost)) return "direct";
      if (host) return host;
    } catch {
      // ignore invalid referrer
    }
  }

  return "direct";
}

export function sanitizeUtmPayload(utm: UtmPayload): UtmPayload {
  return {
    ...utm,
    source: normalizeStoredSource(utm.source),
  };
}

export function parseUtmFromSearchParams(
  params: URLSearchParams,
  referrer?: string | null,
  requestHost?: string | null,
): UtmPayload {
  const utmSource = params.get("utm_source") ?? undefined;
  const utmMedium = params.get("utm_medium") ?? undefined;
  const utmCampaign = params.get("utm_campaign") ?? undefined;

  return sanitizeUtmPayload({
    source: normalizeSource(utmSource, referrer, requestHost),
    utmSource,
    utmMedium,
    utmCampaign,
  });
}

export function parseUtmFromCookie(value?: string): UtmPayload | null {
  if (!value) return null;
  try {
    return sanitizeUtmPayload(JSON.parse(value) as UtmPayload);
  } catch {
    return null;
  }
}
