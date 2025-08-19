import { Component } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-patient-care',
  templateUrl: './patient-care.component.html',
  styleUrls: ['./patient-care.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PatientCareComponent {
  bannerImage = 'assets/images/Not Sure About Surgery-01.jpg';
  phoneNumber = '04067369999';
  mobileNumber = '8096369999';

  sections = [
    { title: 'Before Admission', text: 'Contact our IP Reception Desk, available 24x7.', icon: 'fas fa-user-check' },
    { title: 'Admission', text: 'In emergencies, visit reception immediately for swift admission.', icon: 'fas fa-door-open' },
    { title: 'Required Documents', list: ['Doctor’s prescription', 'Insurance proof', 'Medical benefits card', 'Test results', 'Medication list', 'Passport (intl patients)'], icon: 'fas fa-file-medical' },
    { title: 'What to Bring', text: 'Comfortable slippers, toiletries, and light clothes for your stay.', icon: 'fas fa-suitcase' },
    { title: 'Discharge Procedure', list: ['Advance notice', 'Interim bill', 'Transport help', 'Follow-up contact', 'Instructions for rest & diet'], icon: 'fas fa-sign-out-alt' },
    { title: 'Payment', text: 'Cash or card payments. Cheques not accepted.', icon: 'fas fa-credit-card' }
  ];

  callNumber(num: string) {
    window.location.href = `tel:${num}`;
  }
}
