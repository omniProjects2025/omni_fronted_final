import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CanonicalService {
  private baseUrl = 'https://omnihospitals.in';

  constructor(private metaService: Meta) {}

  /**
   * Set canonical URL for the current page
   * @param path - The path after the domain (e.g., '/our-specialities')
   */
  setCanonicalUrl(path: string = ''): void {
    const canonicalUrl = `${this.baseUrl}${path}`;
    
    // Remove existing canonical tag if it exists
    this.metaService.removeTag('rel="canonical"');
    
    // Add new canonical tag
    this.metaService.addTag({
      rel: 'canonical',
      href: canonicalUrl
    });
  }

  /**
   * Set canonical URL with full URL
   * @param fullUrl - Complete URL including domain
   */
  setCanonicalUrlFull(fullUrl: string): void {
    // Remove existing canonical tag if it exists
    this.metaService.removeTag('rel="canonical"');
    
    // Add new canonical tag
    this.metaService.addTag({
      rel: 'canonical',
      href: fullUrl
    });
  }

  /**
   * Get base URL for the application
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}
