import { ChangeDetectorRef, Component, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FixedpackagesService } from '../fixedpackages.service';
import { UsersService } from '../users.service';
declare var $: any;

@Component({
  selector: 'app-fixed-surgery-details',
  templateUrl: './fixed-surgery-details.component.html',
  styleUrls: ['./fixed-surgery-details.component.css']
})
export class FixedSurgeryDetailsComponent implements AfterViewInit {
  selected_map_location = "";
  carouselVisible: boolean = true;
  surgeryPackages: any[] = [];
  mapUrl: SafeResourceUrl | null = null;
  appointmentForm!: FormGroup;
  modalInstance: any;
  carouselInitialized = false;
  surgicalPackages: { [key: string]: any[] } = {};
  selectedPackage: any;
  packageIncludesCol1: string[] = [];
  packageIncludesCol2: string[] = [];
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  BRANCH_LOCATIONS: any = [
    {
      key: 'kukatpally',
      name: 'OMNI Hospitals, Kukatpally',
      lat: 17.485269683418686,
      lng: 78.4083654749371,
      address: 'Mumbai Hwy, opp. BIG BAZAR, Balaji Nagar, Kukatpally, Hyderabad, Telangana 500072',
      phone: '1234567889',
      img: "omni_kukkatpally_contact_us.svg"
    },
    {
      key: 'udai',
      name: 'Udai Omni Hospital - Orthopedics | Multispeciality | Trauma',
      lat: 17.3969257,
      lng: 78.472412,
      address: '5-9-92/A/1, Chapel Rd, near Fateh Maidan, Fateh Maidan, Abids, Hyderabad, Telangana 500001',
      phone: '1234567889',
      img: "udai_omni.svg"
    },
    {
      key: 'kothapet',
      name: 'OMNI Hospitals',
      lat: 17.3686691,
      lng: 78.538822,
      address: 'Plot No.W-11,B-9, Sy. No.9/1/A Near SVC Cinema Theatre opp PVT Market Building Kothapet, Dilsukhnagar, Hyderabad, Telangana 500036',
      phone: '1234567889',
      img: "kothapet_location_image.svg"
    },
    {
      key: 'kurnool',
      name: 'OMNI Hospitals Kurnool',
      lat: 15.823561600000001,
      lng: 78.0415378,
      address: '46/679-C, NH40, Budhawara Peta, Alluri Sitarama Raju Nagar, Kurnool, Andhra Pradesh 518002',
      phone: '1234567889',
      img: "kurnool_location_image.svg"
    },
    {
      key: 'vizag',
      name: 'OMNI RK Multi Specialty Hospital',
      lat: 17.7183946,
      lng: 83.3111361,
      address: 'RK Beach Rd, Pandurangapuram, Visakhapatnam, Andhra Pradesh 530003',
      phone: '1234567890',
      img: "vizag_location_image.svg"
    },
    {
      key: 'giggles',
      name: 'Giggles by Omni RK',
      lat: 17.718362979950925,
      lng: 83.31482030053034,
      address: 'Beside Omni Hospitals, Waltair Main Rd, Opp Lions Club Of, Ram Nagar, Visakhapatnam, Andhra Pradesh 530002',
      phone: '1234567889',
      img: "giggles_vizag_location.svg"
    }
  ]

  dummy_packages = [
    {
      image: 'assets/health_checkup/health_checkup_package_dummy_assets.png',
      title: 'Whole Body Check-Up',
      originalPrice: '₹7666/-',
      discountedPrice: '₹1999/-',
      discount: '60%'
    },
    {
      image: 'assets/health_checkup/health_checkup_package_dummy_assets.png',
      title: 'Whole Body Check-Up',
      originalPrice: '₹7666/-',
      discountedPrice: '₹1999/-',
      discount: '60%'
    },
    {
      image: 'assets/health_checkup/health_checkup_package_dummy_assets.png',
      title: 'Whole Body Check-Up',
      originalPrice: '₹7666/-',
      discountedPrice: '₹1999/-',
      discount: '60%'
    },
    {
      image: 'assets/health_checkup/health_checkup_package_dummy_assets.png',
      title: 'Whole Body Check-Up',
      originalPrice: '₹7666/-',
      discountedPrice: '₹1999/-',
      discount: '60%'
    },
    {
      image: 'assets/health_checkup/health_checkup_package_dummy_assets.png',
      title: 'Whole Body Check-Up',
      originalPrice: '₹7666/-',
      discountedPrice: '₹1999/-',
      discount: '60%'
    },
    {
      image: 'assets/health_checkup/health_checkup_package_dummy_assets.png',
      title: 'Whole Body Check-Up',
      originalPrice: '₹7666/-',
      discountedPrice: '₹1999/-',
      discount: '60%'
    },
    {
      image: 'assets/health_checkup/health_checkup_package_dummy_assets.png',
      title: 'Whole Body Check-Up',
      originalPrice: '₹7666/-',
      discountedPrice: '₹1999/-',
      discount: '60%'
    }
  ];
  constructor(
    private renderer: Renderer2,
    private activated_routes: ActivatedRoute,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private fixedPackagesService: FixedpackagesService,
    private userservice: UsersService
  ) {
  }

  ngOnInit() {
    this.activatedRoutesData();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const nearestBranch = this.BRANCH_LOCATIONS[0];
        const url = `https://maps.google.com/maps?q=${nearestBranch.lat},${nearestBranch.lng}&z=15&output=embed`;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      });
    }
    setTimeout(() => this.getSurgicalData(), 100);
    this.formValidations();
  }

  formValidations() {
    this.appointmentForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/) // Starts from 6-9, and exactly 10 digits
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    setTimeout(() => {
      this.surgicalSlide();
    }, 0);
  }


  ngAfterViewChecked(): void {
    if (!this.carouselInitialized) {
      this.carouselInitialized = true;
      setTimeout(() => this.surgicalSlide(), 0);
    }
  }


  swapItems(index1: number, index2: number) {
    const temp = this.items[index1];
    this.items[index1] = this.items[index2];
    this.items[index2] = temp;
  }

  surgicalSlide() {
    if ($('.owl-carousel').length) {
      $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 1 },
          768: { items: 1 },
          992: { items: 2 },
          1200: { items: 3 }
        }
      });
    } else {
      console.warn("Owl carousel element not found in DOM");
    }
  }


  activatedRoutesData() {
    this.activated_routes.queryParams.subscribe(params => {
      const loc = (params['location'] || '').toLowerCase();
      this.selected_map_location = loc;
      console.log(this.selected_map_location, 'selected_map_location...');

      const selectedPackageStr = params['selected_package'];
      if (selectedPackageStr) {
        try {
          this.selectedPackage = JSON.parse(selectedPackageStr);
          this.splitPackageIncludes(this.selectedPackage);
        } catch (err) {
          console.error('Invalid JSON in selected_package', err);
        }
      }
    });
  }
  splitPackageIncludes(pkg: any) {
    const includes = pkg?.package_includes || [];
    const mid = Math.ceil(includes.length / 2);
    this.packageIncludesCol1 = includes.slice(0, mid);
    this.packageIncludesCol2 = includes.slice(mid);
  }

  getSurgicalData() {
    this.fixedPackagesService.getAllHealthPackagesDetails().subscribe(
      (res: any) => {
        if (res?.data?.length) {
          const loc = this.selected_map_location;
          const allData = res.data[0];
          let allPackages: any[] = [];
          if (loc && allData[loc.charAt(0).toUpperCase() + loc.slice(1)]) {
            allPackages = allData[loc.charAt(0).toUpperCase() + loc.slice(1)];
          } else {
            Object.keys(allData).forEach(branch => {
              if (Array.isArray(allData[branch])) {
                allPackages = allPackages.concat(allData[branch]);
              }
            });
          }
          this.surgeryPackages = allPackages.filter((pkg: { package_name: any }) =>
            !this.selectedPackage || pkg.package_name !== this.selectedPackage.package_name
          );
          this.carouselVisible = false;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.carouselVisible = true;
            this.cdr.detectChanges();

            setTimeout(() => {
              this.destroyOwlCarousel();
              this.surgicalSlide();
            }, 100);
          }, 50);
        }
      },
      error => {
        console.error('Failed to fetch packages:', error);
      }
    );
  }


  destroyOwlCarousel() {
    const $carousel = $('.owl-carousel');
    if ($carousel && $carousel.data('owl.carousel')) {
      $carousel.trigger('destroy.owl.carousel');
      $carousel.html($carousel.find('.owl-stage-outer').html());
    }
  }

  submitForm() {
    if (this.appointmentForm.valid) {
      this.userservice.signupUser(this.appointmentForm.value).subscribe({
        next: (res) => {
          alert('Appointment Booked Successfully!');
          console.log('Form Data:', this.appointmentForm.value);
          this.appointmentForm.reset();
        },
        error: (err) => {
          alert('Something went wrong while booking the appointment.');
          console.error(err);
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
  capitalizeText(text: string): string {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  bookAppointment(id: number, package_type: any) {
    this.appointmentForm.patchValue({ packageType: this.capitalizeText(package_type) });
    const modalElement = document.getElementById('appointmentModal');
    if (modalElement) {
      modalElement.removeAttribute('inert');
      this.modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
      this.modalInstance.show();
      setTimeout(() => {
        document.querySelector('.modal-backdrop')?.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.8) !important;');
      }, 100);
    }
  }

  onPackageCardClick(pkg: any) {
    const prevSelected = this.selectedPackage;
    this.selectedPackage = pkg;
    this.splitPackageIncludes(pkg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.surgeryPackages = this.surgeryPackages.filter(p => p.package_name !== pkg.package_name);
    if (prevSelected) {
      this.surgeryPackages.push(prevSelected);
    }
    this.carouselVisible = false;
    setTimeout(() => {
      this.cdr.detectChanges();
      this.carouselVisible = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.destroyOwlCarousel();
        this.surgicalSlide();
      }, 100);
    }, 50);
  }



}
