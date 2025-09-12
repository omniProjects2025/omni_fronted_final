import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // private BASE_URL = 'http://localhost:3000';
  private BASE_URL = 'https://omniservicebackend.onrender.com';


  constructor(private http: HttpClient) { }
  signupUser(data: any) {
    return this.http.post(`${this.BASE_URL}/signup`, data);
  }

  getAllUsers() {
    return this.http.get(`${this.BASE_URL}/getusers`);
  }

  getUserByEmail(emailId: string) {
    return this.http.get(`${this.BASE_URL}/getuserbyid`, {
      params: { emailId }
    });
  }

}
