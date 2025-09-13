import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorService {

  constructor() { }

  handleError(error: HttpErrorResponse): string {
    let errorMessage = 'An error occurred';

    if (error.status === 0) {
      // Network/CORS error
      errorMessage = 'Unable to connect to server. Please check your internet connection or try again later.';
      console.error('🌐 Network/CORS Error Details:', {
        message: error.message,
        url: error.url,
        headers: error.headers
      });
    } else if (error.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.status === 500) {
      errorMessage = 'Internal server error. Please try again later.';
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = error.error?.message || 'Bad request. Please check your input.';
    } else {
      errorMessage = error.error?.message || 'An unexpected error occurred.';
    }

    // Log detailed error for debugging
    console.error('🚨 API Error Details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
      error: error.error
    });

    return errorMessage;
  }

  logCorsInfo(): void {
    console.log('🔍 CORS Debugging Info:');
    console.log('- Frontend URL:', window.location.origin);
    console.log('- Backend should allow this origin in CORS configuration');
    console.log('- Check browser Network tab for preflight OPTIONS requests');
    console.log('- Ensure backend is running on the expected port');
  }
}
