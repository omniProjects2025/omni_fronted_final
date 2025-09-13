import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LeadSquaredAttribute {
  Attribute: string;
  Value: string;
}

export interface LeadSquaredPayload extends Array<LeadSquaredAttribute> {}

@Injectable({
  providedIn: 'root'
})
export class LeadSquaredService {
  private readonly config = environment.leadsquared;

  constructor(private http: HttpClient) { }

  // Direct LeadSquared API calls (matching existing working pages)
  submitLead(payload: LeadSquaredPayload): Observable<any> {
    const url = `${this.config.baseUrl}LeadManagement.svc/Lead.Capture?accessKey=${this.config.accessKey}&secretKey=${this.config.secretKey}`;
    return this.http.post(url, payload, { 
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Predefined methods for different form types
  submitAppointment(data: {
    fullName: string;
    phoneNumber: string;
    emailId?: string;
    location?: string;
    department?: string;
    message?: string;
  }): Observable<any> {
    const payload: LeadSquaredPayload = [
      { Attribute: "FirstName", Value: data.fullName },
      { Attribute: "Phone", Value: data.phoneNumber },
      { Attribute: "EmailAddress", Value: data.emailId || '' },
      { Attribute: "mx_City", Value: data.location || '' },
      { Attribute: "mx_Department", Value: data.department || '' },
      { Attribute: "Description", Value: data.message || '' },
      { Attribute: "Source", Value: "Website - Book An Appointment" }
    ];
    return this.submitLead(payload);
  }

  submitContactUs(data: {
    name: string;
    phone: string;
    email?: string;
    message?: string;
  }): Observable<any> {
    const payload: LeadSquaredPayload = [
      { Attribute: "FirstName", Value: data.name },
      { Attribute: "Phone", Value: data.phone },
      { Attribute: "EmailAddress", Value: data.email || '' },
      { Attribute: "Description", Value: data.message || '' },
      { Attribute: "Source", Value: "Website - Contact Us" }
    ];
    return this.submitLead(payload);
  }

  submitSecondOpinion(data: {
    fullName: string;
    phoneNumber: string;
    emailId?: string;
    location?: string;
    department?: string;
  }): Observable<any> {
    const payload: LeadSquaredPayload = [
      { Attribute: "FirstName", Value: data.fullName },
      { Attribute: "Phone", Value: data.phoneNumber },
      { Attribute: "EmailAddress", Value: data.emailId || '' },
      { Attribute: "mx_City", Value: data.location || '' },
      { Attribute: "mx_Department", Value: data.department || '' },
      { Attribute: "Source", Value: "Website - Second Opinion" }
    ];
    return this.submitLead(payload);
  }

  submitPackageBooking(data: {
    fullName: string;
    phoneNumber: string;
    emailId?: string;
    speciality?: string;
    appointmentDate?: string;
  }): Observable<any> {
    const payload: LeadSquaredPayload = [
      { Attribute: 'FirstName', Value: data.fullName },
      { Attribute: 'Phone', Value: data.phoneNumber },
      { Attribute: 'EmailAddress', Value: data.emailId || '' },
      { Attribute: 'mx_Speciality', Value: data.speciality || '' },
      { Attribute: 'mx_AppointmentDate', Value: data.appointmentDate || '' },
      { Attribute: 'Source', Value: 'Website - Package Booking' }
    ];
    return this.submitLead(payload);
  }

  submitSpecialityEnquiry(data: {
    fullName: string;
    phoneNumber: string;
    emailId?: string;
    department?: string;
  }): Observable<any> {
    const payload: LeadSquaredPayload = [
      { Attribute: 'FirstName', Value: data.fullName },
      { Attribute: 'Phone', Value: data.phoneNumber },
      { Attribute: 'EmailAddress', Value: data.emailId || '' },
      { Attribute: 'mx_Department', Value: data.department || '' },
      { Attribute: 'Source', Value: 'Website - Enquiry Form From Speciality' }
    ];
    return this.submitLead(payload);
  }

  submitFeedback(data: {
    name: string;
    phone: string;
    email?: string;
    location?: string;
    department?: string;
    feedback?: string;
  }): Observable<any> {
    const payload: LeadSquaredPayload = [
      { Attribute: "FirstName", Value: data.name },
      { Attribute: "Phone", Value: data.phone },
      { Attribute: "EmailAddress", Value: data.email || '' },
      { Attribute: "mx_City", Value: data.location || '' },
      { Attribute: "mx_Department", Value: data.department || '' },
      { Attribute: "Description", Value: data.feedback || '' },
      { Attribute: "Source", Value: "Website - Feedback" }
    ];
    return this.submitLead(payload);
  }
}
