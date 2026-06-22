import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import {
  Inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JsonLdService {
  private renderer: Renderer2;

  /** Schemas that persist across every route (e.g. site-wide MedicalOrganization). */
  private globalScripts: HTMLScriptElement[] = [];

  /** Schemas specific to the current page/route — swapped on every navigation. */
  private pageScripts: HTMLScriptElement[] = [];

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Inject schema(s) that should persist across all route changes — e.g. the
   * site-wide Organization schema. Call this ONCE, typically from the root
   * AppComponent's ngOnInit(). Safe to call again later (e.g. if the org
   * data ever needs a runtime update) — it replaces the previous global set
   * rather than duplicating, but it is NOT affected by per-page setSchemas()/
   * clearSchemas() calls, so individual route components don't need to know
   * about it or worry about wiping it out.
   */
  setGlobalSchemas(
    schemas: Record<string, unknown> | Record<string, unknown>[],
  ): void {
    this.clearGlobalSchemas();
    this.globalScripts = this.injectAll(schemas);
  }

  /** Remove previously injected global schemas. Rarely needed in practice. */
  clearGlobalSchemas(): void {
    this.removeScripts(this.globalScripts);
    this.globalScripts = [];
  }

  /**
   * Inject schema(s) specific to the current page (e.g. campaign WebPage,
   * Physician, Offer, FAQPage, BreadcrumbList). Clears any previously
   * injected PAGE-level schemas first — global schemas are untouched.
   */
  setSchemas(
    schemas: Record<string, unknown> | Record<string, unknown>[],
  ): void {
    this.clearSchemas();
    this.pageScripts = this.injectAll(schemas);
  }

  /** Remove previously injected page-level schemas. Call on route/component destroy. */
  clearSchemas(): void {
    this.removeScripts(this.pageScripts);
    this.pageScripts = [];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────────────────────

  private injectAll(
    schemas: Record<string, unknown> | Record<string, unknown>[],
  ): HTMLScriptElement[] {
    if (!this.document.head) return [];

    const list = Array.isArray(schemas) ? schemas : [schemas];
    const injected: HTMLScriptElement[] = [];

    list.forEach((schema) => {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      this.renderer.appendChild(this.document.head, script);
      injected.push(script);
    });

    return injected;
  }

  private removeScripts(scripts: HTMLScriptElement[]): void {
    scripts.forEach((script) => {
      if (script.parentNode) {
        this.renderer.removeChild(script.parentNode, script);
      }
    });
  }
}
