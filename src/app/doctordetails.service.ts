import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, shareReplay, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DoctordetailsService {
  // private BASE_URL = 'http://localhost:3000';
  // private BASE_URL = 'https://omniservicebackend-vnyk.onrender.com';
  private BASE_URL = 'http://api.omni-hospitals.in:3000';
  private cache: Observable<any> | null = null;
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for better data freshness
  private lastFetchTime = 0;

  constructor(private http: HttpClient) { }

  getDoctors(): Observable<any> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.cache && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      return this.cache;
    }

    // Create new request with optimizations
    this.cache = this.http.get(`${this.BASE_URL}/getdoctors`, { 
      withCredentials: true 
    }).pipe(
      timeout(10000), // Back to 10 second timeout
      retry(2), // Back to 2 retries
      shareReplay(1), // Share the result among multiple subscribers
      catchError(this.handleError.bind(this))
    );

    this.lastFetchTime = now;
    return this.cache;
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('Doctor service error:', error);
    
    // Return cached data if available, otherwise return empty result
    if (this.cache) {
      return this.cache;
    }
    
    return of({ data: [] });
  }

  // Method to clear cache when needed
  clearCache(): void {
    this.cache = null;
    this.lastFetchTime = 0;
  }
}
