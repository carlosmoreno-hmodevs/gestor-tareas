import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, isDevMode, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { TenantContextService } from './core/services/tenant-context.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Cargar tenant de localStorage antes de la primera navegación para evitar redirección a /select-tenant
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        inject(TenantContextService);
        return () => {};
      },
      multi: true
    },
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
