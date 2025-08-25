// Builders module exports
// This module contains builder classes for constructing Hybrid Loan Book transactions

// Export base builder interfaces and classes
export * from './base';

// Generic transaction and account builders (for backward compatibility with tests)

/**
 * Generic transaction builder for basic Aptos transactions
 */
export class TransactionBuilder {
  private sender: string = '';
  private payload: any = null;
  private gasLimit: number = 2000;
  private maxGasAmount: number = 2000;
  private gasUnitPrice: number = 100;

  setSender(sender: string): this {
    this.sender = sender;
    return this;
  }

  setPayload(payload: any): this {
    this.payload = payload;
    return this;
  }

  setGasLimit(gasLimit: number): this {
    this.gasLimit = gasLimit;
    return this;
  }

  setMaxGasAmount(maxGasAmount: number): this {
    this.maxGasAmount = maxGasAmount;
    return this;
  }

  setGasUnitPrice(gasUnitPrice: number): this {
    this.gasUnitPrice = gasUnitPrice;
    return this;
  }

  build() {
    return {
      sender: this.sender,
      payload: this.payload,
      gasLimit: this.gasLimit,
      maxGasAmount: this.maxGasAmount,
      gasUnitPrice: this.gasUnitPrice,
    };
  }
}

/**
 * Generic account builder for basic Aptos accounts
 */
export class AccountBuilder {
  private address: string = '';
  private sequenceNumber: string = '0';
  private authenticationKey: string = '';

  setAddress(address: string): this {
    this.address = address;
    return this;
  }

  setSequenceNumber(sequenceNumber: string): this {
    this.sequenceNumber = sequenceNumber;
    return this;
  }

  setAuthenticationKey(authenticationKey: string): this {
    this.authenticationKey = authenticationKey;
    return this;
  }

  build() {
    return {
      address: this.address,
      sequenceNumber: this.sequenceNumber,
      authenticationKey: this.authenticationKey,
    };
  }
}

// Re-export all specific builders
export * from './loan-creation';
export * from './loan-repayment';
export * from './documents';
export * from './configuration';
export * from './payment-schedule';

// Placeholder export to prevent module resolution errors
export const BUILDERS_MODULE = 'builders';