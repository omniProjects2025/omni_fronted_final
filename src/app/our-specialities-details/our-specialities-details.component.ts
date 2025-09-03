import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { data } from 'jquery';

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

    // 1) Grab the param first
    this.route.queryParams.subscribe(params => {
      this.departmentName = (params['selected_speciality'] || '').trim();
      this.getAllSpecialities();
      console.log('departmentName', this.departmentName);
      // 2) Then load JSON (avoids race)
    });
  }


  getAllSpecialities() {
    this.http.get<any>('assets/json_data_files/specialities.json')
      .subscribe({
        next: (data) => {
          this.selectedDepartment = (data.departments.filter((dept: any) => this.departmentName.toLocaleLowerCase() == dept.name.toLocaleLowerCase()))[0]
          this.subDepartmentData = this.selectedDepartment.sub_departments[0];
          this.selectedSubDept = this.subDepartmentData.name;
        },
        error: (err) => {
          console.error('Failed to load departments JSON:', err);
        }
      });
      this.onSelectSubDept(this.subDepartmentData.name);
  }

  getDepartmentName(): string {
    return this.selectedDepartment?.name || this.departmentName || '';
  }


  submitEnquiry() {
    if (!this.enquiry.fullName.trim()) { alert('Full Name is required.'); return; }
    if (!this.enquiry.phoneNumber.trim()) { alert('Phone Number is required.'); return; }

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
  // onSubDepartmentSelect(sub: any) {
  //   this.selectedSubDepartment = sub;  // ✅ show sub details only
  //   this.selected_dep = sub.id;        // ✅ highlight active sidebar
  //   this.departmentName = sub.name;
  // }
  onSelectSubDept(subdept_name: string) {
    console.log(subdept_name);
    this.selectedSubDept = subdept_name;
    this.subDepartmentData = this.selectedDepartment.sub_departments.find(
      (subdept: any) => subdept_name.toLocaleLowerCase() === subdept.name.toLocaleLowerCase()
    );

    console.log(this.subDepartmentData);
  }

}