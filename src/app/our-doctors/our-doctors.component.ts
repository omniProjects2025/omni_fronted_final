import { Component, AfterViewInit, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DoctordetailsService } from '../doctordetails.service';
import { finalize, take } from 'rxjs/operators';

@Component({
  selector: 'app-our-doctors',
  templateUrl: './our-doctors.component.html',
  styleUrls: ['./our-doctors.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OurDoctorsComponent implements AfterViewInit, OnDestroy {
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

  @ViewChild('loadMoreSentinel', { static: false }) loadMoreSentinel!: ElementRef;

  constructor(
    private router: Router,
    private doctorservice: DoctordetailsService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getDoctorDetails();
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
    this.isLoading = true;
    this.doctorservice.getDoctors()
      .pipe(
        take(1),
        finalize(() => { this.isLoading = false; })
      )
      .subscribe({
        next: (data: any) => {
          this.allDoctorData = (data && data.data) ? data.data : [];
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
          this.locations = [...new Set(this.allDoctorsFlat.map(d => d.doctor_location).filter(Boolean))];
          this.specialities = [...new Set(this.allDoctorsFlat.map(d => d.doctor_designation).filter(Boolean))];
          this.cdr.markForCheck();
          this.ensureFilledView();
          // Ensure observer attached after data renders
          setTimeout(() => this.observeSentinel(), 0);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  onLocationChange() {
    this.selectedSpeciality = '';
    this.updateSpecialitiesByLocation();
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
    this.filterDebounce = setTimeout(() => this.runFilters(), 150);
  }

  private runFilters() {
    this.updateSpecialitiesByLocation();
    const nameLc = this.searchTerm.toLowerCase().trim();
    const locationLc = this.selectedLocation.toLowerCase().trim();
    const specialityLc = this.selectedSpeciality.toLowerCase().trim();

    const filtered = this.allDoctorsFlat.filter(d => {
      const matchesName = !nameLc || d._name_lc.includes(nameLc);
      const matchesLocation = !locationLc || d._loc_lc === locationLc;
      const matchesSpeciality = !specialityLc || d._spec_lc.includes(specialityLc);
      return matchesName && matchesLocation && matchesSpeciality;
    });
    this.doctors = this.sortByLocation(filtered);
    this.visibleDoctors = this.doctors.slice(0, this.pageSize);
    this.cdr.markForCheck();
    this.ensureFilledView();
    setTimeout(() => this.observeSentinel(), 0);
  }

  goToDoctorDetails(doctor_name: string) {
    this.router.navigate(['/doctor-details'], {
      queryParams: { selected_doctor: doctor_name }
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
