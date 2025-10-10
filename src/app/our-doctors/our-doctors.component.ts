import { Component, AfterViewInit, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorDetailsService } from '../services/doctor-details.service';
import { finalize, take, catchError, retry, shareReplay } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-our-doctors',
  templateUrl: './our-doctors.component.html',
  styleUrls: ['./our-doctors.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OurDoctorsComponent implements OnInit, AfterViewInit, OnDestroy {
  allDoctorData: any[] = [];
  isLoading = true;
  doctors: any[] = [];
  allDoctorsFlat: any[] = [];
  visibleDoctors: any[] = [];
  selectedLocation = '';
  selectedSpeciality = '';
  searchTerm = '';
  specialities: string[] = [];
  locations: string[] = [];
  private filterDebounce: any;
  pageSize = 20;
  private io?: IntersectionObserver;
  isAppending = false;
  
  // Performance optimizations
  private cachedData: any[] = [];
  private filteredDataSubject = new BehaviorSubject<any[]>([]);
  private hasInitialLoad = false;
  
  // Flag to prevent circular updates when restoring from URL
  private isRestoringFromUrl = false;

  @ViewChild('loadMoreSentinel', { static: false }) loadMoreSentinel!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private doctorservice: DoctorDetailsService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log('OurDoctorsComponent ngOnInit() called');
    
    // Check for filter parameters from query params to restore filter state
    this.route.queryParams.subscribe(params => {
      this.isRestoringFromUrl = true;
      
      // Reset filters if no params present
      if (!params['location']) {
        this.selectedLocation = '';
      } else {
        this.selectedLocation = params['location'];
      }
      
      if (!params['speciality']) {
        this.selectedSpeciality = '';
      } else {
        this.selectedSpeciality = params['speciality'];
      }
      
      if (!params['search']) {
        this.searchTerm = '';
      } else {
        this.searchTerm = params['search'];
      }
      
      // Apply filters after restoring from URL
      if (this.allDoctorsFlat.length > 0) {
        this.runFilters();
      }
      
      // Mark for check to ensure UI updates with new filter values
      this.cdr.markForCheck();
      
      this.isRestoringFromUrl = false;
    });
    
    // FOR TESTING: Clear cache to force API call
    // Uncomment the line below to force API calls every time
    // this.clearAllCaches();
    
    // Check if we have cached data first
    const cachedData = this.getCachedData();
    if (cachedData && cachedData.length > 0) {
      console.log('Using cached data from localStorage:', cachedData.length, 'doctors');
      this.processCachedData(cachedData);
      this.isLoading = false;
      this.cdr.markForCheck();
    } else {
      console.log('No cached data found, making API call');
      this.getDoctorDetails();
    }
  }

  ngAfterViewInit(): void {
    // Set up intersection observer to append more as user scrolls
    this.ngZone.runOutsideAngular(() => {
      this.io = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && !this.isAppending) {
          this.isAppending = true;
          this.ngZone.run(() => {
            this.loadMore();
            this.isAppending = false;
          });
        }
      }, { root: null, rootMargin: '200px 0px', threshold: 0 });
    });

    // Delay attaching until view child exists
    setTimeout(() => this.observeSentinel(), 0);
  }

  getDoctorDetails() {
    console.log('getDoctorDetails() called - making API request');
    this.isLoading = true;
    
    this.doctorservice.getDoctors()
      .pipe(
        take(1),
        catchError((error) => {
          console.error('Error loading doctors:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
          return of({ data: [], error: true });
        }),
        finalize(() => { 
          console.log('API call finalized - isLoading set to false');
          this.isLoading = false; 
          this.hasInitialLoad = true;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log('API response received:', data);
          if (data && data.data && !data.error) {
            console.log('Processing doctor data:', data.data.length, 'doctors');
            this.processDoctorData(data.data);
            this.cacheData(this.allDoctorsFlat);
            this.cdr.markForCheck();
          } else {
            console.log('No data received from API');
          }
        }
      });
  }

  // Method to manually retry loading
  retryLoading() {
    console.log('Manual retry triggered');
    this.isLoading = true;
    this.cdr.markForCheck();
    this.getDoctorDetails();
  }

  private processDoctorData(rawData: any[]) {
    this.allDoctorData = rawData;
    
    // Optimize data processing with single pass
    this.allDoctorsFlat = this.allDoctorData.flatMap(loc =>
      (loc.doctors || []).map((doc: any) => {
        const doctor_location = (doc.work_location || '').trim();
        const doctor_designation = (doc.specialization || '').trim();
        const doctor_name = doc.name || '';
        return {
          ...doc,
          doctor_name,
          doctor_location,
          doctor_designation,
          profile: doc.profile,
          qualification: doc.qualification,
          experience: doc.experience,
          id: doc.id,
          // normalized for faster filters
          _name_lc: doctor_name.toLowerCase(),
          _loc_lc: doctor_location.toLowerCase(),
          _spec_lc: doctor_designation.toLowerCase()
        };
      })
    );

    this.doctors = this.sortByLocation(this.allDoctorsFlat);
    this.visibleDoctors = this.doctors.slice(0, this.pageSize);
    
    // Extract unique values more efficiently
    this.locations = [...new Set(this.allDoctorsFlat.map(d => d.doctor_location).filter(Boolean))];
    this.specialities = [...new Set(this.allDoctorsFlat.map(d => d.doctor_designation).filter(Boolean))];
    
    this.cdr.markForCheck();
    this.ensureFilledView();
    
    // Apply filters if there are URL parameters
    if (this.selectedLocation || this.selectedSpeciality || this.searchTerm) {
      this.runFilters();
    }
    
    // Ensure observer attached after data renders
    setTimeout(() => this.observeSentinel(), 0);
  }

  private processCachedData(cachedData: any[]) {
    this.allDoctorsFlat = cachedData;
    this.doctors = this.sortByLocation(this.allDoctorsFlat);
    this.visibleDoctors = this.doctors.slice(0, this.pageSize);
    
    this.locations = [...new Set(this.allDoctorsFlat.map(d => d.doctor_location).filter(Boolean))];
    this.specialities = [...new Set(this.allDoctorsFlat.map(d => d.doctor_designation).filter(Boolean))];
    
    this.ensureFilledView();
    setTimeout(() => this.observeSentinel(), 0);
    this.cdr.markForCheck();
    
    // Apply filters if there are URL parameters
    if (this.selectedLocation || this.selectedSpeciality || this.searchTerm) {
      this.runFilters();
    }
  }

  private cacheData(data: any[]) {
    try {
      localStorage.setItem('doctors_cache', JSON.stringify({
        data: data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  private getCachedData(): any[] {
    try {
      const cached = localStorage.getItem('doctors_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Cache valid for 1 hour (3600000ms)
        // For development, you can reduce this to 300000ms (5 minutes)
        const cacheDuration = 3600000; // 1 hour
        if (Date.now() - parsed.timestamp < cacheDuration) {
          console.log('Using cached data from localStorage');
          return parsed.data;
        } else {
          console.log('Cache expired, will make API call');
          // Clean up expired cache
          localStorage.removeItem('doctors_cache');
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      // Clean up corrupted cache
      localStorage.removeItem('doctors_cache');
    }
    return [];
  }

  // Method to clear all caches for testing
  private clearAllCaches(): void {
    console.log('Clearing all caches to force API call');
    try {
      localStorage.removeItem('doctors_cache');
      this.doctorservice.clearCache();
    } catch (error) {
      console.warn('Failed to clear caches:', error);
    }
  }

  onLocationChange() {
    this.selectedSpeciality = '';
    this.updateSpecialitiesByLocation();
    // Only update URL if not restoring from URL parameters
    if (!this.isRestoringFromUrl) {
      this.updateUrlWithFilters();
    }
    this.applyFilters();
  }

  updateSpecialitiesByLocation() {
    const locationLc = this.selectedLocation.toLowerCase().trim();
    const filteredByLocation = this.allDoctorsFlat
      .filter(d => !locationLc || d._loc_lc === locationLc)
      .map(d => d.doctor_designation)
      .filter(Boolean);
    this.specialities = [...new Set(filteredByLocation)];
    if (!this.specialities.includes(this.selectedSpeciality)) {
      this.selectedSpeciality = '';
    }
  }

  applyFilters() {
    clearTimeout(this.filterDebounce);
    this.filterDebounce = setTimeout(() => {
      this.runFilters();
      // Only update URL if not restoring from URL parameters
      if (!this.isRestoringFromUrl) {
        this.updateUrlWithFilters();
      }
    }, 100); // Reduced debounce time
  }

  private updateUrlWithFilters() {
    const queryParams: any = {};
    
    if (this.selectedLocation) {
      queryParams.location = this.selectedLocation;
    }
    if (this.selectedSpeciality) {
      queryParams.speciality = this.selectedSpeciality;
    }
    if (this.searchTerm) {
      queryParams.search = this.searchTerm;
    }
    
    // Use replaceUrl to avoid creating multiple history entries for each filter change
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true
    });
  }

  private runFilters() {
    this.updateSpecialitiesByLocation();
    
    const nameLc = this.searchTerm.toLowerCase().trim();
    const locationLc = this.selectedLocation.toLowerCase().trim();
    const specialityLc = this.selectedSpeciality.toLowerCase().trim();

    // Early return if no filters applied
    if (!nameLc && !locationLc && !specialityLc) {
      this.doctors = this.sortByLocation(this.allDoctorsFlat);
      this.visibleDoctors = this.doctors.slice(0, this.pageSize);
      this.cdr.markForCheck();
      this.ensureFilledView();
      setTimeout(() => this.observeSentinel(), 0);
      return;
    }

    // Optimized filtering with early exits
    const filtered = this.allDoctorsFlat.filter(d => {
      if (nameLc && !d._name_lc.includes(nameLc)) return false;
      if (locationLc && d._loc_lc !== locationLc) return false;
      if (specialityLc && !d._spec_lc.includes(specialityLc)) return false;
      return true;
    });
    
    this.doctors = this.sortByLocation(filtered);
    this.visibleDoctors = this.doctors.slice(0, this.pageSize);
    this.cdr.markForCheck();
    this.ensureFilledView();
    setTimeout(() => this.observeSentinel(), 0);
  }

  goToDoctorDetails(doctor_name: string) {
    // Convert doctor name to URL-friendly format
    const urlFriendlyName = doctor_name
      .toLowerCase()
      .replace(/^dr\.?\s*/i, 'dr-')  // Handle Dr prefix properly
      .replace(/&/g, 'and')  // Replace & with 'and'
      .replace(/\s+/g, '-')   // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
      .replace(/-+/g, '-')    // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    // Preserve current filter state in query parameters
    const queryParams: any = {};
    if (this.selectedLocation) {
      queryParams.location = this.selectedLocation;
    }
    if (this.selectedSpeciality) {
      queryParams.speciality = this.selectedSpeciality;
    }
    if (this.searchTerm) {
      queryParams.search = this.searchTerm;
    }
    
    this.router.navigate(['/doctor-details', urlFriendlyName], {
      queryParams: queryParams
    });
  }

  goToBookAppointment() {
    this.router.navigate(['/book-an-appointment']);
  }

  trackByDoctorId(index: number, item: any) {
    return item.id || item.doctor_name || index;
  }

  loadMore(): void {
    if (!this.doctors || this.visibleDoctors.length >= this.doctors.length) return;
    const next = this.doctors.slice(this.visibleDoctors.length, this.visibleDoctors.length + this.pageSize);
    this.visibleDoctors = [...this.visibleDoctors, ...next];
    this.cdr.markForCheck();
  }

  private sortByLocation(list: any[]): any[] {
    if (!list || list.length === 0) return [];
    // Grouped by location (branch-wise), each branch contiguous; within branch sort by name
    return [...list].sort((a, b) => {
      const la = (a.doctor_location || '').toLowerCase();
      const lb = (b.doctor_location || '').toLowerCase();
      if (la !== lb) return la.localeCompare(lb);
      const na = (a.doctor_name || '').toLowerCase();
      const nb = (b.doctor_name || '').toLowerCase();
      return na.localeCompare(nb);
    });
  }

  private ensureFilledView(): void {
    // Preload a couple of pages so multiple branches appear above the fold
    let iterations = 0;
    while (this.visibleDoctors.length < Math.min(this.pageSize * 2, this.doctors.length) && iterations < 5) {
      this.loadMore();
      iterations++;
    }
  }

  private observeSentinel(): void {
    if (!this.io || !this.loadMoreSentinel) return;
    try {
      this.io.observe(this.loadMoreSentinel.nativeElement);
    } catch {}
  }

  ngOnDestroy(): void {
    try { this.io?.disconnect(); } catch {}
  }

  // Fallback lazy loading for environments where IO might not trigger reliably
  @HostListener('window:scroll')
  onWindowScroll() {
    this.checkScrollAndLoad();
  }

  private checkScrollAndLoad(): void {
    if (this.isAppending) return;
    const scrollPos = window.scrollY + window.innerHeight;
    const threshold = document.documentElement.scrollHeight - 300;
    if (scrollPos >= threshold) {
      this.isAppending = true;
      this.loadMore();
      this.isAppending = false;
    }
  }
}
