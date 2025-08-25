import { TransactionBuilder, AccountBuilder } from '../../src/builders';

describe('Builders Module', () => {
  describe('TransactionBuilder', () => {
    let builder: TransactionBuilder;

    beforeEach(() => {
      builder = new TransactionBuilder();
    });

    it('should create a transaction with default values', () => {
      const transaction = builder.build();
      expect(transaction).toEqual({
        sender: '',
        payload: null,
        gasLimit: 2000,
        maxGasAmount: 2000,
        gasUnitPrice: 100,
      });
    });

    it('should build a complete transaction using fluent API', () => {
      const sender = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const payload = { function: 'transfer', args: ['0x...', 100] };

      const transaction = builder
        .setSender(sender)
        .setPayload(payload)
        .setGasLimit(3000)
        .setMaxGasAmount(3000)
        .setGasUnitPrice(150)
        .build();

      expect(transaction.sender).toBe(sender);
      expect(transaction.payload).toEqual(payload);
      expect(transaction.gasLimit).toBe(3000);
      expect(transaction.maxGasAmount).toBe(3000);
      expect(transaction.gasUnitPrice).toBe(150);
    });

    it('should support method chaining', () => {
      const result = builder
        .setSender('0x...')
        .setPayload({})
        .setGasLimit(1000);

      expect(result).toBe(builder);
    });
  });

  describe('AccountBuilder', () => {
    let builder: AccountBuilder;

    beforeEach(() => {
      builder = new AccountBuilder();
    });

    it('should create an account with default values', () => {
      const account = builder.build();
      expect(account).toEqual({
        address: '',
        sequenceNumber: '0',
        authenticationKey: '',
      });
    });

    it('should build a complete account using fluent API', () => {
      const address = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const sequenceNumber = '42';
      const authKey = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';

      const account = builder
        .setAddress(address)
        .setSequenceNumber(sequenceNumber)
        .setAuthenticationKey(authKey)
        .build();

      expect(account.address).toBe(address);
      expect(account.sequenceNumber).toBe(sequenceNumber);
      expect(account.authenticationKey).toBe(authKey);
    });

    it('should support method chaining', () => {
      const result = builder
        .setAddress('0x...')
        .setSequenceNumber('1')
        .setAuthenticationKey('0x...');

      expect(result).toBe(builder);
    });
  });
}); 