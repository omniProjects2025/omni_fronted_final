import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogDetailsDataService {

  
    // private BASE_URL = 'http://localhost:3000';
  
        private BASE_URL = 'https://omniservicebackend.onrender.com';
  
    constructor(private http: HttpClient) { }
  
    getPaginatedBlogs(page: number = 1, limit: number = 5):Observable<any> {
      return this.http.get(`${this.BASE_URL}/getblogdetailsPagination?page=${page}&limit=${limit}`);
    }
   
}
