import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css']
})
export class CareersComponent {
  currentTab: 'openings' | 'joiners' | 'apply' = 'openings';
  today = new Date();
  applyForm: FormGroup;
  selectedFile: File | null = null;
  emil: string = 'doctors@omnihospitals.in';
  careers = [
    { title: 'Compassionate Culture', image: 'culture_image.png', description: "We believe great healthcare starts with kindness. Our workplace culture is built on empathy, respect, and a shared commitment to patient well-being creating an environment where every voice is valued." },
    { title: 'Career Growth', image: 'career_growth.png', description: "Your growth matters to us. With continuous learning opportunities, mentoring, and internal advancement programs, we empower you to shape a fulfilling and long-term career in healthcare." },
    { title: 'Great Teamwork', image: 'great_teamwork.png', description: "Collaboration is at the heart of everything we do. Our multidisciplinary teams work together seamlessly to deliver the best outcomes supporting one another, learning from each other, and celebrating success together." },
  ];

  jobList = [
    { title: 'IP Operations', location: 'Hyderabad', department: 'Operations', postedDate: '2025-09-01', lastDate: '2025-10-10' },
    { title: 'Billing Executive', location: 'Vijayawada', department: 'Billing', postedDate: '2025-09-01', lastDate: '2025-10-12' },
    { title: 'Pharmacist', location: 'Chennai', department: 'Pharmacy', postedDate: '2025-09-03', lastDate: '2025-09-08' },
    { title: 'Nursing Supervisor', location: 'Vizag', department: 'Nursing', postedDate: '2025-09-01', lastDate: '2025-10-20' },
    { title: 'Front Office Executive', location: 'Hyderabad', department: 'FO', postedDate: '2025-09-25', lastDate: '2025-11-05' },
    { title: 'Radiologist', location: 'Vijayawada', department: 'Radiology', postedDate: '2025-09-02', lastDate: '2025-10-18' },
    { title: 'HR Executive', location: 'Vizag', department: 'HR', postedDate: '2025-09-01', lastDate: '2025-10-11' },
    { title: 'Lab Technician', location: 'Hyderabad', department: 'Lab', postedDate: '2025-09-05', lastDate: '2025-09-09' },
    { title: 'Marketing Officer', location: 'Chennai', department: 'Marketing', postedDate: '2025-09-06', lastDate: '2025-11-30' },
    { title: 'Housekeeping Staff', location: 'Vizag', department: 'Housekeeping', postedDate: '2025-09-20', lastDate: '2025-10-01' },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.applyForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required]
    });
  }

  switchTab(tab: 'openings' | 'joiners' | 'apply') {
    this.currentTab = tab;
  }

  isJobActive(job: any): boolean {
    return new Date(job.lastDate) >= this.today;
  }

  shareJob(job: any) {
    const shareData = {
      title: job.title,
      text: `${job.title} - ${job.location} in ${job.department}`,
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      alert('Share not supported on this browser.');
    }
  }

  onSubmit() {
    if (this.applyForm.valid) {
      const formData = new FormData();
      formData.append('firstName', this.applyForm.get('firstName')?.value);
      formData.append('lastName', this.applyForm.get('lastName')?.value);
      formData.append('phone', this.applyForm.get('phone')?.value);
      formData.append('email', this.applyForm.get('email')?.value);
      formData.append('position', this.applyForm.get('position')?.value);

      if (this.selectedFile) {
        formData.append('resume', this.selectedFile, this.selectedFile.name);
      }

      this.http.post('http://localhost:3000/send-email', formData).subscribe(
        res => alert('Email sent successfully!'),
        err => alert('Failed to send email.')
      );

      this.applyForm.reset();
    } else {
      this.applyForm.markAllAsTouched();
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

}
