import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PessoasService } from '@services/pessoas.service';
import { Router } from '@angular/router';
import { PessoaDados } from '../../core/interfaces/pessoas.interface';
import { FORM_FIELD_CONFIGS } from '../../core/constants/cadastro-pessoa-form.config';
import { MaskUtils } from '../../core/utils/mask.utils';
import { Toast } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cadastrar-pessoas',
  templateUrl: './cadastrar-pessoas.component.html',
  styleUrls: ['./cadastrar-pessoas.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    Toast,
    InputTextModule
  ],
  providers: [MessageService]
})
export class CadastrarPessoasComponent {
  private destroyRef = inject(DestroyRef);

  public readonly sexoOptions = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Feminino', value: 'feminino' },
    { label: 'Outro', value: 'outro' },
    { label: 'Prefiro não informar', value: 'nao_informar' }
  ];

  public readonly CONTROLS = {
    nome: new FormControl<string | null>(
      { value: null, disabled: FORM_FIELD_CONFIGS.nome.disabled },
      FORM_FIELD_CONFIGS.nome.validators
    ),
    cpf: new FormControl<string | null>(
      { value: null, disabled: FORM_FIELD_CONFIGS.cpf.disabled },
      FORM_FIELD_CONFIGS.cpf.validators
    ),
    sexo: new FormControl<string | null>(
      { value: null, disabled: FORM_FIELD_CONFIGS.sexo.disabled },
      FORM_FIELD_CONFIGS.sexo.validators
    ),
    email: new FormControl<string | null>(
      { value: null, disabled: FORM_FIELD_CONFIGS.email.disabled },
      FORM_FIELD_CONFIGS.email.validators
    ),
    telefone: new FormControl<string | null>(
      { value: null, disabled: FORM_FIELD_CONFIGS.telefone.disabled },
      FORM_FIELD_CONFIGS.telefone.validators
    ),
  };

  public pessoaForm: FormGroup;

  constructor(
    private readonly pessoaDados: PessoasService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {
    this.pessoaForm = this.formBuilder.group(this.CONTROLS);
  }

  verDadosPessoa() {
    if (this.pessoaForm.valid) {
      const pessoaDados: PessoaDados = {
        nome: this.CONTROLS.nome.value || '',
        cpf: this.CONTROLS.cpf.value || '',
        sexo: this.CONTROLS.sexo.value || '',
        email: this.CONTROLS.email.value || '',
        telefone: this.CONTROLS.telefone.value || ''
      };

      console.log('Dados da pessoa:', pessoaDados);

      // Exibir mensagem de sucesso
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Pessoa cadastrada com sucesso!',
        key: 'cadastro'
      });

      // Resetar formulário após sucesso
      this.pessoaForm.reset();

    } else {
      console.log('Formulário inválido');
      this.markFormGroupTouched();

      // Exibir mensagem de erro
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, corrija os erros no formulário',
        key: 'cadastro'
      });
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.CONTROLS).forEach(key => {
      const control = this.pessoaForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Métodos para aplicar máscaras
  onCpfInput(event: any): void {
    MaskUtils.applyCPFMask(event);
  }

  onTelefoneInput(event: any): void {
    MaskUtils.applyTelefoneMask(event);
  }

  // Método para obter mensagens de erro específicas
  getErrorMessage(fieldName: string): string {
    const control = this.pessoaForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        const fieldLabels: { [key: string]: string } = {
          'nome': 'Nome',
          'cpf': 'CPF',
          'sexo': 'Sexo',
          'email': 'E-mail',
          'telefone': 'Telefone'
        };
        return `${fieldLabels[fieldName] || fieldName} é obrigatório`;
      }
      if (control.errors['pattern']) {
        switch (fieldName) {
          case 'cpf':
            return 'CPF deve estar no formato 000.000.000-00';
          case 'telefone':
            return 'Telefone deve estar no formato (00) 00000-0000';
          case 'email':
            return 'Email deve ter um formato válido';
          default:
            return 'Formato inválido';
        }
      }
      if (control.errors['cpfInvalid']) {
        return 'CPF inválido';
      }
      if (control.errors['telefoneInvalid']) {
        return 'Telefone deve ter 10 ou 11 dígitos';
      }
      if (control.errors['email']) {
        return 'Email deve ter um formato válido';
      }
      if (control.errors['minlength']) {
        return `Campo deve ter pelo menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  // Método para debug (remover em produção)
  getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.CONTROLS).forEach(key => {
      const control = this.pessoaForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  // Método para limpar formulário
  limparFormulario(): void {
    this.pessoaForm.reset();
    this.messageService.add({
      severity: 'info',
      summary: 'Formulário limpo',
      detail: 'Todos os campos foram resetados',
      key: 'cadastro'
    });
  }

  // Método para cancelar e voltar
  cancelar(): void {
    if (this.pessoaForm.dirty) {
      // Implementar modal de confirmação se necessário
      if (confirm('Tem certeza que deseja cancelar? Todos os dados serão perdidos.')) {
        this.router.navigate(['/consultar-dados']);
      }
    } else {
      this.router.navigate(['/consultar-dados']);
    }
  }
}
