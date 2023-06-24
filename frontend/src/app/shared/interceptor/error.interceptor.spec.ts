import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
    let interceptor: ErrorInterceptor;
    let swalFireSpy: jasmine.Spy;

    beforeEach(() => {
        swalFireSpy = spyOn(Swal, 'fire');
        TestBed.configureTestingModule({
            providers: [
                { provide: Swal, useValue: Swal },
                ErrorInterceptor
            ]
        });
        interceptor = TestBed.inject(ErrorInterceptor);
    });

    it('should handle 404 error', () => {
        const errorResponse = new HttpErrorResponse({ status: 404 });

        interceptor.intercept(new HttpRequest<any>('GET', '/api'), {
            handle: () => throwError(errorResponse)
        }).subscribe({
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(404);
                expect(swalFireSpy).toHaveBeenCalledWith('Error!', 'Resource not found', 'error');
            }
        });

        expect(swalFireSpy).toHaveBeenCalled();
    });

    it('should handle 500 error', () => {
        const errorResponse = new HttpErrorResponse({ status: 500 });

        interceptor.intercept(new HttpRequest<any>('GET', '/api'), {
            handle: () => throwError(errorResponse)
        }).subscribe({
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
                expect(swalFireSpy).toHaveBeenCalledWith('Error!', 'Internal server error', 'error');
            }
        });

        expect(swalFireSpy).toHaveBeenCalled();
    });

    it('should handle other errors', () => {
        const errorResponse = new HttpErrorResponse({ status: 403 });

        interceptor.intercept(new HttpRequest<any>('GET', '/api'), {
            handle: () => throwError(errorResponse)
        }).subscribe({
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(403);
                expect(swalFireSpy).toHaveBeenCalledWith('Error!', 'An error occurred:403', 'error');
            }
        });

        expect(swalFireSpy).toHaveBeenCalled();
    });
});
