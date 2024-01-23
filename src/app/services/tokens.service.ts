import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from './base-service';
import {
  TokenRequest,
  RefreshTokenRequest,
  ForgotPassword,
  ChangePass,
} from '../models/auth/token.request';
import { TokenResponse } from '../models/auth/token.response';
import { Router } from '@angular/router';
import { UserDetailsDto } from '../models/user/user-details.dto';
import { BaseResponse } from '../models/base-pagination.res';

@Injectable({
  providedIn: 'root',
})
export class TokensService extends BaseService {
  public defaultHeaders = new HttpHeaders();
  private _user: BehaviorSubject<TokenResponse | null> =
    new BehaviorSubject<TokenResponse | null>(null);
  public user!: Observable<TokenResponse | null>;

  constructor(protected httpClient: HttpClient, private router: Router) {
    super(httpClient);
    const tokenLocalStorage = localStorage.getItem('tokenTenant');
    if (tokenLocalStorage) {
      this._user = new BehaviorSubject<TokenResponse | null>(
        JSON.parse(tokenLocalStorage)
      );
    }

    this.user = this._user.asObservable();

  }

  /**
   * Request an access token using credentials.
   *
   * @param body
   */
  public tokensGetToken(
    body: TokenRequest,
  ): Observable<TokenResponse> {
    const headers = this.defaultHeaders;
    return this.httpClient.request<BaseResponse<TokenResponse>>(
      'post',
      `${this.baseUrl}/api/auth/sign-in`,
      {
        body: body,
        headers: headers,
      }
    ).pipe(map((res) => res.data));
  }

  public forgot(email: ForgotPassword) : Observable<any> {
    return this.httpClient.request<TokenResponse>(
      'get',
      `${this.baseUrl}/api/admin/send-mail-reset-password/${email.email}`,
    );
  }

  public changePass(body: ChangePass) : Observable<any> {
    return this.httpClient.request<TokenResponse>(
      'post',
      `${this.baseUrl}/api/admin/reset-password`,
      {
        body: body,
      }
    );
  }

  /**
   * Request an access token using a refresh token.
   *
   * @param body
   * @param tenant Input your tenant Id to access this API
   */
  public tokensRefresh(
    body: RefreshTokenRequest
  ): Observable<TokenResponse> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling tokensRefresh.'
      );
    }

   
    let headers = this.defaultHeaders;

    return this.httpClient.request<TokenResponse>(
      'post',
      `${this.baseUrl}/api/tokens/refresh`,
      {
        body: body,
        headers: headers,
      }
    );
  }

  public get loggedUserValue(): TokenResponse | null {
    return this._user.value;
  }

  public updateAuthUser(user: TokenResponse) {
    this._user.next(user);
    localStorage.setItem('tokenTenant', JSON.stringify(user));
  }

  logout() {
    this.removeSessionLogin();
  }

  public removeSessionLogin() {
    localStorage.removeItem('tokenTenant');
    this._user.next(null);
    this.router.navigate(['/login']);
  }

  public getUserProfile() {
    return this.httpClient.request<UserDetailsDto>(
      'get',
      `${this.baseUrl}/api/personal/profile`
    );
  }
}
