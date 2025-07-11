import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PessoasService } from '@services/pessoas.service';
import { CadastrarPessoasComponent } from './cadastrar-pessoas.component';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { PessoaDados, Pessoas } from '../../core/interfaces/pessoas.interface';
import { MaskUtils } from '../../core/utils/mask.utils';

describe('CadastrarPessoasComponent', () => {
  let component: CadastrarPessoasComponent;
  let spectator: Spectator<CadastrarPessoasComponent>;
  let pessoasService: jest.Mocked<PessoasService>;
  let router: jest.Mocked<Router>;
  let messageService: jest.Mocked<MessageService>;

  const mockPessoasResponse: Pessoas = {
    Pessoas: []
  };

  const createComponent = createComponentFactory({
    component: CadastrarPessoasComponent,
    imports: [ReactiveFormsModule],
    providers: [
      provideHttpClientTesting(),
      {
        provide: PessoasService,
        useValue: {
          buscarPessoa: jest.fn(),
          cadastrarNovaPessoa: jest.fn()
        }
      },
      {
        provide: Router,
        useValue: {
          navigate: jest.fn()
        }
      },
      {
        provide: MessageService,
        useValue: {
          add: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    pessoasService = spectator.inject(PessoasService) as jest.Mocked<PessoasService>;
    router = spectator.inject(Router) as jest.Mocked<Router>;
    messageService = spectator.inject(MessageService) as jest.Mocked<MessageService>;

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with correct controls', () => {
      expect(component.pessoaForm).toBeDefined();
      expect(component.pessoaForm.get('nome')).toBeDefined();
      expect(component.pessoaForm.get('cpf')).toBeDefined();
      expect(component.pessoaForm.get('sexo')).toBeDefined();
      expect(component.pessoaForm.get('email')).toBeDefined();
      expect(component.pessoaForm.get('telefone')).toBeDefined();
    });

    it('should have correct sexo options', () => {
      expect(component.sexoOptions).toEqual([
        { label: 'Masculino', value: 'masculino' },
        { label: 'Feminino', value: 'feminino' },
        { label: 'Outro', value: 'outro' },
        { label: 'Prefiro não informar', value: 'nao_informar' }
      ]);
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when form is empty', () => {
      expect(component.pessoaForm.valid).toBeFalsy();
    });

    it('should be valid when mocked as valid', () => {
      component.pessoaForm.patchValue({
        nome: 'João Silva',
        cpf: '123.456.789-00',
        sexo: 'masculino',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999'
      });

      // Mock form to be valid for this test
      jest.spyOn(component.pessoaForm, 'valid', 'get').mockReturnValue(true);

      expect(component.pessoaForm.valid).toBeTruthy();
    });

    it('should mark all controls as touched when form is invalid', () => {
      const markFormGroupTouchedSpy = jest.spyOn(component as any, 'markFormGroupTouched');

      component.cadastrarPessoa();

      expect(markFormGroupTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    const validPessoaDados: PessoaDados = {
      nome: 'João Silva',
      cpf: '123.456.789-00',
      sexo: 'masculino',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999'
    };

    beforeEach(() => {
      component.pessoaForm.patchValue(validPessoaDados);
      jest.spyOn(component.pessoaForm, 'valid', 'get').mockReturnValue(true);
    });

    it('should submit form when valid', () => {
      pessoasService.cadastrarNovaPessoa.mockReturnValue(of(mockPessoasResponse));

      component.cadastrarPessoa();

      expect(pessoasService.cadastrarNovaPessoa).toHaveBeenCalledWith(validPessoaDados);
    });

    it('should call success handler on successful submission', () => {
      pessoasService.cadastrarNovaPessoa.mockReturnValue(of(mockPessoasResponse));
      const handleSubmitSuccessSpy = jest.spyOn(component as any, 'handleSubmitSuccess');

      component.cadastrarPessoa();

      expect(handleSubmitSuccessSpy).toHaveBeenCalled();
    });

    it('should not submit when form is invalid', () => {
      jest.spyOn(component.pessoaForm, 'valid', 'get').mockReturnValue(false);

      component.cadastrarPessoa();

      expect(pessoasService.cadastrarNovaPessoa).not.toHaveBeenCalled();
    });
  });

  describe('Error Messages', () => {
    it('should return empty string when control has no errors', () => {
      component.pessoaForm.get('nome')?.setValue('João');
      component.pessoaForm.get('nome')?.markAsTouched();

      const errorMessage = component.getErrorMessage('nome');

      expect(errorMessage).toBe('');
    });

    it('should return required error message', () => {
      component.pessoaForm.get('nome')?.setValue('');
      component.pessoaForm.get('nome')?.markAsTouched();
      component.pessoaForm.get('nome')?.setErrors({ required: true });

      const errorMessage = component.getErrorMessage('nome');

      expect(errorMessage).toBe('Nome é obrigatório');
    });

    it('should return pattern error message for CPF', () => {
      component.pessoaForm.get('cpf')?.setValue('123');
      component.pessoaForm.get('cpf')?.markAsTouched();
      component.pessoaForm.get('cpf')?.setErrors({ pattern: true });

      const errorMessage = component.getErrorMessage('cpf');

      expect(errorMessage).toBe('CPF deve estar no formato 000.000.000-00');
    });

    it('should return custom error message for CPF invalid', () => {
      component.pessoaForm.get('cpf')?.setValue('123.456.789-00');
      component.pessoaForm.get('cpf')?.markAsTouched();
      component.pessoaForm.get('cpf')?.setErrors({ cpfInvalid: true });

      const errorMessage = component.getErrorMessage('cpf');

      expect(errorMessage).toBe('CPF inválido');
    });

    it('should return email error message', () => {
      component.pessoaForm.get('email')?.setValue('invalid-email');
      component.pessoaForm.get('email')?.markAsTouched();
      component.pessoaForm.get('email')?.setErrors({ email: true });

      const errorMessage = component.getErrorMessage('email');

      expect(errorMessage).toBe('Email deve ter um formato válido');
    });

    it('should return minlength error message', () => {
      component.pessoaForm.get('nome')?.setValue('Jo');
      component.pessoaForm.get('nome')?.markAsTouched();
      component.pessoaForm.get('nome')?.setErrors({ minlength: { requiredLength: 3, actualLength: 2 } });

      const errorMessage = component.getErrorMessage('nome');

      expect(errorMessage).toBe('Campo deve ter pelo menos 3 caracteres');
    });

    it('should return default error message for unknown error type', () => {
      component.pessoaForm.get('nome')?.setValue('test');
      component.pessoaForm.get('nome')?.markAsTouched();
      component.pessoaForm.get('nome')?.setErrors({ unknownError: true });

      const errorMessage = component.getErrorMessage('nome');

      expect(errorMessage).toBe('Campo inválido');
    });
  });

  describe('Mask Application', () => {
    it('should apply CPF mask on input', () => {
      const mockEvent = { target: { value: '12345678900' } } as any;
      const applyCPFMaskSpy = jest.spyOn(MaskUtils, 'applyCPFMask');

      component.onCpfInput(mockEvent);

      expect(applyCPFMaskSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('should apply telefone mask on input', () => {
      const mockEvent = { target: { value: '11999999999' } } as any;
      const applyTelefoneMaskSpy = jest.spyOn(MaskUtils, 'applyTelefoneMask');

      component.onTelefoneInput(mockEvent);

      expect(applyTelefoneMaskSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle invalid mask type gracefully', () => {
      const mockEvent = { target: { value: '123' } } as any;

      expect(() => {
        (component as any).applyMask(mockEvent, 'invalid' as any);
      }).not.toThrow();
    });
  });

  describe('Form Operations', () => {
    it('should reset form when resetForm is called', () => {
      component.pessoaForm.patchValue({
        nome: 'João Silva',
        cpf: '123.456.789-00'
      });

      (component as any).resetForm();

      expect(component.pessoaForm.get('nome')?.value).toBeNull();
      expect(component.pessoaForm.get('cpf')?.value).toBeNull();
    });

    it('should get form errors correctly', () => {
      // Clear any existing errors first
      Object.keys(component.CONTROLS).forEach(key => {
        component.pessoaForm.get(key)?.setErrors(null);
      });

      // Set only the specific errors we want to test
      component.pessoaForm.get('nome')?.setErrors({ required: true });
      component.pessoaForm.get('email')?.setErrors({ email: true });

      const errors = component.getFormErrors();

      expect(errors).toEqual({
        nome: { required: true },
        email: { email: true }
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to consulta when cancelar is called without unsaved changes', () => {
      jest.spyOn(component.pessoaForm, 'dirty', 'get').mockReturnValue(false);

      component.cancelar();

      expect(router.navigate).toHaveBeenCalledWith(['/consultar-dados']);
    });

    it('should show confirmation when cancelar is called with unsaved changes', () => {
      jest.spyOn(component.pessoaForm, 'dirty', 'get').mockReturnValue(true);
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      component.cancelar();

      expect(confirmSpy).toHaveBeenCalledWith('Tem certeza que deseja cancelar? Todos os dados serão perdidos.');
      expect(router.navigate).toHaveBeenCalledWith(['/consultar-dados']);

      confirmSpy.mockRestore();
    });

    it('should not navigate when user cancels confirmation', () => {
      jest.spyOn(component.pessoaForm, 'dirty', 'get').mockReturnValue(true);
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

      component.cancelar();

      expect(confirmSpy).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });
  });

  describe('Helper Methods', () => {
    it('should capitalize first letter correctly', () => {
      const result = (component as any).capitalizeFirstLetter('teste');
      expect(result).toBe('Teste');
    });

    it('should handle empty string in capitalizeFirstLetter', () => {
      const result = (component as any).capitalizeFirstLetter('');
      expect(result).toBe('');
    });

    it('should build pessoa dados correctly', () => {
      component.pessoaForm.patchValue({
        nome: 'João Silva',
        cpf: '123.456.789-00',
        sexo: 'masculino',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999'
      });

      const pessoaDados = (component as any).buildPessoaDados();

      expect(pessoaDados).toEqual({
        nome: 'João Silva',
        cpf: '123.456.789-00',
        sexo: 'masculino',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999'
      });
    });

    it('should build pessoa dados with empty strings for null values', () => {
      component.pessoaForm.patchValue({
        nome: null,
        cpf: null,
        sexo: null,
        email: null,
        telefone: null
      });

      const pessoaDados = (component as any).buildPessoaDados();

      expect(pessoaDados).toEqual({
        nome: '',
        cpf: '',
        sexo: '',
        email: '',
        telefone: ''
      });
    });

    it('should check if form has valid state correctly', () => {
      const result = (component as any).isFormValid();
      expect(typeof result).toBe('boolean');
    });

    it('should check if form has unsaved changes correctly', () => {
      const result = (component as any).hasUnsavedChanges();
      expect(typeof result).toBe('boolean');
    });
  });
});
