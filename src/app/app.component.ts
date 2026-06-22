import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CanonicalService } from './canonical.service';
import { JsonLdService } from './services/json-ld.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Omni_project';

  constructor(
    private router: Router,
    private canonicalService: CanonicalService,
    private jsonLdService: JsonLdService,
  ) {}

  ngOnInit(): void {
    // Site-wide Organization schema — injected once, persists across every
    // route. Independent from JsonLdService.setSchemas()/clearSchemas(),
    // which individual page components (e.g. campaign landing pages) use
    // for their own per-route schemas without affecting this one.
    this.jsonLdService.setGlobalSchemas({
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      name: 'Omnihospital',
      url: 'https://omnihospitals.in/',
      logo: 'https://omnihospitals.in/assets/images/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '8880101000',
        contactType: 'emergency',
        areaServed: 'IN',
        availableLanguage: 'en',
      },
      sameAs: [
        'https://www.facebook.com/INCORHospitals',
        'https://www.instagram.com/omni_hospitals/',
        'https://www.youtube.com/channel/UCLaU7cDfvVTbh4PO6GDI0ew',
        'https://www.linkedin.com/company/30885967/', // fixed — was the admin dashboard URL
      ],
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Use the router's own URL (not window.location.href) on both platforms —
        // it's SSR-safe, and stripping the query string here ensures UTM params
        // never leak into the canonical tag (a canonical URL should represent the
        // clean, de-duplicated page, not one specific tracked visit to it).
        const cleanPath = this.router.url.split('?')[0];
        this.canonicalService.setCanonicalUrl(cleanPath);
      });
  }
}
