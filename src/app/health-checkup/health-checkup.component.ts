import { HttpClient } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HealthPackageService } from '../health-package.service';
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
    this.renderer.setStyle(document.body, 'background-color', 'rgb(234, 232, 232)');
  }

  getDiscount(oldPrice: number, newPrice: number): string {
    return ((1 - newPrice / oldPrice) * 100).toFixed(0) + '% Off';
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
      packageType: new FormControl('', Validators.required)

    });
  }

bookAppointment(id: number, package_type: string) {
  this.appointmentForm.patchValue({
    packageType: package_type,
    speciality: package_type
  });

  const modalElement = document.getElementById('appointmentModal');
  if (modalElement) {
    modalElement.removeAttribute('inert');
    this.modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
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
    { Attribute: 'mx_Speciality', Value: formValues.speciality }, // send speciality
    { Attribute: 'mx_AppointmentDate', Value: this.packageData.appointmentDate },
    { Attribute: 'Source', Value: 'Website - Package Booking' }
  ];

  const accessKey = 'u$r56afea08b32d556818ad1a5f69f0e7f0';
  const secretKey = '8d7f86d677dadaba209b4dead3cfcc4ab019031b';
  const api_url_base = 'https://api-in21.leadsquared.com/v2/';
  const url = `${api_url_base}LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

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
