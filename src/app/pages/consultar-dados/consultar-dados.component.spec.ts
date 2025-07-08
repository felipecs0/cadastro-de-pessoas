import { ConsultarDadosComponent } from './consultar-dados.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PessoasService } from '@services/pessoas.service';
import { of } from 'rxjs';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

describe('ConsultarDadosComponent', () => {
  let spectator: Spectator<ConsultarDadosComponent>;
  let component: ConsultarDadosComponent;
  let pessoasServiceSpy: jasmine.SpyObj<PessoasService>;
  let router: jasmine.SpyObj<Router>;


  const pessoasSpy = jasmine.createSpyObj('PessoasService', ['buscarPessoa', 'cadastrarNovaPessoa']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  const createComponent = createComponentFactory({
    component: ConsultarDadosComponent,
    providers: [
      {
        provide: PessoasService,
        useValue: {
          buscarPessoa: pessoasSpy.buscarPessoa.and.returnValue(of('')),
          cadastrarNovaPessoa: pessoasSpy.cadastrarNovaPessoa.and.returnValue(of(''))
        }
      },
      { provide: Router, useValue: routerSpy },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: { id: 1 }
          }
        }
      }
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    pessoasServiceSpy = spectator.inject(PessoasService) as jasmine.SpyObj<PessoasService>;
    router = spectator.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    routerSpy.navigate.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




