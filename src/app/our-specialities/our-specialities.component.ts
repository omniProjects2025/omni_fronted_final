import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpecialitiesService } from '../services/specialities.service';
import { toUrlFriendly } from '../utils/url-helper.util';
import { Title, Meta } from '@angular/platform-browser';
import { CanonicalService } from '../services/canonical.service';

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
    private specialitiesService: SpecialitiesService,
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService
  ) {
    window.scrollTo(0, 0);
    this.setDefaultMetaTags();
    this.setCanonicalUrl();
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

  private setCanonicalUrl() {
    this.canonicalService.setCanonicalUrl('/our-specialities');
  }

  private loadSpecialties() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.specialitiesService.getAllSpecialities().subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Extract specialties data from API response
        if (response?.SpecialtyData?.[0]) {
          this.specialtiesData = response.SpecialtyData[0];
          this.filterByLocation(this.selectedLocation);
        } else {
          this.errorMessage = 'No specialties data found';
          console.error('Invalid API response structure');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load specialties. Please try again later.';
        console.error('API Error:', error);
      }
    });
  }

  filterByLocation(location: string) {
    this.selectedLocation = location;
    
    // Filter specialties by location
    const specialties = this.specialtiesData[location] || [];
    this.filteredSpecialties = specialties.map(specialty => ({
      ...specialty,
      blue_icon: specialty.icon
    }));
    
    this.updateMetaTagsForLocation(location);
  }

  private updateMetaTagsForLocation(location: string) {
    const specialties = this.filteredSpecialties;
    const specialtyNames = specialties.map(s => s.name).join(', ');
    
    // Check if any specialty has meta_title and meta_description from API
    const specialtyWithMeta = specialties.find(s => s.meta_title && s.meta_description);
    
    if (specialtyWithMeta) {
      // Use the first specialty's meta data that has both title and description
      console.log(`📄 Using API meta data for ${location}:`, {
        title: specialtyWithMeta.meta_title,
        description: specialtyWithMeta.meta_description
      });
      this.titleService.setTitle(specialtyWithMeta.meta_title);
      this.metaService.updateTag({ name: 'description', content: specialtyWithMeta.meta_description });
    } else {
      // Fallback to default meta tags
      console.log(`📄 Using default meta tags for ${location}`);
      this.titleService.setTitle(`${location} Specialities - OMNI Hospitals | Expert Medical Care`);
      
      const description = specialties.length > 0 
        ? `Expert medical specialties at OMNI Hospitals ${location}: ${specialtyNames}. Book your consultation today.`
        : `OMNI Hospitals ${location} - Expert medical care and treatment.`;
        
      this.metaService.updateTag({ name: 'description', content: description });
    }
    
    this.metaService.updateTag({ name: 'keywords', content: `${location}, medical specialties, ${specialtyNames}, OMNI hospitals` });
  }

  goToDetails(speciality: string) {
    const urlFriendlyName = toUrlFriendly(speciality);
    this.router.navigate(['/our-specialities-details', urlFriendlyName]);
  }

  onSpecialtyClick(specialty: Specialty) {
    // Update meta tags with the specific specialty's meta data
    if (specialty.meta_title && specialty.meta_description) {
      console.log(`🎯 Using specialty-specific meta data:`, {
        specialty: specialty.name,
        title: specialty.meta_title,
        description: specialty.meta_description
      });
      this.titleService.setTitle(specialty.meta_title);
      this.metaService.updateTag({ name: 'description', content: specialty.meta_description });
    } else {
      console.log(`🎯 No meta data for ${specialty.name}, using location-based meta tags`);
      // Fallback to location-based meta tags
      this.updateMetaTagsForLocation(this.selectedLocation);
    }
    
    // Navigate to specialty details
    this.goToDetails(specialty.name);
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
