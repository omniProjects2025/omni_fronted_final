import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      name: ['', Validators.required],
      isPatient: ['', Validators.required],
      patientId: ['', Validators.required],
      patientAddress: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      email: ['', [Validators.email]],
      location: ['', Validators.required],
      department: ['', Validators.required],
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
      alert('Form submitted successfully!');
      console.log(this.feedbackForm.value, 'feedbackForm..');
    }
  }
}
