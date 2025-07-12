import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PessoasService } from '@services/pessoas.service';
import { Router } from '@angular/router';
import { PessoaDados } from '../../core/interfaces/pessoas.interface';
import { FORM_FIELD_CONFIGS } from '../../core/constants/cadastro-pessoa-form.config';
import { MaskUtils } from '../../core/utils/mask.utils';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    InputTextModule
  ]
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
    private readonly pessoasService: PessoasService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {
    this.pessoaForm = this.formBuilder.group(this.CONTROLS);
  }

  cadastrarPessoa(): void {
    if (!this.isFormValid()) {
      this.handleInvalidForm();
      return;
    }

    const pessoaDados = this.buildPessoaDados();
    this.submitPessoa(pessoaDados);
  }

  private isFormValid(): boolean {
    return this.pessoaForm.valid;
  }

  private handleInvalidForm(): void {
    this.markFormGroupTouched();
    this.showErrorMessage('Por favor, corrija os erros no formulário');
  }

  private buildPessoaDados(): PessoaDados {
    const formValue = this.pessoaForm.value;

    return {
      nome: formValue.nome || '',
      cpf: formValue.cpf || '',
      sexo: formValue.sexo || '',
      email: formValue.email || '',
      telefone: formValue.telefone || ''
    };
  }

  private submitPessoa(pessoaDados: PessoaDados): void {
    this.pessoasService.cadastrarNovaPessoa(pessoaDados)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => this.handleSubmitSuccess(),
    });
  }

  private handleSubmitSuccess(): void {
    this.showSuccessMessage('Pessoa cadastrada com sucesso!');
    this.resetForm();
  }

  private resetForm(): void {
    this.pessoaForm.reset();
  }

  private showSuccessMessage(detail: string): void {
    this.showMessage('success', 'Sucesso', detail);
  }

  private showErrorMessage(detail: string): void {
    this.showMessage('error', 'Erro', detail);
  }

  private showInfoMessage(detail: string): void {
    this.showMessage('info', 'Informação', detail);
  }

  private showMessage(severity: 'success' | 'error' | 'info', summary: string, detail: string): void {
    this.messageService.add({
      severity,
      summary,
      detail,
      key: 'cadastro'
    });
  }

  private markFormGroupTouched(): void {
    const controlNames = Object.keys(this.CONTROLS);
    controlNames.forEach(controlName => {
      this.markControlAsTouched(controlName);
    });
  }

  private markControlAsTouched(controlName: string): void {
    const control = this.pessoaForm.get(controlName);
    if (control) {
      control.markAsTouched();
    }
  }

  // Métodos para aplicar máscaras
  onCpfInput(event: Event): void {
    this.applyMask(event, 'cpf');
  }

  onTelefoneInput(event: Event): void {
    this.applyMask(event, 'telefone');
  }

  private applyMask(event: Event, maskType: 'cpf' | 'telefone'): void {
    const maskHandlers = this.getMaskHandlers();
    const handler = maskHandlers[maskType];

    if (handler) {
      handler(event);
    }
  }

  private getMaskHandlers(): Record<string, (event: Event) => void> {
    return {
      cpf: MaskUtils.applyCPFMask,
      telefone: MaskUtils.applyTelefoneMask
    };
  }

  // Método para obter mensagens de erro específicas
  getErrorMessage(fieldName: string): string {
    const control = this.pessoaForm.get(fieldName);

    if (!this.hasControlErrors(control)) {
      return '';
    }

    const errors = control!.errors!;
    return this.getErrorMessageByType(errors, fieldName);
  }

  private hasControlErrors(control: any): boolean {
    return control?.errors && control.touched;
  }

  private getErrorMessageByType(errors: any, fieldName: string): string {
    const errorHandlers = this.getErrorHandlers();

    for (const errorType of Object.keys(errors)) {
      const handler = errorHandlers[errorType];
      if (handler) {
        return handler(errors[errorType], fieldName);
      }
    }

    return 'Campo inválido';
  }

  private getErrorHandlers(): Record<string, (error: any, fieldName: string) => string> {
    return {
      required: (_, fieldName) => this.getRequiredErrorMessage(fieldName),
      pattern: (_, fieldName) => this.getPatternErrorMessage(fieldName),
      cpfInvalid: () => 'CPF inválido',
      telefoneInvalid: () => 'Telefone deve ter 10 ou 11 dígitos',
      email: () => 'Email deve ter um formato válido',
      minlength: (error) => this.getMinLengthErrorMessage(error)
    };
  }

  private getRequiredErrorMessage(fieldName: string): string {
    const fieldLabels = this.getFieldLabels();
    const label = fieldLabels[fieldName] || this.capitalizeFirstLetter(fieldName);
    return `${label} é obrigatório`;
  }

  private getPatternErrorMessage(fieldName: string): string {
    const patternMessages = this.getPatternMessages();
    return patternMessages[fieldName] || 'Formato inválido';
  }

  private getPatternMessages(): Record<string, string> {
    return {
      cpf: 'CPF deve estar no formato 000.000.000-00',
      telefone: 'Telefone deve estar no formato (00) 00000-0000',
      email: 'Email deve ter um formato válido'
    };
  }

  private getMinLengthErrorMessage(minLengthError: any): string {
    const requiredLength = minLengthError.requiredLength;
    return `Campo deve ter pelo menos ${requiredLength} caracteres`;
  }

  private getFieldLabels(): Record<string, string> {
    return {
      nome: 'Nome',
      cpf: 'CPF',
      sexo: 'Sexo',
      email: 'E-mail',
      telefone: 'Telefone'
    };
  }

  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Método para debug (remover em produção)
  getFormErrors(): Record<string, any> {
    const errors: Record<string, any> = {};

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
    this.resetForm();
    this.showInfoMessage('Todos os campos foram resetados');
  }

  // Método para cancelar e voltar
  cancelar(): void {
    if (this.hasUnsavedChanges()) {
      this.confirmAndNavigate();
    } else {
      this.navigateToConsulta();
    }
  }

  private hasUnsavedChanges(): boolean {
    return this.pessoaForm.dirty;
  }

  private confirmAndNavigate(): void {
    const confirmationMessage = this.getUnsavedChangesMessage();

    if (this.confirmNavigation(confirmationMessage)) {
      this.navigateToConsulta();
    }
  }

  private getUnsavedChangesMessage(): string {
    return 'Tem certeza que deseja cancelar? Todos os dados serão perdidos.';
  }

  private confirmNavigation(message: string): boolean {
    return confirm(message);
  }

  private navigateToConsulta(): void {
    this.router.navigate(['/consultar-dados']);
  }
}
