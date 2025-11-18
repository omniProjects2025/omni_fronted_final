import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { toUrlFriendly } from '../utils/url-helper.util';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  activeSection = 'aboutOmni'; // Default
  hoveredItem: string | null = null;
  mobileMenuOpen = false;
  isScrolled = false; // Add this property to track scroll state

  direction_icon: boolean = false;
  depertment_icon: boolean = false;
  activeTab = 'home';


  navItems = [
    { key: 'home', label: '', route: '/home' },
    {
      key: 'about', label: 'About us', route: '/about-us',
      children: [
        {
          id: 'about-us', label: 'About Us', route: '/about-us'
        },
        {
          id: 'leadership-team', label: 'Leadership Team', route: '/about-us/leadership-team'
        }
      ]
    },
    {
      key: 'doctor', label: 'Find a Doctor', route: '/doctors'
    },
    {
      key: 'specialities', label: 'Specialities', route: '/specialities',
      children: [
        { id: 'cardiology', label: 'Cardiology', route: '/specialities/cardiology' },
        { id: 'orthopedic', label: 'Orthopedics', route: '/specialities/orthopedic' },
        { id: 'neurology', label: 'Neurology', route: '/specialities/neurology' },
        { id: 'emergency-medicine', label: 'Emergency Medicine & Critical Care', route: '/specialities/emergency-medicine' },
        { id: 'general-medicine', label: 'General Medicine', route: '/specialities/general-medicine' },
        { id: 'general-surgery', label: 'General Surgery', route: '/specialities/general-surgery' },
        { id: 'gastroenterology', label: 'Gastroenterology', route: '/specialities/gastroenterology' },
        { id: 'obstetrics-gynaecology', label: 'Obstetrics & Gynaecology', route: '/specialities/obstetrics-gynaecology' },
        { id: 'ent', label: 'ENT', route: '/specialities/ent' },
        { id: 'nephrology', label: 'Nephrology', route: '/specialities/nephrology' },
        { id: 'pulmonology', label: 'Pulmonology', route: '/specialities/pulmonology' },
        { id: 'dermatology', label: 'Dermatology', route: '/specialities/dermatology' },
        { id: 'psychiatry', label: 'Psychiatry', route: '/specialities/psychiatry' },
        { id: 'plastic-surgery', label: 'Plastic Surgery', route: '/specialities/plastic-surgery' },
      ]
    },
    {
      label: 'Locations', key: 'branches', modalTarget: '#branchesModal',
      children: [
        {
          id: 'Kothapet', label: 'Kothapet', img: 'omni_kothapet.png', route: ''
        },
        {
          id: 'Kukatpally', label: 'Kukatpally', img: 'omni_kukatpally.png', route: ''
        },
        {
          id: 'UDAI OMNI - Nampally', label: 'UDAI OMNI - Nampally', img: 'udai_omni.png', route: ''
        },
        {
          id: 'Vizag', label: 'Vizag', img: 'omni_vizag.png',
          route: ''
        },
        {
          id: 'Giggles Vizag', label: 'Giggles Vizag', img: 'giggles_vizag_building.png', route: ''
        },
        {
          id: 'Kurnool', label: 'Kurnool', img: 'kurnool_location.png', route: ''
        }
      ]
    },
    { key: 'empanelments', label: 'Our Empanelments', route: '/our-empanelment' },
    { key: 'blogs', label: 'Blogs', route: "/blogs" },
    { key: 'careers', label: 'Careers', route: "/careers" },
    { key: 'contact', label: 'Contact us', route: "/contact-us" },
    // { key: 'whatsapp', label: 'WhatsApp', route: '/whatsapp' },
    { key: 'bookAppointment', label: 'Book an Appointment', route: '/book-an-appointment' }
  ];

  infoItems = [
    {
      id: 1, icon: 'assets/icons/siron_icon.gif',
      title: '24/7 Emergency',
    },
    {
      id: 2, icon: 'assets/icons/book_an_appointment_nav.svg',
      title: 'Book Appointment',
      route: '/book-an-appointment'
    },
    {
      id: 3, icon: 'assets/icons/call_bttn_nav.svg',
      title: '888 0101 000',
    },
    {
      id: 4, icon: 'assets/icons/nabh_patient_safety_and_quality_of care_.svg',
      title: ''
    }
  ];


  locations_details = [
    {
      id: 1, location_name: 'Kothapet', img: 'omni_kothapet.png'
    },
    {
      id: 2, location_name: 'Kukatpally', img: 'omni_kukatpally.png'
    },
    {
      id: 3, location_name: 'UDAI OMNI - Nampally', img: 'udai_omni.png'
    },
    {
      id: 4, location_name: 'Vizag', img: 'omni_vizag.png'
    },
    {
      id: 5, location_name: 'Giggles Vizag', img: 'giggles_vizag_building.png'
    },
    {
      id: 6, location_name: 'Kurnool', img: 'kurnool_location.png'
    }
  ]
  locationToggle(num: number) {

  }

  constructor(private router: Router, private activated_routes: ActivatedRoute) {

  }

  ngOnInit() {
    this.activeTab = 'home';
    this.setActiveBasedOnRoute();

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.setActiveBasedOnRoute();
      });
  }

  setActiveBasedOnRoute() {
    const currentUrl = this.router.url;
    console.log('setActiveBasedOnRoute called - Current URL:', currentUrl);

    // Check if we're on an About Us page
    if (currentUrl.startsWith('/about-us')) {
      this.activeTab = 'about';
      console.log('Set active tab to about based on route');
    }
    // Check if we're on a specialty details page (both old and new format)
    else if (currentUrl.includes('/our-specialities-details/') || currentUrl.includes('/specialities/')) {
      this.activeTab = 'specialities';
      console.log('Set active tab to specialities based on route (specialty details)');
    }
    // Check if we're on a branch page
    else if (currentUrl.includes('/locations/')) {
      this.activeTab = 'branches';
      console.log('Set active tab to branches based on route (branch details)');
    }
    // Check if we're on the main specialties page (old format)
    else if (currentUrl === '/our-specialities') {
      this.activeTab = 'specialities';
      console.log('Set active tab to specialities based on route (main specialties)');
    }
    // Check if we're on the main branches page
    else if (currentUrl === '/locations') {
      this.activeTab = 'branches';
      console.log('Set active tab to branches based on route (main branches)');
    }
    // For other routes, determine based on the path
    else if (currentUrl.startsWith('/our-specialities')) {
      this.activeTab = 'specialities';
      console.log('Set active tab to specialities based on route (starts with)');
    }
    else if (currentUrl.startsWith('/locations')) {
      this.activeTab = 'branches';
      console.log('Set active tab to branches based on route (starts with)');
    }
    else {
      // For other routes, try to match with navigation items
      const matchedItem = this.navItems.find(item =>
        item.route && currentUrl.startsWith(item.route)
      );
      if (matchedItem) {
        this.activeTab = matchedItem.key;
        console.log('Set active tab to', matchedItem.key, 'based on route (matched item)');
      } else {
        console.log('No matching route found for:', currentUrl);
      }
    }
  }

  ngAfterViewInit() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) =>
      modal.addEventListener('hidden.bs.modal', () => {
        this.activeTab = '';
      })
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check if page is scrolled more than 50px
    const wasScrolled = this.isScrolled;
    this.isScrolled = window.scrollY > 50;

    // Add/remove body class for proper spacing
    if (this.isScrolled !== wasScrolled) {
      if (this.isScrolled) {
        document.body.classList.add('has-fixed-nav');
      } else {
        document.body.classList.remove('has-fixed-nav');
      }
    }
  }

  ngOnDestroy(): void {
    // Clean up body class when component is destroyed
    document.body.classList.remove('has-fixed-nav');
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  routeToLocation(location: string, selected_image: string) {
    const modalElement = document.getElementById('branchesModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }

    setTimeout(() => {
      // Convert location name to URL-friendly format
      const urlFriendlyName = location
        .toLowerCase()
        .replace(/&/g, 'and')  // Replace & with 'and'
        .replace(/\s+/g, '-')   // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
        .replace(/-+/g, '-')    // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

      this.router.navigate(['/locations', urlFriendlyName]).then(() => {
        // Set active state after navigation completes
        this.setActive('branches');
        console.log('Active state set to branches after modal navigation');
      });
    }, 300); // optional delay for smoother transition
  }

  setActive(tab: string) {
    this.activeTab = tab;
    console.log(this.activeTab, 'this.activeTab');
  }

  // Public method to set active state from other components
  setActiveFromExternal(tab: string) {
    this.activeTab = tab;
    console.log('Active tab set externally to:', tab);
  }

  isModalRouteActive(modalRoutePrefix: string): boolean {
    return this.router.url.startsWith(modalRoutePrefix);
  }

  goToBookAnAppointment() {
    this.router.navigate(['/book-an-appointment']).then(success => {
      if (success) {
        console.log('Navigation to Book An Appointment successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }

  onChildClick(key: string, id: string, label: string) {
    console.log('onChildClick called with key:', key, 'id:', id);

    if (key === 'about') {
      // Navigate based on the id
      if (id === 'about-us') {
        this.router.navigate(['/about-us']);
      } else if (id === 'leadership-team') {
        this.router.navigate(['/about-us/leadership-team']);
      }
      this.setActive('about');
    } else if (key == 'branches') {
      // Convert location name to URL-friendly format
      const urlFriendlyName = id
        .toLowerCase()
        .replace(/&/g, 'and')  // Replace & with 'and'
        .replace(/\s+/g, '-')   // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
        .replace(/-+/g, '-')    // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      this.router.navigate(['/locations', urlFriendlyName]);
      this.setActive('branches'); // Set active state for branches
    } else if (key === 'specialities') {
      const urlFriendlyName = toUrlFriendly(label);
      // Navigate to new URL format (without location defaults to showing all)
      this.router.navigate(['/specialities', urlFriendlyName]);
      // routerLinkActive will handle the active state automatically
    }
    this.hoveredItem = null;
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


}
