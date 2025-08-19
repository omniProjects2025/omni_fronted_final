import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OurSpecialitiesService {

  //  private BASE_URL = 'http://localhost:3000'; 
  //  private BASE_URL = 'https://omniservicebackend.onrender.com'; 

  private BASE_URL = 'https://omniservicebackend-vnyk.onrender.com';

  constructor(private http: HttpClient) { }



  // getAllSpecialities() {
  //   return this.http.get(`${this.BASE_URL}/getspecialty`);
  // }

  getAllSpecialities(): Observable<{ message: string, SpecialtyData: [] }> {
    return this.http.get<{ message: string, SpecialtyData: [] }>(`${this.BASE_URL}/getspecialty`, { withCredentials: true });
  }

}
