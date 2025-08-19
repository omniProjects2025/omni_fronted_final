import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-book-an-appointment',
  templateUrl: './book-an-appointment.component.html',
  styleUrls: ['./book-an-appointment.component.css']
})
export class BookAnAppointmentComponent {

  showEmergencyModal = false;

  emergencyNumbers = [
    { place: 'Kothapet', phone: '040 - 25365895' },
    { place: 'Kukatpally', phone: '040 - 25365895' },
    { place: 'Nampally', phone: '040 - 25365895' },
    { place: 'Vizag', phone: '040 - 25365895' },
    { place: 'Giggles - Vizag', phone: '040 - 25365895' },
    { place: 'Kurnool', phone: '040 - 25365895' },
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
  formData = {
    fullName: '',
    phoneNumber: '',
    emailId: '',
    location: '',
    department: '',
    message: ''
  };

  constructor(private router: Router, private http: HttpClient) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  toggleEmergencyModal() {
    this.showEmergencyModal = !this.showEmergencyModal;
  }


  submitForm() {
    // 1️⃣ Mandatory fields check
    if (!this.formData.fullName.trim()) {
      alert('Full Name is required.');
      return;
    }
    if (!this.formData.phoneNumber.trim()) {
      alert('Phone Number is required.');
      return;
    }

    // 2️⃣ Prevent duplicate submission for 30 minutes
    const lastSubmission = localStorage.getItem('lastSubmission');
    if (lastSubmission) {
      const { name, phone, time } = JSON.parse(lastSubmission);
      const thirtyMinutes = 30 * 60 * 1000;
      const now = Date.now();

      if (
        name === this.formData.fullName.trim() &&
        phone === this.formData.phoneNumber.trim() &&
        now - time < thirtyMinutes
      ) {
        alert('You have already submitted a request with this name and phone number in the last 30 minutes.');
        return;
      }
    }

    const payload = [
      { Attribute: "FirstName", Value: this.formData.fullName },
      { Attribute: "Phone", Value: this.formData.phoneNumber },
      { Attribute: "EmailAddress", Value: this.formData.emailId },
      { Attribute: "mx_Location", Value: this.formData.location },
      { Attribute: "mx_Department", Value: this.formData.department },
      { Attribute: "mx_Message", Value: this.formData.message },
      { Attribute: "Source", Value: "Website - Book An Appointment" }
    ];

    const accessKey = 'u$r56afea08b32d556818ad1a5f69f0e7f0';
    const secretKey = '8d7f86d677dadaba209b4dead3cfcc4ab019031b';
    const api_url_base = 'https://api-in21.leadsquared.com/v2/';
    const url = `${api_url_base}LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

    this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (res) => {
          console.log('LeadSquared Success:', res);
          alert('Your appointment request has been submitted successfully!');

          // Save last submission info for 30-minute check
          localStorage.setItem('lastSubmission', JSON.stringify({
            name: this.formData.fullName.trim(),
            phone: this.formData.phoneNumber.trim(),
            time: Date.now()
          }));

          // Reset form
          this.formData = {
            fullName: '',
            phoneNumber: '',
            emailId: '',
            location: '',
            department: '',
            message: ''
          };
          this.router.navigate(['/thank-you']);
        },
        error: (err) => {
          console.error('LeadSquared Error:', err);
          alert('There was a problem submitting your request.');
        }
      });
  }




  goToHealthPackages() {
    this.router.navigate(['/health-checkup']).then(success => {
      if (success) {
        console.log('Navigation to Thank you page successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
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
    }, 300);
  }
}
