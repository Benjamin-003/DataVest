import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import '@angular/localize/init';
import * as Sentry from '@sentry/angular';

Sentry.init({
  dsn: 'http://357419a83f5d48ab84bf7c178cceede2@sentry.prod.modiscloud.net:9000/25',
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 0,
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));