import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PessoasService } from '@services/pessoas.service';
import { CadastrarPessoasComponent } from './cadastrar-pessoas.component';

describe('CadastrarPessoasComponent', () => {
  let component: CadastrarPessoasComponent;
  let spectator: Spectator<CadastrarPessoasComponent>;
  let pessoasService: jest.Mocked<PessoasService>;
  let router: jest.Mocked<Router>;

  const pessoasServiceSpy = {
    buscarPessoa: jest.fn(),
    cadastrarNovaPessoa: jest.fn()
  };
  const routerSpy = {
    navigate: jest.fn()
  };

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
    pessoasService = spectator.inject(PessoasService) as jest.Mocked<PessoasService>;
    router = spectator.inject(Router) as jest.Mocked<Router>;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
