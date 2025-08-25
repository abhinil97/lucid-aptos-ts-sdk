import { isValidAptosAddress, formatAddress, toHex, fromHex, validateConfig } from '../../src/utils';

describe('Utils Module', () => {
  describe('Address Validation', () => {
    it('should validate correct Aptos addresses', () => {
      const validAddress = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      expect(isValidAptosAddress(validAddress)).toBe(true);
    });

    it('should reject invalid addresses', () => {
      const invalidAddresses = [
        '0x123', // Too short
        '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // No 0x prefix
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdeg', // Invalid characters
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123', // Too long
      ];

      invalidAddresses.forEach(address => {
        expect(isValidAptosAddress(address)).toBe(false);
      });
    });
  });

  describe('Address Formatting', () => {
    it('should format valid addresses correctly', () => {
      const address = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const formatted = formatAddress(address);
      expect(formatted).toBe('0x1234...cdef');
    });

    it('should throw error for invalid addresses', () => {
      expect(() => formatAddress('invalid')).toThrow('Invalid Aptos address');
    });
  });

  describe('Hex Utilities', () => {
    it('should convert string to hex', () => {
      expect(toHex('hello')).toBe('0x68656c6c6f');
    });

    it('should convert number to hex', () => {
      expect(toHex(255)).toBe('0xff');
    });

    it('should convert buffer to hex', () => {
      const buffer = Buffer.from('test', 'utf8');
      expect(toHex(buffer)).toBe('0x74657374');
    });

    it('should convert hex to buffer', () => {
      const hex = '0x74657374';
      const buffer = fromHex(hex);
      // Convert Uint8Array to string using TextDecoder
      const text = new TextDecoder().decode(buffer);
      expect(text).toBe('test');
    });
  });

  describe('Validation Utilities', () => {
    it('should validate valid configs', () => {
      expect(validateConfig({ key: 'value' })).toBe(true);
      expect(validateConfig({})).toBe(true);
    });

    it('should reject invalid configs', () => {
      expect(validateConfig(null)).toBe(false);
      expect(validateConfig(undefined)).toBe(false);
      expect(validateConfig('string')).toBe(false);
      expect(validateConfig(123)).toBe(false);
    });
  });
}); 