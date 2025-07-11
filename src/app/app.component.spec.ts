import { Router, ActivatedRoute, NavigationEnd, UrlTree } from '@angular/router';
import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let component: AppComponent;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let messageService: MessageService;

  const createComponent = createComponentFactory({
    component: AppComponent,
    providers: [
      MessageService,
      {
        provide: Router,
        useValue: {
          events: of(new NavigationEnd(1, '/', '/')),
          navigate: jest.fn(),
          navigateByUrl: jest.fn(),
          createUrlTree: jest.fn().mockReturnValue(new UrlTree()),
          serializeUrl: jest.fn().mockReturnValue(''),
          parseUrl: jest.fn().mockReturnValue(new UrlTree()),
          isActive: jest.fn().mockReturnValue(false),
          url: '/',
          routerState: {
            root: {
              snapshot: {
                params: {},
                queryParams: {},
                fragment: null,
                data: {},
                url: [],
                outlet: 'primary',
                component: null,
                routeConfig: null,
                root: null,
                parent: null,
                firstChild: null,
                children: [],
                pathFromRoot: [],
                title: undefined
              }
            }
          }
        }
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: new Map(),
            queryParamMap: new Map(),
            url: [],
            params: {},
            queryParams: {},
            fragment: null,
            data: {},
            outlet: 'primary',
            component: null,
            routeConfig: null,
            root: null,
            parent: null,
            firstChild: null,
            children: [],
            pathFromRoot: [],
            title: undefined
          },
          params: of({}),
          queryParams: of({}),
          fragment: of(null),
          data: of({}),
          url: of([]),
          outlet: 'primary',
          component: null,
          routeConfig: null,
          root: null as any,
          parent: null,
          firstChild: null,
          children: [],
          pathFromRoot: [],
          title: of(undefined)
        }
      }
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    router = spectator.inject(Router);
    activatedRoute = spectator.inject(ActivatedRoute);
    messageService = spectator.inject(MessageService);
  });

  describe('Component Initialization', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should have correct title', () => {
      expect(component.title).toBe('cadastro-de-pessoas');
    });

    it('should initialize mobile menu as closed', () => {
      expect(component.mobileMenuOpen).toBeFalsy();
    });
  });

  describe('Mobile Menu Functionality', () => {
    it('should toggle mobile menu state', () => {
      expect(component.mobileMenuOpen).toBeFalsy();

      component.toggleMobileMenu();
      expect(component.mobileMenuOpen).toBeTruthy();

      component.toggleMobileMenu();
      expect(component.mobileMenuOpen).toBeFalsy();
    });

    it('should close mobile menu', () => {
      component.mobileMenuOpen = true;

      component.closeMobileMenu();
      expect(component.mobileMenuOpen).toBeFalsy();
    });

    it('should close mobile menu when route changes', () => {
      component.mobileMenuOpen = true;

      // Simulate route change
      component.ngOnInit();

      expect(component.mobileMenuOpen).toBeFalsy();
    });
  });

  describe('Template Rendering', () => {
    it('should render header with title', () => {
      expect(spectator.query('h1')).toHaveText('Cadastro de Pessoas');
    });

    it('should render desktop navigation menu', () => {
      expect(spectator.query('.desktop-menu')).toBeTruthy();
    });

    it('should render mobile menu button', () => {
      expect(spectator.query('.mobile-menu-button')).toBeTruthy();
    });

    it('should render mobile menu', () => {
      expect(spectator.query('.mobile-menu')).toBeTruthy();
    });

    it('should render both navigation links', () => {
      const links = spectator.queryAll('a[routerLink]');
      expect(links).toHaveLength(4); // 2 desktop + 2 mobile
    });

    it('should have correct routerLink values', () => {
      const cadastrarLinks = spectator.queryAll('a[routerLink="/cadastrar-pessoas"]');
      const consultarLinks = spectator.queryAll('a[routerLink="/consultar-dados"]');

      expect(cadastrarLinks).toHaveLength(2);
      expect(consultarLinks).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria attributes on mobile menu button', () => {
      const button = spectator.query('.mobile-menu-button');

      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-label', 'Abrir menu de navegação');
      expect(button).toHaveAttribute('aria-controls', 'mobile-menu');
    });

    it('should update aria-expanded when menu opens', () => {
      component.toggleMobileMenu();
      spectator.detectChanges();

      const button = spectator.query('.mobile-menu-button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have proper aria attributes on mobile menu', () => {
      const menu = spectator.query('.mobile-menu');

      expect(menu).toHaveAttribute('id', 'mobile-menu');
      expect(menu).toHaveAttribute('aria-hidden', 'true');
    });

    it('should update aria-hidden when menu opens', () => {
      component.toggleMobileMenu();
      spectator.detectChanges();

      const menu = spectator.query('.mobile-menu');
      expect(menu).toHaveAttribute('aria-hidden', 'false');
    });

    it('should have proper navigation labels', () => {
      const nav = spectator.query('nav[aria-label="Menu principal"]');
      const mobileNav = spectator.query('nav[aria-label="Menu principal mobile"]');

      expect(nav).toBeTruthy();
      expect(mobileNav).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should toggle menu when mobile button is clicked', () => {
      const button = spectator.query('.mobile-menu-button');

      spectator.click(button!);
      expect(component.mobileMenuOpen).toBeTruthy();

      spectator.click(button!);
      expect(component.mobileMenuOpen).toBeFalsy();
    });

    it('should close menu when mobile link is clicked', () => {
      component.mobileMenuOpen = true;
      spectator.detectChanges();

      const mobileLink = spectator.query('.mobile-menu a[routerLink="/cadastrar-pessoas"]');
      spectator.click(mobileLink!);

      expect(component.mobileMenuOpen).toBeFalsy();
    });

    it('should apply correct CSS classes based on menu state', () => {
      const menu = spectator.query('.mobile-menu');

      expect(menu).not.toHaveClass('mobile-menu-open');

      component.toggleMobileMenu();
      spectator.detectChanges();

      expect(menu).toHaveClass('mobile-menu-open');
    });
  });

  describe('Responsive Behavior', () => {
    it('should have responsive classes applied', () => {
      expect(spectator.query('.desktop-menu')).toBeTruthy();
      expect(spectator.query('.mobile-menu-button')).toBeTruthy();
      expect(spectator.query('.mobile-menu')).toBeTruthy();
    });

    it('should render toast component', () => {
      expect(spectator.query('p-toast')).toBeTruthy();
    });

    it('should render router outlet', () => {
      expect(spectator.query('router-outlet')).toBeTruthy();
    });
  });
});
