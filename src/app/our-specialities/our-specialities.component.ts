import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OurSpecialitiesService } from './our-specialities.service';
import { toUrlFriendly } from '../utils/url-helper.util';

@Component({
  selector: 'app-our-specialities',
  templateUrl: './our-specialities.component.html',
  styleUrls: ['./our-specialities.component.css']
})
export class OurSpecialitiesComponent {
  selectedLocation: string = 'Kukatpally';
  locations: string[] = ['Kukatpally', 'Kothapet', 'Nampally', 'Vizag', 'Kurnool'];
  specialties: any[] = [];
  filteredSpecialties: any[] = [];

  constructor(private router: Router, private specialitiesService: OurSpecialitiesService) {
    window.scrollTo(0, 0)
  }

  ngOnInit() {
    this.onGetspecialities()
  }
  onGetspecialities() {
    this.specialitiesService.getAllSpecialities().subscribe(
      res => {
        this.specialties = res?.SpecialtyData || [];
        this.filterByLocation(this.selectedLocation);
      },
      err => {
        console.error('Error:', err);
      }
    );
  }


  filterByLocation(location: string) {
    this.selectedLocation = location;
    this.filteredSpecialties = this.specialties.filter(s => s.location.includes(location));
    console.log(this.filteredSpecialties, 'filteredSpecialties...');

  }

  goToDetails(speciality: string) {
    const urlFriendlyName = toUrlFriendly(speciality);
    this.router.navigate(['/our-specialities-details', urlFriendlyName]);
  }
}
