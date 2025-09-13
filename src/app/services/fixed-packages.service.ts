import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FixedPackagesService {
  private dataUrl = 'assets/json_data_files/data.json';
  private BASE_URL = environment.omniApiUrl;

  constructor(private http: HttpClient) { }

  updateHealthpackages(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/updatefixedsuricalpackages`, data);
  }

  getAllHealthPackagesDetails(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getfixedsurgicalpackages`, { withCredentials: true });
  }

  getPackages(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
}

