import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctordetailsService } from '../doctordetails.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent {
  doctors: any[] = []
  doctor_name = "";
  constructor(private router: Router, private doctorservice: DoctordetailsService, private activated_routes: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activated_routes.queryParams.subscribe(params => {
      this.doctor_name = params['selected_doctor']?.trim() || '';
      console.log(this.doctor_name, 'doctor_name..');

      this.getDoctorDetails(); // Only call this after doctor_name is set
    });
  }


  // activatedRoutesData() {
  //   this.activated_routes.queryParams.subscribe(params => {
  //     this.doctor_name = params['selected_doctor']?.trim() || '';
  //   });
  // }

  goToBookAppointment() {
    this.router.navigate(['/book-an-appointment']).then(success => {
      if (success) {
        console.log('Navigation to Book An Appointment successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }

getDoctorDetails(): void {
  this.doctorservice.getDoctors().subscribe(
    (response: any) => {
      const dataArray = response?.data || [];
      const allDoctors = dataArray
        .map((item: any) => item.doctors || [])
        .flat();
      if (!this.doctor_name) {
        this.doctors = [];
        return;
      }
      this.doctors = allDoctors.filter((doctor: any) =>
        doctor.name?.trim().toLowerCase() === this.doctor_name.toLowerCase()
      
    );
    console.log(this.doctors,'doctors...');
      if (this.doctors.length === 0) {
      }
    },
    (error: any) => {
      console.error('Error fetching doctor details:', error);
      this.doctors = [];
    }
  );
}

}
