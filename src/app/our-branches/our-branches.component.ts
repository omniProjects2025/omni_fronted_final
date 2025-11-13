import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'owl.carousel';
declare var $: any;

@Component({
  selector: 'app-our-branches',
  templateUrl: './our-branches.component.html',
  styleUrls: ['./our-branches.component.css']
})
export class OurBranchesComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedDepartment: string | null = null;
  selectedLocation: string | null = null;

  departments: string[] = []; // now dynamic


  locationImages = [
    { name: 'Vishakapatnam', image: 'kothapet_hospital.svg' },
    { name: "Womens & Children's Hospital", image: 'kothapet_hospital.svg' },
    { name: 'Fertility Center', image: 'kothapet_hospital.svg' } // Example third location
  ];
  doctors: any[] = [];

  @ViewChild('vizagBannerCarousel', { static: false }) vizagBannerCarousel?: ElementRef;

  private bannerOwlInstance: any;

  constructor(private router: Router, private activated_routes: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.activated_routes.params.subscribe(params => {
      const locationParam = params['location'] || '';
      if (locationParam) {
        // Convert URL-friendly format back to original location name
        this.selectedLocation = locationParam
          .replace(/-/g, ' ')           // Replace hyphens with spaces
          .replace(/and/g, '&')         // Replace 'and' with &
          .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Capitalize first letter of each word

        // Handle specific case for UDAI OMNI - Nampally
        if (this.selectedLocation === 'Udai Omni Nampally') {
          this.selectedLocation = 'UDAI OMNI - Nampally';
        }
        console.log(this.selectedLocation, 'selectedLocation..');
        if (this.selectedLocation) {
          this.getting_location = this.selectedLocation; // Set getting_location for display
          this.loadDoctors(this.selectedLocation);
          this.refreshVizagCarousel();
        }
      } else {
        // If no path parameter, check for query parameters (backward compatibility)
        this.activatedRoutesData();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeVizagCarousel();
  }

  ngOnDestroy(): void {
    this.destroyVizagCarousel();
  }

  BRANCH_LOCATIONS: any = [
    {
      key: 'kukatpally',
      name: 'OMNI Hospitals, Kukatpally',
      lat: 17.485269683418686,
      lng: 78.4083654749371,
      address: 'OMNI Hospitals, Kukatpally, Hyderabad, Telangana 500072',
      phone: '888 0101 000',
      rating: 4.5,
      reviewCount: 5142,
      reviewsUrl: 'https://www.google.com/search?hl=en-IN&gl=in&q=OMNI+Hospitals+%7C+Best+Multi+Speciality+Hospital+in+Kukatpally,+Mumbai+Highway+Rd,+opp.+BIG+BAZAR,+Balaji+Nagar,+Kukatpally,+Hyderabad,+Telangana+500072&ludocid=13361647533386732115&lsig=AB86z5VaL4xoUCUUipWsuXSHLIlT&hl=en&gl=IN#lrd=0x3bcb91bc5cdb9fbd:0xb96e1ba3797d9253,1'
    },
    {
      key: 'udai',
      name: 'Udai Omni Hospital - Orthopedics | Multispeciality | Trauma',
      lat: 17.3969257,
      lng: 78.472412,
      address: '5-9-92/A/1, Chapel Rd, near Fateh Maidan, Fateh Maidan, Abids, Hyderabad, Telangana 500001',
      phone: '888 0101 000',
      rating: 4.4,
      reviewCount: 2517,
      reviewsUrl: 'https://www.google.com/search?hl=en-IN&gl=in&q=Udai+Omni+Hospital+-+Orthopedics+%7C+Multispeciality+%7C+Trauma,+5-9-92/A/1,+Chapel+Rd,+near+Fateh+Maidan,+Fateh+Maidan,+Abids,+Hyderabad,+Telangana+500001&ludocid=14772628000669664513&lsig=AB86z5WUfRzMeit0e7X9MxbzvgQ5&hl=en&gl=IN#lrd=0x3bcb9762f7471823:0xcd02eae5dae78501,1'
    },
    {
      key: 'kothapet',
      name: 'OMNI Hospitals',
      lat: 17.3686691,
      lng: 78.538822,
      address: 'Plot No.W-11,B-9, Sy. No.9/1/A Near SVC Cinema Theatre opp PVT Market Building Kothapet, Dilsukhnagar, Hyderabad, Telangana 500036',
      phone: '888 0101 000',
      rating: 4.3,
      reviewCount: 3427,
      reviewsUrl: 'https://www.google.com/search?hl=en-IN&gl=in&q=OMNI+Hospitals,+Plot+No.W-11,B-9,+Sy.+No.9/1/A+Near+SVC+Cinema+Theatre+opp+PVT+Market+Building+Kothapet,+Dilsukhnagar,+Hyderabad,+Telangana+500102&ludocid=11369620307516432253&lsig=AB86z5X76sxgP1FsrwjYK-6IT_Se&hl=en&gl=IN#lrd=0x3bcb98e93eec1a2f:0x9dc9016e4c959f7d,1'
    },
    {
      key: 'kurnool',
      name: 'OMNI Hospitals Kurnool',
      lat: 15.823561600000001,
      lng: 78.0415378,
      address: '46/679-C, NH40, Budhawara Peta, Alluri Sitarama Raju Nagar, Kurnool, Andhra Pradesh 518002',
      phone: '888 0101 000',
      rating: 4.7,
      reviewCount: 2047,
      reviewsUrl: 'https://www.google.com/search?hl=en-IN&gl=in&q=OMNI+Hospitals+Kurnool,+46/679-C,+NH40,+Budhawara+Peta,+Alluri+Sitarama+Raju+Nagar,+Kurnool,+Andhra+Pradesh+518002&ludocid=6291900437469527256&lsig=AB86z5X5KmZjkBCwiqJm5b0m-wIN&hl=en&gl=IN#lrd=0x3bb5ddf5391420ef:0x5751521ca97efcd8,1'
    },
    {
      key: 'vizag',
      name: 'OMNI RK Multi Specialty Hospital',
      lat: 17.7183946,
      lng: 83.3111361,
      address: 'RK Beach Rd, Pandurangapuram, Visakhapatnam, Andhra Pradesh 530003',
      phone: '888 0101 000',
      rating: 4.2,
      reviewCount: 2138,
      reviewsUrl: 'https://www.google.com/search?hl=en-IN&gl=in&q=OMNI+RK+Multi+Specialty+Hospital,+Waltair+Main+Rd,+opp.+Lions+Club,+Ram+Nagar,+Visakhapatnam,+Andhra+Pradesh+530002&ludocid=3934366984762721501&lsig=AB86z5UkIYNyAXmFFch47gz2OzGF&hl=en&gl=IN#lrd=0x3a394315b6aa6577:0x3699aded6ece84dd,1'
    },
    {
      key: 'giggles',
      name: 'Giggles by Omni RK',
      lat: 17.718362979950925,
      lng: 83.31482030053034,
      address: 'Beside Omni Hospitals, Waltair Main Rd, Opp Lions Club Of, Ram Nagar, Visakhapatnam, Andhra Pradesh 530002',
      phone: '888 0101 000',
      rating: 4.7,
      reviewCount: 3162,
      reviewsUrl: 'https://www.google.com/search?hl=en-IN&gl=in&q=Giggles+by+Omni+RK,+Beside+Omni+Hospitals,+Waltair+Main+Rd,+Opp+Lions+Club+Of,+Ram+Nagar,+Visakhapatnam,+Andhra+Pradesh+530002&ludocid=1512469724875382304&lsig=AB86z5UWqvAZNSi-zmI4oGuBqaH2&hl=en&gl=IN#lrd=0x3a39438ce00efc2f:0x14fd5f338cbade20,1'
    }
  ]

  jsonPath = 'assets/json_data_files/our_locations_doctors.json';

  getting_image: string = '';
  getting_location: string = '';

  activatedRoutesData() {
    this.activated_routes.queryParams.subscribe(params => {
      console.log(params, 'params..');
      this.getting_location = params['selected_location'] || '';
      this.loadDoctors(this.getting_location);
      this.refreshVizagCarousel();
    });
  }
  loadDoctors(location: string): void {
    this.http.get<any[]>(this.jsonPath).subscribe({
      next: (locations) => {
        const selectedLocation = locations.find(
          loc => loc.location.toLowerCase() === location.toLowerCase()
        );
        this.doctors = selectedLocation ? selectedLocation.doctors : [];

        // ✅ Extract unique departments from filter_by_speciality
        this.departments = [...new Set(this.doctors.map(d => d.filter_by_speciality))];
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
      }
    });

    this.refreshVizagCarousel();
  }

  private initializeVizagCarousel(): void {
    if (!this.isVizagCarouselLocation() || !this.vizagBannerCarousel) {
      return;
    }

    const element = $(this.vizagBannerCarousel.nativeElement);
    this.bannerOwlInstance = element.owlCarousel({
      loop: true,
      margin: 0,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 4000,
      autoplayHoverPause: true,
      items: 1,
      responsive: {
        0: { items: 1 },
        768: { items: 1 },
        992: { items: 1 }
      }
    });
  }

  private refreshVizagCarousel(): void {
    setTimeout(() => {
      this.destroyVizagCarousel();
      this.initializeVizagCarousel();
    }, 0);
  }

  private destroyVizagCarousel(): void {
    if (this.bannerOwlInstance && this.vizagBannerCarousel) {
      $(this.vizagBannerCarousel.nativeElement).trigger('destroy.owl.carousel');
      this.bannerOwlInstance = null;
    }
  }

  private isVizagCarouselLocation(): boolean {
    const location = (this.getting_location || '').trim();
    return location === 'Vizag' || location === 'Giggles Vizag';
  }

  setSelected(dept: string) {
    this.selectedDepartment = dept;
  }

  filteredDoctors() {
    return this.selectedDepartment
      ? this.doctors.filter(d => d.filter_by_speciality === this.selectedDepartment)
      : this.doctors;
  }
  openDirections(location: string) {
    console.log('openDirections called with:', location);
    console.log('getting_location:', this.getting_location);

    const loc = location.trim().toLowerCase();
    console.log('Processed location:', loc);

    // Find the branch location from BRANCH_LOCATIONS array
    const branchLocation = this.BRANCH_LOCATIONS.find((branch: any) => 
      branch.key.toLowerCase() === loc || 
      branch.name.toLowerCase().includes(loc) ||
      loc.includes(branch.key.toLowerCase())
    );
    
    console.log('Found branch location:', branchLocation);

    if (branchLocation) {
      const encodedAddress = encodeURIComponent(branchLocation.address);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      console.log('Using address from BRANCH_LOCATIONS:', branchLocation.address);
      console.log('Google Maps URL:', googleMapsUrl);
      window.open(googleMapsUrl, '_blank');
      return;
    }

    // Fallback to hardcoded addresses for backward compatibility
    if (loc === 'kothapet') {
      const Kothapet = encodeURIComponent(
        'OMNI Hospitals, Plot No.W-11,B-9, Sy. No.9/1/A Near SVC Cinema Theatre opp PVT Market Building Kothapet, Dilsukhnagar, Hyderabad, Telangana 500036'
      );
      const googleMapsUrlkothapet = `https://www.google.com/maps/dir/?api=1&destination=${Kothapet}`;
      window.open(googleMapsUrlkothapet, '_blank');
    } else if (loc === 'kukatpally') {
      const kukatpally = encodeURIComponent(
        'OMNI Hospitals, Kukatpally, Hyderabad, Telangana 500072'
      );
      const googleMapsUrlkukatpally = `https://www.google.com/maps/dir/?api=1&destination=${kukatpally}`;
      console.log('Using fallback address for Kukatpally:', 'OMNI Hospitals, Kukatpally, Hyderabad, Telangana 500072');
      console.log('Google Maps URL:', googleMapsUrlkukatpally);
      window.open(googleMapsUrlkukatpally, '_blank');
    }

    else if (loc === 'udai omni - nampally' || loc === 'udai omni nampally' || loc.includes('udai')) {
      const nampally = encodeURIComponent(
        'Udai Omni Hospital - Orthopedics | Multispeciality | Trauma, 5-9-92/A/1, Chapel Rd, near Fateh Maidan, Fateh Maidan, Abids, Hyderabad, Telangana 500001'
      );
      const googleMapsUrlnampally = `https://www.google.com/maps/dir/?api=1&destination=${nampally}`;
      window.open(googleMapsUrlnampally, '_blank');
    }

    else if (loc === 'vizag') {
      const vizag = encodeURIComponent(
        'OMNI RK Multi Specialty Hospital, Waltair Main Rd, opp. Lions Club, Ram Nagar, Visakhapatnam, Andhra Pradesh 530002'
      );
      const googleMapsUrlvizag = `https://www.google.com/maps/dir/?api=1&destination=${vizag}`;
      window.open(googleMapsUrlvizag, '_blank');
    }

    else if (loc === 'giggles vizag') {
      const giggles_vizag = encodeURIComponent(
        'Giggles by Omni RK, Beside Omni Hospitals, Waltair Main Rd, Opp Lions Club Of, Ram Nagar, Visakhapatnam, Andhra Pradesh 530002'
      );
      const googleMapsUrlgigglesvizag = `https://www.google.com/maps/dir/?api=1&destination=${giggles_vizag}`;
      window.open(googleMapsUrlgigglesvizag, '_blank');
    }

    else if (loc === 'kurnool') {
      const kurnool = encodeURIComponent(
        'OMNI Hospitals Kurnool, 46/679-C, NH40, Budhawara Peta, Alluri Sitarama Raju Nagar, Kurnool, Andhra Pradesh 518002'
      );
      const googleMapsUrlkurnool = `https://www.google.com/maps/dir/?api=1&destination=${kurnool}`;
      window.open(googleMapsUrlkurnool, '_blank');
    }

    else {
      console.warn('Location not recognized:', loc);
    }
  }

  goToDoctorDetails(doctor_name:string) {
    // Convert doctor name to URL-friendly format
    const urlFriendlyName = doctor_name
      .toLowerCase()
      .replace(/&/g, 'and')  // Replace & with 'and'
      .replace(/\s+/g, '-')   // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
      .replace(/-+/g, '-')    // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    this.router.navigate(['/doctor-details', urlFriendlyName]);
  }


  goToBookAppointment() {
    this.router.navigate(['/book-an-appointment']).then(success => {
      if (success) {
        console.log('Navigation to Book An Appointment successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }

  openReviews() {
    // Get current location data and open reviews
    const currentLocationData = this.getCurrentLocationData();
    if (currentLocationData && currentLocationData.reviewsUrl) {
      window.open(currentLocationData.reviewsUrl, '_blank');
    }
  }

  getCurrentLocationData() {
    // Find the location data based on getting_location
    const loc = this.getting_location.trim().toLowerCase();
    
    const locationData = this.BRANCH_LOCATIONS.find((branch: any) => 
      branch.key.toLowerCase() === loc || 
      branch.name.toLowerCase().includes(loc) ||
      loc.includes(branch.key.toLowerCase())
    );
    
    return locationData || null;
  }

}
