/// <reference types="@angular/localize" />

// Angular modules
import { enableProdMode }       from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

// External modules
import { appConfig }            from './app/app.config';

// Internal modules
import { environment }          from './environments/environment';

// Components
import { AppComponent }         from './app/app.component';

// Mock service initialization
async function prepareMocks() {
  if (!environment.production) {
    const { initMocks } = await import('./mocks/init');
    return initMocks();
  }
  return Promise.resolve();
}

if (environment.production) {
  enableProdMode();
}

// Initialize mocks in development, then bootstrap the app
prepareMocks().then(() => {
  bootstrapApplication(
    AppComponent,
    appConfig
  )
  .catch(err => console.error(err));
});
