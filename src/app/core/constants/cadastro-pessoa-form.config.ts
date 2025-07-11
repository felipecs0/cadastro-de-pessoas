import { Validators } from "@angular/forms";
import { PessoaFormFields } from "@interfaces/form-validators.interface";
import { CustomValidators } from "../validators/custom-validators";

export const REGEX_PATTERNS = {
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, // Formato: 000.000.000-00
  TELEFONE: /^(\(\d{2}\)\s?)?[\d\s-]{8,}$/, // Formato: (00) 00000-0000 ou 00000-0000
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
} as const;

export const FORM_FIELD_CONFIGS: PessoaFormFields = {
  nome: {
    required: true,
    disabled: false,
    validators: [Validators.required, Validators.minLength(2)]
  },
  cpf: {
    required: true,
    disabled: false,
    pattern: REGEX_PATTERNS.CPF.source,
    validators: [Validators.required, CustomValidators.cpf()]
  },
  sexo: {
    required: true,
    disabled: false,
    validators: [Validators.required]
  },
  email: {
    required: true,
    disabled: false,
    pattern: REGEX_PATTERNS.EMAIL.source,
    validators: [Validators.required, Validators.email]
  },
  telefone: {
    required: false,
    disabled: false,
    pattern: REGEX_PATTERNS.TELEFONE.source,
    validators: [CustomValidators.telefone()]
  }
};
