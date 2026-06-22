import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

@Injectable({
  providedIn: 'root',
})
export class GtmService {
  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object,
  ) {}

  /** Push any arbitrary event to GTM dataLayer. */
  pushEvent(event: Record<string, unknown>): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push(event);
  }

  /** Virtual page view */
  trackPageView(pageName: string, pageUrl: string): void {
    this.pushEvent({
      event: 'virtual_page_view',
      page_name: pageName,
      page_url: pageUrl,
    });
  }

  /** Campaign view */
  trackCampaignView(
    campaignName: string,
    campaignType: string,
    utmParams: Record<string, string>,
  ): void {
    this.pushEvent({
      event: 'campaign_view',
      campaign_name: campaignName,
      campaign_type: campaignType,
      ...utmParams,
    });
  }

  /** Form submit */
  trackFormSubmit(
    formName: string,
    extras: Record<string, unknown> = {},
  ): void {
    this.pushEvent({
      event: 'form_submit',
      form_name: formName,
      ...extras,
    });
  }
}
