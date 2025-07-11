import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomValidators } from './custom-validators';

describe('CustomValidators', () => {
  describe('cpf', () => {
    it('should return null for valid CPF', () => {
      const control = { value: '12345678909' } as AbstractControl;
      const validator = CustomValidators.cpf();
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return validation error for invalid CPF', () => {
      const control = { value: '123' } as AbstractControl;
      const validator = CustomValidators.cpf();
      const result = validator(control);
      expect(result).toEqual({ cpfInvalid: true });
    });

    it('should return null for empty value', () => {
      const control = { value: '' } as AbstractControl;
      const validator = CustomValidators.cpf();
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const control = { value: null } as AbstractControl;
      const validator = CustomValidators.cpf();
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return validation error for CPF with same digits', () => {
      const control = { value: '11111111111' } as AbstractControl;
      const validator = CustomValidators.cpf();
      const result = validator(control);
      expect(result).toEqual({ cpfInvalid: true });
    });
  });

  describe('telefone', () => {
    it('should return null for valid phone number', () => {
      const control = { value: '(11) 99999-9999' } as AbstractControl;
      const validator = CustomValidators.telefone();
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return validation error for invalid phone number', () => {
      const control = { value: '123' } as AbstractControl;
      const validator = CustomValidators.telefone();
      const result = validator(control);
      expect(result).toEqual({ telefoneInvalid: true });
    });

    it('should return null for empty value', () => {
      const control = { value: '' } as AbstractControl;
      const validator = CustomValidators.telefone();
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const control = { value: null } as AbstractControl;
      const validator = CustomValidators.telefone();
      const result = validator(control);
      expect(result).toBeNull();
    });
  });
});
