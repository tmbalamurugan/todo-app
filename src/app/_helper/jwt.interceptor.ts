import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = this.authenticationService.currentUserValue;
        // const currentUser = sessionStorage.getItem('currentUser');

        // console.log('jwt ', JSON.parse(sessionStorage.getItem('currentUser')));
        // console.log('jwt iiii', sessionStorage.getItem('currentUser'));
        if (JSON.parse(sessionStorage.getItem('currentUser')) !== null) {
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }
        } else {
            request = request.clone({
                setHeaders: {
                    Authorization: ''
                }
            });
        }
        return next.handle(request);
    }
}