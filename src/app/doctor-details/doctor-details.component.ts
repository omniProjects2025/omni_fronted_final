import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DoctorDetailsService } from '../services/doctor-details.service';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnDestroy {
  doctors: any[] = []
  doctor_name = "";
  selectedDoctor: any = null;
  isSubmitting = false;
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  appointmentData = {
    fullName: '',
    mobileNumber: '',
    emailId: '',
    location: '',
    message: ''
  };

  constructor(
    private router: Router, 
    private doctorservice: DoctorDetailsService, 
    private activated_routes: ActivatedRoute, 
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta
  ) {

  }

  ngOnInit(): void {
    this.activated_routes.params.subscribe(params => {
      const doctorParam = params['doctor'] || '';
      // Convert URL-friendly format back to original doctor name
      this.doctor_name = doctorParam
        .replace(/^dr-/, 'Dr ')        // Handle Dr prefix properly
        .replace(/-/g, ' ')           // Replace hyphens with spaces
        .replace(/\band\b/g, '&')    // Replace 'and' with & (only whole words)
        .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Capitalize first letter of each word
      console.log(this.doctor_name, 'doctor_name..');

      this.getDoctorDetails(); // Only call this after doctor_name is set
    });
  }

  ngOnDestroy(): void {
    // Reset meta tags when leaving the page
    this.resetMetaTags();
  }

  openAppointmentModal(doctor: any) {
    this.selectedDoctor = doctor;
    this.resetAppointmentData();
    const modalElement = document.getElementById('appointmentModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  resetAppointmentData() {
    this.appointmentData = {
      fullName: '',
      mobileNumber: '',
      emailId: '',
      location: '',
      message: ''
    };
  }

  submitAppointmentForm() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;

    // Form validation
    if (!this.appointmentData.fullName.trim()) {
      alert('Full Name is required.');
      this.isSubmitting = false;
      return;
    }
    if (!this.appointmentData.mobileNumber.trim()) {
      alert('Mobile Number is required.');
      this.isSubmitting = false;
      return;
    }

    // Prevent duplicate submission for 30 minutes
    const lastSubmission = localStorage.getItem('lastAppointmentSubmission');
    if (lastSubmission) {
      const { name, phone, time } = JSON.parse(lastSubmission);
      const thirtyMinutes = 30 * 60 * 1000;
      const now = Date.now();

      if (
        name === this.appointmentData.fullName.trim() &&
        phone === this.appointmentData.mobileNumber.trim() &&
        now - time < thirtyMinutes
      ) {
        alert('You have already submitted an appointment request with this name and phone number in the last 30 minutes.');
        this.isSubmitting = false;
        return;
      }
    }

    const payload = [
      { Attribute: "FirstName", Value: this.appointmentData.fullName },
      { Attribute: "Phone", Value: this.appointmentData.mobileNumber },
      { Attribute: "EmailAddress", Value: this.appointmentData.emailId },
      { Attribute: "mx_City", Value: this.appointmentData.location },
      { Attribute: "mx_Department", Value: this.selectedDoctor?.department || '' },
      { Attribute: "Description", Value: `Appointment request for Dr. ${this.selectedDoctor?.name}. ${this.appointmentData.message}` },
      { Attribute: "Source", Value: "Website - Doctor Profile Appointment" },
      { Attribute: "mx_DoctorName", Value: this.selectedDoctor?.name || '' }
    ];

    // LeadSquared API call (matching working pages)
    const url = `${environment.leadsquared.baseUrl}LeadManagement.svc/Lead.Capture?accessKey=${environment.leadsquared.accessKey}&secretKey=${environment.leadsquared.secretKey}`;

    this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (res) => {
          console.log('LeadSquared Success:', res);
          alert('Your appointment request has been submitted successfully! Our team will contact you soon.');

          // Save last submission info for 30-minute check
          localStorage.setItem('lastAppointmentSubmission', JSON.stringify({
            name: this.appointmentData.fullName.trim(),
            phone: this.appointmentData.mobileNumber.trim(),
            time: Date.now()
          }));

          // Close modal and reset form
          this.closeModal();
          this.resetAppointmentData();
          this.router.navigate(['/thank-you']);
        },
        error: (err) => {
          console.error('LeadSquared Error:', err);
          alert('There was a problem submitting your appointment request. Please try again or call us directly.');
          this.isSubmitting = false;
        }
      });
  }

  closeModal() {
    const modalElement = document.getElementById('appointmentModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.isSubmitting = false;
  }

  retryLoading() {
    this.getDoctorDetails();
  }

  clearCache() {
    // Clear all doctor-related cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('doctor_') || key === 'doctors_cache') {
        localStorage.removeItem(key);
      }
    });
    // Also clear service cache
    this.doctorservice.clearCache();
    this.getDoctorDetails();
  }

  // Method to force refresh data (useful for admin updates)
  public forceRefresh(): void {
    console.log('Force refreshing doctor details...');
    this.clearCache();
  }

getDoctorDetails(): void {
  this.isLoading = true;
  this.hasError = false;
  this.errorMessage = '';

  // Check if we have cached data for this doctor
  const cacheKey = `doctor_${this.doctor_name.toLowerCase().replace(/\s+/g, '_')}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    try {
      const parsedData = JSON.parse(cachedData);
      const cacheTime = parsedData.timestamp;
      const now = Date.now();
      const cacheExpiry = 2 * 60 * 1000; // 2 minutes cache for individual doctor pages
      
        if (now - cacheTime < cacheExpiry) {
          this.doctors = parsedData.data;
          this.isLoading = false;
          console.log('Using cached doctor data');
          
          // Set meta tags for cached data
          if (this.doctors.length > 0) {
            this.setMetaTags(this.doctors[0]);
          }
          return;
        } else {
        // Remove expired cache
        localStorage.removeItem(cacheKey);
      }
    } catch (e) {
      console.warn('Failed to parse cached data:', e);
      localStorage.removeItem(cacheKey);
    }
  }

  this.doctorservice.getDoctors().subscribe({
    next: (response: any) => {
      try {
        const dataArray = response?.data || [];
        const allDoctors = dataArray
          .map((item: any) => item.doctors || [])
          .flat();
        
        if (!this.doctor_name) {
          this.doctors = [];
          this.isLoading = false;
          return;
        }
        
        // Try exact match first
        this.doctors = allDoctors.filter((doctor: any) =>
          doctor.name?.trim().toLowerCase() === this.doctor_name.toLowerCase()
        );
        
        // If no exact match, try partial match
        if (this.doctors.length === 0) {
          this.doctors = allDoctors.filter((doctor: any) =>
            doctor.name?.trim().toLowerCase().includes(this.doctor_name.toLowerCase()) ||
            this.doctor_name.toLowerCase().includes(doctor.name?.trim().toLowerCase())
          );
        }
        
        // If still no match, try removing common prefixes/suffixes
        if (this.doctors.length === 0) {
          const cleanDoctorName = this.doctor_name.toLowerCase()
            .replace(/^dr\.?\s*/i, '') // Remove "Dr." prefix
            .replace(/\s+/g, ' ')      // Normalize spaces
            .trim();
          this.doctors = allDoctors.filter((doctor: any) => {
            const cleanDbName = doctor.name?.trim().toLowerCase()
              .replace(/^dr\.?\s*/i, '') // Remove "Dr." prefix
              .replace(/\s+/g, ' ')      // Normalize spaces
              .trim();
            return cleanDbName === cleanDoctorName ||
                   cleanDbName.includes(cleanDoctorName) ||
                   cleanDoctorName.includes(cleanDbName);
          });
        }
        if (this.doctors.length === 0) {
          const searchWords = this.doctor_name.toLowerCase()
            .replace(/^dr\.?\s*/i, '')
            .replace(/[^\w\s]/g, ' ') // Remove special characters
            .split(/\s+/)
            .filter((word: string) => word.length > 1); // Filter out single characters
          const doctorsWithScores = allDoctors.map((doctor: any) => {
            const dbWords = doctor.name?.toLowerCase()
              .replace(/^dr\.?\s*/i, '')
              .replace(/[^\w\s]/g, ' ')
              .split(/\s+/)
              .filter((word: string) => word.length > 1) || [];
            const matchingWords = searchWords.filter(searchWord => 
              dbWords.some((dbWord: string) => dbWord.includes(searchWord) || searchWord.includes(dbWord))
            );
            const matchScore = matchingWords.length;
            const totalWords = Math.max(searchWords.length, dbWords.length);
            const matchPercentage = matchScore / totalWords;
            return { doctor, matchScore, matchPercentage };
          });
          this.doctors = doctorsWithScores
            .filter((item: any) => item.matchScore >= Math.min(searchWords.length, 2))
            .sort((a: any, b: any) => {
              if (b.matchPercentage !== a.matchPercentage) {
                return b.matchPercentage - a.matchPercentage;
              }
              return b.matchScore - a.matchScore;
            })
            .map((item: any) => item.doctor);
        }
        if (this.doctors.length > 0) {
          const cacheData = {
            data: this.doctors,
            timestamp: Date.now()
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
          
          // Set meta tags for the first (best matching) doctor
          this.setMetaTags(this.doctors[0]);
        }
        this.isLoading = false;
        if (this.doctors.length === 0) {
          this.hasError = true;
          this.errorMessage = `No doctor found with name: ${this.doctor_name}`;
          
          // Set default meta tags for error case
          this.resetMetaTags();
          
          allDoctors.forEach((doctor: any, index: number) => {
            console.log(`${index + 1}. "${doctor.name}"`);
          });
        }
      } catch (error) {
        this.hasError = true;
        this.errorMessage = 'Error processing doctor information';
        this.isLoading = false;
      }
    },
    error: (error: any) => {
      this.hasError = true;
      this.errorMessage = 'Failed to load doctor details. Please check your internet connection and try again.';
      this.doctors = [];
      this.isLoading = false;
    }
  });
}

  // Method to set meta tags for SEO using API data
  private setMetaTags(doctor: any): void {
    if (!doctor) return;

    // Set page title from API data or fallback
    const title = doctor.meta_title || `${doctor.name} - ${doctor.specialization || doctor.depertment} | OMNI Hospitals`;
    this.titleService.setTitle(title);

    // Set meta description from API data or fallback
    const description = doctor.meta_description || 
      `Book appointment with ${doctor.name}, ${doctor.specialization || doctor.depertment} at OMNI Hospitals. ${doctor.experience ? `Experience: ${doctor.experience}.` : ''} ${doctor.work_location ? `Location: ${doctor.work_location}.` : ''} Expert medical care and treatment.`;
    
    this.metaService.updateTag({ name: 'description', content: description });

    // Set additional meta tags for better SEO
    this.metaService.updateTag({ name: 'keywords', content: `${doctor.name}, ${doctor.specialization || doctor.depertment}, doctor, appointment, OMNI Hospitals, ${doctor.work_location || ''}` });
    
    // Set Open Graph tags for social media sharing
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'profile' });
    
    if (doctor.profile) {
      this.metaService.updateTag({ property: 'og:image', content: doctor.profile });
    }

    // Set Twitter Card tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    
    if (doctor.profile) {
      this.metaService.updateTag({ name: 'twitter:image', content: doctor.profile });
    }

    console.log('Meta tags set for doctor:', doctor.name);
  }

  // Method to reset meta tags to default
  private resetMetaTags(): void {
    this.titleService.setTitle('OMNI Hospitals - Best Healthcare Services');
    this.metaService.updateTag({ name: 'description', content: 'OMNI Hospitals - Leading healthcare provider offering comprehensive medical services with expert doctors and advanced facilities.' });
    this.metaService.updateTag({ name: 'keywords', content: 'OMNI Hospitals, healthcare, medical services, doctors, treatment, Hyderabad' });
  }

}
