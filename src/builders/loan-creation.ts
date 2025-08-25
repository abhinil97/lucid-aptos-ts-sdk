// Loan Creation builders for Hybrid Loan Book with proper Move type safety
// Handles offer_loan_simple and offer_loan functions

import { HybridLoanBookBuilder } from './base';
import type {
  EnhancedBuilderResult,
  AccountAddress,
  ObjectAddress,
  VectorU8,
  U8,
  U64,
  PaymentSchedule,
  LoanCreationParams,
} from '../types';
import { MoveTypes, createPaymentSchedule, validatePaymentScheduleLengths } from '../types';

/**
 * Builder for the offer_loan_simple function
 * Simplified loan creation with vectors for payment schedule
 */
export class OfferLoanSimpleBuilder extends HybridLoanBookBuilder {
  private config?: ObjectAddress;
  private seed?: VectorU8;
  private borrower?: AccountAddress;
  private paymentSchedule?: PaymentSchedule;
  private paymentOrderBitmap: U8 = MoveTypes.u8(7); // Default: 111 binary (principal, interest, fee)
  private faMetadata?: ObjectAddress;
  private startTimeUs?: U64;
  private riskScore?: U64;

  constructor(moduleAddress: string) {
    super(moduleAddress, 'offer_loan_simple');
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setSeed(seed: VectorU8): this {
    this.seed = seed;
    return this;
  }

  setSeedFromString(seed: string): this {
    this.seed = new TextEncoder().encode(seed);
    return this;
  }

  setSeedFromHex(hexSeed: string): this {
    // Remove 0x prefix if present
    const cleanHex = hexSeed.startsWith('0x') ? hexSeed.slice(2) : hexSeed;
    this.seed = new Uint8Array(cleanHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    return this;
  }

  setBorrower(borrower: AccountAddress): this {
    this.borrower = borrower;
    return this;
  }

  setPaymentSchedule(
    timeDueUs: (string | number | bigint)[],
    principalPayments: (string | number | bigint)[],
    interestPayments: (string | number | bigint)[],
    feePayments: (string | number | bigint)[]
  ): this {
    this.paymentSchedule = createPaymentSchedule(
      timeDueUs,
      principalPayments,
      interestPayments,
      feePayments
    );
    return this;
  }

  setPaymentScheduleFromIntervals(
    intervals: {
      timeDueUs: string | number | bigint;
      principal: string | number | bigint;
      interest: string | number | bigint;
      fee: string | number | bigint;
    }[]
  ): this {
    const timeDueUs = intervals.map(i => i.timeDueUs);
    const principal = intervals.map(i => i.principal);
    const interest = intervals.map(i => i.interest);
    const fee = intervals.map(i => i.fee);

    return this.setPaymentSchedule(timeDueUs, principal, interest, fee);
  }

  setPaymentOrderBitmap(bitmap: number): this {
    this.paymentOrderBitmap = MoveTypes.u8(bitmap);
    return this;
  }

  setFaMetadata(metadata: ObjectAddress): this {
    this.faMetadata = metadata;
    return this;
  }

  setStartTime(startTimeUs: string | number | bigint): this {
    this.startTimeUs = MoveTypes.u64(startTimeUs);
    return this;
  }

  setRiskScore(riskScore: string | number | bigint): this {
    this.riskScore = MoveTypes.u64(riskScore);
    return this;
  }

  build(): EnhancedBuilderResult {
    // Validate required fields
    if (!this.config) throw new Error('Config is required');
    if (!this.seed) throw new Error('Seed is required');
    if (!this.borrower) throw new Error('Borrower is required');
    if (!this.paymentSchedule) throw new Error('Payment schedule is required');

    // Validate payment schedule
    validatePaymentScheduleLengths(this.paymentSchedule);

    const functionArguments = [
      this.config,
      Array.from(this.seed), // Convert Uint8Array to number array for Aptos SDK
      this.borrower,
      this.paymentSchedule.timeDueUs,
      this.paymentSchedule.principal,
      this.paymentSchedule.interest,
      this.paymentSchedule.fee,
      this.paymentOrderBitmap,
      MoveTypes.option(this.faMetadata), // Option<Object<Metadata>>
      MoveTypes.option(this.startTimeUs), // Option<u64>
      MoveTypes.option(this.riskScore), // Option<u64>
    ];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the offer_loan function
 * Full loan creation with sender parameter (deprecated _sender)
 */
export class OfferLoanBuilder extends HybridLoanBookBuilder {
  private sender?: AccountAddress;
  private config?: ObjectAddress;
  private seed?: VectorU8;
  private borrower?: AccountAddress;
  private paymentSchedule?: PaymentSchedule;
  private paymentOrderBitmap: U8 = MoveTypes.u8(7); // Default: 111 binary
  private faMetadata?: ObjectAddress;
  private startTimeUs?: U64;
  private riskScore?: U64;

  constructor(moduleAddress: string) {
    super(moduleAddress, 'offer_loan');
  }

  setSender(sender: AccountAddress): this {
    this.sender = sender;
    return this;
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setSeed(seed: VectorU8): this {
    this.seed = seed;
    return this;
  }

  setSeedFromString(seed: string): this {
    this.seed = new TextEncoder().encode(seed);
    return this;
  }

  setSeedFromHex(hexSeed: string): this {
    // Remove 0x prefix if present
    const cleanHex = hexSeed.startsWith('0x') ? hexSeed.slice(2) : hexSeed;
    this.seed = new Uint8Array(cleanHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    return this;
  }

  setBorrower(borrower: AccountAddress): this {
    this.borrower = borrower;
    return this;
  }

  setPaymentSchedule(
    timeDueUs: (string | number | bigint)[],
    principalPayments: (string | number | bigint)[],
    interestPayments: (string | number | bigint)[],
    feePayments: (string | number | bigint)[]
  ): this {
    this.paymentSchedule = createPaymentSchedule(
      timeDueUs,
      principalPayments,
      interestPayments,
      feePayments
    );
    return this;
  }

  setPaymentScheduleFromIntervals(
    intervals: {
      timeDueUs: string | number | bigint;
      principal: string | number | bigint;
      interest: string | number | bigint;
      fee: string | number | bigint;
    }[]
  ): this {
    const timeDueUs = intervals.map(i => i.timeDueUs);
    const principal = intervals.map(i => i.principal);
    const interest = intervals.map(i => i.interest);
    const fee = intervals.map(i => i.fee);

    return this.setPaymentSchedule(timeDueUs, principal, interest, fee);
  }

  setPaymentOrderBitmap(bitmap: number): this {
    this.paymentOrderBitmap = MoveTypes.u8(bitmap);
    return this;
  }

  setFaMetadata(metadata: ObjectAddress): this {
    this.faMetadata = metadata;
    return this;
  }

  setStartTime(startTimeUs: string | number | bigint): this {
    this.startTimeUs = MoveTypes.u64(startTimeUs);
    return this;
  }

  setRiskScore(riskScore: string | number | bigint): this {
    this.riskScore = MoveTypes.u64(riskScore);
    return this;
  }

  build(): EnhancedBuilderResult {
    // Validate required fields
    if (!this.sender) throw new Error('Sender is required');
    if (!this.config) throw new Error('Config is required');
    if (!this.seed) throw new Error('Seed is required');
    if (!this.borrower) throw new Error('Borrower is required');
    if (!this.paymentSchedule) throw new Error('Payment schedule is required');

    // Validate payment schedule
    validatePaymentScheduleLengths(this.paymentSchedule);

    const functionArguments = [
      this.sender,
      this.config,
      Array.from(this.seed), // Convert Uint8Array to number array for Aptos SDK
      this.borrower,
      this.paymentSchedule.timeDueUs,
      this.paymentSchedule.principal,
      this.paymentSchedule.interest,
      this.paymentSchedule.fee,
      this.paymentOrderBitmap,
      MoveTypes.option(this.faMetadata), // Option<Object<Metadata>>
      MoveTypes.option(this.startTimeUs), // Option<u64>
      MoveTypes.option(this.riskScore), // Option<u64>
    ];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Unified loan creation builder that provides access to both loan creation methods
 */
export class LoanCreationBuilder {
  private moduleAddress: string;

  constructor(moduleAddress: string) {
    this.moduleAddress = moduleAddress;
  }

  /**
   * Create a loan using validated parameters (recommended)
   */
  createLoan(params: LoanCreationParams): OfferLoanSimpleBuilder {
    const builder = new OfferLoanSimpleBuilder(this.moduleAddress)
      .setConfig(params.config)
      .setSeed(params.seed)
      .setBorrower(params.borrower)
      .setPaymentSchedule(
        params.paymentSchedule.timeDueUs,
        params.paymentSchedule.principal,
        params.paymentSchedule.interest,
        params.paymentSchedule.fee
      )
      .setPaymentOrderBitmap(params.paymentOrderBitmap);

    if (params.faMetadata) builder.setFaMetadata(params.faMetadata);
    if (params.startTimeUs) builder.setStartTime(params.startTimeUs);
    if (params.riskScore) builder.setRiskScore(params.riskScore);

    return builder;
  }

  /**
   * Create an offer_loan_simple builder
   */
  offerLoanSimple(): OfferLoanSimpleBuilder {
    return new OfferLoanSimpleBuilder(this.moduleAddress);
  }

  /**
   * Create an offer_loan builder
   */
  offerLoan(): OfferLoanBuilder {
    return new OfferLoanBuilder(this.moduleAddress);
  }
}

// Export utility functions for working with loan creation
export const LoanCreationUtils = {
  /**
   * Create a simple payment schedule with equal payments
   */
  createEqualPaymentSchedule(
    numberOfPayments: number,
    startTimeUs: string | number | bigint,
    intervalUs: string | number | bigint,
    principalPerPayment: string | number | bigint,
    interestPerPayment: string | number | bigint = 0,
    feePerPayment: string | number | bigint = 0
  ): PaymentSchedule {
    const startTime = BigInt(startTimeUs.toString());
    const interval = BigInt(intervalUs.toString());

    const timeDueUs = Array.from({ length: numberOfPayments }, (_, i) =>
      (startTime + BigInt(i + 1) * interval).toString()
    );

    const principal = Array(numberOfPayments).fill(principalPerPayment.toString());
    const interest = Array(numberOfPayments).fill(interestPerPayment.toString());
    const fee = Array(numberOfPayments).fill(feePerPayment.toString());

    return createPaymentSchedule(timeDueUs, principal, interest, fee);
  },

  /**
   * Generate a random seed for loan creation
   */
  generateRandomSeed(): VectorU8 {
    return crypto.getRandomValues(new Uint8Array(16));
  },

  /**
   * Create seed from string (UTF-8 encoded)
   */
  createSeedFromString(seed: string): VectorU8 {
    return new TextEncoder().encode(seed);
  },
};
