# Guia de Implementação: Consistência em Formulários com Interfaces

Este guia mostra como implementar consistência em formulários Angular usando interfaces, validadores customizados e máscaras.

## 🏗️ Estrutura Criada

### 1. **Interfaces para Configuração de Formulários**
- `/core/interfaces/form-validators.interface.ts` - Define configurações padronizadas para campos
- `/core/interfaces/estados.interface.ts` - Interface para estados brasileiros
- `/core/interfaces/localidade.interface.ts` - Interface para localidades/cidades

### 2. **Validadores Customizados**
- `/core/validators/custom-validators.ts` - Validadores para CPF e telefone

### 3. **Utilitários de Máscara**
- `/core/utils/mask.utils.ts` - Funções para aplicar máscaras em tempo real

### 4. **Constantes**
- `/core/constants/estados.constants.ts` - Lista de estados brasileiros

## 🎯 Principais Benefícios

### ✅ **Consistência Garantida**
```typescript
// Todos os formulários usam a mesma configuração
export const FORM_FIELD_CONFIGS: PessoaFormFields = {
  cpf: {
    required: true,
    disabled: false,
    pattern: REGEX_PATTERNS.CPF.source,
    validators: [Validators.required, Validators.pattern(REGEX_PATTERNS.CPF), CustomValidators.cpf()]
  }
  // ... outros campos
}
```

### ✅ **Validação com Regex Patterns**
```typescript
export const REGEX_PATTERNS = {
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,     // 000.000.000-00
  TELEFONE: /^(\(\d{2}\)\s?)?[\d\s-]{8,}$/, // (00) 00000-0000
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};
```

### ✅ **Máscaras Automáticas**
```typescript
// No template
(input)="onCpfInput($event)"
(input)="onTelefoneInput($event)"

// No componente
onCpfInput(event: any): void {
  MaskUtils.applyCPFMask(event);
}
```

### ✅ **Validação de CPF Completa**
- Verifica formato (000.000.000-00)
- Valida dígitos verificadores
- Rejeita CPFs com todos os dígitos iguais

## 📱 Como Usar

### 1. **Configurar o Componente**
```typescript
export class SeuComponent {
  public readonly CONTROLS = {
    cpf: new FormControl<string | null>(
      { value: null, disabled: FORM_FIELD_CONFIGS.cpf.disabled }, 
      FORM_FIELD_CONFIGS.cpf.validators
    ),
    telefone: new FormControl<string | null>(
      { value: null, disabled: FORM_FIELD_CONFIGS.telefone.disabled }, 
      FORM_FIELD_CONFIGS.telefone.validators
    )
  };

  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(this.CONTROLS);
  }
}
```

### 2. **Template com Validação**
```html
<!-- Campo CPF com máscara e validação -->
<input 
  formControlName="cpf" 
  placeholder="000.000.000-00"
  (input)="onCpfInput($event)"
  [class.ng-invalid]="form.get('cpf')?.invalid && form.get('cpf')?.touched" />
<small class="p-error" *ngIf="getErrorMessage('cpf')">
  {{ getErrorMessage('cpf') }}
</small>
```

### 3. **Mensagens de Erro Personalizadas**
```typescript
getErrorMessage(fieldName: string): string {
  const control = this.form.get(fieldName);
  if (control?.errors && control.touched) {
    if (control.errors['cpfInvalid']) return 'CPF inválido';
    if (control.errors['telefoneInvalid']) return 'Telefone deve ter 10 ou 11 dígitos';
    // ... outras validações
  }
  return '';
}
```

## 🔧 Extensibilidade

### Adicionar Novos Campos
1. **Atualize a interface:**
```typescript
export interface PessoaFormFields {
  // ... campos existentes
  novoCampo: FormFieldConfig;
}
```

2. **Configure as validações:**
```typescript
export const FORM_FIELD_CONFIGS: PessoaFormFields = {
  // ... configs existentes
  novoCampo: {
    required: true,
    disabled: false,
    validators: [Validators.required, Validators.minLength(3)]
  }
};
```

### Criar Novos Validadores
```typescript
export class CustomValidators {
  static meuValidador(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Sua lógica de validação
      return null; // ou { meuErro: true }
    };
  }
}
```

## 🎨 Características da Solução

### ⚡ **Type Safety**
- Todas as interfaces são tipadas
- IntelliSense completo
- Detecção de erros em tempo de compilação

### 🔄 **Reutilização**
- Configurações centralizadas
- Validadores reutilizáveis
- Máscaras padronizadas

### 🛡️ **Robustez**
- Validação no frontend e backend
- Máscaras que melhoram UX
- Mensagens de erro consistentes

### 📈 **Manutenibilidade**
- Código organizado em modules
- Separação de responsabilidades
- Fácil de testar

## 🚀 Próximos Passos

1. Implementar validações no backend
2. Adicionar testes unitários
3. Criar documentação de API
4. Implementar logs de auditoria
5. Adicionar internacionalização (i18n)

---

**Nota:** Esta estrutura garante que todos os formulários do projeto mantenham consistência na validação, formatação e experiência do usuário.
