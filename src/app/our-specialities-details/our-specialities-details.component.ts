import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { fromUrlFriendly } from '../utils/url-helper.util';
import { environment } from '../../environments/environment';
import { combineLatest } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { CanonicalService } from '../services/canonical.service';

@Component({
  selector: 'app-our-specialities-details',
  templateUrl: './our-specialities-details.component.html',
  styleUrls: ['./our-specialities-details.component.css']
})
export class OurSpecialitiesDetailsComponent implements OnInit {
  // selectedSubDepartment: any = {};
  selectedDepartment: any = {};
  subDepartmentData: any = {};
  selectedSubDept: string | null = null;
  departmentName = '';
  selectedLocation: string = 'kukatpally'; // Default location

  enquiry = { fullName: '', phoneNumber: '', emailId: '' };

  locations = [
    { id: 'kukkatpally', name: 'Kukkatpally' },
    { id: 'Nampally', name: 'UDAI OMNI - Nampally' },
    { id: 'kothapet', name: 'Kothapet' },
    { id: 'vizag', name: 'Vizag' },
    { id: 'Giggles-vizag', name: 'Giggles Vizag' },
    { id: 'kurnool', name: 'Kurnool' }
  ];


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);

    // Use combineLatest to wait for both params and queryParams
    combineLatest([
      this.route.params,
      this.route.queryParams
    ]).subscribe(([params, queryParams]) => {
      const departmentParam = params['department'] || '';
      // Convert URL-friendly format back to original name
      this.departmentName = fromUrlFriendly(departmentParam);
      
      // Get location from query parameters
      this.selectedLocation = queryParams['location'] || 'kukatpally';
      
      console.log('departmentName', this.departmentName);
      console.log('selectedLocation', this.selectedLocation);
      
      // Call getAllSpecialities only after both departmentName and selectedLocation are set
      this.getAllSpecialities();
    });
  }


  getAllSpecialities() {
    console.log('=== getAllSpecialities called ===');
    console.log('selectedLocation:', this.selectedLocation);
    console.log('departmentName:', this.departmentName);
    
    // Determine JSON file path based on selected location
    let jsonFilePath = 'assets/json_data_files/specialities.json'; // Default for kukatpally
    
    if (this.selectedLocation && this.selectedLocation.toLowerCase() !== 'kukatpally') {
      // Map location names to their respective JSON files
      const locationJsonMap: { [key: string]: string } = {
        'vizag': 'assets/json_data_files/specialities_vizag.json',
        'kothapet': 'assets/json_data_files/specialities_kothapet.json',
        'nampally': 'assets/json_data_files/specialities_nampally.json',
        'kurnool': 'assets/json_data_files/specialities_kurnool.json'
      };
      
      const locationKey = this.selectedLocation.toLowerCase();
      jsonFilePath = locationJsonMap[locationKey] || jsonFilePath;
      
      console.log('Location key:', locationKey);
      console.log('Mapped JSON file:', locationJsonMap[locationKey]);
    }
    
    console.log('Final JSON file path:', jsonFilePath);
    
    this.http.get<any>(jsonFilePath)
      .subscribe({
        next: (data) => {
          this.selectedDepartment = (data.departments.filter((dept: any) => this.departmentName.toLocaleLowerCase() == dept.name.toLocaleLowerCase()))[0]
          if (this.selectedDepartment && this.selectedDepartment.sub_departments && this.selectedDepartment.sub_departments.length > 0) {
            this.subDepartmentData = this.selectedDepartment.sub_departments[0];
            this.selectedSubDept = this.subDepartmentData.name;
            this.onSelectSubDept(this.subDepartmentData.name);
          }
          
          // Set meta tags from the department data
          this.setMetaTags();
        },
        error: (err) => {
          console.error('Failed to load departments JSON:', err);
          // Fallback to default JSON if location-specific JSON fails
          if (jsonFilePath !== 'assets/json_data_files/specialities.json') {
            console.log('Falling back to default JSON file');
            this.http.get<any>('assets/json_data_files/specialities.json')
              .subscribe({
                next: (data) => {
                  this.selectedDepartment = (data.departments.filter((dept: any) => this.departmentName.toLocaleLowerCase() == dept.name.toLocaleLowerCase()))[0]
                  if (this.selectedDepartment && this.selectedDepartment.sub_departments && this.selectedDepartment.sub_departments.length > 0) {
                    this.subDepartmentData = this.selectedDepartment.sub_departments[0];
                    this.selectedSubDept = this.subDepartmentData.name;
                    this.onSelectSubDept(this.subDepartmentData.name);
                  }
                  
                  // Set meta tags from the fallback department data
                  this.setMetaTags();
                },
                error: (fallbackErr) => {
                  console.error('Failed to load fallback departments JSON:', fallbackErr);
                }
              });
          }
        }
      });
  }

  getDepartmentName(): string {
    return this.selectedDepartment?.name || this.departmentName || '';
  }


  submitEnquiry() {
    // Enhanced validation
    if (!this.enquiry.fullName.trim()) { 
      alert('Full Name is required.'); 
      return; 
    }
    
    if (this.enquiry.fullName.trim().length < 3) {
      alert('Full Name must be at least 3 characters long.');
      return;
    }
    
    if (!this.enquiry.phoneNumber.trim()) { 
      alert('Phone Number is required.'); 
      return; 
    }
    
    // Phone number validation (Indian format)
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(this.enquiry.phoneNumber.trim())) {
      alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    
    // Email validation (optional but if provided, should be valid)
    if (this.enquiry.emailId.trim() && !this.isValidEmail(this.enquiry.emailId.trim())) {
      alert('Please enter a valid email address.');
      return;
    }

    const lastSubmission = localStorage.getItem('lastEnquiry');
    if (lastSubmission) {
      const { name, phone, time } = JSON.parse(lastSubmission);
      if (name === this.enquiry.fullName.trim() &&
        phone === this.enquiry.phoneNumber.trim() &&
        Date.now() - time < 30 * 60 * 1000) {
        alert('You already submitted this enquiry within the last 30 minutes.');
        return;
      }
    }

    const payload = [
      { Attribute: 'FirstName', Value: this.enquiry.fullName },
      { Attribute: 'Phone', Value: this.enquiry.phoneNumber },
      { Attribute: 'EmailAddress', Value: this.enquiry.emailId },
      { Attribute: 'mx_Department', Value: this.getDepartmentName() },
      { Attribute: 'Source', Value: 'Website - Enquiry Form From Speciality' }
    ];

    const accessKey = environment.leadsquared.accessKey;
    const secretKey = environment.leadsquared.secretKey;
    const api_url_base = environment.leadsquared.baseUrl;
    const url = `${api_url_base}LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

    this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: () => {
          alert('Your enquiry has been submitted successfully!');
          localStorage.setItem('lastEnquiry', JSON.stringify({
            name: this.enquiry.fullName.trim(),
            phone: this.enquiry.phoneNumber.trim(),
            time: Date.now()
          }));
          this.enquiry = { fullName: '', phoneNumber: '', emailId: '' };
          this.router.navigate(['/thank-you']);
        },
        error: (err) => {
          console.error('LeadSquared Error:', err);
          alert('There was a problem submitting your enquiry.');
        }
      });
  }
  onSelectSubDept(subdept_name: string) {
    console.log(subdept_name);
    this.selectedSubDept = subdept_name;
    this.subDepartmentData = this.selectedDepartment.sub_departments.find(
      (subdept: any) => subdept_name.toLocaleLowerCase() === subdept.name.toLocaleLowerCase()
    );

    console.log(this.subDepartmentData);
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Method to test location-based JSON loading (for debugging)
  testLocationJsonLoading(location: string) {
    console.log('=== Testing location JSON loading ===');
    this.selectedLocation = location;
    this.getAllSpecialities();
  }

  private setMetaTags() {
    if (!this.selectedDepartment) {
      console.log('No department selected, using default meta tags');
      this.setDefaultMetaTags();
      return;
    }

    const department = this.selectedDepartment;
    const locationName = this.getLocationDisplayName(this.selectedLocation);
    
    // Check if department has meta_title and meta_description
    if (department.meta_title && department.meta_description) {
      console.log(`📄 Setting meta tags from JSON for ${department.name} in ${locationName}:`, {
        title: department.meta_title,
        description: department.meta_description
      });
      
      this.titleService.setTitle(department.meta_title);
      this.metaService.updateTag({ 
        name: 'description', 
        content: department.meta_description 
      });
    } else {
      console.log(`📄 No meta data in JSON for ${department.name}, using default meta tags`);
      this.setDefaultMetaTags();
    }
    
    // Set canonical URL
    const canonicalPath = `/our-specialities-details/${this.departmentName.toLowerCase().replace(/\s+/g, '-')}`;
    this.canonicalService.setCanonicalUrl(canonicalPath);
    
    // Set keywords
    const keywords = `${department.name}, ${locationName}, OMNI hospitals, medical specialty, health care`;
    this.metaService.updateTag({ name: 'keywords', content: keywords });
  }

  private setDefaultMetaTags() {
    const locationName = this.getLocationDisplayName(this.selectedLocation);
    const departmentName = this.selectedDepartment?.name || this.departmentName || 'Medical Specialty';
    
    const title = `${departmentName} - ${locationName} | OMNI Hospitals`;
    const description = `Expert ${departmentName} care at OMNI Hospitals ${locationName}. Get specialized medical treatment from experienced doctors.`;
    
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
  }

  private getLocationDisplayName(location: string): string {
    const locationMap: { [key: string]: string } = {
      'kukatpally': 'Kukatpally',
      'vizag': 'Vizag',
      'kothapet': 'Kothapet',
      'nampally': 'Nampally',
      'kurnool': 'Kurnool'
    };
    
    return locationMap[location.toLowerCase()] || location;
  }

  // Method to navigate back to specialities page with location preserved
  // navigateBackToSpecialities() {
  //   this.router.navigate(['/our-specialities'], {
  //     queryParams: { location: this.selectedLocation }
  //   });
  // }

}