// Documents builders for Hybrid Loan Book
// Handles add_document and add_document_for functions

import { HybridLoanBookBuilder } from "./index";
import type { EnhancedBuilderResult, AccountAddress, ObjectAddress } from "../types";

/**
 * Builder for the add_document function
 * Add a document to a loan
 */
export class AddDocumentBuilder extends HybridLoanBookBuilder {
  private loan?: ObjectAddress;
  private name?: string;
  private description?: string;
  private hash?: Uint8Array;

  constructor(moduleAddress: string) {
    super(moduleAddress, "add_document");
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setHash(hash: Uint8Array): this {
    this.hash = hash;
    return this;
  }

  build(): EnhancedBuilderResult {
    if (!this.loan) throw new Error("Loan is required");
    if (!this.name) throw new Error("Document name is required");
    if (!this.description) throw new Error("Document description is required");
    if (!this.hash) throw new Error("Document hash is required");

    const functionArguments = [
      this.loan,
      this.name,
      this.description,
      Array.from(this.hash),
    ];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the add_document_for function
 * Add a document to a loan (with additional sender parameter)
 * Note: The Move function has _sender parameter which appears to be unused
 */
export class AddDocumentForBuilder extends HybridLoanBookBuilder {
  private sender?: AccountAddress;
  private loan?: ObjectAddress;
  private name?: string;
  private description?: string;
  private hash?: Uint8Array;

  constructor(moduleAddress: string) {
    super(moduleAddress, "add_document_for");
  }

  setSender(sender: AccountAddress): this {
    this.sender = sender;
    return this;
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setHash(hash: Uint8Array): this {
    this.hash = hash;
    return this;
  }

  build(): EnhancedBuilderResult {
    if (!this.sender) throw new Error("Sender is required");
    if (!this.loan) throw new Error("Loan is required");
    if (!this.name) throw new Error("Document name is required");
    if (!this.description) throw new Error("Document description is required");
    if (!this.hash) throw new Error("Document hash is required");

    const functionArguments = [
      this.sender,
      this.loan,
      this.name,
      this.description,
      Array.from(this.hash),
    ];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the update_current_payment_fee function (accessible via documents namespace)
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

  build(): EnhancedBuilderResult {
    if (!this.loan) throw new Error("Loan is required");
    if (!this.newFee) throw new Error("New fee is required");

    const functionArguments = [
      this.loan,
      this.newFee,
    ];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Unified documents builder that provides access to all document methods
 */
export class DocumentsBuilder {
  private moduleAddress: string;

  constructor(moduleAddress: string) {
    this.moduleAddress = moduleAddress;
  }

  /**
   * Create an add_document builder
   */
  addDocument(): AddDocumentBuilder {
    return new AddDocumentBuilder(this.moduleAddress);
  }

  /**
   * Create an add_document_for builder
   */
  addDocumentFor(): AddDocumentForBuilder {
    return new AddDocumentForBuilder(this.moduleAddress);
  }

  /**
   * Create an update_current_payment_fee builder (convenience method)
   */
  updateCurrentPaymentFee(): UpdateCurrentPaymentFeeBuilder {
    return new UpdateCurrentPaymentFeeBuilder(this.moduleAddress);
  }
}