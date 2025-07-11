
import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { createComponentFactory, Spectator, SpyObject } from '@ngneat/spectator/jest';

import { ConsultarDadosComponent } from './consultar-dados.component';
import { PessoasService } from '@services/pessoas.service';
import { PessoaDados } from '../../core/interfaces/pessoas.interface';
import { MaskUtils } from '../../core/utils/mask.utils';
import { CustomValidators } from '../../core/validators/custom-validators';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';

describe('ConsultarDadosComponent', () => {
  let spectator: Spectator<ConsultarDadosComponent>;
  let component: ConsultarDadosComponent;
  let pessoasService: SpyObject<PessoasService>;
  let router: SpyObject<Router>;

  const mockPessoa: PessoaDados = {
    nome: 'João Silva Santos',
    cpf: '12345678901',
    email: 'joao@email.com',
    sexo: 'masculino',
    telefone: '(11) 99999-9999'
  };

  const createComponent = createComponentFactory({
    component: ConsultarDadosComponent,
    imports: [
      ReactiveFormsModule,
      ButtonModule,
      InputTextModule,
      AutoCompleteModule,
      SelectModule
    ],
    providers: [
      FormBuilder
    ],
    mocks: [
      PessoasService,
      Router
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    pessoasService = spectator.inject(PessoasService);
    router = spectator.inject(Router);
  });

  describe('Inicialização do Componente', () => {
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar o formulário com valores padrão', () => {
      expect(component.searchForm).toBeDefined();
      expect(component.searchForm.get('cpf')?.value).toBeNull();
      expect(component.searchForm.valid).toBeFalsy();
    });

    it('deve inicializar os estados da tela', () => {
      expect(component.isLoading).toBeFalsy();
      expect(component.hasSearched).toBeFalsy();
      expect(component.pessoa).toBeNull();
      expect(component.errorMessage).toBe('');
    });

    it('deve definir validadores no campo CPF', () => {
      const cpfControl = component.searchForm.get('cpf');
      expect(cpfControl?.hasError('required')).toBeTruthy();
    });
  });

  describe('Validação de Formulário', () => {
    it('deve ser inválido quando CPF estiver vazio', () => {
      component.searchForm.patchValue({ cpf: '' });
      expect(component.searchForm.valid).toBeFalsy();
      expect(component.isFormValid).toBeFalsy();
    });

    it('deve ser válido quando CPF for válido', () => {
      // Mock do validador CPF para retornar null (válido)
      jest.spyOn(CustomValidators, 'cpf').mockReturnValue(() => null);

      component.searchForm.patchValue({ cpf: '123.456.789-09' });
      expect(component.searchForm.valid).toBeTruthy();
      expect(component.isFormValid).toBeTruthy();
    });

    it('deve verificar se CPF tem valor', () => {
      component.SEARCH_CONTROLS.cpf.setValue('');
      expect(component.hasCpfValue).toBeFalsy();

      component.SEARCH_CONTROLS.cpf.setValue('123.456.789-01');
      expect(component.hasCpfValue).toBeTruthy();
    });
  });

  describe('Aplicação de Máscara CPF', () => {
    it('deve aplicar máscara ao CPF no input', () => {
      const maskSpy = jest.spyOn(MaskUtils, 'applyCPFMask');
      const mockEvent = { target: { value: '12345678901' } };

      component.onCpfInput(mockEvent);

      expect(maskSpy).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('Busca de Pessoa', () => {
    beforeEach(() => {
      // Mock do validador para permitir formulário válido
      jest.spyOn(CustomValidators, 'cpf').mockReturnValue(() => null);
      jest.spyOn(MaskUtils, 'removeMask').mockReturnValue('12345678901');
    });

    it('deve buscar pessoa com sucesso', () => {
      pessoasService.buscarPessoa.mockReturnValue(of(mockPessoa));
      component.searchForm.patchValue({ cpf: '123.456.789-01' });

      component.buscarPessoa();

      expect(component.isLoading).toBeFalsy();
      expect(component.hasSearched).toBeTruthy();
      expect(component.pessoa).toEqual(mockPessoa);
      expect(component.errorMessage).toBe('');
      expect(pessoasService.buscarPessoa).toHaveBeenCalledWith('12345678901');
    });

    it('deve definir loading como true durante a busca', () => {
      pessoasService.buscarPessoa.mockReturnValue(of(mockPessoa));
      component.searchForm.patchValue({ cpf: '123.456.789-01' });

      component.buscarPessoa();

      expect(component.hasSearched).toBeTruthy();
    });

    it('deve tratar erro na busca', () => {
      pessoasService.buscarPessoa.mockReturnValue(throwError(() => new Error('Erro na API')));
      component.searchForm.patchValue({ cpf: '123.456.789-01' });

      component.buscarPessoa();

      expect(component.isLoading).toBeFalsy();
      expect(component.hasSearched).toBeTruthy();
      expect(component.pessoa).toBeNull();
      expect(component.errorMessage).toBe('Pessoa não encontrada. Verifique o CPF digitado.');
    });

    it('não deve buscar se formulário for inválido', () => {
      component.searchForm.patchValue({ cpf: '' });
      const markTouchedSpy = jest.spyOn(component as any, 'markFormGroupTouched');

      component.buscarPessoa();

      expect(pessoasService.buscarPessoa).not.toHaveBeenCalled();
      expect(markTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('Limpeza de Busca', () => {
    it('deve limpar busca e resetar estados', () => {
      // Define estados como se uma busca tivesse sido realizada
      component.pessoa = mockPessoa;
      component.hasSearched = true;
      component.isLoading = true;
      component.errorMessage = 'Erro de teste';

      component.limparBusca();

      expect(component.searchForm.get('cpf')?.value).toBeNull();
      expect(component.pessoa).toBeNull();
      expect(component.hasSearched).toBeFalsy();
      expect(component.isLoading).toBeFalsy();
      expect(component.errorMessage).toBe('');
    });

    it('deve executar limparBusca quando novaBusca for chamada', () => {
      const limparSpy = jest.spyOn(component, 'limparBusca');

      component.novaBusca();

      expect(limparSpy).toHaveBeenCalled();
    });
  });

  describe('Navegação', () => {
    it('deve navegar para página inicial', () => {
      component.voltar();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Mensagens de Erro', () => {
    it('deve retornar mensagem de erro para CPF obrigatório', () => {
      const cpfControl = component.searchForm.get('cpf');
      cpfControl?.setErrors({ required: true });
      cpfControl?.markAsTouched();

      const errorMessage = component.getErrorMessage('cpf');
      expect(errorMessage).toBe('CPF é obrigatório');
    });

    it('deve retornar mensagem de erro para CPF inválido', () => {
      const cpfControl = component.searchForm.get('cpf');
      cpfControl?.setErrors({ cpfInvalid: true });
      cpfControl?.markAsTouched();

      const errorMessage = component.getErrorMessage('cpf');
      expect(errorMessage).toBe('CPF inválido');
    });

    it('deve retornar string vazia se não houver erro', () => {
      const cpfControl = component.searchForm.get('cpf');
      cpfControl?.setErrors(null);

      const errorMessage = component.getErrorMessage('cpf');
      expect(errorMessage).toBe('');
    });
  });

  describe('Funcionalidades Adicionais', () => {
    it('deve imprimir tela', () => {
      const printSpy = jest.spyOn(window, 'print').mockImplementation(() => {});

      component.imprimirTela();

      expect(printSpy).toHaveBeenCalled();
    });

    it('deve excluir pessoa com sucesso', () => {
      component.pessoa = mockPessoa;
      pessoasService.excluirPessoa.mockReturnValue(of(void 0));
      const limparSpy = jest.spyOn(component, 'limparBusca');

      component.excluirDadosPessoa('12345678901');

      expect(pessoasService.excluirPessoa).toHaveBeenCalledWith('12345678901');
      expect(limparSpy).toHaveBeenCalled();
    });

    it('deve tratar erro ao excluir pessoa', () => {
      component.pessoa = mockPessoa;
      pessoasService.excluirPessoa.mockReturnValue(throwError(() => new Error('Erro ao excluir')));

      component.excluirDadosPessoa('12345678901');

      expect(component.errorMessage).toBe('Erro ao excluir pessoa.');
      expect(component.isLoading).toBeFalsy();
    });

    it('não deve excluir se pessoa for null', () => {
      component.pessoa = null;

      component.excluirDadosPessoa('12345678901');

      expect(pessoasService.excluirPessoa).not.toHaveBeenCalled();
    });
  });

  describe('Template Integration', () => {
    it('deve renderizar formulário de busca', () => {
      expect(spectator.query('[data-testid="search-form"]')).toBeTruthy();
    });

    it('deve renderizar campo CPF', () => {
      expect(spectator.query('#cpf-busca')).toBeTruthy();
    });

    it('deve renderizar botão de busca', () => {
      expect(spectator.query('[data-testid="btn-buscar"]')).toBeTruthy();
    });

    it('deve renderizar botão de limpar', () => {
      expect(spectator.query('[data-testid="btn-limpar"]')).toBeTruthy();
    });

    it('deve mostrar loading quando isLoading for true', () => {
      component.isLoading = true;
      spectator.detectChanges();

      expect(spectator.query('[data-testid="loading-section"]')).toBeTruthy();
    });

    it('deve mostrar dados da pessoa quando pessoa existir', () => {
      component.pessoa = mockPessoa;
      component.hasSearched = true;
      component.errorMessage = '';
      spectator.detectChanges();

      expect(spectator.query('[data-testid="pessoa-dados"]')).toBeTruthy();
    });

    it('deve mostrar mensagem de erro quando houver erro', () => {
      component.hasSearched = true;
      component.errorMessage = 'Pessoa não encontrada';
      component.isLoading = false;
      spectator.detectChanges();

      expect(spectator.query('[data-testid="error-section"]')).toBeTruthy();
    });
  });

  describe('Interações do Usuário', () => {
    it('deve chamar buscarPessoa quando botão de busca for clicado', () => {
      const buscarSpy = jest.spyOn(component, 'buscarPessoa');

      spectator.click('[data-testid="btn-buscar"]');

      expect(buscarSpy).toHaveBeenCalled();
    });

    it('deve chamar limparBusca quando botão de limpar for clicado', () => {
      const limparSpy = jest.spyOn(component, 'limparBusca');

      spectator.click('[data-testid="btn-limpar"]');

      expect(limparSpy).toHaveBeenCalled();
    });

    it('deve aplicar máscara quando usuario digitar no campo CPF', () => {
      const maskSpy = jest.spyOn(MaskUtils, 'applyCPFMask');
      const input = spectator.query('#cpf-busca') as HTMLInputElement;

      spectator.typeInElement('12345678901', input);

      expect(maskSpy).toHaveBeenCalled();
    });
  });
});
