import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withPreloading,
} from '@angular/router';
import { appRoutes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClient,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideQueryClientOptions } from '@ngneat/query';
import { provideQueryDevTools } from '@ngneat/query-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { environment } from 'src/environments/environment';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withPreloading(PreloadAllModules)
    ),
    { provide: NZ_I18N, useValue: vi_VN },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      AngularFireModule.initializeApp(environment.firebase),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      AngularFireAuthModule,
    ),
    provideQueryClientOptions({
      defaultOptions: {
        queries: {
          staleTime: 600000, // 10 minutes
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          retry: false,
          retryDelay: 1000,
        },
      },
    }),
    environment.production ? [] : provideQueryDevTools(),
  ],
};
