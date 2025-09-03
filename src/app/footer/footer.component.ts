import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  hoveredIcon: string = '';
  email = "info@omnihospitals.in"
  specialties: string[] = [
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
    this.router.navigate(['/our-specialities-details'], {
      queryParams: {
        selected_speciality: speciality
      }
    });
  }
} 
