import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { fromUrlFriendly } from '../utils/url-helper.util';

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
    private router: Router
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);

    // Get department name from route parameter
    this.route.params.subscribe(params => {
      const departmentParam = params['department'] || '';
      // Convert URL-friendly format back to original name
      this.departmentName = fromUrlFriendly(departmentParam);
      this.getAllSpecialities();
      console.log('departmentName', this.departmentName);
    });
  }


  getAllSpecialities() {
    this.http.get<any>('assets/json_data_files/specialities.json')
      .subscribe({
        next: (data) => {
          this.selectedDepartment = (data.departments.filter((dept: any) => this.departmentName.toLocaleLowerCase() == dept.name.toLocaleLowerCase()))[0]
          if (this.selectedDepartment && this.selectedDepartment.sub_departments && this.selectedDepartment.sub_departments.length > 0) {
            this.subDepartmentData = this.selectedDepartment.sub_departments[0];
            this.selectedSubDept = this.subDepartmentData.name;
            this.onSelectSubDept(this.subDepartmentData.name);
          }
        },
        error: (err) => {
          console.error('Failed to load departments JSON:', err);
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

    const accessKey = 'u$r56afea08b32d556818ad1a5f69f0e7f0';
    const secretKey = '8d7f86d677dadaba209b4dead3cfcc4ab019031b';
    const api_url_base = 'https://api-in21.leadsquared.com/v2/';
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

}