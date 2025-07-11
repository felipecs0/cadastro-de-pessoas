import { MaskUtils } from './mask.utils';

describe('MaskUtils', () => {
  describe('formatCPF', () => {
    it('should format valid CPF with mask', () => {
      expect(MaskUtils.formatCPF('12345678901')).toBe('123.456.789-01');
    });

    it('should format CPF with existing mask', () => {
      expect(MaskUtils.formatCPF('123.456.789-01')).toBe('123.456.789-01');
    });

    it('should format partial CPF', () => {
      expect(MaskUtils.formatCPF('123456789')).toBe('123.456.789');
    });

    it('should return empty string for null/undefined', () => {
      expect(MaskUtils.formatCPF(null as any)).toBe('');
      expect(MaskUtils.formatCPF(undefined as any)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(MaskUtils.formatCPF('')).toBe('');
      expect(MaskUtils.formatCPF('   ')).toBe('');
    });

    it('should handle CPF with letters and special characters', () => {
      expect(MaskUtils.formatCPF('123abc456def789gh01')).toBe('123.456.789-01');
    });
  });

  describe('formatTelefone', () => {
    it('should format landline phone (10 digits)', () => {
      expect(MaskUtils.formatTelefone('1234567890')).toBe('(12) 3456-7890');
    });

    it('should format mobile phone (11 digits)', () => {
      expect(MaskUtils.formatTelefone('12345678901')).toBe('(12) 34567-8901');
    });

    it('should format phone with existing mask', () => {
      expect(MaskUtils.formatTelefone('(12) 3456-7890')).toBe('(12) 3456-7890');
    });

    it('should format partial phone', () => {
      expect(MaskUtils.formatTelefone('123456789')).toBe('(12) 3456-789');
    });

    it('should return empty string for null/undefined', () => {
      expect(MaskUtils.formatTelefone(null as any)).toBe('');
      expect(MaskUtils.formatTelefone(undefined as any)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(MaskUtils.formatTelefone('')).toBe('');
      expect(MaskUtils.formatTelefone('   ')).toBe('');
    });

    it('should handle phone with letters and special characters', () => {
      expect(MaskUtils.formatTelefone('12abc34def567gh890')).toBe('(12) 3456-7890');
    });
  });

  describe('removeMask', () => {
    it('should remove mask from CPF', () => {
      expect(MaskUtils.removeMask('123.456.789-01')).toBe('12345678901');
    });

    it('should remove mask from phone', () => {
      expect(MaskUtils.removeMask('(12) 3456-7890')).toBe('1234567890');
    });

    it('should return only numbers from mixed string', () => {
      expect(MaskUtils.removeMask('abc123def456ghi789')).toBe('123456789');
    });

    it('should return empty string for null/undefined', () => {
      expect(MaskUtils.removeMask(null as any)).toBe('');
      expect(MaskUtils.removeMask(undefined as any)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(MaskUtils.removeMask('')).toBe('');
      expect(MaskUtils.removeMask('   ')).toBe('');
    });

    it('should return empty string for string with no numbers', () => {
      expect(MaskUtils.removeMask('abcdef')).toBe('');
    });
  });

  describe('applyCPFMask', () => {
    let mockEvent: any;
    let mockTarget: any;

    beforeEach(() => {
      mockTarget = {
        value: ''
      };
      mockEvent = {
        target: mockTarget
      };
    });

    it('should apply CPF mask to input value', () => {
      mockTarget.value = '12345678901';
      MaskUtils.applyCPFMask(mockEvent);
      expect(mockTarget.value).toBe('123.456.789-01');
    });

    it('should apply CPF mask to partial input', () => {
      mockTarget.value = '123456789';
      MaskUtils.applyCPFMask(mockEvent);
      expect(mockTarget.value).toBe('123.456.789');
    });

    it('should not change value if it exceeds CPF length', () => {
      mockTarget.value = '123456789012345';
      MaskUtils.applyCPFMask(mockEvent);
      expect(mockTarget.value).toBe('123456789012345');
    });

    it('should handle event without target', () => {
      const eventWithoutTarget = {};
      expect(() => MaskUtils.applyCPFMask(eventWithoutTarget as any)).not.toThrow();
    });

    it('should handle input with existing mask', () => {
      mockTarget.value = '123.456.789-01';
      MaskUtils.applyCPFMask(mockEvent);
      expect(mockTarget.value).toBe('123.456.789-01');
    });
  });

  describe('applyTelefoneMask', () => {
    let mockEvent: any;
    let mockTarget: any;

    beforeEach(() => {
      mockTarget = {
        value: ''
      };
      mockEvent = {
        target: mockTarget
      };
    });

    it('should apply landline phone mask', () => {
      mockTarget.value = '1234567890';
      MaskUtils.applyTelefoneMask(mockEvent);
      expect(mockTarget.value).toBe('(12) 3456-7890');
    });

    it('should apply mobile phone mask', () => {
      mockTarget.value = '12345678901';
      MaskUtils.applyTelefoneMask(mockEvent);
      expect(mockTarget.value).toBe('(12) 34567-8901');
    });

    it('should apply mask to partial phone', () => {
      mockTarget.value = '123456789';
      MaskUtils.applyTelefoneMask(mockEvent);
      expect(mockTarget.value).toBe('(12) 3456-789');
    });

    it('should not change value if it exceeds phone length', () => {
      mockTarget.value = '123456789012345';
      MaskUtils.applyTelefoneMask(mockEvent);
      expect(mockTarget.value).toBe('123456789012345');
    });

    it('should handle event without target', () => {
      const eventWithoutTarget = {};
      expect(() => MaskUtils.applyTelefoneMask(eventWithoutTarget as any)).not.toThrow();
    });

    it('should handle input with existing mask', () => {
      mockTarget.value = '(12) 3456-7890';
      MaskUtils.applyTelefoneMask(mockEvent);
      expect(mockTarget.value).toBe('(12) 3456-7890');
    });
  });
});
