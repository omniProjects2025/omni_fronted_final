import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'videoUrl'
})
export class VideoUrlPipe implements PipeTransform {
  private cache = new Map<string, SafeResourceUrl>();

  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    if (!url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    // Check if we have a cached version
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Create sanitized URL with parameters - remove autoplay to prevent reloading
    const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${url}?mute=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`
    );

    // Cache the result
    this.cache.set(url, sanitizedUrl);

    return sanitizedUrl;
  }
}
