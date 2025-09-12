import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OurSpecialitiesService {

  //  private BASE_URL = 'http://localhost:3000'; 
  //  private BASE_URL = 'https://omniservicebackend.onrender.com'; 

  // private BASE_URL = 'https://omniservicebackend-vnyk.onrender.com';\
  private BASE_URL = 'http://api.omni-hospitals.in:3000';


  private specialtiesCache$: Observable<any> | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  constructor(private http: HttpClient) { }



  // getAllSpecialities() {
  //   return this.http.get(`${this.BASE_URL}/getspecialty`);
  // }

  getAllSpecialities(): Observable<any> {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (this.specialtiesCache$ && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.specialtiesCache$;
    }
    
    // Create new request and cache it
    this.specialtiesCache$ = this.http.get<any>(`${this.BASE_URL}/getspecialty`, { 
      withCredentials: true 
    }).pipe(
      tap(() => {
        this.cacheTimestamp = now;
      }),
      catchError(error => {
        console.error('Error fetching specialties:', error);
        // Return empty data structure on error
        return of({ message: 'Error', SpecialtyData: {} });
      }),
      shareReplay(1) // Share the result among multiple subscribers
    );
    
    return this.specialtiesCache$;
  }

  // Method to clear cache if needed
  clearCache(): void {
    this.specialtiesCache$ = null;
    this.cacheTimestamp = 0;
  }

}
