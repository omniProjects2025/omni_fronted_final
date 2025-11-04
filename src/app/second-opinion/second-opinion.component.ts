import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-second-opinion',
  templateUrl: './second-opinion.component.html',
  styleUrls: ['./second-opinion.component.css']
})
export class SecondOpinionComponent{
  counters = [
    { id: 1, img: 'branches_counter.svg', label: 'Hospitals', target: 6, value: 0 },
    { id: 2, img: 'beds_counter.svg', label: 'Beds', target: 800, value: 0 },
    { id: 3, img: 'doctor_counter.svg', label: 'Doctors', target: 450, value: 0 },
    { id: 4, img: 'pharmacy_counter.svg', label: 'Pharmacy', target: 6, value: 0 }
  ];
  secondOpinionData = {
    fullName: '',
    phoneNumber: '',
    emailId: '',
    location: '',
    department: ''
  };
  showNameError = false;
  showPhoneError = false;

  constructor(private http: HttpClient, private router: Router, private notification: NotificationService) { }

  ngAfterViewInit(): void {
    this.observeCounters();
  }

  observeCounters(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const target = parseInt(element.getAttribute('data-target') || '0', 10);
          this.animateCounter(element, target);
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(counter => observer.observe(counter));
  }
  animateCounter(element: HTMLElement, target: number) {
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 20);

    function updateCounter() {
      start += step;
      if (start >= target) {
        element.innerText = target.toString() + '+';
      } else {
        element.innerText = Math.ceil(start).toString() + '+';
        requestAnimationFrame(updateCounter);
      }
    }
    updateCounter();
  }

  submitSecondOpinion(form: any) {
    this.showNameError = false;
    this.showPhoneError = false;
    let hasError = false;
    // Full Name validation
    if (!form.fullName || form.fullName.trim().length < 3) {
      this.showNameError = true;
      hasError = true;
    }
    // Mobile Number validation
    const phonePattern = /^[6-9]\d{9}$/;
    if (!form.phoneNumber || !phonePattern.test(form.phoneNumber)) {
      this.showPhoneError = true;
      hasError = true;
    }
    if (hasError) return;
    // Prevent duplicate submission for 30 minutes
    const lastSubmission = localStorage.getItem('secondOpinionSubmission');
    if (lastSubmission) {
      const { name, phone, time } = JSON.parse(lastSubmission);
      const thirtyMinutes = 30 * 60 * 1000;
      const now = Date.now();
      if (
        name === form.fullName.trim() &&
        phone === form.phoneNumber.trim() &&
        now - time < thirtyMinutes
      ) {
        this.notification.info('You have already submitted a request with this name and phone number in the last 30 minutes.');
        return;
      }
    }
    const payload = [
      { Attribute: "FirstName", Value: form.fullName },
      { Attribute: "Phone", Value: form.phoneNumber },
      { Attribute: "EmailAddress", Value: form.emailId },
      { Attribute: "mx_City", Value: form.location },
      { Attribute: "mx_Department", Value: form.department },
      { Attribute: "Source", Value: "Website - Second Opinion" }
    ];
    const accessKey = environment.leadsquared.accessKey;
    const secretKey = environment.leadsquared.secretKey;
    const api_url_base = environment.leadsquared.baseUrl;
    const url = `${api_url_base}LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;
    this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (res) => {
          localStorage.setItem('secondOpinionSubmission', JSON.stringify({
            name: form.fullName.trim(),
            phone: form.phoneNumber.trim(),
            time: Date.now()
          }));
          this.secondOpinionData = {
            fullName: '',
            phoneNumber: '',
            emailId: '',
            location: '',
            department: ''
          };
          this.router.navigate(['/thank-you']);
        },
        error: (err) => {
          this.notification.error('Submission failed. Please try again.');
          console.error(err);
        }
      });
  }
}
