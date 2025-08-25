// Builders module exports
// This module contains builder classes for constructing Hybrid Loan Book transactions

import type { BuilderResult } from "../types";

// Base builder interface that all builders implement
export interface BaseBuilder {
  build(): BuilderResult;
}

// Abstract base class for all Hybrid Loan Book builders
export abstract class HybridLoanBookBuilder implements BaseBuilder {
  protected moduleAddress: string;
  protected functionName: string;

  constructor(moduleAddress: string, functionName: string) {
    this.moduleAddress = moduleAddress;
    this.functionName = functionName;
  }

  abstract build(): BuilderResult;

  protected createBuilderResult(
    typeArguments: string[] = [],
    functionArguments: any[] = []
  ): BuilderResult {
    return {
      function: `${this.moduleAddress}::pact::hybrid_loan_book::${this.functionName}`,
      typeArguments,
      functionArguments,
      functionName: this.functionName,
      moduleName: "hybrid_loan_book",
    };
  }
}

// Placeholder export to prevent module resolution errors
export const BUILDERS_MODULE = 'builders';
