import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
    console.log('NewsService initialized with BASE_URL:', this.BASE_URL);
    console.log('Environment production mode:', environment.production);
  }

  getAllNews(): Observable<{ message: string, NewsData: [] }> {
    return this.http.get<{ message: string, NewsData: [] }>(`${this.BASE_URL}/getnews`);
  }

}
