/**
 * Classe utilitária para aplicação de máscaras em campos de formulário
 * Fornece métodos para formatação e aplicação de máscaras em CPF e telefone
 */
export class MaskUtils {
  // Constantes para CPF
  private static readonly CPF_MAX_LENGTH = 11;

  // Constantes para telefone
  private static readonly PHONE_LANDLINE_MAX_LENGTH = 10;
  private static readonly PHONE_MOBILE_MAX_LENGTH = 11;

  // Regex para remover caracteres não numéricos
  private static readonly NON_NUMERIC_REGEX = /\D/g;

  /**
   * Formata um CPF aplicando a máscara xxx.xxx.xxx-xx
   * @param value - Valor do CPF a ser formatado
   * @returns CPF formatado com máscara
   */
  static formatCPF(value: string): string {
    if (!MaskUtils.isValidInput(value)) {
      return '';
    }

    const cleanCpf = MaskUtils.removeNonNumericCharacters(value);
    return MaskUtils.applyCpfFormat(cleanCpf);
  }

  /**
   * Formata um telefone aplicando a máscara apropriada
   * Telefone fixo: (xx) xxxx-xxxx
   * Celular: (xx) xxxxx-xxxx
   * @param value - Valor do telefone a ser formatado
   * @returns Telefone formatado com máscara
   */
  static formatTelefone(value: string): string {
    if (!MaskUtils.isValidInput(value)) {
      return '';
    }

    const cleanPhone = MaskUtils.removeNonNumericCharacters(value);
    return MaskUtils.applyPhoneFormat(cleanPhone);
  }

  /**
   * Remove todas as máscaras/formatação de um valor
   * @param value - Valor com máscara a ser limpo
   * @returns Valor apenas com números
   */
  static removeMask(value: string): string {
    if (!MaskUtils.isValidInput(value)) {
      return '';
    }

    return MaskUtils.removeNonNumericCharacters(value);
  }

  /**
   * Aplica máscara de CPF em tempo real em um evento de input
   * @param event - Evento do input HTML
   */
  static applyCPFMask(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    const cleanValue = MaskUtils.removeNonNumericCharacters(target.value);

    if (MaskUtils.isValidCpfLength(cleanValue)) {
      target.value = MaskUtils.applyCpfFormat(cleanValue);
    }
  }

  /**
   * Aplica máscara de telefone em tempo real em um evento de input
   * @param event - Evento do input HTML
   */
  static applyTelefoneMask(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    const cleanValue = MaskUtils.removeNonNumericCharacters(target.value);

    if (MaskUtils.isValidPhoneLength(cleanValue)) {
      target.value = MaskUtils.applyPhoneFormat(cleanValue);
    }
  }

  /**
   * Verifica se o input é válido (não nulo/undefined/vazio)
   * @param value - Valor a ser verificado
   * @returns true se o valor for válido
   */
  private static isValidInput(value: string): boolean {
    return value != null && value.trim().length > 0;
  }

  /**
   * Remove todos os caracteres não numéricos de uma string
   * @param value - String a ser limpa
   * @returns String apenas com números
   */
  private static removeNonNumericCharacters(value: string): string {
    return value.replace(MaskUtils.NON_NUMERIC_REGEX, '');
  }

  /**
   * Aplica formatação de CPF
   * @param cpf - CPF apenas com números
   * @returns CPF formatado
   */
  private static applyCpfFormat(cpf: string): string {
    // Para CPF incompleto, aplica formatação parcial
    if (cpf.length >= 3 && cpf.length <= 11) {
      return cpf.replace(/(\d{3})(\d{0,3})(\d{0,3})(\d{0,2})/, (match, p1, p2, p3, p4) => {
        let result = p1;
        if (p2) result += '.' + p2;
        if (p3) result += '.' + p3;
        if (p4) result += '-' + p4;
        return result;
      });
    }
    return cpf;
  }

  /**
   * Aplica formatação de telefone baseada no comprimento
   * @param phone - Telefone apenas com números
   * @returns Telefone formatado
   */
  private static applyPhoneFormat(phone: string): string {
    if (phone.length >= 2) {
      if (MaskUtils.isLandlinePhone(phone)) {
        // Formatação para telefone fixo (até 10 dígitos)
        return phone.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
          let result = `(${p1})`;
          if (p2) result += ' ' + p2;
          if (p3) result += '-' + p3;
          return result;
        });
      } else {
        // Formatação para celular (11 dígitos)
        return phone.replace(/(\d{2})(\d{0,5})(\d{0,4})/, (match, p1, p2, p3) => {
          let result = `(${p1})`;
          if (p2) result += ' ' + p2;
          if (p3) result += '-' + p3;
          return result;
        });
      }
    }
    return phone;
  }

  /**
   * Verifica se o CPF tem comprimento válido
   * @param cpf - CPF a ser verificado
   * @returns true se o comprimento for válido
   */
  private static isValidCpfLength(cpf: string): boolean {
    return cpf.length <= MaskUtils.CPF_MAX_LENGTH;
  }

  /**
   * Verifica se o telefone tem comprimento válido
   * @param phone - Telefone a ser verificado
   * @returns true se o comprimento for válido
   */
  private static isValidPhoneLength(phone: string): boolean {
    return phone.length <= MaskUtils.PHONE_MOBILE_MAX_LENGTH;
  }

  /**
   * Verifica se o telefone é do tipo fixo (até 10 dígitos)
   * @param phone - Telefone a ser verificado
   * @returns true se for telefone fixo
   */
  private static isLandlinePhone(phone: string): boolean {
    return phone.length <= MaskUtils.PHONE_LANDLINE_MAX_LENGTH;
  }
}
