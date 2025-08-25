// Loan Repayment builders for Hybrid Loan Book with proper Move type safety
// Handles repay_loan, repay_loan_by_seed, repay_loan_historical, and repay_loan_historical_with_seed

import { HybridLoanBookBuilder } from './base';
import type {
  EnhancedBuilderResult,
  AccountAddress,
  ObjectAddress,
  VectorU8,
  U64,
  LoanRepaymentParams,
} from '../types';
import { MoveTypes } from '../types';

/**
 * Builder for the repay_loan function
 * Basic loan repayment
 */
export class RepayLoanBuilder extends HybridLoanBookBuilder {
  private loan?: ObjectAddress;
  private amount?: U64;

  constructor(moduleAddress: string) {
    super(moduleAddress, 'repay_loan');
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setAmount(amount: string | number | bigint): this {
    this.amount = MoveTypes.u64(amount);
    return this;
  }

  build(): EnhancedBuilderResult {
    if (!this.loan) throw new Error('Loan is required');
    if (!this.amount) throw new Error('Amount is required');

    const functionArguments = [this.loan, this.amount];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the repay_loan_by_seed function
 * Repay loan using seed to identify the loan
 */
export class RepayLoanBySeedBuilder extends HybridLoanBookBuilder {
  private config?: ObjectAddress;
  private loanSeed?: VectorU8;
  private amount?: U64;

  constructor(moduleAddress: string) {
    super(moduleAddress, 'repay_loan_by_seed');
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setLoanSeed(seed: VectorU8): this {
    this.loanSeed = seed;
    return this;
  }

  setLoanSeedFromString(seed: string): this {
    this.loanSeed = new TextEncoder().encode(seed);
    return this;
  }

  setLoanSeedFromHex(hexSeed: string): this {
    // Remove 0x prefix if present
    const cleanHex = hexSeed.startsWith('0x') ? hexSeed.slice(2) : hexSeed;
    this.loanSeed = new Uint8Array(
      cleanHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );
    return this;
  }

  setAmount(amount: string | number | bigint): this {
    this.amount = MoveTypes.u64(amount);
    return this;
  }

  build(): EnhancedBuilderResult {
    if (!this.config) throw new Error('Config is required');
    if (!this.loanSeed) throw new Error('Loan seed is required');
    if (!this.amount) throw new Error('Amount is required');

    const functionArguments = [this.config, Array.from(this.loanSeed), this.amount];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the repay_loan_historical function
 * Repay loan with historical timestamp (requires admin)
 */
export class RepayLoanHistoricalBuilder extends HybridLoanBookBuilder {
  private adminSigner?: AccountAddress;
  private loan?: ObjectAddress;
  private amount?: U64;
  private timestamp?: U64;

  constructor(moduleAddress: string) {
    super(moduleAddress, 'repay_loan_historical');
  }

  setAdminSigner(admin: AccountAddress): this {
    this.adminSigner = admin;
    return this;
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setAmount(amount: string | number | bigint): this {
    this.amount = MoveTypes.u64(amount);
    return this;
  }

  setTimestamp(timestamp: string | number | bigint): this {
    this.timestamp = MoveTypes.u64(timestamp);
    return this;
  }

  /**
   * Set timestamp to current time in microseconds
   */
  setCurrentTimestamp(): this {
    this.timestamp = MoveTypes.u64(Date.now() * 1000); // Convert to microseconds
    return this;
  }

  build(): EnhancedBuilderResult {
    if (!this.adminSigner) throw new Error('Admin signer is required');
    if (!this.loan) throw new Error('Loan is required');
    if (!this.amount) throw new Error('Amount is required');
    if (!this.timestamp) throw new Error('Timestamp is required');

    const functionArguments = [this.adminSigner, this.loan, this.amount, this.timestamp];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the repay_loan_historical_with_seed function
 * Repay loan with historical timestamp using seed (requires admin)
 */
export class RepayLoanHistoricalWithSeedBuilder extends HybridLoanBookBuilder {
  private adminSigner?: AccountAddress;
  private config?: ObjectAddress;
  private loanSeed?: VectorU8;
  private amount?: U64;
  private timestamp?: U64;

  constructor(moduleAddress: string) {
    super(moduleAddress, 'repay_loan_historical_with_seed');
  }

  setAdminSigner(admin: AccountAddress): this {
    this.adminSigner = admin;
    return this;
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setLoanSeed(seed: VectorU8): this {
    this.loanSeed = seed;
    return this;
  }

  setLoanSeedFromString(seed: string): this {
    this.loanSeed = new TextEncoder().encode(seed);
    return this;
  }

  setLoanSeedFromHex(hexSeed: string): this {
    // Remove 0x prefix if present
    const cleanHex = hexSeed.startsWith('0x') ? hexSeed.slice(2) : hexSeed;
    this.loanSeed = new Uint8Array(
      cleanHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );
    return this;
  }

  setAmount(amount: string | number | bigint): this {
    this.amount = MoveTypes.u64(amount);
    return this;
  }

  setTimestamp(timestamp: string | number | bigint): this {
    this.timestamp = MoveTypes.u64(timestamp);
    return this;
  }

  /**
   * Set timestamp to current time in microseconds
   */
  setCurrentTimestamp(): this {
    this.timestamp = MoveTypes.u64(Date.now() * 1000); // Convert to microseconds
    return this;
  }

  build(): EnhancedBuilderResult {
    if (!this.adminSigner) throw new Error('Admin signer is required');
    if (!this.config) throw new Error('Config is required');
    if (!this.loanSeed) throw new Error('Loan seed is required');
    if (!this.amount) throw new Error('Amount is required');
    if (!this.timestamp) throw new Error('Timestamp is required');

    const functionArguments = [
      this.adminSigner,
      this.config,
      Array.from(this.loanSeed),
      this.amount,
      this.timestamp,
    ];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Unified loan repayment builder that provides access to all repayment methods
 */
export class LoanRepaymentBuilder {
  private moduleAddress: string;

  constructor(moduleAddress: string) {
    this.moduleAddress = moduleAddress;
  }

  /**
   * Create a repayment using validated parameters (recommended)
   */
  createRepayment(params: LoanRepaymentParams): RepayLoanBuilder | RepayLoanBySeedBuilder {
    if (params.loan) {
      // Use direct loan repayment
      return new RepayLoanBuilder(this.moduleAddress).setLoan(params.loan).setAmount(params.amount);
    } else if (params.config && params.loanSeed) {
      // Use seed-based repayment
      return new RepayLoanBySeedBuilder(this.moduleAddress)
        .setConfig(params.config)
        .setLoanSeed(params.loanSeed)
        .setAmount(params.amount);
    } else {
      throw new Error('Either loan or (config + loanSeed) must be provided');
    }
  }

  /**
   * Create a repay_loan builder
   */
  repayLoan(): RepayLoanBuilder {
    return new RepayLoanBuilder(this.moduleAddress);
  }

  /**
   * Create a repay_loan_by_seed builder
   */
  repayLoanBySeed(): RepayLoanBySeedBuilder {
    return new RepayLoanBySeedBuilder(this.moduleAddress);
  }

  /**
   * Create a repay_loan_historical builder
   */
  repayLoanHistorical(): RepayLoanHistoricalBuilder {
    return new RepayLoanHistoricalBuilder(this.moduleAddress);
  }

  /**
   * Create a repay_loan_historical_with_seed builder
   */
  repayLoanHistoricalWithSeed(): RepayLoanHistoricalWithSeedBuilder {
    return new RepayLoanHistoricalWithSeedBuilder(this.moduleAddress);
  }
}

// Export utility functions for working with loan repayment
export const LoanRepaymentUtils = {
  /**
   * Convert amount from decimal units to smallest unit (considering decimals)
   */
  convertToSmallestUnit(amount: number | string, decimals: number = 6): U64 {
    const amountBigInt =
      typeof amount === 'string'
        ? BigInt(parseFloat(amount) * 10 ** decimals)
        : BigInt(Math.floor(amount * 10 ** decimals));

    return MoveTypes.u64(amountBigInt.toString());
  },

  /**
   * Convert from smallest unit back to decimal units
   */
  convertFromSmallestUnit(amount: U64, decimals: number = 6): string {
    const divisor = BigInt(10 ** decimals);
    const amountBigInt = BigInt(amount);
    const wholePart = amountBigInt / divisor;
    const fractionalPart = amountBigInt % divisor;

    return `${wholePart}.${fractionalPart.toString().padStart(decimals, '0')}`;
  },

  /**
   * Get current timestamp in microseconds (Move timestamp format)
   */
  getCurrentTimestampUs(): U64 {
    return MoveTypes.u64(Date.now() * 1000);
  },

  /**
   * Add time interval to a timestamp
   */
  addTimeInterval(timestampUs: U64, intervalUs: string | number | bigint): U64 {
    const currentTime = BigInt(timestampUs);
    const interval = BigInt(intervalUs.toString());
    return MoveTypes.u64((currentTime + interval).toString());
  },
};
