import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  /** og:type – defaults to 'website' */
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  noindex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {

  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {}

  /**
   * Apply full SEO meta-tag set:
   * title, description, keywords, OpenGraph, and Twitter Card.
   */
  applySeo(config: SeoConfig): void {
    this.titleService.setTitle(config.title);

    this.metaService.updateTag({
      name: 'description',
      content: config.description,
    });

    this.metaService.updateTag({
      name: 'robots',
      content: 'index, follow',
    });

    this.metaService.updateTag({
      name: 'author',
      content: 'OMNI Hospitals',
    });

    this.metaService.updateTag({
      name: 'theme-color',
      content: '#0056a6',
    });

    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    }

    // ── OpenGraph ──────────────────────────────────────────────────────────
    const ogTitle = config.ogTitle || config.title;
    const ogDesc  = config.ogDescription || config.description;
    const ogType  = config.ogType || 'website';

    this.metaService.updateTag({ property: 'og:title',       content: ogTitle });
    this.metaService.updateTag({ property: 'og:description', content: ogDesc  });
    this.metaService.updateTag({ property: 'og:type', content: ogType });
    this.metaService.updateTag({ property: 'og:site_name', content: 'OMNI Hospitals', });
    this.metaService.updateTag({name: 'twitter:site',content: '@OmniHospitals',});

    if (config.ogUrl) {
      this.metaService.updateTag({ property: 'og:url', content: config.ogUrl });
    }
    if (config.ogImage) {
      this.metaService.updateTag({ property: 'og:image', content: config.ogImage });
    }

    // ── Twitter Card ───────────────────────────────────────────────────────
    this.metaService.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title',       content: ogTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: ogDesc  });

    if (config.ogImage) {
      this.metaService.updateTag({ name: 'twitter:image', content: config.ogImage });
    }

    if (config.noindex) {
      this.metaService.updateTag({
        name: 'robots',
        content: 'noindex,nofollow',
      });
    } else {
      this.metaService.updateTag({
        name: 'robots',
        content: 'index,follow',
      });
    }
  }
  
}
