// Loan Creation builders for Hybrid Loan Book
// Handles offer_loan_simple and offer_loan functions

import { HybridLoanBookBuilder } from "./index";
import type { BuilderResult, AccountAddress, ObjectAddress } from "../types";

/**
 * Builder for the offer_loan_simple function
 * Simplified loan creation with vectors for payment schedule
 */
export class OfferLoanSimpleBuilder extends HybridLoanBookBuilder {
  private config?: ObjectAddress;
  private seed?: Uint8Array;
  private borrower?: AccountAddress;
  private timeDueUs: string[] = [];
  private principalPayments: string[] = [];
  private interestPayments: string[] = [];
  private feePayments: string[] = [];
  private paymentOrderBitmap: number = 7; // Default: 111 binary (principal, interest, fee)
  private faMetadata?: ObjectAddress;
  private startTimeUs?: string;
  private riskScore?: string;

  constructor(moduleAddress: string) {
    super(moduleAddress, "offer_loan_simple");
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setSeed(seed: Uint8Array): this {
    this.seed = seed;
    return this;
  }

  setBorrower(borrower: AccountAddress): this {
    this.borrower = borrower;
    return this;
  }

  setPaymentSchedule(
    timeDueUs: string[],
    principalPayments: string[],
    interestPayments: string[],
    feePayments: string[]
  ): this {
    this.timeDueUs = timeDueUs;
    this.principalPayments = principalPayments;
    this.interestPayments = interestPayments;
    this.feePayments = feePayments;
    return this;
  }

  setPaymentOrderBitmap(bitmap: number): this {
    this.paymentOrderBitmap = bitmap;
    return this;
  }

  setFaMetadata(metadata: ObjectAddress): this {
    this.faMetadata = metadata;
    return this;
  }

  setStartTime(startTimeUs: string): this {
    this.startTimeUs = startTimeUs;
    return this;
  }

  setRiskScore(riskScore: string): this {
    this.riskScore = riskScore;
    return this;
  }

  build(): BuilderResult {
    if (!this.config) throw new Error("Config is required");
    if (!this.seed) throw new Error("Seed is required");
    if (!this.borrower) throw new Error("Borrower is required");
    if (this.timeDueUs.length === 0) throw new Error("Payment schedule is required");

    const functionArguments = [
      this.config,
      Array.from(this.seed),
      this.borrower,
      this.timeDueUs,
      this.principalPayments,
      this.interestPayments,
      this.feePayments,
      this.paymentOrderBitmap,
      this.faMetadata ? [this.faMetadata] : [], // Option<Object<Metadata>>
      this.startTimeUs ? [this.startTimeUs] : [], // Option<u64>
      this.riskScore ? [this.riskScore] : [], // Option<u64>
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the offer_loan function
 * Full loan creation with sender parameter (deprecated _sender)
 */
export class OfferLoanBuilder extends HybridLoanBookBuilder {
  private sender?: AccountAddress;
  private config?: ObjectAddress;
  private seed?: Uint8Array;
  private borrower?: AccountAddress;
  private timeDueUs: string[] = [];
  private principalPayments: string[] = [];
  private interestPayments: string[] = [];
  private feePayments: string[] = [];
  private paymentOrderBitmap: number = 7; // Default: 111 binary
  private faMetadata?: ObjectAddress;
  private startTimeUs?: string;
  private riskScore?: string;

  constructor(moduleAddress: string) {
    super(moduleAddress, "offer_loan");
  }

  setSender(sender: AccountAddress): this {
    this.sender = sender;
    return this;
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setSeed(seed: Uint8Array): this {
    this.seed = seed;
    return this;
  }

  setBorrower(borrower: AccountAddress): this {
    this.borrower = borrower;
    return this;
  }

  setPaymentSchedule(
    timeDueUs: string[],
    principalPayments: string[],
    interestPayments: string[],
    feePayments: string[]
  ): this {
    this.timeDueUs = timeDueUs;
    this.principalPayments = principalPayments;
    this.interestPayments = interestPayments;
    this.feePayments = feePayments;
    return this;
  }

  setPaymentOrderBitmap(bitmap: number): this {
    this.paymentOrderBitmap = bitmap;
    return this;
  }

  setFaMetadata(metadata: ObjectAddress): this {
    this.faMetadata = metadata;
    return this;
  }

  setStartTime(startTimeUs: string): this {
    this.startTimeUs = startTimeUs;
    return this;
  }

  setRiskScore(riskScore: string): this {
    this.riskScore = riskScore;
    return this;
  }

  build(): BuilderResult {
    if (!this.sender) throw new Error("Sender is required");
    if (!this.config) throw new Error("Config is required");
    if (!this.seed) throw new Error("Seed is required");
    if (!this.borrower) throw new Error("Borrower is required");
    if (this.timeDueUs.length === 0) throw new Error("Payment schedule is required");

    const functionArguments = [
      this.sender,
      this.config,
      Array.from(this.seed),
      this.borrower,
      this.timeDueUs,
      this.principalPayments,
      this.interestPayments,
      this.feePayments,
      this.paymentOrderBitmap,
      this.faMetadata ? [this.faMetadata] : [], // Option<Object<Metadata>>
      this.startTimeUs ? [this.startTimeUs] : [], // Option<u64>
      this.riskScore ? [this.riskScore] : [], // Option<u64>
    ];

    return this.createBuilderResult([], functionArguments);
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