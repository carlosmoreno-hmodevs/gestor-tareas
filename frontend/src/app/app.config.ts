import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, isDevMode, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { TenantContextService } from './core/services/tenant-context.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { INITIAL_TENANTS } from './core/data/tenant-initial';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Si no hay tenant guardado, elegir el primero por defecto (evita pasar por /select-tenant al recargar)
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const tenantContext = inject(TenantContextService);
        if (!tenantContext.hasTenant() && INITIAL_TENANTS.length > 0) {
          tenantContext.setCurrentTenant(INITIAL_TENANTS[0].id);
        }
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
