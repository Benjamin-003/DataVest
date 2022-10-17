import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from "@sentry/angular";
import { BrowserTracing } from '@sentry/tracing';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment.prod';

if (environment.production) {
  enableProdMode();
  }

Sentry.init({
  dsn: "http://357419a83f5d48ab84bf7c178cceede2@sentry.prod.modiscloud.net:9000/25",
  integrations: [
    new BrowserTracing({
      tracingOrigins: ["localhost", "localhost:4200","127.0.0.1"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0,
});


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
