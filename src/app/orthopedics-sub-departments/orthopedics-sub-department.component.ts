import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CanonicalService } from '../services/canonical.service';
import { OrthopedicsSubDepartmentsService } from './orthopedics-sub-departments.service';
import { LeadSquaredService } from '../services/leadsquared.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-orthopedics-sub-department',
  templateUrl: './orthopedics-sub-department.component.html',
  styleUrls: ['./orthopedics-sub-department.component.css']
})
export class OrthopedicsSubDepartmentComponent implements OnInit {
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
    private orthopedicsService: OrthopedicsSubDepartmentsService,
    private leadSquaredService: LeadSquaredService,
    private router: Router,
    private route: ActivatedRoute
    ,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    
    // Initialize data first - exactly like cardiology
    this.orthopedicsService.initializeData().subscribe((data) => {
      console.log('Orthopedics data initialized:', data);
      
      // Get the slug from the route
      // For lazy-loaded routes, the slug param is on the parent route (common-pages.module)
      // Check parent route first for lazy-loaded modules
      let slug: string | null = null;
      
      // First check parent route params (for lazy-loaded routes) - this is where the slug comes from
      if (this.route.parent?.snapshot?.params?.['slug']) {
        slug = this.route.parent.snapshot.params['slug'];
        console.log('Slug from parent route.snapshot:', slug);
      } 
      // Then check current route params (for non-lazy routes)
      else if (this.route.snapshot.params['slug']) {
        slug = this.route.snapshot.params['slug'];
        console.log('Slug from route.snapshot:', slug);
      }
      
      // Also try to get from URL path segments as fallback
      if (!slug) {
        const urlSegments = this.router.url.split('/').filter(segment => segment && segment !== '?');
        // Pattern: specialities/orthopedics/{slug}
        if (urlSegments.length >= 3 && urlSegments[0] === 'specialities' && urlSegments[1] === 'orthopedics') {
          slug = urlSegments[2].split('?')[0]; // Remove query params
          console.log('Slug extracted from URL segments:', slug);
        }
      }
      
      // If found, load the data immediately
      if (slug) {
        this.loadSubDepartmentData(slug);
      } else {
        console.error('Could not extract slug from route. Current URL:', this.router.url);
      }
      
      // Also subscribe to params changes for navigation within the same component
      this.route.params.subscribe(params => {
        const routeSlug = params['slug'];
        console.log('Slug from route.params subscription:', routeSlug);
        if (routeSlug && routeSlug !== slug) {
          this.loadSubDepartmentData(routeSlug);
        }
      });
      
      // Subscribe to parent params changes (important for lazy-loaded routes)
      if (this.route.parent) {
        this.route.parent.params.subscribe(parentParams => {
          const parentSlug = parentParams['slug'];
          console.log('Slug from parent route.params subscription:', parentSlug);
          if (parentSlug && parentSlug !== slug) {
            this.loadSubDepartmentData(parentSlug);
          }
        });
      }
    });
  }

  private loadSubDepartmentData(slug: string) {
    console.log('Loading sub-department data for slug:', slug);
    
    // Get sub-department data by slug - exactly like cardiology
    this.subDepartment = this.orthopedicsService.getSubDepartmentBySlug(slug);
    console.log('Sub-department found:', this.subDepartment);
    
    if (this.subDepartment) {
      // Set meta tags
      this.titleService.setTitle(this.subDepartment.meta_title);
      this.metaService.updateTag({ name: 'description', content: this.subDepartment.meta_description });
      
      // Set canonical URL
      this.canonicalService.setCanonicalUrlFull(this.subDepartment.canonical_url);
      console.log('Sub-department loaded successfully:', this.subDepartment.name);
    } else {
      console.error(`Sub-department with slug '${slug}' not found!`);
      // Get all sub-departments to see what's available
      this.orthopedicsService.getAllSubDepartments().subscribe(allDepts => {
        console.log('Available slugs:', allDepts.map((d: any) => d.slug));
      });
      // Don't redirect immediately - let's debug first
      // this.router.navigate(['/']);
    }
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

    // Extra phone validation: ensure 10 digits numeric
    const phone = (this.formData.mobile || '').toString().trim();
    if (!/^[0-9]{10}$/.test(phone)) {
      this.notification.info('Please enter a valid 10 digit mobile number.');
      return;
    }

    console.log('Appointment form submitted:', this.formData);
    
    // Prepare data for LeadSquare
    const leadData = {
      fullName: this.formData.name,
      phoneNumber: this.formData.mobile,
      emailId: this.formData.email || '',
      department: this.subDepartment.name || 'Orthopedics',
      location: 'Hyderabad',
      message: `Appointment request for ${this.subDepartment.name || 'Orthopedics'} Treatment`
    };

    // Submit to LeadSquare
    this.leadSquaredService.submitAppointment(leadData).subscribe({
      next: (response) => {
        console.log('LeadSquare response:', response);
        // Navigate to thank-you (no blocking alert)
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

  formatListItem(item: string): string {
    if (!item) return '';
    // Check if item contains a colon
    const colonIndex = item.indexOf(':');
    if (colonIndex > 0) {
      // Split at the colon
      const beforeColon = item.substring(0, colonIndex);
      const afterColon = item.substring(colonIndex);
      // Return with bold formatting for before colon
      return `<strong>${beforeColon}</strong>${afterColon}`;
    }
    return item;
  }

  formatDescription(description: string): string {
    if (!description) return '';
    // Replace newlines with <br> tags for HTML rendering
    return description.replace(/\n/g, '<br>');
  }
}

