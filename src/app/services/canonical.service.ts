import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CanonicalService {
  private readonly baseUrl = 'https://omnihospitals.in';

  constructor(
    @Inject(DOCUMENT)
    private document: Document,
  ) {}

  setCanonicalUrl(path = ''): void {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    this.applyLink(`${this.baseUrl}${normalizedPath}`);
  }

  setCanonicalUrlFull(fullUrl: string): void {
    this.applyLink(fullUrl);
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
