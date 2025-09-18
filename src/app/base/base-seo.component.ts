import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CanonicalService } from '../services/canonical.service';
import { SEO_CONFIG } from '../config/seo-config';

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
}

@Component({
  template: ''
})
export abstract class BaseSEOComponent implements OnInit {
  constructor(
    protected titleService: Title,
    protected metaService: Meta,
    protected canonicalService: CanonicalService
  ) {}

  ngOnInit(): void {
    this.setSEOTags();
  }

  protected setSEOTags(): void {
    const seoData = this.getSEOData();
    
    // Set title
    this.titleService.setTitle(seoData.title);
    
    // Set meta description
    this.metaService.updateTag({ 
      name: 'description', 
      content: seoData.description 
    });
    
    // Set meta keywords
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: seoData.keywords 
    });
    
    // Set canonical URL
    this.canonicalService.setCanonicalUrl(seoData.canonicalPath);
  }

  /**
   * Get SEO data from configuration or override in child components
   */
  protected getSEOData(): SEOData {
    const routeName = this.getRouteName();
    return SEO_CONFIG[routeName] || this.getDefaultSEOData();
  }

  /**
   * Override this method in child components to provide route name
   */
  protected abstract getRouteName(): string;

  /**
   * Override this method in child components to provide default SEO data
   */
  protected getDefaultSEOData(): SEOData {
    return {
      title: 'OMNI Hospitals - Best Multispecialty Hospital in Hyderabad',
      description: 'Leading multispecialty hospital in Hyderabad offering expert medical care.',
      keywords: 'OMNI hospitals, multispecialty hospital Hyderabad, medical care',
      canonicalPath: '/'
    };
  }
}
