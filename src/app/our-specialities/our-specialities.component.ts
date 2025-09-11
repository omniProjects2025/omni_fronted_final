import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OurSpecialitiesService } from './our-specialities.service';
import { toUrlFriendly } from '../utils/url-helper.util';
import { Title, Meta } from '@angular/platform-browser';

interface Specialty {
  name: string;
  icon: string;
  description: string;
  meta_title: string;
  meta_description: string;
}

interface LocationSpecialties {
  [location: string]: Specialty[];
}

@Component({
  selector: 'app-our-specialities',
  templateUrl: './our-specialities.component.html',
  styleUrls: ['./our-specialities.component.css']
})
export class OurSpecialitiesComponent implements OnInit {
  selectedLocation: string = 'Kukatpally';
  locations: string[] = ['Kukatpally', 'Kothapet', 'Nampally', 'Vizag', 'Kurnool'];
  filteredSpecialties: Specialty[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  specialtiesData: LocationSpecialties = {};

  constructor(
    private router: Router, 
    private specialitiesService: OurSpecialitiesService,
    private titleService: Title,
    private metaService: Meta
  ) {
    window.scrollTo(0, 0);
    this.setDefaultMetaTags();
  }

  ngOnInit() {
    this.loadSpecialties();
  }


  private setDefaultMetaTags() {
    this.titleService.setTitle('Our Specialities - OMNI Hospitals | Best Multispecialty Hospital in Hyderabad');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Discover comprehensive medical specialties at OMNI Hospitals. From cardiology to orthopedics, we offer expert care across multiple locations in Andhra Pradesh and Telangana.' 
    });
    this.metaService.updateTag({ name: 'keywords', content: 'medical specialties, cardiology, orthopedics, neurology, nephrology, OMNI hospitals, Hyderabad, Andhra Pradesh, Telangana' });
  }

  private loadSpecialties() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.specialitiesService.getAllSpecialities().subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Simple and clear data extraction
        if (response?.SpecialtyData?.[0]) {
          this.specialtiesData = response.SpecialtyData[0];
          console.log('✅ Data loaded successfully:', Object.keys(this.specialtiesData));
          this.filterByLocation(this.selectedLocation);
        } else {
          this.errorMessage = 'No specialties data found';
          console.error('❌ Invalid API response structure');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load specialties. Please try again later.';
        console.error('❌ API Error:', error);
      }
    });
  }

  filterByLocation(location: string) {
    this.selectedLocation = location;
    
    // Simple data filtering
    const specialties = this.specialtiesData[location] || [];
    this.filteredSpecialties = specialties.map(specialty => ({
      ...specialty,
      blue_icon: specialty.icon // Use icon as blue_icon for consistency
    }));
    
    console.log(`📍 ${location}: ${this.filteredSpecialties.length} specialties loaded`);
    console.log('Specialties:', this.filteredSpecialties.map(s => s.name));
    
    this.updateMetaTagsForLocation(location);
  }

  private updateMetaTagsForLocation(location: string) {
    const specialties = this.filteredSpecialties;
    const specialtyNames = specialties.map(s => s.name).join(', ');
    
    this.titleService.setTitle(`${location} Specialities - OMNI Hospitals | Expert Medical Care`);
    
    const description = specialties.length > 0 
      ? `Expert medical specialties at OMNI Hospitals ${location}: ${specialtyNames}. Book your consultation today.`
      : `OMNI Hospitals ${location} - Expert medical care and treatment.`;
      
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: `${location}, medical specialties, ${specialtyNames}, OMNI hospitals` });
  }

  goToDetails(speciality: string) {
    const urlFriendlyName = toUrlFriendly(speciality);
    this.router.navigate(['/our-specialities-details', urlFriendlyName]);
  }

  retryLoading() {
    this.loadSpecialties();
  }

  trackBySpecialty(index: number, specialty: Specialty): string {
    return specialty.name;
  }

  onImageError(event: any) {
    event.target.src = 'assets/our_specialities/default_specialty.svg';
  }
}
