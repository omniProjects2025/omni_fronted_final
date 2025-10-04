import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { LeadSquaredService } from '../services/leadsquared.service';

declare var AOS: any;

@Component({
  selector: 'app-total-knee-replacement',
  templateUrl: './total-knee-replacement.component.html',
  styleUrls: ['./total-knee-replacement.component.css']
})
export class TotalKneeReplacementComponent implements OnInit, OnDestroy {
  consultationForm: FormGroup;
  inquiryForm: FormGroup;
  isSubmitting = false;
  isInquirySubmitting = false;
  submitMessage = '';
  inquiryMessage = '';
  submitSuccess = false;
  inquirySuccess = false;
  expandedFaqIndex: number = 0; // First FAQ is open by default

  constructor(
    private meta: Meta,
    private title: Title,
    private fb: FormBuilder,
    private leadSquaredService: LeadSquaredService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.consultationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.email]], // Made optional - removed required validator
      message: ['', Validators.maxLength(500)]
    });

    this.inquiryForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.email]] // Optional field
    });
  }

  ngOnInit(): void {
    this.setSEOTags();
    this.initAOS();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  private setSEOTags(): void {
    // Set page title
    this.title.setTitle('Best Total Knee Replacement Surgery in Kukatpally, Hyderabad');

    // Set meta description
    this.meta.updateTag({
      name: 'description',
      content: 'Get Total Knee Replacement (TKR) in Kukatpally, Hyderabad, for an all-inclusive cost of ₹1.5 Lacs (Stryker implants included). Consult our expert orthopaedic team for minimal-invasive TKR and fast recovery.'
    });

    // Set Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: 'Best Total Knee Replacement Surgery in Kukatpally, Hyderabad' });
    this.meta.updateTag({ property: 'og:description', content: 'Get Total Knee Replacement (TKR) in Kukatpally, Hyderabad, for an all-inclusive cost of ₹1.5 Lacs (Stryker implants included). Consult our expert orthopaedic team for minimal-invasive TKR and fast recovery.' });
    this.meta.updateTag({ property: 'og:url', content: 'https://omnihospitals.in/total-knee-replacement-surgery-kukatpally-hyderabad/' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: 'https://omnihospitals.in/assets/images/tkr-banner.jpg' });

    // Set Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Best Total Knee Replacement Surgery in Kukatpally, Hyderabad' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Get Total Knee Replacement (TKR) in Kukatpally, Hyderabad, for an all-inclusive cost of ₹1.5 Lacs (Stryker implants included).' });

    // Set canonical URL
    this.meta.updateTag({ rel: 'canonical', href: 'https://omnihospitals.in/total-knee-replacement-surgery-kukatpally-hyderabad/' });

    // Set additional SEO tags
    this.meta.updateTag({ name: 'keywords', content: 'total knee replacement, TKR surgery, knee replacement kukatpally, hyderabad knee surgery, orthopaedic surgery, stryker implants, minimal invasive surgery' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'author', content: 'Omni Hospitals' });
  }

  private initAOS(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Load AOS dynamically
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
      script.onload = () => {
        AOS.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
          offset: 100
        });
      };
      document.head.appendChild(script);

      // Load AOS CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
      document.head.appendChild(link);
    }
  }

  onSubmit(): void {
    if (this.consultationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitMessage = '';

      const formData = {
        name: this.consultationForm.value.name,
        phone: this.consultationForm.value.phone,
        email: this.consultationForm.value.email || '',
        message: this.consultationForm.value.message || ''
      };

      // Use LeadSquared service with correct format
      this.leadSquaredService.submitLead([
        { Attribute: "FirstName", Value: formData.name },
        { Attribute: "Phone", Value: formData.phone },
        { Attribute: "EmailAddress", Value: formData.email },
        { Attribute: "Description", Value: formData.message },
        { Attribute: "Source", Value: "Total Knee Replacement Landing Page" }
      ]).subscribe({
        next: (response) => {
          console.log('LeadSquared API Response:', response);
          this.submitSuccess = true;
          this.submitMessage = 'Thank you! Your consultation request has been submitted successfully. Our team will contact you soon.';
          this.consultationForm.reset();
          this.isSubmitting = false;
          
          // Navigate to thank you page after successful submission
          setTimeout(() => {
            this.router.navigate(['/thank-you']);
          }, 2000); // 2 second delay to show success message
        },
        error: (error) => {
          console.error('Form submission error:', error);
          this.submitSuccess = false;
          this.submitMessage = 'There was an error submitting your request. Please try again or call us directly.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.consultationForm.controls).forEach(key => {
      const control = this.consultationForm.get(key);
      control?.markAsTouched();
    });
  }

  // Navigation methods
  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToKeySurgeries(): void {
    this.router.navigate(['/key-surgeries']);
  }

  // Phone call functionality
  makeCall(): void {
    // TODO: Replace with actual phone number
    const phoneNumber = '+91-XXXXXXXXXX'; // Replace with actual Omni Hospitals phone number
    window.open(`tel:${phoneNumber}`, '_self');
  }

  // Scroll to form functionality
  scrollToForm(): void {
    const formElement = document.getElementById('consultation-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Utility methods for form validation
  getFieldError(fieldName: string): string {
    const consultationField = this.consultationForm.get(fieldName);
    const inquiryField = this.inquiryForm.get(fieldName);
    
    const field = consultationField || inquiryField;
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid 10-digit phone number';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least 2 characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed 500 characters`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      message: 'Message',
      fullName: 'Full Name',
      mobileNumber: 'Mobile Number'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const consultationField = this.consultationForm.get(fieldName);
    const inquiryField = this.inquiryForm.get(fieldName);
    
    if (consultationField) {
      return !!(consultationField.invalid && consultationField.touched);
    }
    
    if (inquiryField) {
      return !!(inquiryField.invalid && inquiryField.touched);
    }
    
    return false;
  }

  // Inquiry form submission
  onInquirySubmit(): void {
    if (this.inquiryForm.valid && !this.isInquirySubmitting) {
      this.isInquirySubmitting = true;
      this.inquiryMessage = '';

      const formData = {
        fullName: this.inquiryForm.value.fullName,
        mobileNumber: this.inquiryForm.value.mobileNumber,
        email: this.inquiryForm.value.email || ''
      };

      // Use LeadSquared service with correct format
      this.leadSquaredService.submitLead([
        { Attribute: "FirstName", Value: formData.fullName },
        { Attribute: "Phone", Value: formData.mobileNumber },
        { Attribute: "EmailAddress", Value: formData.email },
        { Attribute: "Source", Value: "Total Knee Replacement - Inquiry Form" }
      ]).subscribe({
        next: (response) => {
          console.log('LeadSquared API Response:', response);
          this.inquirySuccess = true;
          this.inquiryMessage = 'Thank you! Your inquiry has been submitted successfully. Our team will contact you soon.';
          this.inquiryForm.reset();
          this.isInquirySubmitting = false;
          
          // Navigate to thank you page after successful submission
          setTimeout(() => {
            this.router.navigate(['/thank-you']);
          }, 2000); // 2 second delay to show success message
        },
        error: (error) => {
          console.error('Inquiry form submission error:', error);
          this.inquirySuccess = false;
          this.inquiryMessage = 'There was an error submitting your inquiry. Please try again or call us directly.';
          this.isInquirySubmitting = false;
        }
      });
    } else {
      this.markInquiryFormGroupTouched();
    }
  }

  private markInquiryFormGroupTouched(): void {
    Object.keys(this.inquiryForm.controls).forEach(key => {
      const control = this.inquiryForm.get(key);
      control?.markAsTouched();
    });
  }

  // FAQ toggle functionality
  toggleFaq(index: number): void {
    this.expandedFaqIndex = this.expandedFaqIndex === index ? -1 : index;
  }

  isFaqExpanded(index: number): boolean {
    return this.expandedFaqIndex === index;
  }
}
