import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OurSpecialitiesService {

  private BASE_URL: string;
  private specialtiesCache$: Observable<any> | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  constructor(private http: HttpClient) { 
    // Dynamic BASE_URL
    if (window.location.hostname === 'localhost') {
      this.BASE_URL = 'http://localhost:3000';
    } else {
      this.BASE_URL = 'http://api.omni-hospitals.in:3000';
    }
  }

  getAllSpecialities(): Observable<any> {
    const now = Date.now();
    
    // Return cached data if valid
    if (this.specialtiesCache$ && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.specialtiesCache$;
    }
    
    // Fetch new data and cache it
    this.specialtiesCache$ = this.http.get<any>(`${this.BASE_URL}/getspecialty`, { 
      withCredentials: true 
    }).pipe(
      tap(() => this.cacheTimestamp = now),
      catchError(error => {
        console.error('Error fetching specialties:', error);
        return of({ message: 'Error', SpecialtyData: {} });
      }),
      shareReplay(1) // Share result with multiple subscribers
    );

    return this.specialtiesCache$;
  }

  // Clear cache manually
  clearCache(): void {
    this.specialtiesCache$ = null;
    this.cacheTimestamp = 0;
  }

}
