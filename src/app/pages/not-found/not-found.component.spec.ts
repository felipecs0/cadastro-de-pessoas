import { NotFoundComponent } from './not-found.component';
import { ButtonModule } from 'primeng/button';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { Router } from '@angular/router';

describe('NotFoundComponent', () => {
  let spectator: Spectator<NotFoundComponent>;
  let component: NotFoundComponent;
  let router: jest.Mocked<Router>;

  const routerSpy = {
    navigate: jest.fn()
  };

  const createComponent = createComponentFactory({
    component: NotFoundComponent,
    imports: [ButtonModule],
    providers: [
      { provide: Router, useValue: routerSpy }
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    router = spectator.inject(Router) as jest.Mocked<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a button with label "Voltar para Home"', () => {
    const button = spectator.query('#voltar');
    expect(button).toHaveText('Voltar para Home');
  });

  it('should navigate to home on button click', () => {
    const button = spectator.query('#voltar')!;
    spectator.dispatchFakeEvent(button, 'onClick');

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
