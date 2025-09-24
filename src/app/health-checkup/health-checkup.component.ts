import { HttpClient } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HealthPackageService } from '../services/health-package.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-health-checkup',
  templateUrl: './health-checkup.component.html',
  styleUrls: ['./health-checkup.component.css']
})
export class HealthCheckupComponent {
  discount: string = '';
  appointmentForm!: FormGroup;
  modalInstance: any;
  locations: string[] = ['All Packages', 'Kothapet', 'Kukatpally', 'Nampally', 'Vizag', 'Kurnool'];
  selected: string = 'All Packages';
  allPackages: any = {};
  displayedPackages: any[] = [];
  selectedPackageName: string = '';
  packageData = {
    fullName: '',
    emailId: '',
    phoneNumber: '',
    appointmentDate: ''
  };
  constructor(private router: Router, private renderer: Renderer2, private fb: FormBuilder, private http: HttpClient, private healthpackagesdetails: HealthPackageService) {
    this.valiDations()
  }
  ngOnInit() {
    this.getHealthPackageDetails();
    this.renderer.setStyle(document.body, 'background-color', 'white');
  }

  getHealthPackageDetails() {
    this.healthpackagesdetails.getAllHealthPackagesDetails().pipe(take(1)).subscribe((response: any) => {
      if (Array.isArray(response.data)) {
        const packageArray = response.data;
        const grouped = packageArray.reduce((acc: any, pkg: any) => {
          const loc = pkg.location || 'Others';
          if (!acc[loc]) {
            acc[loc] = [];
          }
          acc[loc].push(pkg);
          return acc;
        }, {});
        this.allPackages = grouped;
        this.locations = ['All Packages', ...Object.keys(grouped)];
        this.displayAllPackages();
      } else {
        console.error('Expected array but got:', response);
      }
    });
  }


  ngOnDestroy() {
  }

  getDiscount(oldPrice: number, newPrice: number): string {
    return ((1 - newPrice / oldPrice) * 100).toFixed(0) + '% Off';
  }

  getPackageIcon(packageName: string): string {
    if (!packageName) return 'fas fa-heartbeat';
    
    const name = packageName.toLowerCase();
    
    // Cardiac/Heart related packages
    if (name.includes('cardiac') || name.includes('heart') || name.includes('cardio')) {
      return 'fas fa-heartbeat';
    }
    
    // Orthopedic/Bone related packages
    if (name.includes('ortho') || name.includes('bone') || name.includes('joint') || name.includes('spine')) {
      return 'fas fa-bone';
    }
    
    // Eye/Vision related packages
    if (name.includes('eye') || name.includes('vision') || name.includes('ophthal')) {
      return 'fas fa-eye';
    }
    
    // Diabetes related packages
    if (name.includes('diabetes') || name.includes('diabetic') || name.includes('sugar')) {
      return 'fas fa-tint';
    }
    
    // Kidney related packages
    if (name.includes('kidney') || name.includes('renal') || name.includes('nephro')) {
      return 'fas fa-filter';
    }
    
    // Liver related packages
    if (name.includes('liver') || name.includes('hepatic')) {
      return 'fas fa-leaf';
    }
    
    // Cancer related packages
    if (name.includes('cancer') || name.includes('onco') || name.includes('tumor')) {
      return 'fas fa-ribbon';
    }
    
    // Women's health packages
    if (name.includes('women') || name.includes('gynec') || name.includes('pregnancy') || name.includes('maternal')) {
      return 'fas fa-female';
    }
    
    // Men's health packages
    if (name.includes('men') || name.includes('male') || name.includes('prostate')) {
      return 'fas fa-male';
    }
    
    // Child/Pediatric packages
    if (name.includes('child') || name.includes('pediatric') || name.includes('baby') || name.includes('infant')) {
      return 'fas fa-child';
    }
    
    // Senior/Elderly packages
    if (name.includes('senior') || name.includes('elderly') || name.includes('geriatric')) {
      return 'fas fa-user-clock';
    }
    
    // Full body/Complete packages
    if (name.includes('whole') || name.includes('complete') || name.includes('full') || name.includes('comprehensive')) {
      return 'fas fa-user-md';
    }
    
    // Executive packages
    if (name.includes('executive') || name.includes('corporate') || name.includes('business')) {
      return 'fas fa-briefcase';
    }
    
    // Default health checkup icon
    return 'fas fa-stethoscope';
  }


  viewPackageDetails(selected_obj: any) {
    console.log(selected_obj, 'selected_obj...');

    this.router.navigate(['/package-details'], {
      queryParams: {
        selected_obj: JSON.stringify(selected_obj),
        selected_loc: this.selected
      }
    });
  }

  valiDations() {
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      packageType: new FormControl('', Validators.required),
      speciality: new FormControl('')

    });
  }

bookAppointment(id: number, package_title: string) {
  this.selectedPackageName = package_title;
  this.appointmentForm.patchValue({
    packageType: package_title,
    speciality: package_title
  });

  const modalElement = document.getElementById('appointmentModal');
  if (modalElement) {
    modalElement.removeAttribute('inert');
    this.modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement, {
      backdrop: 'static',
      keyboard: false
    });
    this.modalInstance.show();
    setTimeout(() => {
      document
        .querySelector('.modal-backdrop')
        ?.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.8) !important;');
    }, 100);
  }
}


submitPackageForm() {
  if (this.appointmentForm.invalid) {
    this.appointmentForm.markAllAsTouched();
    return;
  }

  const formValues = this.appointmentForm.getRawValue();
  this.packageData.fullName = formValues.name;
  this.packageData.emailId = formValues.email;
  this.packageData.phoneNumber = formValues.mobile;
  this.packageData.appointmentDate = ''; // Optional

  // 30-minute restriction
  const lastSubmission = localStorage.getItem('lastPackageBooking');
  if (lastSubmission) {
    const { name, phone, time } = JSON.parse(lastSubmission);
    const thirtyMinutes = 30 * 60 * 1000;
    if (
      name === this.packageData.fullName.trim() &&
      phone === this.packageData.phoneNumber.trim() &&
      Date.now() - time < thirtyMinutes
    ) {
      alert('You already submitted a booking with this name and phone in the last 30 minutes.');
      return;
    }
  }

  const payload = [
    { Attribute: 'FirstName', Value: this.packageData.fullName },
    { Attribute: 'Phone', Value: this.packageData.phoneNumber },
    { Attribute: 'EmailAddress', Value: this.packageData.emailId },
    { Attribute: 'mx_Speciality', Value: formValues.speciality || this.selectedPackageName },
    { Attribute: 'mx_AppointmentDate', Value: this.packageData.appointmentDate || '' },
    { Attribute: 'Source', Value: 'Website - Package Booking' }
  ];

  // LeadSquared API call (matching working pages)
  const url = `${environment.leadsquared.baseUrl}LeadManagement.svc/Lead.Capture?accessKey=${environment.leadsquared.accessKey}&secretKey=${environment.leadsquared.secretKey}`;

  this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
    .subscribe({
      next: (res) => {
        console.log('LeadSquared Booking Success:', res);
        localStorage.setItem('lastPackageBooking', JSON.stringify({
          name: this.packageData.fullName.trim(),
          phone: this.packageData.phoneNumber.trim(),
          time: Date.now()
        }));
        this.router.navigate(['/thank-you']);
        this.modalInstance.hide();
      },
      error: (err) => {
        console.error('LeadSquared Error:', err);
        alert('There was a problem submitting your booking.');
      }
    });
}


  selectLocation(location: string) {
    this.selected = location;
    if (location === 'All Packages') {
      this.displayAllPackages();
    } else {
      this.displayedPackages = this.allPackages[location] || [];
      console.log(this.displayedPackages, 'displayedPackages locations..');

      if (this.displayedPackages.length === 0) {
        console.warn(`No packages found for location: ${location}`);
      }
    }
  }

  displayAllPackages() {
    console.log(this.displayedPackages, 'location wise data displaying...');
    this.displayedPackages = Object.entries(this.allPackages)
      .filter(([key]) => key !== 'All Packages')
      .flatMap(([_, value]) => value);
  }
}
