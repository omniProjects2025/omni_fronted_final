import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtmTrackingService {
  private readonly STORAGE_KEY = 'omni_utm_attribution';

  readonly UTM_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
  ];

  /** Returns the first-touch UTM set persisted for this browser session, or {} if none exists. */
  getStoredParams(): Record<string, string> {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      // sessionStorage unavailable (SSR, private browsing, etc.) — degrade gracefully.
      return {};
    }
  }

  private persist(params: Record<string, string>): void {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(params));
    } catch {
      // Non-fatal — UTM tracking still works in-memory for this page view.
    }
  }

  /**
   * First-touch capture: pulls UTM keys out of a raw route query-params object.
   * - If no first-touch record exists yet for this session, this capture becomes
   *   it and gets persisted.
   * - If one already exists, the original values win — new URL params only fill
   *   in keys that weren't already captured.
   * Returns the resulting UTM set either way (always safe to assign directly).
   */
  captureFromQueryParams(params: Record<string, any>): Record<string, string> {
    const captured: Record<string, string> = {};
    this.UTM_KEYS.forEach((key) => {
      if (params[key]) captured[key] = params[key] as string;
    });

    if (Object.keys(captured).length === 0) {
      return this.getStoredParams();
    }

    const stored = this.getStoredParams();
    if (Object.keys(stored).length === 0) {
      this.persist(captured);
      return captured;
    }

    return { ...captured, ...stored };
  }

  /**
   * Appends the stored UTM set to an absolute URL as query params — used for
   * cross-domain nav links (e.g. header nav pointing at the main site), since
   * sessionStorage itself does NOT carry across to a different subdomain/origin.
   * Preserves any existing query string on the target URL.
   */
  appendToUrl(url: string): string {
    const params = this.getStoredParams();
    const keys = Object.keys(params);
    if (keys.length === 0) return url;

    const query = new URLSearchParams(params).toString();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${query}`;
  }
}
