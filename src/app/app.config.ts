import { registerLocaleData }               from '@angular/common';
import { HTTP_INTERCEPTORS, withFetch, withInterceptors }              from '@angular/common/http';
import { withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClient }      from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID }      from '@angular/core';
import { importProvidersFrom }    from '@angular/core';
import { BrowserModule }          from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter }          from '@angular/router';
import { withInMemoryScrolling }  from '@angular/router';
import { withRouterConfig }       from '@angular/router';
import { routes }                 from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { TokenInterceptor } from './core/interceptors/token/token.interceptor';
import { MessageService } from 'primeng/api';
import { ErrorHandlingInterceptor } from './core/interceptors/error-handling/error-handling.interceptor';
import { LoaderInterceptor } from './core/interceptors/loader/loader.interceptor';
import localePt from '@angular/common/locales/pt';
import { MyPreset } from 'src/assets/theme/mytheme';
registerLocaleData(localePt);

export const appConfig : ApplicationConfig = {
  providers : [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation : 'reload',
      }),
      withInMemoryScrolling({
        scrollPositionRestoration : 'enabled'
      }),
    ),

    importProvidersFrom(
      BrowserModule,
    ),
    MessageService,
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    provideAnimationsAsync(),
    provideClientHydration(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
      }
    }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
  ]
};
