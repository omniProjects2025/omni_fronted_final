import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

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
  filteredDepartments: string[] = [
    'Cardiology', 'Neurology', 'Oncology'
  ];

  departmentMap: { [key: string]: string[] } = {
    'Kothapet': ['Cardiology', 'Neurology'],
    'Kukkatpally': ['Oncology'],
    'Udai - Nampally': ['Cardiology', 'Oncology'],
    'OMNI - Vizag': ['Neurology'],
    'Giggles Vizag': ['Cardiology', 'Neurology', 'Oncology']
  };

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.feedbackForm = this.fb.group({
      name: ['', Validators.required],
      isPatient: ['', Validators.required],
      patientId: ['', Validators.required],
      patientAddress: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      email: ['', [Validators.email]],
      location: ['', Validators.required],
      department: [''],
      doctorName: [''],
      rating: [0, Validators.min(1)],
      feedback: ['']
    });

    this.feedbackForm.get('location')?.valueChanges.subscribe(loc => {
      this.filteredDepartments = this.departmentMap[loc] || [];
      this.feedbackForm.get('department')?.setValue('');
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
      alert('OTP sent to your phone');
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.feedbackForm.valid) {
      // Prepare payload for LeadSquared
      const payload = [
        { Attribute: "FirstName", Value: this.feedbackForm.value.name },
        { Attribute: "Phone", Value: this.feedbackForm.value.phone },
        { Attribute: "EmailAddress", Value: this.feedbackForm.value.email },
        { Attribute: "mx_City", Value: this.feedbackForm.value.location },
        { Attribute: "mx_Department", Value: this.feedbackForm.value.department },
        { Attribute: "Description", Value: this.feedbackForm.value.feedback },
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
            alert('Your feedback has been submitted successfully!');
            // Optionally reset form
            this.feedbackForm.reset();
            this.router.navigate(['/thank-you']);
          },
          error: (err) => {
            console.error('LeadSquared Feedback Error:', err);
            alert('There was a problem submitting your feedback.');
          }
        });
    }
  }
}
