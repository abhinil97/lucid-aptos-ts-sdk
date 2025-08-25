// Loan Repayment builders for Hybrid Loan Book
// Handles repay_loan, repay_loan_by_seed, repay_loan_historical, and repay_loan_historical_with_seed

import { HybridLoanBookBuilder } from "./index";
import type { BuilderResult, AccountAddress, ObjectAddress } from "../types";

/**
 * Builder for the repay_loan function
 * Basic loan repayment
 */
export class RepayLoanBuilder extends HybridLoanBookBuilder {
  private loan?: ObjectAddress;
  private amount?: string;

  constructor(moduleAddress: string) {
    super(moduleAddress, "repay_loan");
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setAmount(amount: string): this {
    this.amount = amount;
    return this;
  }

  build(): BuilderResult {
    if (!this.loan) throw new Error("Loan is required");
    if (!this.amount) throw new Error("Amount is required");

    const functionArguments = [
      this.loan,
      this.amount,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the repay_loan_by_seed function
 * Repay loan using seed to identify the loan
 */
export class RepayLoanBySeedBuilder extends HybridLoanBookBuilder {
  private config?: ObjectAddress;
  private loanSeed?: Uint8Array;
  private amount?: string;

  constructor(moduleAddress: string) {
    super(moduleAddress, "repay_loan_by_seed");
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setLoanSeed(seed: Uint8Array): this {
    this.loanSeed = seed;
    return this;
  }

  setAmount(amount: string): this {
    this.amount = amount;
    return this;
  }

  build(): BuilderResult {
    if (!this.config) throw new Error("Config is required");
    if (!this.loanSeed) throw new Error("Loan seed is required");
    if (!this.amount) throw new Error("Amount is required");

    const functionArguments = [
      this.config,
      Array.from(this.loanSeed),
      this.amount,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the repay_loan_historical function  
 * Repay loan with historical timestamp (requires admin)
 */
export class RepayLoanHistoricalBuilder extends HybridLoanBookBuilder {
  private adminSigner?: AccountAddress;
  private loan?: ObjectAddress;
  private amount?: string;
  private timestamp?: string;

  constructor(moduleAddress: string) {
    super(moduleAddress, "repay_loan_historical");
  }

  setAdminSigner(admin: AccountAddress): this {
    this.adminSigner = admin;
    return this;
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setAmount(amount: string): this {
    this.amount = amount;
    return this;
  }

  setTimestamp(timestamp: string): this {
    this.timestamp = timestamp;
    return this;
  }

  build(): BuilderResult {
    if (!this.adminSigner) throw new Error("Admin signer is required");
    if (!this.loan) throw new Error("Loan is required");
    if (!this.amount) throw new Error("Amount is required");
    if (!this.timestamp) throw new Error("Timestamp is required");

    const functionArguments = [
      this.adminSigner,
      this.loan,
      this.amount,
      this.timestamp,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the repay_loan_historical_with_seed function
 * Repay loan with historical timestamp using seed (requires admin)
 */
export class RepayLoanHistoricalWithSeedBuilder extends HybridLoanBookBuilder {
  private adminSigner?: AccountAddress;
  private config?: ObjectAddress;
  private loanSeed?: Uint8Array;
  private amount?: string;
  private timestamp?: string;

  constructor(moduleAddress: string) {
    super(moduleAddress, "repay_loan_historical_with_seed");
  }

  setAdminSigner(admin: AccountAddress): this {
    this.adminSigner = admin;
    return this;
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setLoanSeed(seed: Uint8Array): this {
    this.loanSeed = seed;
    return this;
  }

  setAmount(amount: string): this {
    this.amount = amount;
    return this;
  }

  setTimestamp(timestamp: string): this {
    this.timestamp = timestamp;
    return this;
  }

  build(): BuilderResult {
    if (!this.adminSigner) throw new Error("Admin signer is required");
    if (!this.config) throw new Error("Config is required");
    if (!this.loanSeed) throw new Error("Loan seed is required");
    if (!this.amount) throw new Error("Amount is required");
    if (!this.timestamp) throw new Error("Timestamp is required");

    const functionArguments = [
      this.adminSigner,
      this.config,
      Array.from(this.loanSeed),
      this.amount,
      this.timestamp,
    ];

    return this.createBuilderResult([], functionArguments);
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