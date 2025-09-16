import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔄 API Request:', req.method, req.url);
    
    // Clone the request and add necessary headers
    let apiReq = req.clone({
      setHeaders: {
        'Content-Type': req.headers.get('Content-Type') || 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Add credentials for API calls
    if (req.url.startsWith('/api') || req.url.includes('api')) {
      apiReq = apiReq.clone({
        withCredentials: true
      });
    }

    return next.handle(apiReq).pipe(
      timeout(30000), // 30 second timeout
      catchError((error: HttpErrorResponse) => {
        console.error('❌ API Error:', error);
        
        // Handle different types of errors
        if (error.status === 0) {
          // Network error or CORS issue
          console.error('🌐 Network/CORS Error:', error.message);
          console.error('🔍 Check if backend is running and CORS is configured correctly');
        } else if (error.status >= 400 && error.status < 500) {
          // Client errors
          console.error('📝 Client Error:', error.status, error.message);
        } else if (error.status >= 500) {
          // Server errors
          console.error('🔥 Server Error:', error.status, error.message);
        }

        return throwError(() => error);
      })
    );
  }
}
