import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Interceptor logic goes here
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // Perform custom error handling here
                if (error.status === 404) {
                    Swal.fire('Error!', "Resource not found", 'error');
                } else if (error.status === 500) {
                    Swal.fire('Error!', "Internal server error", 'error');
                } else {
                    Swal.fire('Error!', "An error occurred:" + error.status, 'error');
                }
                return throwError(() => error);
            })
        );
    }
}
