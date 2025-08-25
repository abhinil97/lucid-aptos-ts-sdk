// Payment Schedule builders for Hybrid Loan Book
// Handles payment schedule update functions

import { HybridLoanBookBuilder } from "./index";
import type { BuilderResult, ObjectAddress } from "../types";

/**
 * Builder for the update_current_payment_fee function
 * Update the current payment fee for a loan
 */
export class UpdateCurrentPaymentFeeBuilder extends HybridLoanBookBuilder {
  private loan?: ObjectAddress;
  private newFee?: string;

  constructor(moduleAddress: string) {
    super(moduleAddress, "update_current_payment_fee");
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setNewFee(fee: string): this {
    this.newFee = fee;
    return this;
  }

  build(): BuilderResult {
    if (!this.loan) throw new Error("Loan is required");
    if (!this.newFee) throw new Error("New fee is required");

    const functionArguments = [
      this.loan,
      this.newFee,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the add_fee_and_interest_to_current_payment function
 * Add additional fee and interest to the current payment
 */
export class AddFeeAndInterestToCurrentPaymentBuilder extends HybridLoanBookBuilder {
  private loan?: ObjectAddress;
  private additionalFee?: string;
  private additionalInterest?: string;

  constructor(moduleAddress: string) {
    super(moduleAddress, "add_fee_and_interest_to_current_payment");
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setAdditionalFee(fee: string): this {
    this.additionalFee = fee;
    return this;
  }

  setAdditionalInterest(interest: string): this {
    this.additionalInterest = interest;
    return this;
  }

  build(): BuilderResult {
    if (!this.loan) throw new Error("Loan is required");
    if (!this.additionalFee) throw new Error("Additional fee is required");
    if (!this.additionalInterest) throw new Error("Additional interest is required");

    const functionArguments = [
      this.loan,
      this.additionalFee,
      this.additionalInterest,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the update_payment_schedule_by_index function
 * Update a specific payment schedule interval by index
 */
export class UpdatePaymentScheduleByIndexBuilder extends HybridLoanBookBuilder {
  private loan?: ObjectAddress;
  private index?: number;
  private newTimeDueUs?: string;
  private newPrincipal?: string;
  private newInterest?: string;
  private newFee?: string;
  private newStatus?: number;

  constructor(moduleAddress: string) {
    super(moduleAddress, "update_payment_schedule_by_index");
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setIndex(index: number): this {
    this.index = index;
    return this;
  }

  setNewTimeDue(timeDueUs: string): this {
    this.newTimeDueUs = timeDueUs;
    return this;
  }

  setNewPrincipal(principal: string): this {
    this.newPrincipal = principal;
    return this;
  }

  setNewInterest(interest: string): this {
    this.newInterest = interest;
    return this;
  }

  setNewFee(fee: string): this {
    this.newFee = fee;
    return this;
  }

  setNewStatus(status: number): this {
    this.newStatus = status;
    return this;
  }

  build(): BuilderResult {
    if (!this.loan) throw new Error("Loan is required");
    if (this.index === undefined) throw new Error("Index is required");
    if (!this.newTimeDueUs) throw new Error("New time due is required");
    if (!this.newPrincipal) throw new Error("New principal is required");
    if (!this.newInterest) throw new Error("New interest is required");
    if (!this.newFee) throw new Error("New fee is required");
    if (this.newStatus === undefined) throw new Error("New status is required");

    const functionArguments = [
      this.loan,
      this.index,
      this.newTimeDueUs,
      this.newPrincipal,
      this.newInterest,
      this.newFee,
      this.newStatus,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the update_payment_schedule function
 * Update the entire payment schedule
 */
export class UpdatePaymentScheduleBuilder extends HybridLoanBookBuilder {
  private loan?: ObjectAddress;
  private timeDueUs: string[] = [];
  private principal: string[] = [];
  private interest: string[] = [];
  private fee: string[] = [];

  constructor(moduleAddress: string) {
    super(moduleAddress, "update_payment_schedule");
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setPaymentSchedule(
    timeDueUs: string[],
    principal: string[],
    interest: string[],
    fee: string[]
  ): this {
    this.timeDueUs = timeDueUs;
    this.principal = principal;
    this.interest = interest;
    this.fee = fee;
    return this;
  }

  build(): BuilderResult {
    if (!this.loan) throw new Error("Loan is required");
    if (this.timeDueUs.length === 0) throw new Error("Payment schedule is required");

    const functionArguments = [
      this.loan,
      this.timeDueUs,
      this.principal,
      this.interest,
      this.fee,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the update_current_payment_fee_by_seed function
 * Update current payment fee using seed to identify loan
 */
export class UpdateCurrentPaymentFeeBySeedBuilder extends HybridLoanBookBuilder {
  private config?: ObjectAddress;
  private loanSeed?: Uint8Array;
  private newFee?: string;

  constructor(moduleAddress: string) {
    super(moduleAddress, "update_current_payment_fee_by_seed");
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setLoanSeed(seed: Uint8Array): this {
    this.loanSeed = seed;
    return this;
  }

  setNewFee(fee: string): this {
    this.newFee = fee;
    return this;
  }

  build(): BuilderResult {
    if (!this.config) throw new Error("Config is required");
    if (!this.loanSeed) throw new Error("Loan seed is required");
    if (!this.newFee) throw new Error("New fee is required");

    const functionArguments = [
      this.config,
      Array.from(this.loanSeed),
      this.newFee,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the add_fee_and_interest_to_current_payment_by_seed function
 * Add fee and interest to current payment using seed
 */
export class AddFeeAndInterestToCurrentPaymentBySeedBuilder extends HybridLoanBookBuilder {
  private config?: ObjectAddress;
  private loanSeed?: Uint8Array;
  private additionalFee?: string;
  private additionalInterest?: string;

  constructor(moduleAddress: string) {
    super(moduleAddress, "add_fee_and_interest_to_current_payment_by_seed");
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setLoanSeed(seed: Uint8Array): this {
    this.loanSeed = seed;
    return this;
  }

  setAdditionalFee(fee: string): this {
    this.additionalFee = fee;
    return this;
  }

  setAdditionalInterest(interest: string): this {
    this.additionalInterest = interest;
    return this;
  }

  build(): BuilderResult {
    if (!this.config) throw new Error("Config is required");
    if (!this.loanSeed) throw new Error("Loan seed is required");
    if (!this.additionalFee) throw new Error("Additional fee is required");
    if (!this.additionalInterest) throw new Error("Additional interest is required");

    const functionArguments = [
      this.config,
      Array.from(this.loanSeed),
      this.additionalFee,
      this.additionalInterest,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the update_payment_schedule_by_index_and_seed function
 * Update payment schedule by index using seed
 */
export class UpdatePaymentScheduleByIndexAndSeedBuilder extends HybridLoanBookBuilder {
  private config?: ObjectAddress;
  private loanSeed?: Uint8Array;
  private index?: number;
  private newTimeDueUs?: string;
  private newPrincipal?: string;
  private newInterest?: string;
  private newFee?: string;
  private newStatus?: number;

  constructor(moduleAddress: string) {
    super(moduleAddress, "update_payment_schedule_by_index_and_seed");
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setLoanSeed(seed: Uint8Array): this {
    this.loanSeed = seed;
    return this;
  }

  setIndex(index: number): this {
    this.index = index;
    return this;
  }

  setNewTimeDue(timeDueUs: string): this {
    this.newTimeDueUs = timeDueUs;
    return this;
  }

  setNewPrincipal(principal: string): this {
    this.newPrincipal = principal;
    return this;
  }

  setNewInterest(interest: string): this {
    this.newInterest = interest;
    return this;
  }

  setNewFee(fee: string): this {
    this.newFee = fee;
    return this;
  }

  setNewStatus(status: number): this {
    this.newStatus = status;
    return this;
  }

  build(): BuilderResult {
    if (!this.config) throw new Error("Config is required");
    if (!this.loanSeed) throw new Error("Loan seed is required");
    if (this.index === undefined) throw new Error("Index is required");
    if (!this.newTimeDueUs) throw new Error("New time due is required");
    if (!this.newPrincipal) throw new Error("New principal is required");
    if (!this.newInterest) throw new Error("New interest is required");
    if (!this.newFee) throw new Error("New fee is required");
    if (this.newStatus === undefined) throw new Error("New status is required");

    const functionArguments = [
      this.config,
      Array.from(this.loanSeed),
      this.index,
      this.newTimeDueUs,
      this.newPrincipal,
      this.newInterest,
      this.newFee,
      this.newStatus,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the update_payment_schedule_by_seed function
 * Update entire payment schedule using seed
 */
export class UpdatePaymentScheduleBySeedBuilder extends HybridLoanBookBuilder {
  private config?: ObjectAddress;
  private loanSeed?: Uint8Array;
  private timeDueUs: string[] = [];
  private principal: string[] = [];
  private interest: string[] = [];
  private fee: string[] = [];

  constructor(moduleAddress: string) {
    super(moduleAddress, "update_payment_schedule_by_seed");
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setLoanSeed(seed: Uint8Array): this {
    this.loanSeed = seed;
    return this;
  }

  setPaymentSchedule(
    timeDueUs: string[],
    principal: string[],
    interest: string[],
    fee: string[]
  ): this {
    this.timeDueUs = timeDueUs;
    this.principal = principal;
    this.interest = interest;
    this.fee = fee;
    return this;
  }

  build(): BuilderResult {
    if (!this.config) throw new Error("Config is required");
    if (!this.loanSeed) throw new Error("Loan seed is required");
    if (this.timeDueUs.length === 0) throw new Error("Payment schedule is required");

    const functionArguments = [
      this.config,
      Array.from(this.loanSeed),
      this.timeDueUs,
      this.principal,
      this.interest,
      this.fee,
    ];

    return this.createBuilderResult([], functionArguments);
  }
}

/**
 * Unified payment schedule builder that provides access to all payment schedule methods
 */
export class PaymentScheduleBuilder {
  private moduleAddress: string;

  constructor(moduleAddress: string) {
    this.moduleAddress = moduleAddress;
  }

  /**
   * Create an update_current_payment_fee builder
   */
  updateCurrentPaymentFee(): UpdateCurrentPaymentFeeBuilder {
    return new UpdateCurrentPaymentFeeBuilder(this.moduleAddress);
  }

  /**
   * Create an add_fee_and_interest_to_current_payment builder
   */
  addFeeAndInterestToCurrentPayment(): AddFeeAndInterestToCurrentPaymentBuilder {
    return new AddFeeAndInterestToCurrentPaymentBuilder(this.moduleAddress);
  }

  /**
   * Create an update_payment_schedule_by_index builder
   */
  updatePaymentScheduleByIndex(): UpdatePaymentScheduleByIndexBuilder {
    return new UpdatePaymentScheduleByIndexBuilder(this.moduleAddress);
  }

  /**
   * Create an update_payment_schedule builder
   */
  updatePaymentSchedule(): UpdatePaymentScheduleBuilder {
    return new UpdatePaymentScheduleBuilder(this.moduleAddress);
  }

  /**
   * Create an update_current_payment_fee_by_seed builder
   */
  updateCurrentPaymentFeeBySeed(): UpdateCurrentPaymentFeeBySeedBuilder {
    return new UpdateCurrentPaymentFeeBySeedBuilder(this.moduleAddress);
  }

  /**
   * Create an add_fee_and_interest_to_current_payment_by_seed builder
   */
  addFeeAndInterestToCurrentPaymentBySeed(): AddFeeAndInterestToCurrentPaymentBySeedBuilder {
    return new AddFeeAndInterestToCurrentPaymentBySeedBuilder(this.moduleAddress);
  }

  /**
   * Create an update_payment_schedule_by_index_and_seed builder
   */
  updatePaymentScheduleByIndexAndSeed(): UpdatePaymentScheduleByIndexAndSeedBuilder {
    return new UpdatePaymentScheduleByIndexAndSeedBuilder(this.moduleAddress);
  }

  /**
   * Create an update_payment_schedule_by_seed builder
   */
  updatePaymentScheduleBySeed(): UpdatePaymentScheduleBySeedBuilder {
    return new UpdatePaymentScheduleBySeedBuilder(this.moduleAddress);
  }
}