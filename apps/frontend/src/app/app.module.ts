import { CoreModule } from './core/core.module';
import { ErrorHandler, NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as Sentry from "@sentry/angular";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { AuthentificationInterceptor } from './authentification/services/authentification-interceptor';
import { I18nModule } from './i18n/i18n.module';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        CoreModule,
        BrowserAnimationsModule,
        InputTextModule], providers: [
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
                showDialog: true,
            }),
        },
        {
            provide: Sentry.TraceService,
            deps: [Router],
        },
        provideAppInitializer(() => {
        const initializerFn = (() => () => {
                // Empty Function
            })(inject(Sentry.TraceService));
        return initializerFn();
      }),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthentificationInterceptor,
            multi: true
        },
        I18nModule.setLocale(),
        I18nModule.setLocaleId(),
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
