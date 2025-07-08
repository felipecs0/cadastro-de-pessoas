import { Component, DestroyRef, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Components
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { Carousel } from 'primeng/carousel';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { Avatar } from 'primeng/avatar';
import { Panel } from 'primeng/panel';

import { PessoasService } from '@services/pessoas.service';
import { PessoaDados } from '../../core/interfaces/pessoas.interface';
import { MaskUtils } from '../../core/utils/mask.utils';
import { CustomValidators } from '../../core/validators/custom-validators';

@Component({
  selector: 'app-consultar-dados',
  templateUrl: './consultar-dados.component.html',
  styleUrls: ['./consultar-dados.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    CardModule,
    Carousel,
    Button,
    InputText,
    FloatLabel,
    Message,
    ProgressSpinner,
    Divider,
    Tag,
    Skeleton,
    Avatar,
    Panel
  ]
})
export class ConsultarDadosComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private identificadorPessoa = inject(ActivatedRoute).snapshot.params['id'];

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
  public successMessage: string = '';

  constructor(
    private readonly pessoaService: PessoasService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group(this.SEARCH_CONTROLS);
  }

  ngOnInit(): void {
    // Se veio um ID da rota, buscar automaticamente
    if (this.identificadorPessoa) {
      this.SEARCH_CONTROLS.cpf.setValue(this.identificadorPessoa);
      this.buscarPessoa();
    }
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
      this.successMessage = '';
      this.pessoa = null;

      const cpfLimpo = MaskUtils.removeMask(this.SEARCH_CONTROLS.cpf.value || '');

      // Simular chamada API - substitua por chamada real
      setTimeout(() => {
        // Simular dados da pessoa (substitua por chamada real ao service)
        if (cpfLimpo === '12345678901') {
          this.pessoa = {
            nome: 'João Silva Santos',
            cpf: '123.456.789-01',
            sexo: 'M',
            email: 'joao.silva@email.com',
            telefone: '(11) 99999-8888'
          };
          this.successMessage = 'Pessoa encontrada com sucesso!';
        } else {
          this.errorMessage = 'Pessoa não encontrada. Verifique o CPF digitado.';
        }
        this.isLoading = false;
      }, 1500);

      /* 
      // Implementação real com service:
      this.pessoaService.buscarPorCpf(cpfLimpo)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (pessoa: PessoaDados) => {
            this.pessoa = pessoa;
            this.successMessage = 'Pessoa encontrada com sucesso!';
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Pessoa não encontrada. Verifique o CPF digitado.';
            this.isLoading = false;
            console.error('Erro ao buscar pessoa:', error);
          }
        });
      */
    } else {
      this.markFormGroupTouched();
    }
  }

  // Limpar busca
  limparBusca(): void {
    this.searchForm.reset();
    this.pessoa = null;
    this.hasSearched = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
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

  // Getter para facilitar acesso ao formulário válido
  get isFormValid(): boolean {
    return this.searchForm.valid;
  }

  // Getter para verificar se CPF tem valor
  get hasCpfValue(): boolean {
    return !!this.SEARCH_CONTROLS.cpf.value?.trim();
  }
}
