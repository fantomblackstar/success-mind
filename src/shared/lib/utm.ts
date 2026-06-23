import type { UtmPayload } from "@server/common/types";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

function isLocalHost(hostname: string) {
  const host = hostname.replace(/^www\./, "").toLowerCase();
  return LOCAL_HOSTS.has(host) || host.endsWith(".localhost");
}

export function normalizeSource(
  utmSource: string | null | undefined,
  referrer?: string | null,
): string {
  if (utmSource?.trim()) {
    const normalized = utmSource.trim().toLowerCase();
    if (isLocalHost(normalized)) return "direct";
    return normalized;
  }

  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
      if (isLocalHost(host)) return "direct";
      if (host) return host;
    } catch {
      // ignore invalid referrer
    }
  }

  return "direct";
}

export function sanitizeUtmPayload(utm: UtmPayload): UtmPayload {
  if (isLocalHost(utm.source.toLowerCase())) {
    return { ...utm, source: "direct" };
  }
  return utm;
}

export function parseUtmFromSearchParams(
  params: URLSearchParams,
  referrer?: string | null,
): UtmPayload {
  const utmSource = params.get("utm_source") ?? undefined;
  const utmMedium = params.get("utm_medium") ?? undefined;
  const utmCampaign = params.get("utm_campaign") ?? undefined;

  return sanitizeUtmPayload({
    source: normalizeSource(utmSource, referrer),
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
