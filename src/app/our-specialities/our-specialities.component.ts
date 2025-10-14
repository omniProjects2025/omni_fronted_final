import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  // locations: string[] = ['Kukatpally', 'Kothapet', 'Nampally', 'Vizag', 'Kurnool'];
  locations: string[] = ['Kukatpally','Vizag'];
  filteredSpecialties: Specialty[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  specialtiesData: LocationSpecialties = {};

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private specialitiesService: SpecialitiesService,
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService
  ) {
    window.scrollTo(0, 0);
    this.setDefaultMetaTags();
    // Canonical URL will be set after location is detected in ngOnInit
  }

  ngOnInit() {
    // Detect location from URL path (for routes like /specialities/kukatpally)
    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/').filter(segment => segment && segment !== '?');
    
    // Check if URL is /specialities/:location format
    if (urlSegments.length >= 2 && urlSegments[0] === 'specialities') {
      const possibleLocation = urlSegments[1].split('?')[0]; // Remove query params
      const properCaseLocation = this.convertToProperCase(possibleLocation);
      
      if (this.locations.includes(properCaseLocation)) {
        this.selectedLocation = properCaseLocation;
      }
    }
    
    // Also check for location parameter from route params (for backward compatibility with old routes)
    this.route.params.subscribe(params => {
      if (params['location']) {
        const locationFromParams = params['location'];
        // Convert lowercase to proper case for display
        const properCaseLocation = this.convertToProperCase(locationFromParams);
        if (this.locations.includes(properCaseLocation)) {
          this.selectedLocation = properCaseLocation;
        }
      }
    });
    
    // Fallback to query params for backward compatibility
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['location']) {
        const locationFromParams = queryParams['location'];
        // Convert lowercase to proper case for display
        const properCaseLocation = this.convertToProperCase(locationFromParams);
        if (this.locations.includes(properCaseLocation)) {
          this.selectedLocation = properCaseLocation;
          // Redirect to new URL format
          this.router.navigate(['/specialities', locationFromParams.toLowerCase()], { replaceUrl: true });
          return;
        }
      }
    });
    
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
    // Use the new URL format for canonical
    const location = this.selectedLocation ? this.selectedLocation.toLowerCase() : 'kukatpally';
    this.canonicalService.setCanonicalUrl(`/specialities/${location}`);
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
          // Just filter data without navigation (component already on correct route)
          this.applyLocationFilter(this.selectedLocation);
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

  // Called when user clicks a location tab - includes navigation
  filterByLocation(location: string) {
    this.selectedLocation = location;
    
    // Navigate to new URL format with location as route param
    this.router.navigate(['/specialities', location.toLowerCase()]);
    
    // Apply the filter
    this.applyLocationFilter(location);
  }

  // Private method to just filter data without navigation
  private applyLocationFilter(location: string) {
    // Filter specialties by location
    const specialties = this.specialtiesData[location] || [];
    this.filteredSpecialties = specialties.map(specialty => ({
      ...specialty,
      blue_icon: specialty.icon
    }));
    
    this.updateMetaTagsForLocation(location);
    this.setCanonicalUrl();
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
    // Navigate to new URL format with location as route param
    this.router.navigate(['/specialities', urlFriendlyName, this.selectedLocation.toLowerCase()]);
  }

  private convertToProperCase(location: string): string {
    const locationMap: { [key: string]: string } = {
      'kukatpally': 'Kukatpally',
      'vizag': 'Vizag',
      'kothapet': 'Kothapet',
      'nampally': 'Nampally',
      'kurnool': 'Kurnool'
    };
    
    return locationMap[location.toLowerCase()] || location;
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

  navigateToSecondOpinion() {
    // Navigate to second opinion page
    this.router.navigate(['/get-a-second-opinion']);
  }
}
