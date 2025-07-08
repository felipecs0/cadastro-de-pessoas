export class MaskUtils {
  static formatCPF(value: string): string {
    // Remove tudo que não é dígito
    const cpf = value.replace(/\D/g, '');

    // Aplica a máscara
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  static formatTelefone(value: string): string {
    // Remove tudo que não é dígito
    const telefone = value.replace(/\D/g, '');

    // Aplica a máscara baseada na quantidade de dígitos
    if (telefone.length <= 10) {
      // Telefone fixo: (00) 0000-0000
      return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      // Celular: (00) 00000-0000
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }

  static removeMask(value: string): string {
    return value.replace(/\D/g, '');
  }

  static applyCPFMask(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      event.target.value = value;
    }
  }

  static applyTelefoneMask(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      event.target.value = value;
    }
  }
}
