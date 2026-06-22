import type { UtmPayload } from "@server/common/types";

export function normalizeSource(
  utmSource: string | null | undefined,
  referrer?: string | null,
): string {
  if (utmSource?.trim()) {
    return utmSource.trim().toLowerCase();
  }

  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      if (host) return host;
    } catch {
      // ignore invalid referrer
    }
  }

  return "direct";
}

export function parseUtmFromSearchParams(
  params: URLSearchParams,
  referrer?: string | null,
): UtmPayload {
  const utmSource = params.get("utm_source") ?? undefined;
  const utmMedium = params.get("utm_medium") ?? undefined;
  const utmCampaign = params.get("utm_campaign") ?? undefined;

  return {
    source: normalizeSource(utmSource, referrer),
    utmSource,
    utmMedium,
    utmCampaign,
  };
}

export function parseUtmFromCookie(value?: string): UtmPayload | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as UtmPayload;
  } catch {
    return null;
  }
}
