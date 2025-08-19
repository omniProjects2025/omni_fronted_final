import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-our-branches',
  templateUrl: './our-branches.component.html',
  styleUrls: ['./our-branches.component.css']
})
export class OurBranchesComponent {
  selectedDepartment: string | null = null;

  departments: string[] = [
    'Cardiology', 'ENT', 'General Medicine',
    'Nephrology', 'Urology', 'Dermatology'
  ];

  locationImages = [
    { name: 'Vishakapatnam', image: 'kothapet_hospital.svg' },
    { name: "Womens & Children's Hospital", image: 'kothapet_hospital.svg' },
    { name: 'Fertility Center', image: 'kothapet_hospital.svg' } // Example third location
  ];

  doctors = [
    {
      name: 'Dr R Naga Sudha Ashok',
      experience: '18+ Years',
      timings: '9am to 4pm',
      location: 'Kukatpally',
      image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
      specialization: 'Surgical Gastroenterologist',
      department: 'General Medicine'
    },
    {
      name: 'Doctor one',
      experience: '18+ Years',
      timings: '9am to 4pm',
      location: 'Kukatpally',
      image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
      specialization: 'Surgical Gastroenterologist',
      department: 'Cardiology'
    },
    {
      name: 'Doctor two',
      experience: '18+ Years',
      timings: '9am to 4pm',
      location: 'Kukatpally',
      image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
      specialization: 'Surgical Gastroenterologist',
      department: 'ENT'
    },
    {
      name: 'Doctor three',
      experience: '18+ Years',
      timings: '9am to 4pm',
      location: 'Kukatpally',
      image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
      specialization: 'Surgical Gastroenterologist',
      department: 'Nephrology'
    },
    {
      name: 'Doctor four',
      experience: '18+ Years',
      timings: '9am to 4pm',
      location: 'Kukatpally',
      image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
      specialization: 'Surgical Gastroenterologist',
      department: 'Urology'
    },
    {
      name: 'Doctor five',
      experience: '18+ Years',
      timings: '9am to 4pm',
      location: 'Kukatpally',
      image: 'assets/our_doctors/doctor_naga_sudha_ashok.png',
      specialization: 'Surgical Gastroenterologist',
      department: 'Dermatology'
    },
  ];

  BRANCH_LOCATIONS: any = [
    {
      key: 'kukatpally',
      name: 'OMNI Hospitals, Kukatpally',
      lat: 17.485269683418686,
      lng: 78.4083654749371,
      address: 'Mumbai Hwy, opp. BIG BAZAR, Balaji Nagar, Kukatpally, Hyderabad, Telangana 500072',
      phone:'1234567889'
    },
    {
      key: 'udai',
      name: 'Udai Omni Hospital - Orthopedics | Multispeciality | Trauma',
      lat:17.3969257,
      lng: 78.472412,
      address: '5-9-92/A/1, Chapel Rd, near Fateh Maidan, Fateh Maidan, Abids, Hyderabad, Telangana 500001',
      phone:'1234567889'
    },
    {
      key: 'kothapet',
      name: 'OMNI Hospitals',
      lat: 17.3686691,
      lng: 17.3686691,
      address: 'Plot No.W-11,B-9, Sy. No.9/1/A Near SVC Cinema Theatre opp PVT Market Building Kothapet, Dilsukhnagar, Hyderabad, Telangana 500036',
      phone:'1234567889'
    },
    {
      key: 'kurnool',
      name: 'OMNI Hospitals Kurnool',
      lat: 15.823561600000001,
      lng: 78.0415378,
      address: '46/679-C, NH40, Budhawara Peta, Alluri Sitarama Raju Nagar, Kurnool, Andhra Pradesh 518002',
      phone:'1234567889'
    },
    {
      key: 'giggles',
      name: 'Giggles by Omni RK',
      lat: 17.718362979950925,
      lng: 83.31482030053034,
      address: 'Beside Omni Hospitals, Waltair Main Rd, Opp Lions Club Of, Ram Nagar, Visakhapatnam, Andhra Pradesh 530002',
      phone:'1234567889'
    }
  ]


  getting_image:string='';
  getting_location:string='';
  constructor(private activated_routes: ActivatedRoute, private router: Router){
    this.activatedRoutesData();
  }

  activatedRoutesData() {
    this.activated_routes.queryParams.subscribe(params => {
      console.log(params,'params..');
      this.getting_location = params['selected_location'] || '';
      // this.getting_image = params['selected_image'] || '';
    });
  }

  setSelected(dept: string) {
    this.selectedDepartment = dept;
  }

  filteredDoctors() {
    return this.selectedDepartment
      ? this.doctors.filter(d => d.department === this.selectedDepartment)
      : this.doctors;
  }
  openDirections(location: string) {
    console.log(location,'location...');
    
    const loc = location.trim().toLowerCase();
    console.log(loc,'loc...');
    
    if (loc === 'kothapet') {
      const Kothapet = encodeURIComponent(
        'OMNI Hospitals, Plot No.W-11,B-9, Sy. No.9/1/A Near SVC Cinema Theatre opp PVT Market Building Kothapet, Dilsukhnagar, Hyderabad, Telangana 500036'
      );
      const googleMapsUrlkothapet = `https://www.google.com/maps/dir/?api=1&destination=${Kothapet}`;
      window.open(googleMapsUrlkothapet, '_blank');
    } else if (loc === 'kukatpally') {
      const kukatpally = encodeURIComponent(
        'OMNI Hospitals, Kukatpally, Mumbai Hwy, opp. BIG BAZAR, Balaji Nagar, Kukatpally, Hyderabad, Telangana 500072'
      );
      const googleMapsUrlkukatpally = `https://www.google.com/maps/dir/?api=1&destination=${kukatpally}`;
      window.open(googleMapsUrlkukatpally, '_blank');
    } 
    
    else if (loc === 'udai omni - nampally') {
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
      const googleMapsUrlvizag  = `https://www.google.com/maps/dir/?api=1&destination=${vizag}`;
      window.open(googleMapsUrlvizag, '_blank');
    }

    else if (loc === 'giggles vizag') {
      const giggles_vizag = encodeURIComponent(
        'Giggles by Omni RK, Beside Omni Hospitals, Waltair Main Rd, Opp Lions Club Of, Ram Nagar, Visakhapatnam, Andhra Pradesh 530002'
      );
      const googleMapsUrlgigglesvizag  = `https://www.google.com/maps/dir/?api=1&destination=${giggles_vizag}`;
      window.open(googleMapsUrlgigglesvizag, '_blank');
    }

    else if (loc === 'kurnool') {
      const kurnool = encodeURIComponent(
        'OMNI Hospitals Kurnool, 46/679-C, NH40, Budhawara Peta, Alluri Sitarama Raju Nagar, Kurnool, Andhra Pradesh 518002'
      );
      const googleMapsUrlkurnool  = `https://www.google.com/maps/dir/?api=1&destination=${kurnool}`;
      window.open(googleMapsUrlkurnool, '_blank');
    }

    else {
      console.warn('Location not recognized');
    }
  }
  
  goToDoctorDetails() {
    this.router.navigate(['/doctor-details']).then(success => {
      if (success) {
        console.log('Navigation to Doctor Details successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
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
