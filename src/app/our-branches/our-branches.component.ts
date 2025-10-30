import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-our-branches',
  templateUrl: './our-branches.component.html',
  styleUrls: ['./our-branches.component.css']
})
export class OurBranchesComponent {
  selectedDepartment: string | null = null;
  selectedLocation: string | null = null;

  departments: string[] = []; // now dynamic


  locationImages = [
    { name: 'Vishakapatnam', image: 'kothapet_hospital.svg' },
    { name: "Womens & Children's Hospital", image: 'kothapet_hospital.svg' },
    { name: 'Fertility Center', image: 'kothapet_hospital.svg' } // Example third location
  ];
  doctors: any[] = [];

  // doctors = [
  //   {
  //     name: 'Dr R Naga Sudha Ashok',
  //     experience: '18+ Years',
  //     timings: '9am to 4pm',
  //     location: 'Kukatpally',
  //     image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
  //     specialization: 'Surgical Gastroenterologist',
  //     department: 'General Medicine'
  //   },
  //   {
  //     name: 'Doctor one',
  //     experience: '18+ Years',
  //     timings: '9am to 4pm',
  //     location: 'Kukatpally',
  //     image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
  //     specialization: 'Surgical Gastroenterologist',
  //     department: 'Cardiology'
  //   },
  //   {
  //     name: 'Doctor two',
  //     experience: '18+ Years',
  //     timings: '9am to 4pm',
  //     location: 'Kukatpally',
  //     image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
  //     specialization: 'Surgical Gastroenterologist',
  //     department: 'ENT'
  //   },
  //   {
  //     name: 'Doctor three',
  //     experience: '18+ Years',
  //     timings: '9am to 4pm',
  //     location: 'Kukatpally',
  //     image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
  //     specialization: 'Surgical Gastroenterologist',
  //     department: 'Nephrology'
  //   },
  //   {
  //     name: 'Doctor four',
  //     experience: '18+ Years',
  //     timings: '9am to 4pm',
  //     location: 'Kukatpally',
  //     image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
  //     specialization: 'Surgical Gastroenterologist',
  //     department: 'Urology'
  //   },
  //   {
  //     name: 'Doctor five',
  //     experience: '18+ Years',
  //     timings: '9am to 4pm',
  //     location: 'Kukatpally',
  //     image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
  //     specialization: 'Surgical Gastroenterologist',
  //     department: 'Dermatology'
  //   },
  //   ];

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
        }
      } else {
        // If no path parameter, check for query parameters (backward compatibility)
        this.activatedRoutesData();
      }
    });
  }

  BRANCH_LOCATIONS: any = [
    {
      key: 'kukatpally',
      name: 'OMNI Hospitals, Kukatpally',
      lat: 17.485269683418686,
      lng: 78.4083654749371,
      address: 'OMNI Hospitals, Kukatpally, Hyderabad, Telangana 500072',
      phone: '1234567889'
    },
    {
      key: 'udai',
      name: 'Udai Omni Hospital - Orthopedics | Multispeciality | Trauma',
      lat: 17.3969257,
      lng: 78.472412,
      address: '5-9-92/A/1, Chapel Rd, near Fateh Maidan, Fateh Maidan, Abids, Hyderabad, Telangana 500001',
      phone: '1234567889'
    },
    {
      key: 'kothapet',
      name: 'OMNI Hospitals',
      lat: 17.3686691,
      lng: 78.538822,
      address: 'Plot No.W-11,B-9, Sy. No.9/1/A Near SVC Cinema Theatre opp PVT Market Building Kothapet, Dilsukhnagar, Hyderabad, Telangana 500036',
      phone: '1234567889'
    },
    {
      key: 'kurnool',
      name: 'OMNI Hospitals Kurnool',
      lat: 15.823561600000001,
      lng: 78.0415378,
      address: '46/679-C, NH40, Budhawara Peta, Alluri Sitarama Raju Nagar, Kurnool, Andhra Pradesh 518002',
      phone: '1234567889'
    },
    {
      key: 'giggles',
      name: 'Giggles by Omni RK',
      lat: 17.718362979950925,
      lng: 83.31482030053034,
      address: 'Beside Omni Hospitals, Waltair Main Rd, Opp Lions Club Of, Ram Nagar, Visakhapatnam, Andhra Pradesh 530002',
      phone: '1234567889'
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

}
