import { Inject, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'videoUrl'
})
export class VideoUrlPipe implements PipeTransform {
  private cache = new Map<string, SafeResourceUrl>();

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  transform(url: string, autoplay: boolean = false): SafeResourceUrl {
    if (!url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    // Check if we have a cached version
    const cacheKey = `${url}_${autoplay}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let finalUrl = url;
    
    if (url.includes('youtube.com/embed')) {
      const urlObj = new URL(url);
      const params = urlObj.searchParams;
      
      // Essential YouTube parameters for proper functionality
      params.set('rel', '0'); // Don't show related videos
      params.set('showinfo', '0'); // Hide video info
      params.set('fs', '1'); // Enable fullscreen button
      params.set('modestbranding', '1'); // Minimal YouTube branding
      params.set('iv_load_policy', '3'); // Hide annotations
      params.set('cc_load_policy', '0'); // Hide captions by default
      params.set('playsinline', '1'); // Play inline on mobile
      params.set('enablejsapi', '1'); // Enable JavaScript API for better control
      const origin = isPlatformBrowser(this.platformId)
        ? window.location.origin
        : 'https://omnihospitals.in';
      params.set('origin', origin); // Set origin for security
      params.set('widget_referrer', origin); // Additional security
      
      // Set autoplay if requested
      if (autoplay) {
        params.set('autoplay', '1');
      } else {
        params.delete('autoplay');
      }
      
      finalUrl = urlObj.toString();
      
      // Temporary debug to verify fullscreen parameters
      if (finalUrl.includes('fs=1')) {
        console.log('✅ Fullscreen enabled:', finalUrl);
      } else {
        console.log('❌ Fullscreen missing:', finalUrl);
      }
    }
    
    const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
    this.cache.set(cacheKey, sanitizedUrl);
    return sanitizedUrl;
  }
}
