import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static cpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Se não há valor, deixe o required validator lidar com isso
      }

      const cpf = control.value.replace(/\D/g, '');

      if (cpf.length !== 11) {
        return { cpfInvalid: true };
      }

      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1+$/.test(cpf)) {
        return { cpfInvalid: true };
      }

      // Validação do primeiro dígito verificador
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let firstDigit = 11 - (sum % 11);
      if (firstDigit >= 10) firstDigit = 0;

      if (parseInt(cpf.charAt(9)) !== firstDigit) {
        return { cpfInvalid: true };
      }

      // Validação do segundo dígito verificador
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
      }
      let secondDigit = 11 - (sum % 11);
      if (secondDigit >= 10) secondDigit = 0;

      if (parseInt(cpf.charAt(10)) !== secondDigit) {
        return { cpfInvalid: true };
      }

      return null; // CPF válido
    };
  }

  static telefone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const telefone = control.value.replace(/\D/g, '');

      // Verifica se tem pelo menos 10 dígitos (telefone fixo) ou 11 (celular)
      if (telefone.length < 10 || telefone.length > 11) {
        return { telefoneInvalid: true };
      }

      return null; // Telefone válido
    };
  }
}
