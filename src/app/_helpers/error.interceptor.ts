import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      console.log('Error');
      return next.handle(request).pipe(catchError(err => {
        console.log("error" + err);
        if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.accountService.logout();
        }

        const error = err.error.message || err.statusText;
        console.log("error");
        return throwError(error);
      }));
    }
}
