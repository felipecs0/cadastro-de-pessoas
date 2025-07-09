import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PessoasService } from '@services/pessoas.service';
import { CadastrarPessoasComponent } from './cadastrar-pessoas.component';

describe('CadastrarPessoasComponent', () => {
  let component: CadastrarPessoasComponent;
  let spectator: Spectator<CadastrarPessoasComponent>;
  let pessoasService: jasmine.SpyObj<PessoasService>;
  let router: jasmine.SpyObj<Router>;

  const pessoasServiceSpy = jasmine.createSpyObj('PessoasService', ['buscarPessoa', 'cadastrarNovaPessoa']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  const createComponent = createComponentFactory({
    component: CadastrarPessoasComponent,
    imports: [ReactiveFormsModule],
    providers: [
      provideHttpClientTesting(),
      { provide: PessoasService, useValue: pessoasServiceSpy },
      { provide: Router, useValue: routerSpy }
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    pessoasService = spectator.inject(PessoasService) as jasmine.SpyObj<PessoasService>;
    router = spectator.inject(Router) as jasmine.SpyObj<Router>;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
