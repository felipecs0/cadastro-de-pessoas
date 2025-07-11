import { ValidatorFn } from '@angular/forms';

export interface FormFieldConfig {
  required: boolean;
  disabled: boolean;
  pattern?: string;
  validators: ValidatorFn[];
}

export interface PessoaFormFields {
  nome: FormFieldConfig;
  cpf: FormFieldConfig;
  sexo: FormFieldConfig;
  email: FormFieldConfig;
  telefone: FormFieldConfig;
}

