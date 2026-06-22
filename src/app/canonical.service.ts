import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CanonicalService {

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  setCanonicalURL(url?: string) {
    const existingLink = this.doc.querySelector("link[rel='canonical']");
    const canonicalUrl = url || window.location.href;

    if (existingLink) {
      existingLink.setAttribute('href', canonicalUrl);
    } else {
      const link: HTMLLinkElement = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalUrl);
      this.doc.head.appendChild(link);
    }
  }
}
