import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';

// Componentes mock para testes
@Component({
  template: '<div>Cadastrar Pessoas Mock</div>',
  standalone: true
})
class MockCadastrarPessoasComponent {}

@Component({
  template: '<div>Consultar Dados Mock</div>',
  standalone: true
})
class MockConsultarDadosComponent {}

@Component({
  template: '<div>Not Found Mock</div>',
  standalone: true
})
class MockNotFoundComponent {}

describe('AppRoutes', () => {
  let router: Router;
  let location: Location;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        // Mock dos componentes que serão carregados dinamicamente
        { provide: 'CadastrarPessoasComponent', useValue: MockCadastrarPessoasComponent },
        { provide: 'ConsultarDadosComponent', useValue: MockConsultarDadosComponent },
        { provide: 'NotFoundComponent', useValue: MockNotFoundComponent }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(MockCadastrarPessoasComponent);
  });

  describe('Route Configuration', () => {
    it('should have correct number of routes', () => {
      expect(routes.length).toBe(4);
    });

    it('should have root route that redirects to /cadastrar-pessoas', () => {
      const rootRoute = routes.find(route => route.path === '');
      expect(rootRoute).toBeDefined();
      expect(rootRoute?.redirectTo).toBe('/cadastrar-pessoas');
      expect(rootRoute?.pathMatch).toBe('full');
    });

    it('should have cadastrar-pessoas route with lazy loading', () => {
      const cadastrarRoute = routes.find(route => route.path === 'cadastrar-pessoas');
      expect(cadastrarRoute).toBeDefined();
      expect(cadastrarRoute?.loadComponent).toBeDefined();
      expect(typeof cadastrarRoute?.loadComponent).toBe('function');
    });

    it('should have consultar-dados route with lazy loading', () => {
      const consultarRoute = routes.find(route => route.path === 'consultar-dados');
      expect(consultarRoute).toBeDefined();
      expect(consultarRoute?.loadComponent).toBeDefined();
      expect(typeof consultarRoute?.loadComponent).toBe('function');
    });

    it('should have wildcard route for 404 pages', () => {
      const wildcardRoute = routes.find(route => route.path === '**');
      expect(wildcardRoute).toBeDefined();
      expect(wildcardRoute?.loadComponent).toBeDefined();
      expect(typeof wildcardRoute?.loadComponent).toBe('function');
    });
  });

  describe('Route Navigation', () => {
    it('should redirect root path to /cadastrar-pessoas', async () => {
      await router.navigate(['']);
      expect(location.path()).toBe('/cadastrar-pessoas');
    });

    it('should navigate to cadastrar-pessoas route', async () => {
      await router.navigate(['/cadastrar-pessoas']);
      expect(location.path()).toBe('/cadastrar-pessoas');
    });

    it('should navigate to consultar-dados route', async () => {
      await router.navigate(['/consultar-dados']);
      expect(location.path()).toBe('/consultar-dados');
    });

    it('should navigate to not-found for invalid routes', async () => {
      await router.navigate(['/invalid-route']);
      expect(location.path()).toBe('/invalid-route');
    });

    it('should navigate to not-found for deeply nested invalid routes', async () => {
      await router.navigate(['/some/deeply/nested/invalid/route']);
      expect(location.path()).toBe('/some/deeply/nested/invalid/route');
    });
  });

  describe('Route Guards and Resolvers', () => {
    it('should not have guards on cadastrar-pessoas route', () => {
      const cadastrarRoute = routes.find(route => route.path === 'cadastrar-pessoas');
      expect(cadastrarRoute?.canActivate).toBeUndefined();
      expect(cadastrarRoute?.canLoad).toBeUndefined();
    });

    it('should not have guards on consultar-dados route', () => {
      const consultarRoute = routes.find(route => route.path === 'consultar-dados');
      expect(consultarRoute?.canActivate).toBeUndefined();
      expect(consultarRoute?.canLoad).toBeUndefined();
    });

    it('should not have resolvers on any route', () => {
      routes.forEach(route => {
        expect(route.resolve).toBeUndefined();
      });
    });
  });

  describe('Route Data and Titles', () => {
    it('should not have custom data on routes', () => {
      routes.forEach(route => {
        if (route.path !== '' && route.path !== '**') {
          expect(route.data).toBeUndefined();
        }
      });
    });

    it('should not have custom titles on routes', () => {
      routes.forEach(route => {
        expect(route.title).toBeUndefined();
      });
    });
  });

  describe('Lazy Loading Components', () => {
    it('should load CadastrarPessoasComponent dynamically', async () => {
      const cadastrarRoute = routes.find(route => route.path === 'cadastrar-pessoas');
      const loadComponent = cadastrarRoute?.loadComponent;

      if (loadComponent) {
        expect(typeof loadComponent).toBe('function');
        // Verifica se a função retorna uma Promise
        const result = loadComponent();
        expect(result).toBeInstanceOf(Promise);
      }
    });

    it('should load ConsultarDadosComponent dynamically', async () => {
      const consultarRoute = routes.find(route => route.path === 'consultar-dados');
      const loadComponent = consultarRoute?.loadComponent;

      if (loadComponent) {
        expect(typeof loadComponent).toBe('function');
        // Verifica se a função retorna uma Promise
        const result = loadComponent();
        expect(result).toBeInstanceOf(Promise);
      }
    });

    it('should load NotFoundComponent dynamically', async () => {
      const wildcardRoute = routes.find(route => route.path === '**');
      const loadComponent = wildcardRoute?.loadComponent;

      if (loadComponent) {
        expect(typeof loadComponent).toBe('function');
        // Verifica se a função retorna uma Promise
        const result = loadComponent();
        expect(result).toBeInstanceOf(Promise);
      }
    });
  });

  describe('Route Order and Priority', () => {
    it('should have routes in correct order (most specific first)', () => {
      const routePaths = routes.map(route => route.path);

      // Verifica se a rota raiz está primeiro
      expect(routePaths[0]).toBe('');

      // Verifica se as rotas específicas vêm antes da wildcard
      const wildcardIndex = routePaths.indexOf('**');
      expect(wildcardIndex).toBe(routes.length - 1);

      // Verifica se todas as rotas específicas vêm antes da wildcard
      const specificRoutes = routePaths.slice(0, wildcardIndex);
      specificRoutes.forEach(path => {
        expect(path).not.toBe('**');
      });
    });

    it('should have wildcard route as last route', () => {
      const lastRoute = routes[routes.length - 1];
      expect(lastRoute.path).toBe('**');
    });
  });

  describe('Route Path Validation', () => {
    it('should have valid route paths without leading slashes', () => {
      routes.forEach(route => {
        if (route.path && route.path !== '**') {
          expect(route.path.startsWith('/')).toBe(false);
        }
      });
    });

    it('should have kebab-case route paths', () => {
      const specificRoutes = routes.filter(route =>
        route.path && route.path !== '' && route.path !== '**'
      );

      specificRoutes.forEach(route => {
        expect(route.path).toMatch(/^[a-z]+(-[a-z]+)*$/);
      });
    });
  });

  describe('Route Configuration Completeness', () => {
    it('should have all required routes for the application', () => {
      const expectedPaths = ['', 'cadastrar-pessoas', 'consultar-dados', '**'];
      const actualPaths = routes.map(route => route.path);

      expectedPaths.forEach(expectedPath => {
        expect(actualPaths).toContain(expectedPath);
      });
    });

    it('should not have duplicate routes', () => {
      const paths = routes.map(route => route.path);
      const uniquePaths = [...new Set(paths)];

      expect(paths.length).toBe(uniquePaths.length);
    });
  });
});
