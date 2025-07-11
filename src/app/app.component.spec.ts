import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

describe('AppComponent (Spectator)', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [RouterTestingModule, ToastModule],
    providers: [MessageService],
    shallow: false,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render the router-outlet', () => {
    const routerOutlet = spectator.query('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should render the toast component', () => {
    const toast = spectator.query('p-toast');
    expect(toast).toBeTruthy();
  });

  it('should have navigation links with routerLink', () => {
    const links = spectator.queryAll('[routerLink]');
    expect(links.length).toBeGreaterThan(0);

    expect(spectator.query('[routerLink="/cadastrar-pessoas"]')).toBeTruthy();
    expect(spectator.query('[routerLink="/consultar-dados"]')).toBeTruthy();
  });
});
