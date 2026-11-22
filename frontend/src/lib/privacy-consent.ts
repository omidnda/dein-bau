export type PrivacyConsent = {
  necessary: true;
  analytics: boolean;
  googleMaps: boolean;
  updatedAt: string;
};

export const PRIVACY_CONSENT_STORAGE_KEY = "";
export const PRIVACY_CONSENT_EVENT = "";

export function readPrivacyConsent(): PrivacyConsent | null {
  try {
    const stored = window.localStorage.getItem(PRIVACY_CONSENT_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Partial<PrivacyConsent>;
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      googleMaps: parsed.googleMaps === true,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function savePrivacyConsent(consent: PrivacyConsent) {
  window.localStorage.setItem(PRIVACY_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent(PRIVACY_CONSENT_EVENT, { detail: consent }));
}
