import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { toUrlFriendly } from '../utils/url-helper.util';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  hoveredIcon: string = '';
  email = "info@omnihospitals.in"
  specialties: string[] = [
    'Cardiology',
    'Emergency Medicine & Critical Care',
    'ENT',
    'Medical & Surgical Gastroenterology',
    'General Surgery',
    'General Medicine',
    'Nephrology',
    'Neurology',
    'Obstetrics & Gynaecology',
    'Orthopedics',
    'Plastic Surgery',
    'Psychiatry',
    'Dermatology',
    'Pulmonology'
  ];
  constructor(private router: Router) {

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

  goToSPeciality(speciality: string) {
    const urlFriendlyName = toUrlFriendly(speciality);
    this.router.navigate(['/our-specialities-details', urlFriendlyName]);
  }

  goToSecondOpinion() {
    this.router.navigate(['/second-opinion']).then(success => {
      if (success) {
        console.log('Navigation to Second Opinion successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }

  goToHealthPackages() {
    this.router.navigate(['/health-checkup']).then(success => {
      if (success) {
        console.log('Navigation to Health Packages successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }

  goToWhatsApp() {
    // Open WhatsApp with a pre-filled message
    const phoneNumber = '8880101000';
    const message = 'Hello, I would like to get more information about your services.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  goToCall() {
    // Direct call functionality
    window.location.href = 'tel:8880101000';
  }
} 
