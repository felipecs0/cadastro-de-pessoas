import { Component, DestroyRef, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { Button } from 'primeng/button';
import { PessoasService } from '@services/pessoas.service';
import { estadosDoBrasil } from 'src/app/core/constants/estados.constants';
import { Estado } from '../../core/interfaces/estados.interface';
import { Localidade } from '../../core/interfaces/localidade.interface';
import { Router } from '@angular/router';
import { FloatLabel } from "primeng/floatlabel"
import { PessoaDados } from '../../core/interfaces/pessoas.interface';
import { REGEX_PATTERNS, FORM_FIELD_CONFIGS } from '../../core/interfaces/form-validators.interface';
import { MaskUtils } from '../../core/utils/mask.utils';

@Component({
  selector    : 'app-cadastrar-pessoas',
  templateUrl : './cadastrar-pessoas.component.html',
  styleUrls   : ['./cadastrar-pessoas.component.scss'],
  standalone  : true,
  imports     : [FormsModule, Button, SelectModule, FloatLabel, ReactiveFormsModule]
})
export class CadastrarPessoasComponent {
  private destroyRef = inject(DestroyRef);

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
  public estadoSelecionado: Estado | null = null;
  public cidadeSelecionada: Localidade | null = null;
  public listaEstadosBrasil: Estado[] = estadosDoBrasil;
  public listaCidades: Localidade[] | undefined;

  constructor(
    private readonly pessoaDados: PessoasService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    this.pessoaForm = this.formBuilder.group(this.CONTROLS)
  }

  buscarCidades(event: SelectChangeEvent) {
    this.pessoaForm.get('cidade')?.enable();
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
      // Aqui você pode fazer o que quiser com os dados (salvar, navegar, etc.)
    } else {
      console.log('Formulário inválido');
      this.markFormGroupTouched();
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

  // Método para validar CPF
  isValidCPF(cpf: string): boolean {
    const cleanCpf = MaskUtils.removeMask(cpf);

    if (cleanCpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCpf)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;

    if (parseInt(cleanCpf.charAt(9)) !== firstDigit) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;

    return parseInt(cleanCpf.charAt(10)) === secondDigit;
  }

  // Método para obter mensagens de erro específicas
  getErrorMessage(fieldName: string): string {
    const control = this.pessoaForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName} é obrigatório`;
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
        return `${fieldName} deve ter pelo menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

}
