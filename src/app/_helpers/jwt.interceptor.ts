import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthService } from '@app/_services/auth.service';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = 'this.authService.userValue';
        const isLoggedIn = true;
        const isApiUrl = request.url.startsWith(environment.apiUrl + '/api');
        console.log(user);
        console.log(isApiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                }
            });
        }
        console.log('JWT');
        return next.handle(request);
    }
}
