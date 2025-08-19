import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctordetailsService {
  // private BASE_URL = 'http://localhost:3000';

      private BASE_URL = 'https://omniservicebackend-vnyk.onrender.com';

  constructor(private http: HttpClient) { }

getDoctors() {
  return this.http.get(`${this.BASE_URL}/getdoctors`, { withCredentials: true });
}


}
