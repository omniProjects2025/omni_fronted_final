import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { CanonicalService } from '../services/canonical.service';
import { CardiologySubDepartmentsService } from './cardiology-sub-departments.service';
import { LeadSquaredService } from '../services/leadsquared.service';

@Component({
  selector: 'app-cardiology-sub-department',
  templateUrl: './cardiology-sub-department.component.html',
  styleUrls: ['./cardiology-sub-department.component.css']
})
export class CardiologySubDepartmentComponent implements OnInit {
  subDepartment: any = {};
  appointmentForm = {
    name: '',
    mobile: '',
    email: ''
  };
  formErrors = {
    name: '',
    mobile: '',
    email: ''
  };

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService,
    private cardiologyService: CardiologySubDepartmentsService,
    private leadSquaredService: LeadSquaredService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    
    // Initialize data first
    this.cardiologyService.initializeData().subscribe(() => {
      // Get the slug from the route
      this.route.params.subscribe(params => {
        const slug = params['slug'];
        
        if (slug) {
          // Get sub-department data by slug
          this.subDepartment = this.cardiologyService.getSubDepartmentBySlug(slug);
          
          if (this.subDepartment) {
            // Set meta tags
            this.titleService.setTitle(this.subDepartment.meta_title);
            this.metaService.updateTag({ name: 'description', content: this.subDepartment.meta_description });
            
            // Set canonical URL
            this.canonicalService.setCanonicalUrlFull(this.subDepartment.canonical_url);
          } else {
            console.error(`Sub-department with slug '${slug}' not found!`);
            // Redirect to 404 or home page
            this.router.navigate(['/']);
          }
        }
      });
    });
  }

  validateForm(): boolean {
    let isValid = true;
    
    // Reset errors
    this.formErrors = { name: '', mobile: '', email: '' };
    
    // Validate name
    if (!this.appointmentForm.name.trim()) {
      this.formErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Validate mobile
    if (!this.appointmentForm.mobile.trim()) {
      this.formErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(this.appointmentForm.mobile)) {
      this.formErrors.mobile = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }
    
    // Validate email (optional)
    if (this.appointmentForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.appointmentForm.email)) {
      this.formErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    return isValid;
  }

  onSubmit() {
    if (this.validateForm()) {
      console.log('Appointment form submitted:', this.appointmentForm);
      
      // Prepare data for LeadSquare
      const leadData = {
        fullName: this.appointmentForm.name,
        phoneNumber: this.appointmentForm.mobile,
        emailId: this.appointmentForm.email || '',
        department: this.subDepartment.name || 'Cardiology',
        location: 'Hyderabad',
        message: `Appointment request for ${this.subDepartment.name || 'Cardiology'} Treatment`
      };

      // Submit to LeadSquare
      this.leadSquaredService.submitAppointment(leadData).subscribe({
        next: (response) => {
          console.log('LeadSquare response:', response);
          alert('Appointment request submitted successfully! We will contact you soon.');
          
          // Reset form
          this.appointmentForm = { name: '', mobile: '', email: '' };
        },
        error: (error) => {
          console.error('LeadSquare error:', error);
          alert('There was an error submitting your request. Please try again or contact us directly.');
        }
      });
    }
  }

  isFormValid(): boolean {
    return this.appointmentForm.name.trim() !== '' && 
           this.appointmentForm.mobile.trim() !== '' && 
           /^\d{10}$/.test(this.appointmentForm.mobile) &&
           (this.appointmentForm.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.appointmentForm.email));
  }

  navigateToSecondOpinion() {
    this.router.navigate(['/get-a-second-opinion']);
  }
}
