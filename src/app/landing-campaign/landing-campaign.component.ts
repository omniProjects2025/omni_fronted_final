import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subscription, of } from 'rxjs';
import { CanonicalService } from '../services/canonical.service';
import { DoctorDetailsService } from '../services/doctor-details.service';
import { GtmService } from '../services/gtm.service';
import { JsonLdService } from '../services/json-ld.service';
import { SeoService } from '../services/seo.service';
import {
  LeadSquaredService,
  LeadSquaredPayload,
} from '../services/leadsquared.service';
import { UtmTrackingService } from '../services/utm-tracking.service';
import { environment } from '../../environments/environment';

declare const require: any;

type CampaignType = 'doctors' | 'package' | 'testimonial';

interface Breadcrumb {
  label: string;
  path: string;
}

interface FaqItem {
  question: string;
  answer: string;
  _open?: boolean;
}

interface InternalLink {
  label: string;
  path: string;
}

interface CampaignRecord {
  slug: string;
  type: CampaignType;
  campaignName: string;
  shortDescription: string;
  cardTitle: string;
  campaignDetails: string[];
  price?: number; // Added to fix template property resolution
  originalPrice?: number; // Added to fix template property resolution
  leftPanel: {
    image?: string;
    title: string;
    name: string;
    subtitle?: string;
    bullets: string[];
    footerNote?: string;
  };
  doctorSlugUrl?: string;
  videoUrl?: string;
  seo: {
    title: string;
    description: string;
    keywords?: string;
  };
  openGraph?: {
    type?: string;
    image?: string;
  };
  breadcrumbs?: Breadcrumb[];
  faq?: FaqItem[];
  internalLinks?: InternalLink[];
}

interface CampaignResponse {
  campaigns: CampaignRecord[];
}

@Component({
  selector: 'app-landing-campaign',
  templateUrl: './landing-campaign.component.html',
  styleUrls: ['./landing-campaign.component.css'],
})
export class LandingCampaignComponent implements OnInit, OnDestroy {
  isLoading = true;
  errorMessage = '';
  campaign: CampaignRecord | null = null;
  submitSuccess = false;
  showWhatsappMessage = true;
  selectedDoctor: any = null;
  doctorProfileImageUrl = 'assets/our_doctors/doctor_dummy_image.svg';
  safeVideoUrl: SafeResourceUrl | null = null; // Sanitized resource URL wrapper for iframe embeds

  /** UTM parameters read from the current URL query string (or restored from sessionStorage). */
  utmParams: Record<string, string> = {};

  /** Safe raster fallback for og:image / twitter:image whenever a campaign's configured
   * image is missing or in a format (e.g. SVG) that social/LLM preview crawlers won't
   * render. Point this at an actual branded fallback asset once one exists. */
  private readonly DEFAULT_OG_IMAGE =
    'https://omnihospitals.in/assets/images/og-default.jpg';

  /** This app is deployed on a subdomain — self-referencing URLs (canonical, og:url,
   * JSON-LD `url`) must point HERE, since this is where the page actually lives, not
   * the main domain. TODO: move this into environment.ts (e.g. environment.siteBaseUrl)
   * once confirmed, so it's a single source of truth shared with CanonicalService too. */
  private readonly SITE_BASE_URL = 'https://campaign.omnihospitals.in';

  /** Maps URL query param names to the corresponding LeadSquared custom attribute names.
   * NOTE: these mx_UTM* fields must already exist as custom fields in the LeadSquared
   * account schema, or the API will silently drop/ignore them. Confirm field names with
   * whoever owns the LeadSquared configuration before relying on this in reporting. */
  private readonly UTM_TO_LEADSQUARED_ATTRIBUTE: Record<string, string> = {
    utm_source: 'mx_UTMSource',
    utm_medium: 'mx_UTMMedium',
    utm_campaign: 'mx_UTMCampaign',
    utm_term: 'mx_UTMTerm',
    utm_content: 'mx_UTMContent',
  };

  inquiryData = {
    fullName: '',
    phoneNumber: '',
    email: '',
    location: '',
    message: '',
  };

  private routeSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorDetailsService,
    private seoService: SeoService,
    private canonicalService: CanonicalService,
    private jsonLdService: JsonLdService,
    private gtmService: GtmService,
    private leadSquaredService: LeadSquaredService,
    private utmTrackingService: UtmTrackingService,
    private sanitizer: DomSanitizer, // Added to sanitize external video embedded assets securely
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    // Capture UTM params (first touch wins) and preserve them across navigations/reloads.
    this.initUtmTracking();

    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const slug = (params.get('slug') || '').trim().toLowerCase();
      const type = this.normalizeType(params.get('type'));
      this.loadCampaign(slug, type);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.jsonLdService.clearSchemas();
  }

  submitInquiry(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const campaignName = this.campaign?.campaignName ?? '';
    const campaignType = this.campaign?.type ?? '';

    // GTM: track form submission with campaign context and UTM data.
    this.gtmService.trackFormSubmit('campaign_inquiry', {
      campaign_name: campaignName,
      campaign_type: campaignType,
      ...this.utmParams,
    });

    // CRM: push the lead into LeadSquared with campaign + UTM attribution attached.
    this.submitLeadToCrm(campaignName, campaignType);

    this.submitSuccess = true;
    this.inquiryData = {
      fullName: '',
      phoneNumber: '',
      email: '',
      location: '',
      message: '',
    };
    form.resetForm(this.inquiryData);
  }

  closeWhatsappMessage(event: Event): void {
    event.stopPropagation();
    this.showWhatsappMessage = false;
  }

  /**
   * Navigate to an internal link while merging existing UTM query params
   * so attribution is preserved across page transitions.
   */
  navigateTo(path: string): void {
    this.router.navigate([path], {
      queryParams: this.utmParams,
      queryParamsHandling: 'merge',
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * First-touch UTM capture, delegated to UtmTrackingService (shared with
   * HeaderComponent, which uses the same stored set to tag outbound nav links
   * back to the main domain since sessionStorage doesn't cross that boundary).
   */
  private initUtmTracking(): void {
    this.utmParams = this.utmTrackingService.getStoredParams();

    this.route.queryParams.subscribe((params) => {
      this.utmParams = this.utmTrackingService.captureFromQueryParams(params);
    });
  }

  /**
   * Submit the inquiry form to LeadSquared, tagging the lead with campaign
   * context and UTM attribution. Fire-and-forget by design (matches the
   * existing optimistic submitSuccess UX) — failures are reported to GTM
   * as an event so they're visible in analytics rather than silently lost.
   */
  private submitLeadToCrm(campaignName: string, campaignType: string): void {
    const payload: LeadSquaredPayload = [
      { Attribute: 'FirstName', Value: this.inquiryData.fullName },
      { Attribute: 'Phone', Value: this.inquiryData.phoneNumber },
      { Attribute: 'EmailAddress', Value: this.inquiryData.email || '' },
      { Attribute: 'mx_City', Value: this.inquiryData.location || '' },
      { Attribute: 'Description', Value: this.inquiryData.message || '' },
      { Attribute: 'Source', Value: `Website - Campaign - ${campaignName}` },
      { Attribute: 'mx_CampaignType', Value: campaignType },
      ...this.buildUtmAttributes(),
    ];

    this.leadSquaredService.submitLead(payload).subscribe({
      next: () => {
        // Lead captured in LeadSquared — no further UI action required.
      },
      error: () => {
        // Don't block the user-facing success state on CRM availability,
        // but surface the failure in analytics so it can be monitored/alerted on.
        this.gtmService.pushEvent({
          event: 'lead_submission_error',
          campaign_name: campaignName,
          campaign_type: campaignType,
        });
      },
    });
  }

  private buildUtmAttributes(): LeadSquaredPayload {
    return Object.entries(this.utmParams)
      .filter(([key]) => this.UTM_TO_LEADSQUARED_ATTRIBUTE[key])
      .map(([key, value]) => ({
        Attribute: this.UTM_TO_LEADSQUARED_ATTRIBUTE[key],
        Value: value,
      }));
  }

  private loadCampaign(slug: string, type: CampaignType | null): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.campaign = null;
    this.selectedDoctor = null;
    this.safeVideoUrl = null;
    this.doctorProfileImageUrl = 'assets/our_doctors/doctor_dummy_image.svg';
    this.submitSuccess = false;

    if (!slug || !type) {
      this.errorMessage = 'Invalid campaign URL. Please verify the link.';
      this.isLoading = false;
      return;
    }

    this.getCampaignsConfig().subscribe({
      next: (response) => {
        const campaign = (response.campaigns || []).find(
          (item) =>
            item.slug.toLowerCase() === slug &&
            this.normalizeType(item.type) === type,
        );

        if (!campaign) {
          this.errorMessage =
            'Campaign not found. Please check the URL and try again.';
          this.isLoading = false;
          return;
        }

        this.campaign = campaign;

        // SSR-Safe Video Processing
        if (this.campaign.videoUrl) {
          let cleanUrl = this.campaign.videoUrl.trim();

          // Fallback parsing rule to catch watch URLs and rewrite them safely to embeds
          if (cleanUrl.includes('watch?v=')) {
            cleanUrl = cleanUrl.replace('watch?v=', 'embed/');
          }

          // Only bypass security trust tokens when executing inside the client browser.
          // This keeps the DOM clean during node rendering and avoids breaking serialization.
          if (isPlatformBrowser(this.platformId)) {
            this.safeVideoUrl =
              this.sanitizer.bypassSecurityTrustResourceUrl(cleanUrl);
          } else {
            this.safeVideoUrl = null;
          }
        }

        if (this.campaign.faq?.length) {
          this.campaign.faq = this.campaign.faq.map((item) => ({
            ...item,
            _open: false,
          }));
        }

        const canonicalPath = `/ld/${campaign.slug}/${campaign.type}`;

        this.applySeo(campaign, canonicalPath);
        this.applyJsonLd(campaign, canonicalPath);

        // GTM: track campaign page view with UTM attribution.
        this.gtmService.trackCampaignView(
          campaign.campaignName,
          campaign.type,
          this.utmParams,
        );

        if (campaign.type === 'doctors') {
          this.loadDoctorDetails(campaign);
          return;
        }

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'Unable to load campaign details right now. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  private getCampaignsConfig(): Observable<CampaignResponse> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<CampaignResponse>(
        'assets/json_data_files/landing_campaigns.json',
      );
    }

    try {
      const serverJson = require('../../assets/json_data_files/landing_campaigns.json');
      return of(serverJson as CampaignResponse);
    } catch {
      return of({ campaigns: [] });
    }
  }

  private loadDoctorDetails(campaign: CampaignRecord): void {
    const targetSlug = this.normalizeSlug(campaign.doctorSlugUrl || '');

    this.doctorService.getDoctors().subscribe({
      next: (response: any) => {
        const dataArray = response?.data || [];
        const allDoctors = dataArray
          .map((item: any) => item.doctors || [])
          .flat();

        if (targetSlug) {
          this.selectedDoctor =
            allDoctors.find(
              (doctor: any) =>
                this.normalizeSlug(doctor.slug_url) === targetSlug,
            ) || null;
        }

        if (!this.selectedDoctor && campaign.leftPanel?.name) {
          const campaignDoctorName = campaign.leftPanel.name
            .toLowerCase()
            .replace(/^dr\.?\s*/i, '')
            .trim();
          this.selectedDoctor =
            allDoctors.find((doctor: any) => {
              const doctorName = (doctor?.name || '')
                .toLowerCase()
                .replace(/^dr\.?\s*/i, '')
                .trim();
              return doctorName === campaignDoctorName;
            }) || null;
        }

        this.doctorProfileImageUrl = this.resolveDoctorProfileUrl(
          this.selectedDoctor?.profile,
        );
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'Doctor details could not be loaded from API. Showing campaign details only.';
        this.isLoading = false;
      },
    });
  }

  private applySeo(campaign: CampaignRecord, canonicalPath: string): void {
    const pageUrl = `${this.SITE_BASE_URL}${canonicalPath}`;

    this.seoService.applySeo({
      title: campaign.seo.title,
      description: campaign.seo.description,
      keywords: campaign.seo.keywords,
      ogType: campaign.openGraph?.type,
      ogImage: this.resolveOgImage(campaign.openGraph?.image),
      ogUrl: pageUrl,
    });

    this.canonicalService.setCanonicalUrl(canonicalPath);
  }

  private applyJsonLd(campaign: CampaignRecord, canonicalPath: string): void {
    const pageUrl = `${this.SITE_BASE_URL}${canonicalPath}`;
    const schemas: Record<string, unknown>[] = [];

    // ── 1. WebPage ──────────────────────────────────────────────────────────
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: campaign.campaignName,
      description: campaign.shortDescription,
      url: pageUrl,
      inLanguage: 'en-IN',
      ...(campaign.seo.keywords ? { keywords: campaign.seo.keywords } : {}),
      about: {
        '@type': 'MedicalOrganization',
        name: 'OMNI Hospitals',
        url: 'https://omnihospitals.in',
      },
      mainEntity: {
        '@type': this.getJsonLdEntityType(campaign.type),
        name: campaign.leftPanel.name,
        description: campaign.campaignDetails.join(' '),
      },
    });

    // ── 2. Entity schema (Physician / Offer / Review) ───────────────────────
    if (campaign.type === 'doctors') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Physician',
        name: campaign.leftPanel.name,
        description: campaign.campaignDetails.join(' '),
        medicalSpecialty: campaign.leftPanel.subtitle || '',
        worksFor: {
          '@type': 'MedicalOrganization',
          name: 'OMNI Hospitals',
          url: 'https://omnihospitals.in',
        },
        url: pageUrl,
      });
    }

    if (campaign.type === 'package') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: campaign.leftPanel.name,
        description: campaign.campaignDetails.join(' '),
        offeredBy: {
          '@type': 'MedicalOrganization',
          name: 'OMNI Hospitals',
        },
        url: pageUrl,
      });
    }

    if (campaign.type === 'testimonial') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: campaign.leftPanel.name,
        },
        reviewBody: campaign.campaignDetails.join(' '),
        itemReviewed: {
          '@type': 'MedicalOrganization',
          name: 'OMNI Hospitals',
          url: 'https://omnihospitals.in',
        },
      });
    }

    // ── 3. BreadcrumbList ───────────────────────────────────────────────────
    if (campaign.breadcrumbs?.length) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: campaign.breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.label,
          item: `https://omnihospitals.in${crumb.path}`,
        })),
      });
    }

    // ── 4. FAQPage ──────────────────────────────────────────────────────────
    if (campaign.faq?.length) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: campaign.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    }

    this.jsonLdService.setSchemas(schemas);
  }

  private normalizeType(type: string | null): CampaignType | null {
    const value = (type || '').toLowerCase().trim();
    if (value === 'doctors' || value === 'doctor') return 'doctors';
    if (
      value === 'package' ||
      value === 'healthpackage' ||
      value === 'health-package'
    )
      return 'package';
    if (
      value === 'testimonial' ||
      value === 'testimonials' ||
      value === 'patient-testimonial'
    )
      return 'testimonial';
    return null;
  }

  private getJsonLdEntityType(type: CampaignType): string {
    if (type === 'doctors') return 'Physician';
    if (type === 'package') return 'Offer';
    return 'Review';
  }

  private normalizeSlug(input: string): string {
    if (!input) return '';
    let value = input.trim();
    if (!value) return '';

    if (/^https?:\/\//i.test(value)) {
      try {
        const parsed = new URL(value);
        value = parsed.pathname || '/';
      } catch {
        // keep original value if URL parsing fails
      }
    }

    if (!value.startsWith('/')) value = `/${value}`;
    value = value.replace(/\/{2,}/g, '/');
    if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1);
    return value.toLowerCase();
  }

  /**
   * Most Open Graph / Twitter Card crawlers (Facebook, LinkedIn, X, WhatsApp) — and most
   * AI/LLM bots that bother to read og:image at all — don't render SVG as a preview image.
   * Fall back to a safe raster default instead of passing through a format that will
   * silently fail to render on those platforms.
   */
  private resolveOgImage(image?: string): string {
    const value = (image || '').trim();
    if (!value) return this.DEFAULT_OG_IMAGE;
    if (/\.svg(\?.*)?$/i.test(value)) return this.DEFAULT_OG_IMAGE;
    return value;
  }

  private resolveDoctorProfileUrl(profile?: string): string {
    const fallback = 'assets/our_doctors/doctor_dummy_image.svg';
    const value = String(profile || '').trim();
    if (!value) return fallback;
    if (/^https?:\/\//i.test(value)) return value;

    const apiBase = (environment.omniApiUrl || '').replace(/\/+$/, '');
    const originBase = apiBase.replace(/\/api$/i, '');

    if (value.startsWith('/api/')) return `${originBase}${value}`;
    if (value.startsWith('api/')) return `${originBase}/${value}`;
    if (value.startsWith('/image/')) return `${apiBase}${value}`;
    if (value.startsWith('image/')) return `${apiBase}/${value}`;
    if (value.startsWith('/images/')) return `${apiBase}${value}`;
    if (value.startsWith('images/')) return `${apiBase}/${value}`;
    if (value.startsWith('/') && !value.startsWith('/assets/'))
      return `${originBase}${value}`;

    return value;
  }
}
