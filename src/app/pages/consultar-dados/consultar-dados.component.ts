import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { PessoasService } from '@services/pessoas.service';
import { PessoaDados } from '../../core/interfaces/pessoas.interface';
import { MaskUtils } from '../../core/utils/mask.utils';
import { CustomValidators } from '../../core/validators/custom-validators';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-consultar-dados',
  templateUrl: './consultar-dados.component.html',
  styleUrls: ['./consultar-dados.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FormsModule, ButtonModule, AutoCompleteModule, SelectModule, ReactiveFormsModule, InputTextModule]
})
export class ConsultarDadosComponent {
  private destroyRef = inject(DestroyRef);

  // Form para busca por CPF
  public searchForm: FormGroup;
  public readonly SEARCH_CONTROLS = {
    cpf: new FormControl<string | null>(
      { value: null, disabled: false },
      [Validators.required, CustomValidators.cpf()]
    )
  };

  // Estados da tela
  public isLoading = false;
  public hasSearched = false;
  public pessoa: PessoaDados | null = null;
  public errorMessage: string = '';

  constructor(
    private readonly pessoaService: PessoasService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService
  ) {
    this.searchForm = this.formBuilder.group(this.SEARCH_CONTROLS);
  }

  // Aplicar máscara no CPF
  onCpfInput(event: any): void {
    MaskUtils.applyCPFMask(event);
  }

  // Buscar pessoa por CPF
  buscarPessoa(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;
      this.hasSearched = true;
      this.errorMessage = '';
      this.pessoa = null;

      const cpfLimpo = MaskUtils.removeMask(this.SEARCH_CONTROLS.cpf.value || '');

      // Implementação real com service:
      this.pessoaService.buscarPessoa(cpfLimpo)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (pessoa: PessoaDados) => {
            this.pessoa = pessoa;
            this.isLoading = false;
          },
          error: () => {
            this.errorMessage = 'Pessoa não encontrada. Verifique o CPF digitado.';
            this.isLoading = false;
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Limpar busca
  limparBusca(): void {
    this.searchForm.reset();
    this.pessoa = null;
    this.hasSearched = false;
    this.isLoading = false;
    this.errorMessage = '';
  }

  // Nova busca
  novaBusca(): void {
    this.limparBusca();
  }

  // Voltar para página inicial
  voltar(): void {
    this.router.navigate(['/']);
  }

  // Marcar campos como tocados para mostrar erros
  private markFormGroupTouched(): void {
    Object.keys(this.SEARCH_CONTROLS).forEach(key => {
      const control = this.searchForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Obter mensagem de erro
  getErrorMessage(fieldName: string): string {
    const control = this.searchForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'CPF é obrigatório';
      }
      if (control.errors['cpfInvalid']) {
        return 'CPF inválido';
      }
    }
    return '';
  }

  imprimirTela(): void {
    window.print()
  }

  excluirDadosPessoa(cpf: string): void {
    if (this.pessoa) {
      this.pessoaService.excluirPessoa(cpf)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.limparBusca();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Pessoa excluída com sucesso.',
              key: 'cadastro'
            });
          },
          error: (error) => {
            this.errorMessage = 'Erro ao excluir pessoa.';
            this.isLoading = false;
          }
        });
    }
  }

  // Getter para facilitar acesso ao formulário válido
  get isFormValid(): boolean {
    return this.searchForm.valid;
  }

  // Getter para verificar se CPF tem valor
  get hasCpfValue(): boolean {
    return !!this.SEARCH_CONTROLS.cpf.value?.trim();
  }
}
