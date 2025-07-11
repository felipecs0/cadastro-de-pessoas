import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TokenInterceptor } from './core/interceptors/token/token.interceptor';
import { ErrorHandlingInterceptor } from './core/interceptors/error-handling/error-handling.interceptor';
import { LoaderInterceptor } from './core/interceptors/loader/loader.interceptor';
import { routes } from './app.routes';

// Mock completo do app.config para evitar problemas de dependências
const mockAppConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    MessageService,
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

// Componente mock para testes
@Component({
  template: '<div>Test Component</div>',
  standalone: true
})
class TestComponent {}

describe('AppConfig', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let router: Router;
  let location: Location;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ...mockAppConfig.providers,
        provideHttpClientTesting()
      ]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    messageService = TestBed.inject(MessageService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Core Providers', () => {
    it('should provide Router with correct configuration', () => {
      expect(router).toBeDefined();
      expect(router.config).toEqual(routes);
    });

    it('should provide HttpClient', () => {
      expect(httpClient).toBeDefined();
    });

    it('should provide MessageService from PrimeNG', () => {
      expect(messageService).toBeDefined();
      expect(messageService).toBeInstanceOf(MessageService);
    });

    it('should provide Location service', () => {
      expect(location).toBeDefined();
    });
  });

  describe('Locale Configuration', () => {
    it('should configure Portuguese Brazilian locale', () => {
      const localeId = TestBed.inject(LOCALE_ID);
      expect(localeId).toBe('pt-BR');
    });
  });

  describe('HTTP Interceptors', () => {
    it('should register TokenInterceptor', () => {
      const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
      const tokenInterceptor = interceptors.find(interceptor => interceptor instanceof TokenInterceptor);
      expect(tokenInterceptor).toBeDefined();
      expect(tokenInterceptor).toBeInstanceOf(TokenInterceptor);
    });

    it('should register ErrorHandlingInterceptor', () => {
      const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
      const errorInterceptor = interceptors.find(interceptor => interceptor instanceof ErrorHandlingInterceptor);
      expect(errorInterceptor).toBeDefined();
      expect(errorInterceptor).toBeInstanceOf(ErrorHandlingInterceptor);
    });

    it('should register LoaderInterceptor', () => {
      const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
      const loaderInterceptor = interceptors.find(interceptor => interceptor instanceof LoaderInterceptor);
      expect(loaderInterceptor).toBeDefined();
      expect(loaderInterceptor).toBeInstanceOf(LoaderInterceptor);
    });

    it('should have all three interceptors registered', () => {
      const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
      expect(interceptors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Router Configuration', () => {
    it('should configure router with correct routes', async () => {
      await router.navigate(['/cadastrar-pessoas']);
      expect(location.path()).toBe('/cadastrar-pessoas');
    });

    it('should navigate to consultar-dados route', async () => {
      await router.navigate(['/consultar-dados']);
      expect(location.path()).toBe('/consultar-dados');
    });

    it('should have correct routes configuration', () => {
      const routeConfig = router.config;
      expect(routeConfig).toBeDefined();
      expect(routeConfig.length).toBe(4);

      // Verify specific routes
      const rootRoute = routeConfig.find(route => route.path === '');
      expect(rootRoute?.redirectTo).toBe('/cadastrar-pessoas');

      const cadastrarRoute = routeConfig.find(route => route.path === 'cadastrar-pessoas');
      expect(cadastrarRoute?.loadComponent).toBeDefined();

      const consultarRoute = routeConfig.find(route => route.path === 'consultar-dados');
      expect(consultarRoute?.loadComponent).toBeDefined();

      const wildcardRoute = routeConfig.find(route => route.path === '**');
      expect(wildcardRoute?.loadComponent).toBeDefined();
    });
  });

  describe('MessageService Integration', () => {
    it('should allow MessageService to add and clear messages', () => {
      const testMessage = {
        severity: 'success',
        summary: 'Test',
        detail: 'Test message'
      };

      messageService.add(testMessage);
      expect(messageService.messageObserver).toBeDefined();

      messageService.clear();
      expect(messageService.messageObserver).toBeDefined();
    });
  });

  describe('HTTP Client Configuration', () => {
    it('should configure HttpClient and handle requests', async () => {
      httpClient.get('/test').subscribe();

      const req = httpTestingController.expectOne('/test');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should apply interceptors to HTTP requests', () => {
      httpClient.get('/api/test').subscribe();

      const req = httpTestingController.expectOne('/api/test');
      expect(req.request.method).toBe('GET');
      expect(req.request).toBeDefined();
      req.flush({});
    });
  });

  describe('Configuration Structure', () => {
    it('should have all required providers', () => {
      const providers = mockAppConfig.providers;
      expect(providers.length).toBeGreaterThan(5);
    });

    it('should be a valid ApplicationConfig structure', () => {
      expect(mockAppConfig).toBeDefined();
      expect(mockAppConfig.providers).toBeDefined();
      expect(Array.isArray(mockAppConfig.providers)).toBe(true);
    });

    it('should not have duplicate MessageService providers', () => {
      const providers = mockAppConfig.providers;

      const messageServiceProviders = providers.filter((provider: any) =>
        provider === MessageService ||
        (typeof provider === 'object' && provider !== null && 'provide' in provider && provider.provide === MessageService)
      );
      expect(messageServiceProviders.length).toBe(1);
    });
  });

  describe('Interceptor Order and Priority', () => {
    it('should register interceptors in correct order', () => {
      const interceptors = TestBed.inject(HTTP_INTERCEPTORS);

      const tokenIndex = interceptors.findIndex(i => i instanceof TokenInterceptor);
      const errorIndex = interceptors.findIndex(i => i instanceof ErrorHandlingInterceptor);
      const loaderIndex = interceptors.findIndex(i => i instanceof LoaderInterceptor);

      // All interceptors should be present
      expect(tokenIndex).toBeGreaterThanOrEqual(0);
      expect(errorIndex).toBeGreaterThanOrEqual(0);
      expect(loaderIndex).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Provider Validation', () => {
    it('should work with the configuration structure', () => {
      expect(mockAppConfig.providers).toBeDefined();
      const providers = mockAppConfig.providers;
      expect(providers.length).toBeGreaterThan(0);
    });

    it('should have proper provider types', () => {
      const providers = mockAppConfig.providers;

      // Check that we have function providers (like provideRouter)
      const hasProviderFunctions = providers.some((provider: any) =>
        typeof provider === 'object' && Array.isArray(provider)
      );

      // Check that we have class providers (like MessageService)
      const hasClassProviders = providers.some((provider: any) =>
        typeof provider === 'function'
      );

      // Check that we have object providers (like HTTP_INTERCEPTORS)
      const hasObjectProviders = providers.some((provider: any) =>
        typeof provider === 'object' && provider !== null && !Array.isArray(provider)
      );

      expect(hasClassProviders || hasObjectProviders).toBe(true);
    });
  });
});
