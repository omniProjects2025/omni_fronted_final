import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DoctordetailsService } from '../doctordetails.service';

@Component({
  selector: 'app-our-doctors',
  templateUrl: './our-doctors.component.html',
  styleUrls: ['./our-doctors.component.css']
})
export class OurDoctorsComponent {
  allDoctorData: any[] = [];
  isLoading = true;
  doctors: any[] = [];
  selectedLocation = '';
  selectedSpeciality = '';
  searchTerm = '';
  specialities: string[] = [];
  locations: string[] = [];

  constructor(private router: Router, private doctorservice: DoctordetailsService) { }

  ngOnInit() {
    this.getDoctorDetails();
  }

  getDoctorDetails() {
    this.isLoading = true;
    this.doctorservice.getDoctors().subscribe({
      next: (data: any) => {
        this.allDoctorData = data.data || [];
        this.doctors = this.allDoctorData.flatMap(loc =>
          loc.doctors.map((doc: any) => ({
            ...doc,
            doctor_name: doc.name,
            doctor_location: doc.work_location.trim() || '',
            doctor_designation: doc.specialization,
            profile: doc.profile,
            qualification: doc.qualification,
            experience: doc.experience,
            id: doc.id
          }))
        );

        this.locations = [...new Set(this.doctors.map(d => d.doctor_location.trim()).filter(Boolean))];
        this.specialities = [...new Set(this.doctors.map(d => d.doctor_designation.trim()).filter(Boolean))];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onLocationChange() {
    this.selectedSpeciality = '';
    this.updateSpecialitiesByLocation();
    this.applyFilters();
  }

  updateSpecialitiesByLocation() {
    const location = this.selectedLocation.toLowerCase().trim();
    const filteredByLocation = this.allDoctorData.flatMap(loc =>
      loc.doctors
        .filter((doc: any) =>
          !location || doc.work_location?.toLowerCase().trim() === location
        )
        .map((doc: any) => doc.specialization?.trim())
        .filter(Boolean)
    );
    this.specialities = [...new Set(filteredByLocation)];
    if (!this.specialities.includes(this.selectedSpeciality)) {
      this.selectedSpeciality = '';
    }
  }

  applyFilters() {
    this.updateSpecialitiesByLocation();
    const name = this.searchTerm.toLowerCase().trim();
    const location = this.selectedLocation.toLowerCase().trim();
    const speciality = this.selectedSpeciality.toLowerCase().trim();
    const allDoctors = this.allDoctorData.flatMap(loc =>
      loc.doctors.map((doc: any) => ({
        ...doc,
        doctor_name: doc.name,
        doctor_location: doc.work_location?.trim() || '',
        doctor_designation: doc.specialization,
        profile: doc.profile,
        qualification: doc.qualification,
        experience: doc.experience,
        id: doc.id
      }))
    );

    this.doctors = allDoctors.filter(doc => {
      const matchesName = !name || doc.doctor_name?.toLowerCase().includes(name);
      const matchesLocation = !location || doc.doctor_location?.toLowerCase() === location;
      const matchesSpeciality = !speciality || doc.doctor_designation?.toLowerCase().includes(speciality);
      return matchesName && matchesLocation && matchesSpeciality;
    });
  }

  goToDoctorDetails(doctor_name: string) {
    this.router.navigate(['/doctor-details'], {
      queryParams: { selected_doctor: doctor_name }
    });
  }

  goToBookAppointment() {
    this.router.navigate(['/book-an-appointment']);
  }
}
