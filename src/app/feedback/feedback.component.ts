import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { getDepartmentsFor, allDepartments as SHARED_ALL } from '../config/specialties';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  feedbackForm: FormGroup;
  submitted = false;
  otpSent = false;
  stars = [1, 2, 3, 4, 5];
  // Location options
  locations: string[] = ['Kukatpally', 'Kothapet', 'Vizag', 'Kurnool', 'Nampally'];

  // Department options (same for all locations)
  departments: string[] = [];
  availableDepartments: string[] = [];
  allDepartments: string[] = [];

  // Track if user is a patient
  isPatientValue: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private notification: NotificationService) {
    this.feedbackForm = this.fb.group({
      name: ['', Validators.required],
      isPatient: ['', Validators.required],
      patientId: [''],
      patientAddress: [''],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      email: ['', [Validators.email]],
      location: ['', Validators.required],
      department: [''],
      doctorName: [''],
      rating: [0, Validators.min(1)],
      feedback: ['']
    });

    // initialize departments
    this.allDepartments = SHARED_ALL || [];
    this.availableDepartments = [];

    // update departments when location changes
    this.feedbackForm.get('location')?.valueChanges.subscribe((loc: string) => {
      const found = getDepartmentsFor(loc);
      this.availableDepartments = found.length ? found : this.allDepartments;
      this.feedbackForm.get('department')?.setValue('');
    });

    this.feedbackForm.get('isPatient')?.valueChanges.subscribe(value => {
      this.isPatientValue = value;
      this.updatePatientIdValidation();
    });
  }

  get f() {
    return this.feedbackForm.controls;
  }

  setRating(value: number) {
    this.feedbackForm.controls['rating'].setValue(value);
  }

  getOtp() {
    this.submitted = true;
    if (this.f['phone'].valid) {
      this.otpSent = true;
      this.notification.info('OTP sent to your phone');
    }
  }

  updatePatientIdValidation() {
    const patientIdControl = this.feedbackForm.get('patientId');
    if (this.isPatientValue === 'yes') {
      patientIdControl?.setValidators([Validators.required]);
    } else {
      patientIdControl?.clearValidators();
    }
    patientIdControl?.updateValueAndValidity();
  }

  onSubmit() {
    this.submitted = true;
    if (this.feedbackForm.valid) {
      const payload = [
        { Attribute: "FirstName", Value: this.feedbackForm.value.name },
        { Attribute: "Phone", Value: this.feedbackForm.value.phone },
        { Attribute: "EmailAddress", Value: this.feedbackForm.value.email },
        { Attribute: "mx_City", Value: this.feedbackForm.value.location },
        { Attribute: "mx_Department", Value: this.feedbackForm.value.department || '' },
        { Attribute: "mx_PatientId", Value: this.feedbackForm.value.patientId || '' },
        { Attribute: "mx_IsPatient", Value: this.feedbackForm.value.isPatient },
        { Attribute: "mx_Comments", Value: this.feedbackForm.value.feedback || '' },
        { Attribute: "Source", Value: "Website - Feedback" }
      ];

      const accessKey = environment.leadsquared.accessKey;
      const secretKey = environment.leadsquared.secretKey;
      const api_url_base = environment.leadsquared.baseUrl;
      const url = `${api_url_base}LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

      this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
        .subscribe({
          next: (res) => {
            console.log('LeadSquared Feedback Success:', res);
            this.feedbackForm.reset();
            this.router.navigate(['/thank-you']);
          },
          error: (err) => {
            console.error('LeadSquared Feedback Error:', err);
            this.notification.error('There was a problem submitting your feedback.');
          }
        });
    }
  }
}
