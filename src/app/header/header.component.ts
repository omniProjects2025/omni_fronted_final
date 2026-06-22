import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { UtmTrackingService } from '../services/utm-tracking.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  activeSection = 'aboutOmni'; // Default
  hoveredItem: string | null = null;
  mobileMenuOpen = false;
  isScrolled = false; // Add this property to track scroll state

  direction_icon: boolean = false;
  depertment_icon: boolean = false;
  activeTab = 'home';

  mainSite = 'https://omnihospitals.in';

  navItems = [
    {
      key: 'about',
      label: 'About us',
      url: `${this.mainSite}/about-us`,
    },
    {
      key: 'doctor',
      label: 'Find a Doctor',
      url: `${this.mainSite}/doctors`,
    },
    {
      key: 'specialities',
      label: 'Specialities',
      url: `${this.mainSite}/specialities`,
    },
    {
      key: 'locations',
      label: 'Locations',
      url: `${this.mainSite}/locations`,
    },
    {
      key: 'bookAppointment',
      label: 'Book Appointment',
      url: `${this.mainSite}/book-an-appointment`,
    },
    {
      key: 'testimonials',
      label: 'Patient Testimonials',
      url: `${this.mainSite}/patient-testimonials`,
    },
    {
      key: 'insurance',
      label: 'Insurance Partners',
      url: `${this.mainSite}/insurance-partners`,
    },
    {
      key: 'blogs',
      label: 'Blogs',
      url: `${this.mainSite}/blogs`,
    },
    {
      key: 'careers',
      label: 'Careers',
      url: `${this.mainSite}/careers`,
    },
    {
      key: 'contact',
      label: 'Contact us',
      url: `${this.mainSite}/contact-us`,
    },
  ];

  infoItems = [
    {
      id: 1,
      icon: 'assets/icons/siron_icon.gif',
      title: '24/7 Emergency',
    },
    {
      id: 2,
      icon: 'assets/icons/book_an_appointment_nav.svg',
      title: 'Book Appointment',
      route: '/book-an-appointment',
    },
    {
      id: 3,
      icon: 'assets/icons/call_bttn_nav.svg',
      title: '888 0101 000',
    },
    {
      id: 4,
      icon: 'assets/icons/nabh_patient_safety_and_quality_of care_.svg',
      title: '',
    },
  ];

  locations_details = [
    {
      id: 1,
      location_name: 'Kothapet',
      img: 'omni_kothapet.png',
    },
    {
      id: 2,
      location_name: 'Kukatpally',
      img: 'omni_kukatpally.png',
    },
    {
      id: 3,
      location_name: 'UDAI OMNI - Nampally',
      img: 'udai_omni.png',
    },
    {
      id: 4,
      location_name: 'Vizag',
      img: 'omni_vizag.png',
    },
    {
      id: 5,
      location_name: 'Giggles Vizag',
      img: 'giggles_vizag_building.png',
    },
    {
      id: 6,
      location_name: 'Kurnool',
      img: 'kurnool_location.png',
    },
  ];
  locationToggle(num: number) {}

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private utmTrackingService: UtmTrackingService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (!this.isBrowser()) {
      return;
    }

    const modals = this.document.querySelectorAll('.modal');

    modals.forEach((modal: Element) => {
      modal.addEventListener('hidden.bs.modal', () => {
        this.activeTab = '';
      });
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser()) {
      return;
    }

    const wasScrolled = this.isScrolled;
    this.isScrolled = window.scrollY > 50;

    if (this.isScrolled !== wasScrolled) {
      if (this.isScrolled) {
        this.document.body.classList.add('has-fixed-nav');
      } else {
        this.document.body.classList.remove('has-fixed-nav');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser()) {
      this.document.body.classList.remove('has-fixed-nav');
    }
  }

  scrollToTop(): void {
    if (this.isBrowser()) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  setActiveSection(sectionId: string) {
    console.log(sectionId);
    this.activeSection = sectionId;
  }

  navigateToAboutSection(sectionId: string) {
    this.hoveredItem = null;
    // this.router.navigate(['/about-us'], { queryParams: {sectionId: id} });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  /**
   * Builds an outbound link to the main site with the session's stored UTM
   * params appended. Pass a relative path (e.g. '/about-us') — it gets
   * prefixed with mainSite — or a full URL, used as-is.
   *
   * This app lives on campaign.omnihospitals.in; the main site is a
   * different origin, so sessionStorage does NOT carry over automatically
   * when the user clicks one of these links. Appending UTM params onto the
   * outbound URL is what lets the main site's own analytics/CRM still see
   * where the visit originated.
   *
   * Read live (not cached) so it always reflects whatever's currently
   * stored, even if it wasn't known yet when this component was constructed.
   */
  getNavUrl(path: string): string {
    const fullUrl = /^https?:\/\//i.test(path)
      ? path
      : `${this.mainSite}${path}`;
    if (!this.isBrowser()) {
      return fullUrl;
    }
    return this.utmTrackingService.appendToUrl(fullUrl);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
