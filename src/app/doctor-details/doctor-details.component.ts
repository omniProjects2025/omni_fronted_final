import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DoctordetailsService } from '../doctordetails.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent {
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

  constructor(private router: Router, private doctorservice: DoctordetailsService, private activated_routes: ActivatedRoute, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.activated_routes.params.subscribe(params => {
      const doctorParam = params['doctor'] || '';
      // Convert URL-friendly format back to original doctor name
      this.doctor_name = doctorParam
        .replace(/-/g, ' ')           // Replace hyphens with spaces
        .replace(/and/g, '&')         // Replace 'and' with &
        .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Capitalize first letter of each word
      console.log(this.doctor_name, 'doctor_name..');

      this.getDoctorDetails(); // Only call this after doctor_name is set
    });
  }


  // activatedRoutesData() {
  //   this.activated_routes.queryParams.subscribe(params => {
  //     this.doctor_name = params['selected_doctor']?.trim() || '';
  //   });
  // }

  openAppointmentModal(doctor: any) {
    this.selectedDoctor = doctor;
    this.resetAppointmentData();
    // Open modal using Bootstrap
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
      { Attribute: "mx_Department", Value: this.selectedDoctor?.depertment || '' },
      { Attribute: "Description", Value: `Appointment request for Dr. ${this.selectedDoctor?.name}. ${this.appointmentData.message}` },
      { Attribute: "Source", Value: "Website - Doctor Profile Appointment" },
      { Attribute: "mx_DoctorName", Value: this.selectedDoctor?.name || '' }
    ];

    const accessKey = 'u$r56afea08b32d556818ad1a5f69f0e7f0';
    const secretKey = '8d7f86d677dadaba209b4dead3cfcc4ab019031b';
    const api_url_base = 'https://api-in21.leadsquared.com/v2/';
    const url = `${api_url_base}LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

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
      if (key.startsWith('doctor_')) {
        localStorage.removeItem(key);
      }
    });
    this.getDoctorDetails();
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
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
      
      if (now - cacheTime < cacheExpiry) {
        this.doctors = parsedData.data;
        this.isLoading = false;
        console.log('Using cached doctor data');
        return;
      }
    } catch (e) {
      console.warn('Failed to parse cached data:', e);
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
        
        // If still no match, try fuzzy matching with word-based comparison
        if (this.doctors.length === 0) {
          const searchWords = this.doctor_name.toLowerCase()
            .replace(/^dr\.?\s*/i, '')
            .replace(/[^\w\s]/g, ' ') // Remove special characters
            .split(/\s+/)
            .filter((word: string) => word.length > 1); // Filter out single characters
          
          this.doctors = allDoctors.filter((doctor: any) => {
            const dbWords = doctor.name?.toLowerCase()
              .replace(/^dr\.?\s*/i, '')
              .replace(/[^\w\s]/g, ' ')
              .split(/\s+/)
              .filter((word: string) => word.length > 1);
            
            // Check if most words match
            const matchingWords = searchWords.filter(searchWord => 
              dbWords.some((dbWord: string) => dbWord.includes(searchWord) || searchWord.includes(dbWord))
            );
            
            return matchingWords.length >= Math.min(searchWords.length, 2); // At least 2 words or most words match
          });
        }
        
        // Cache the filtered data
        if (this.doctors.length > 0) {
          const cacheData = {
            data: this.doctors,
            timestamp: Date.now()
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        }
        
        console.log('=== DOCTOR SEARCH DEBUG ===');
        console.log('Searching for doctor:', this.doctor_name);
        console.log('Total doctors in database:', allDoctors.length);
        console.log('Found doctors:', this.doctors.length);
        console.log('Sample doctor names:', allDoctors.slice(0, 5).map((d: any) => d.name));
        console.log('=== END DEBUG ===');
        console.log(this.doctors, 'doctors...');
        this.isLoading = false;
        
        if (this.doctors.length === 0) {
          this.hasError = true;
          this.errorMessage = `No doctor found with name: ${this.doctor_name}`;
          
          // Debug: Show all available doctor names for troubleshooting
          console.log('=== DEBUG: All available doctor names ===');
          allDoctors.forEach((doctor: any, index: number) => {
            console.log(`${index + 1}. "${doctor.name}"`);
          });
          console.log('=== End of doctor names ===');
        }
      } catch (error) {
        console.error('Error processing doctor data:', error);
        this.hasError = true;
        this.errorMessage = 'Error processing doctor information';
        this.isLoading = false;
      }
    },
    error: (error: any) => {
      console.error('Error fetching doctor details:', error);
      this.hasError = true;
      this.errorMessage = 'Failed to load doctor details. Please check your internet connection and try again.';
      this.doctors = [];
      this.isLoading = false;
    }
  });
}

}
