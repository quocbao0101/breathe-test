import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { environment } from 'src/environments/environment';

export function getBaseUrl(): string {
  return environment.apiUrl;
}

export class BaseService {
  protected http: HttpClient;
  protected baseUrl: string;
  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
    this.baseUrl = getBaseUrl();
  }
}
