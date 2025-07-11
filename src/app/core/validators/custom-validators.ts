import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Classe utilitária para validadores customizados de formulários
 */
export class CustomValidators {
  // Constantes para validação de CPF
  private static readonly CPF_LENGTH = 11;
  private static readonly CPF_FIRST_DIGIT_MULTIPLIER_BASE = 10;
  private static readonly CPF_SECOND_DIGIT_MULTIPLIER_BASE = 11;
  private static readonly CPF_FIRST_DIGIT_POSITION = 9;
  private static readonly CPF_SECOND_DIGIT_POSITION = 10;
  private static readonly CPF_FIRST_DIGIT_LOOP_LIMIT = 9;
  private static readonly CPF_SECOND_DIGIT_LOOP_LIMIT = 10;
  private static readonly MODULO_DIVISOR = 11;
  private static readonly DIGIT_THRESHOLD = 10;

  // Constantes para validação de telefone
  private static readonly PHONE_MIN_LENGTH = 10; // Telefone fixo
  private static readonly PHONE_MAX_LENGTH = 11; // Celular

  // Regex para remover caracteres não numéricos
  private static readonly NON_NUMERIC_REGEX = /\D/g;
  
  // Regex para verificar se todos os dígitos são iguais
  private static readonly REPEATED_DIGITS_REGEX = /^(\d)\1+$/;

  /**
   * Validador para CPF (Cadastro de Pessoa Física)
   * Valida se o CPF está no formato correto e possui dígitos verificadores válidos
   * 
   * @returns ValidatorFn - Função de validação que retorna erro ou null
   */
  static cpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!CustomValidators.hasValue(control.value)) {
        return null; // Se não há valor, deixe o required validator lidar com isso
      }

      const cleanCpf = CustomValidators.removeNonNumericCharacters(control.value);

      if (!CustomValidators.hasValidCpfLength(cleanCpf)) {
        return { cpfInvalid: true };
      }

      if (CustomValidators.hasAllSameDigits(cleanCpf)) {
        return { cpfInvalid: true };
      }

      if (!CustomValidators.hasValidCpfDigits(cleanCpf)) {
        return { cpfInvalid: true };
      }

      return null; // CPF válido
    };
  }

  /**
   * Validador para telefone
   * Valida se o telefone tem entre 10 e 11 dígitos (telefone fixo ou celular)
   * 
   * @returns ValidatorFn - Função de validação que retorna erro ou null
   */
  static telefone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!CustomValidators.hasValue(control.value)) {
        return null;
      }

      const cleanPhone = CustomValidators.removeNonNumericCharacters(control.value);

      if (!CustomValidators.hasValidPhoneLength(cleanPhone)) {
        return { telefoneInvalid: true };
      }

      return null; // Telefone válido
    };
  }

  /**
   * Verifica se um valor existe e não está vazio
   */
  private static hasValue(value: any): boolean {
    return value && value.trim().length > 0;
  }

  /**
   * Remove todos os caracteres não numéricos de uma string
   */
  private static removeNonNumericCharacters(value: string): string {
    return value.replace(CustomValidators.NON_NUMERIC_REGEX, '');
  }

  /**
   * Verifica se o CPF tem o comprimento válido
   */
  private static hasValidCpfLength(cpf: string): boolean {
    return cpf.length === CustomValidators.CPF_LENGTH;
  }

  /**
   * Verifica se o telefone tem comprimento válido
   */
  private static hasValidPhoneLength(phone: string): boolean {
    return phone.length >= CustomValidators.PHONE_MIN_LENGTH && 
           phone.length <= CustomValidators.PHONE_MAX_LENGTH;
  }

  /**
   * Verifica se todos os dígitos do CPF são iguais
   */
  private static hasAllSameDigits(cpf: string): boolean {
    return CustomValidators.REPEATED_DIGITS_REGEX.test(cpf);
  }

  /**
   * Valida os dígitos verificadores do CPF
   */
  private static hasValidCpfDigits(cpf: string): boolean {
    const firstDigit = CustomValidators.calculateCpfFirstDigit(cpf);
    const secondDigit = CustomValidators.calculateCpfSecondDigit(cpf);

    return CustomValidators.getCpfDigitAtPosition(cpf, CustomValidators.CPF_FIRST_DIGIT_POSITION) === firstDigit &&
           CustomValidators.getCpfDigitAtPosition(cpf, CustomValidators.CPF_SECOND_DIGIT_POSITION) === secondDigit;
  }

  /**
   * Calcula o primeiro dígito verificador do CPF
   */
  private static calculateCpfFirstDigit(cpf: string): number {
    const sum = CustomValidators.calculateWeightedSum(
      cpf, 
      CustomValidators.CPF_FIRST_DIGIT_LOOP_LIMIT, 
      CustomValidators.CPF_FIRST_DIGIT_MULTIPLIER_BASE
    );
    
    return CustomValidators.calculateVerificationDigit(sum);
  }

  /**
   * Calcula o segundo dígito verificador do CPF
   */
  private static calculateCpfSecondDigit(cpf: string): number {
    const sum = CustomValidators.calculateWeightedSum(
      cpf, 
      CustomValidators.CPF_SECOND_DIGIT_LOOP_LIMIT, 
      CustomValidators.CPF_SECOND_DIGIT_MULTIPLIER_BASE
    );
    
    return CustomValidators.calculateVerificationDigit(sum);
  }

  /**
   * Calcula a soma ponderada para os dígitos do CPF
   */
  private static calculateWeightedSum(cpf: string, limit: number, multiplierBase: number): number {
    let sum = 0;
    for (let i = 0; i < limit; i++) {
      sum += CustomValidators.getCpfDigitAtPosition(cpf, i) * (multiplierBase - i);
    }
    return sum;
  }

  /**
   * Calcula o dígito verificador baseado na soma
   */
  private static calculateVerificationDigit(sum: number): number {
    const digit = CustomValidators.MODULO_DIVISOR - (sum % CustomValidators.MODULO_DIVISOR);
    return digit >= CustomValidators.DIGIT_THRESHOLD ? 0 : digit;
  }

  /**
   * Obtém o dígito numérico do CPF em uma posição específica
   */
  private static getCpfDigitAtPosition(cpf: string, position: number): number {
    return parseInt(cpf.charAt(position), 10);
  }
}
