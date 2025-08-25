import { 
  TransactionBuilder, 
  AccountBuilder, 
  isValidAptosAddress, 
  formatAddress,
  SDK_VERSION,
  SDK_NAME 
} from '../../src';

describe('SDK Integration Tests', () => {
  describe('SDK Constants', () => {
    it('should have correct SDK version and name', () => {
      expect(SDK_VERSION).toBe('1.0.0');
      expect(SDK_NAME).toBe('Lucid Aptos Protocol TypeScript SDK');
    });
  });

  describe('End-to-End Workflow', () => {
    it('should support complete transaction workflow', () => {
      // Step 1: Validate sender address
      const senderAddress = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      expect(isValidAptosAddress(senderAddress)).toBe(true);

      // Step 2: Format address for display
      const formattedAddress = formatAddress(senderAddress);
      expect(formattedAddress).toBe('0x1234...cdef');

      // Step 3: Build transaction using builder
      const transaction = new TransactionBuilder()
        .setSender(senderAddress)
        .setPayload({ function: 'transfer', args: ['0x...', 100] })
        .setGasLimit(3000)
        .setMaxGasAmount(3000)
        .setGasUnitPrice(150)
        .build();

      expect(transaction.sender).toBe(senderAddress);
      expect(transaction.gasLimit).toBe(3000);

      // Step 4: Build account info
      const account = new AccountBuilder()
        .setAddress(senderAddress)
        .setSequenceNumber('42')
        .setAuthenticationKey('0x...')
        .build();

      expect(account.address).toBe(senderAddress);
      expect(account.sequenceNumber).toBe('42');
    });

    it('should handle invalid addresses gracefully', () => {
      const invalidAddress = 'invalid-address';
      
      expect(isValidAptosAddress(invalidAddress)).toBe(false);
      expect(() => formatAddress(invalidAddress)).toThrow('Invalid Aptos address');
    });
  });

  describe('Module Interoperability', () => {
    it('should allow mixing utilities and builders', () => {
      const address = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      
      // Use utility to validate
      if (isValidAptosAddress(address)) {
        // Use builder to create objects
        const transaction = new TransactionBuilder()
          .setSender(address)
          .setPayload({ function: 'test' })
          .build();

        const account = new AccountBuilder()
          .setAddress(address)
          .build();

        expect(transaction.sender).toBe(address);
        expect(account.address).toBe(address);
      }
    });
  });
}); 