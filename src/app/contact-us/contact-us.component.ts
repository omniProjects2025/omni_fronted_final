import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  private map!: L.Map;
  userLat: number | null = null;
  userLng: number | null = null;
  mapUrl: SafeResourceUrl | null = null;
nearestBranch: any = {}; // Set this as needed

states: string[] = [];
locations: any[] = [];
selectedState: string = '';
filteredBranches:any[] = [];
// selectedLocation: any = null;

  kothapet = false;
  udai = false;
  vizag = false;
  kurnool = false;
  giggles = false;
  kukatpally = false;
  
  BRANCH_LOCATIONS: any = [
    {
      key: 'kukatpally',
      name: 'OMNI Hospitals, Kukatpally',
      lat: 17.485269683418686,
      lng: 78.4083654749371,
      address: 'Mumbai Hwy, opp. BIG BAZAR, Balaji Nagar, Kukatpally, Hyderabad, Telangana 500072',
      phone:'1234567889',
      img:"omni_kukkatpally_contact_us.svg"
    },
    {
      key: 'udai',
      name: 'Udai Omni Hospital - Orthopedics | Multispeciality | Trauma',
      lat:17.3969257,
      lng: 78.472412,
      address: '5-9-92/A/1, Chapel Rd, near Fateh Maidan, Fateh Maidan, Abids, Hyderabad, Telangana 500001',
      phone:'1234567889',
      img:"udai_omni.svg"
    },
    {
      key: 'kothapet',
      name: 'OMNI Hospitals',
      lat: 17.3686691,
      lng: 78.538822,
      address: 'Plot No.W-11,B-9, Sy. No.9/1/A Near SVC Cinema Theatre opp PVT Market Building Kothapet, Dilsukhnagar, Hyderabad, Telangana 500036',
      phone: '1234567889',
      img:"kothapet_location_image.svg"
    },    
    {
      key: 'kurnool',
      name: 'OMNI Hospitals Kurnool',
      lat: 15.823561600000001,
      lng: 78.0415378,
      address: '46/679-C, NH40, Budhawara Peta, Alluri Sitarama Raju Nagar, Kurnool, Andhra Pradesh 518002',
      phone:'1234567889',
      img:"kurnool_location_image.svg"
    },
    {
      key: 'vizag',
      name: 'OMNI RK Multi Specialty Hospital',
      lat: 17.7183946,
      lng: 83.3111361,
      address: 'RK Beach Rd, Pandurangapuram, Visakhapatnam, Andhra Pradesh 530003',
      phone: '1234567890',
      img:"vizag_location_image.svg"
      // iframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.5565941356035!2d83.3111361!3d17.7183946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a394315b6aa6577%3A0x3699aded6ece84dd!2sOMNI%20RK%20Multi%20Specialty%20Hospital!5e0!3m2!1sen!2sin!4v1745143810828!5m2!1sen!2sin'
    },    
    {
      key: 'giggles',
      name: 'Giggles by Omni RK',
      lat: 17.718362979950925,
      lng: 83.31482030053034,
      address: 'Beside Omni Hospitals, Waltair Main Rd, Opp Lions Club Of, Ram Nagar, Visakhapatnam, Andhra Pradesh 530002',
      phone:'1234567889',
      img:"giggles_vizag_location.svg"
    }
  ]

constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute,   private http: HttpClient) {}

ngOnInit() {
 this.filteredBranches = [...this.BRANCH_LOCATIONS]; // show all by default
  this.locations = [];
  this.states = [...new Set(this.BRANCH_LOCATIONS.map((branch: any) => this.getStateFromAddress(branch.address)))] as string[];
this.onNearestBranch()
}

onNearestBranch(){
  console.log('nerast');
  
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      this.userLat = position.coords.latitude;
      this.userLng = position.coords.longitude;

      // Find nearest branch directly
      let minDistance = Infinity;
      let nearest_Branch;
      for (let loc of this.BRANCH_LOCATIONS) {
        const distance = this.getDistance(this.userLat, this.userLng, loc.lat, loc.lng);
        if (distance < minDistance) {
          minDistance = distance;
          nearest_Branch = loc;
        }
      }

      // Set nearestBranch and update map
      this.nearestBranch = nearest_Branch;
      console.log(this.nearestBranch,'this.nearestBranch...');
      
      const url = `https://maps.google.com/maps?q=${nearest_Branch.lat},${nearest_Branch.lng}&z=15&output=embed`;
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }
}


selectBranch(branch: any) {
  this.nearestBranch['key'] = branch.key;
}

getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const R = 6371; // Radius of the earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

findNearestBranch() {
  let minDistance = Number.MAX_VALUE;

  for (const branch of this.BRANCH_LOCATIONS) {
    const distance = this.calculateDistance(this.userLat!, this.userLng!, branch.lat, branch.lng);
    if (distance < minDistance) {
      minDistance = distance;
      this.nearestBranch = branch;
      console.log(this.nearestBranch,'nearestBranch');
    }
  }
  if (this.nearestBranch) {
    const url = `https://maps.google.com/maps?q=${this.nearestBranch.lat},${this.nearestBranch.lng}&z=15&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
getStateFromAddress(address: string): string {
  const parts = address.split(',');
  const lastPart = parts[parts.length - 1].trim(); // "Telangana 500072" or "Andhra Pradesh 530003"
  const stateName = lastPart.replace(/\d+/g, '').trim(); // Remove the pincode
  return stateName;
}

onStateChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  this.selectedState = selectElement.value;
  if (this.selectedState === '') {
    this.filteredBranches = [...this.BRANCH_LOCATIONS];
    this.onNearestBranch()
    return;
  }

  // Filter locations based on selected state
  this.locations = this.BRANCH_LOCATIONS.filter(
    (branch: any) => this.getStateFromAddress(branch.address) === this.selectedState
  );

  
}

onLocationChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const locationKey = selectElement.value;

  if (locationKey === '') {
    this.filteredBranches = [...this.BRANCH_LOCATIONS];
    this.onNearestBranch()
    return;
  } else{
    this.nearestBranch = this.BRANCH_LOCATIONS.find((loc: any) => loc.key === locationKey);
    if (this.nearestBranch) {
      const index = this.BRANCH_LOCATIONS.findIndex((b: any) => b.key === this.nearestBranch.key);
      const selected = this.BRANCH_LOCATIONS[index];
      const rest = this.BRANCH_LOCATIONS.filter((b: any) => b.key !== this.nearestBranch.key);
      this.filteredBranches = [selected];
    }
  }

}

formData = {
  name: '',
  email: '',
  phone: '',
  message: ''
};

submitContactForm(form: any) {
  // Full Name validation
  if (!form.name || form.name.trim().length < 3) {
    alert('Please enter a valid full name (at least 3 characters).');
    return;
  }

  // Mobile Number validation
  const phonePattern = /^[6-9]\d{9}$/;
  if (!form.phone || !phonePattern.test(form.phone)) {
    alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
    return;
  }

  // Prevent duplicate submission for 30 minutes
  const lastSubmission = localStorage.getItem('contactUsSubmission');
  if (lastSubmission) {
    const { name, phone, time } = JSON.parse(lastSubmission);
    const thirtyMinutes = 30 * 60 * 1000;
    const now = Date.now();

    if (
      name === form.name.trim() &&
      phone === form.phone.trim() &&
      now - time < thirtyMinutes
    ) {
      alert('You have already submitted a request with this name and phone number in the last 30 minutes.');
      return;
    }
  }

  const payload = [
    { Attribute: "FirstName", Value: form.name },
    { Attribute: "Phone", Value: form.phone },
    { Attribute: "EmailAddress", Value: form.email },
    { Attribute: "Description", Value: form.message },
    { Attribute: "Source", Value: "Website - Contact Us" }
  ];

  const accessKey = 'u$r56afea08b32d556818ad1a5f69f0e7f0';
  const secretKey = '8d7f86d677dadaba209b4dead3cfcc4ab019031b';
  const api_url_base = 'https://api-in21.leadsquared.com/v2/';
  const url = `${api_url_base}LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

  this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
    .subscribe({
      next: (res) => {
        alert('Thank you! Your enquiry has been submitted.');
        // Save last submission info for 30-minute check
        localStorage.setItem('contactUsSubmission', JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          time: Date.now()
        }));
        this.formData = { name: '', email: '', phone: '', message: '' };
      },
      error: (err) => {
        alert('Submission failed. Please try again.');
        console.error(err);
      }
    });
}
}
