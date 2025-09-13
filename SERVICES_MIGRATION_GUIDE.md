# OMNI Hospitals - Services Migration & Environment Setup Guide

## ✅ Migration Complete!

All services have been successfully migrated to a centralized structure with environment-based configuration.

## 📁 New Project Structure

```
src/
├── environments/
│   ├── environment.ts           # Development environment
│   └── environment.prod.ts      # Production environment
└── app/
    └── services/
        ├── index.ts             # Centralized exports
        ├── specialities.service.ts
        ├── doctor-details.service.ts
        ├── health-package.service.ts
        ├── fixed-packages.service.ts
        ├── users.service.ts
        ├── news.service.ts
        ├── blog-details.service.ts
        ├── video-state.service.ts
        └── leadsquared.service.ts   # NEW: Centralized form handling
```

## 🔧 Environment Configuration

### Development Environment (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',          // Local development server
  omniApiUrl: 'http://localhost:3000',          // Local development server
  specialtiesApiUrl: 'http://localhost:3000',   // Local development server
  blogApiUrl: 'https://omniservicebackend.onrender.com',
  leadsquared: {
    baseUrl: 'https://api-in21.leadsquared.com/v2/',
    accessKey: 'u$r56afea08b32d556818ad1a5f69f0e7f0',
    secretKey: '8d7f86d677dadaba209b4dead3cfcc4ab019031b'
  }
};
```

### Production Environment (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'http://api.omni-hospitals.in:3000',     // Production server
  omniApiUrl: 'http://api.omni-hospitals.in:3000',     // Production server
  specialtiesApiUrl: 'http://api.omni-hospitals.in:3000', // Production server
  blogApiUrl: 'https://omniservicebackend.onrender.com',
  leadsquared: {
    baseUrl: 'https://api-in21.leadsquared.com/v2/',
    accessKey: 'u$r56afea08b32d556818ad1a5f69f0e7f0',
    secretKey: '8d7f86d677dadaba209b4dead3cfcc4ab019031b'
  }
};
```

## 📦 How to Import Services

### Option 1: Individual Imports
```typescript
import { SpecialitiesService } from '../services/specialities.service';
import { DoctorDetailsService } from '../services/doctor-details.service';
import { LeadSquaredService } from '../services/leadsquared.service';
```

### Option 2: Centralized Imports (Recommended)
```typescript
import { 
  SpecialitiesService, 
  DoctorDetailsService, 
  LeadSquaredService 
} from '../services';
```

## 🔄 Service Usage Examples

### 1. Using Specialities Service
```typescript
export class YourComponent {
  constructor(private specialitiesService: SpecialitiesService) {}

  loadSpecialities() {
    this.specialitiesService.getAllSpecialities().subscribe({
      next: (data) => console.log('Specialities:', data),
      error: (error) => console.error('Error:', error)
    });
  }
}
```

### 2. Using LeadSquared Service (NEW)
```typescript
export class ContactComponent {
  constructor(private leadSquaredService: LeadSquaredService) {}

  submitContactForm() {
    this.leadSquaredService.submitContactUs({
      name: 'John Doe',
      phone: '9876543210',
      email: 'john@example.com',
      message: 'Need information'
    }).subscribe({
      next: (response) => {
        console.log('Form submitted successfully:', response);
        alert('Thank you! Your enquiry has been submitted.');
      },
      error: (error) => {
        console.error('Submission failed:', error);
        alert('Submission failed. Please try again.');
      }
    });
  }
}
```

### 3. Using Doctor Details Service
```typescript
export class DoctorsComponent {
  constructor(private doctorService: DoctorDetailsService) {}

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctorsList = doctors.data || [];
      },
      error: (error) => {
        console.error('Failed to load doctors:', error);
      }
    });
  }
}
```

## 🎯 LeadSquared Service Methods

The new `LeadSquaredService` provides these predefined methods:

```typescript
// Appointment booking
submitAppointment(data: AppointmentData): Observable<any>

// Contact us form
submitContactUs(data: ContactData): Observable<any>

// Second opinion request
submitSecondOpinion(data: SecondOpinionData): Observable<any>

// Package booking
submitPackageBooking(data: PackageData): Observable<any>

// Speciality enquiry
submitSpecialityEnquiry(data: EnquiryData): Observable<any>

// Feedback submission
submitFeedback(data: FeedbackData): Observable<any>

// Generic lead submission
submitLead(payload: LeadSquaredPayload): Observable<any>
```

## 🔧 Build Commands

### Development Build
```bash
ng build --configuration development
```

### Production Build
```bash
ng build --configuration production
```

### Serve Development
```bash
ng serve
```

## ✅ Migration Benefits

1. **Centralized Configuration**: All API URLs managed from environment files
2. **Better Organization**: All services in one folder (`src/app/services/`)
3. **Environment-Specific URLs**: Different URLs for development and production
4. **Centralized Form Handling**: LeadSquared service handles all form submissions
5. **Improved Maintainability**: Single place to update API endpoints
6. **Type Safety**: Proper TypeScript interfaces for all services
7. **Cleaner Imports**: Centralized export from services/index.ts
8. **Caching**: Built-in caching for performance optimization
9. **Error Handling**: Comprehensive error handling in all services

## 🚀 What's Next

1. **Update Components**: Replace direct HTTP calls with LeadSquared service methods
2. **Add New APIs**: Add new API endpoints to environment files
3. **Extend Services**: Add new methods to existing services as needed
4. **Monitor Performance**: Use built-in caching and error handling features

## 🔍 Troubleshooting

If you encounter import errors:
1. Check that the service path is correct: `../services/service-name.service`
2. Ensure the service is exported in `services/index.ts`
3. Run `ng build` to check for compilation errors
4. Clear node_modules and reinstall if needed: `npm install`

---

**Migration Status**: ✅ Complete
**Build Status**: ✅ Successful (Development & Production)
**Tests**: ✅ All imports working correctly
