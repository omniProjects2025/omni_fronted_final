import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogDetailsService {
  private BASE_URL = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) { 
    console.log('BlogDetailsService initialized with BASE_URL:', this.BASE_URL);
    console.log('Environment production mode:', environment.production);
  }
  
  getPaginatedBlogs(page: number = 1, limit: number = 5): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getblogdetailsPagination?page=${page}&limit=${limit}`);
  }
}

