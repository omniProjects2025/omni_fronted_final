import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HealthPackageService {

  private dataUrl = 'assets/json_data_files/data.json';
  // private BASE_URL = 'http://localhost:3000';

  // private BASE_URL = 'https://omniservicebackend.onrender.com';
    private BASE_URL = 'https://omniservicebackend-vnyk.onrender.com';

  constructor(private http: HttpClient) { }
  updateHealthpackages(data: any) {
    return this.http.post(`${this.BASE_URL}/updatehealthpackages`, data);
  }

  getAllHealthPackagesDetails() {
    return this.http.get(`${this.BASE_URL}/gethealthpackages`, { withCredentials: true });
  }


  getPackages(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
}
