import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CanonicalService {
  // This app is deployed on campaign.omnihospitals.in — canonical URLs must
  // point HERE, since this is where the page actually lives, not the brand's
  // main domain.
  // TODO: move into environment.ts (environment.siteBaseUrl) once confirmed,
  // for a single source of truth shared with LandingCampaignComponent's
  // SITE_BASE_URL constant.
  private readonly baseUrl = 'https://campaign.omnihospitals.in';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Preferred method. Pass a relative path (e.g. router.url) — this builds
   * the canonical URL by prepending baseUrl. Any query string or hash is
   * stripped automatically: a canonical tag should represent the clean,
   * de-duplicated page, not one specific tracked visit to it (UTM params,
   * etc.), so callers don't need to remember to strip it themselves.
   */
  setCanonicalUrl(path = ''): void {
    const pathOnly = path.split('?')[0].split('#')[0];
    const normalizedPath = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;

    this.applyLink(`${this.baseUrl}${normalizedPath}`);
  }

  /**
   * Escape hatch for when you already have a full, trusted absolute URL —
   * e.g. content that genuinely canonicalizes to a different domain than
   * baseUrl. Used exactly as given, no normalization or prefixing.
   */
  setCanonicalUrlFull(fullUrl: string): void {
    this.applyLink(fullUrl);
  }

  /**
   * @deprecated Kept only so any existing setCanonicalURL(...) call sites
   * elsewhere in the app keep working without a separate find-and-replace.
   * Prefer setCanonicalUrl() (relative path) or setCanonicalUrlFull() (full
   * URL) in new code. Unlike the old version of this method, this does NOT
   * fall back to window.location.href when no argument is passed — that
   * wasn't SSR-safe and could leak query/UTM params into the canonical tag.
   * A URL is now required.
   */
  setCanonicalURL(url: string): void {
    if (/^https?:\/\//i.test(url)) {
      this.setCanonicalUrlFull(url);
    } else {
      this.setCanonicalUrl(url);
    }
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  private applyLink(href: string): void {
    if (!this.document.head) {
      return;
    }

    let link = this.document.querySelector<HTMLLinkElement>(
      "link[rel='canonical']",
    );

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', href);
  }
}
