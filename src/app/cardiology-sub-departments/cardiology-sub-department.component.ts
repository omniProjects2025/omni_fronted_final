import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CanonicalService } from '../services/canonical.service';
import { CardiologySubDepartmentsService } from './cardiology-sub-departments.service';
import { LeadSquaredService } from '../services/leadsquared.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-cardiology-sub-department',
  templateUrl: './cardiology-sub-department.component.html',
  styleUrls: ['./cardiology-sub-department.component.css']
})
export class CardiologySubDepartmentComponent implements OnInit {
  subDepartment: any = {};
  formData = {
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
    private route: ActivatedRoute,
    private notification: NotificationService
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

  onSubmit(form: NgForm) {
    if (form.invalid) {
      // Mark all fields as touched to trigger validation display
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      this.notification.info('Please fill the required fields correctly.');
      return;
    }

    const phone = (this.formData.mobile || '').toString().trim();
    if (!/^[0-9]{10}$/.test(phone)) {
      this.notification.info('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Prepare data for LeadSquare
    const leadData = {
      fullName: this.formData.name,
      phoneNumber: this.formData.mobile,
      emailId: this.formData.email || '',
      department: this.subDepartment.name || 'Cardiology',
      location: 'Hyderabad',
      message: `Appointment request for ${this.subDepartment.name || 'Cardiology'} Treatment`
    };

    // Submit to LeadSquare
    this.leadSquaredService.submitAppointment(leadData).subscribe({
      next: (response) => {
        console.log('LeadSquare response:', response);
        this.formData = { name: '', mobile: '', email: '' };
        this.router.navigate(['/thank-you']);
      },
      error: (error) => {
        console.error('LeadSquare error:', error);
        this.notification.error('There was an error submitting your request. Please try again or contact us directly.');
      }
    });
  }

  navigateToSecondOpinion() {
    this.router.navigate(['/get-a-second-opinion']);
  }
}
