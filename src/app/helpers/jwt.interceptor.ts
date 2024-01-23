import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokensService } from '../services/tokens.service';
import { TranslateService } from '@ngx-translate/core';
import { TokenResponse } from '../models/auth/token.response';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(
    private tokensService: TokensService,
    private router: Router,
    private messageService: NzMessageService,
    private translate: TranslateService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const loggedUser = this.tokensService.loggedUserValue;
    const isLoggedIn = loggedUser && loggedUser.access_token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    // request = request.clone({
    //   setHeaders: {
    //     'Accept-Language': 'vi-VN',
    //   },
    // });
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${loggedUser.access_token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof HttpErrorResponse) {
          // client-side error
          console.error(error.error.message);
        } else {
          // server-side error  && request.url.includes('tokens/refresh')
          if (error.status === 401 && !request.url.includes('login')) {
            this.isRefreshing = false;
            this.messageService.error(
              this.translate.instant('auth.loginSessionHasExpired')
            );
            this.tokensService.removeSessionLogin();
            this.router.navigate(['/login']);
            return throwError(error.error);
          }
          //  else if (error.status === 401 && !request.url.includes('login')) {
          //   return this.handle401Error(request, next, loggedUser);
          // }
          if (error.status === 403) {
            this.router.navigate(['/admin/no-permission']);
          }

          if (error.status === 404) {
            this.router.navigate(['/admin/not-found']);
          }
        }

        return throwError(error.error);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    loggedUser: TokenResponse | null
  ) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = loggedUser?.access_token;
      // const refreshToken = loggedUser?.refreshToken;
      const refreshToken = null;

      if (token && refreshToken)
        return this.tokensService
          .tokensRefresh(
            {
              token: token,
              refreshToken: refreshToken,
            }
          )
          .pipe(
            switchMap((token: TokenResponse) => {
              this.isRefreshing = false;

              this.tokensService.updateAuthUser({
                ...loggedUser,
                access_token: token.access_token,
                token_type: token.token_type,
                tenant: token.tenant,
              });
              this.refreshTokenSubject.next(token.access_token);

              return next.handle(
                this.addTokenHeader(request, token.access_token!)
              );
            })
          );
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }
}
