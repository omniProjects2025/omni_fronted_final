import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private BASE_URL = environment.blogApiUrl; // Using blogApiUrl as it was pointing to the same endpoint

  constructor(private http: HttpClient) { }

  signupUser(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/signup`, data);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getusers`);
  }

  getUserByEmail(emailId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getuserbyid`, {
      params: { emailId }
    });
  }
}

