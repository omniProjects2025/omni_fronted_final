import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  activeSection = 'aboutOmni'; // Default
  hoveredItem: string | null = null;
  mobileMenuOpen = false;

  direction_icon: boolean = false;
  depertment_icon: boolean = false;
  activeTab = 'home';

  navItems = [
    { key: 'home', label: '', route: '/home' },
    {
      key: 'about', label: 'About us', route: '/about-us',
    },
    { key: 'doctor', label: 'Find a Doctor', route: '/our-doctors' },
    {
      key: 'specialities', label: 'Our Specialities', route: '/our-specialities',
      children: [
        { id: '', label: 'Cardiology', route: '/speciality/cardiology' },
        { id: '', label: 'Dermatology', route: '/speciality/dermatology' },
        { id: '', label: 'Emergency Medicine & Critical Care', route: '/speciality/emergency-medicine' },
        { id: '', label: 'ENT', route: '/speciality/ent' },
        { id: '', label: 'General Medicine', route: '/speciality/general-medicine' },
        { id: '', label: 'General Surgery', route: '/speciality/general-surgery' },
        { id: '', label: 'Medical & Surgical Gastroenterology', route: '/speciality/gastroenterology' },
        { id: '', label: 'Nephrology & Urology', route: '/speciality/nephrology-urology' },
        { id: '', label: 'Obstetrics & Gynaecology', route: '/speciality/obstetrics-gynaecology' },
        { id: '', label: 'Orthopedic', route: '/speciality/orthopedic' },
        { id: '', label: 'Paediatrics', route: '/speciality/paediatrics' },
        { id: '', label: 'Psychiatry', route: '/speciality/psychiatry' },
        { id: '', label: 'Pulmonology', route: '/speciality/pulmonology' },
        { id: '', label: 'Vascular Surgery', route: '/speciality/vascular-surgery' }
      ]
    },
    {
      label: 'Our Branches', key: 'branches', modalTarget: '#branchesModal',
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
    {key: 'bookAppointment', label:'Book an Appointment', route:'/book-an-appointment'}
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
  }

  ngAfterViewInit() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) =>
      modal.addEventListener('hidden.bs.modal', () => {
        this.activeTab = '';
      })
    );
  }


  routeToLocation(location: string, selected_image: string) {
    const modalElement = document.getElementById('branchesModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }

    setTimeout(() => {
      this.router.navigate(['/our-branches'], {
        queryParams: {
          selected_location: location,
          selected_image: selected_image
        }
      });
    }, 300); // optional delay for smoother transition
  }

  setActive(tab: string) {
    this.activeTab = tab;
    console.log(this.activeTab, 'this.activeTab');

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

  onChildClick(key: string, id: string) {
    if (key === 'about') {
      this.router.navigate(['/about-us'], { queryParams: { id: id } });
      this.setActiveSection(id);
    } else if (key == 'branches') {
      this.router.navigate(['/our-branches'], {
        queryParams: {
          selected_location: id,
          // selected_image: img,
        }
      });
    }
    this.hoveredItem = null; // Always close the submenu after click
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
