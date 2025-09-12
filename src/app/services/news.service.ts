import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getAllNews(): Observable<{ message: string, NewsData: [] }> {
    return this.http.get<{ message: string, NewsData: [] }>(`${this.BASE_URL}/getnews`);
  }

}
