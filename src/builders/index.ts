// Builders module exports
// This module contains builder classes for constructing Hybrid Loan Book transactions

import type { BuilderResult, EnhancedBuilderResult } from "../types";
import type { InputEntryFunctionData } from "@aptos-labs/ts-sdk";

// Base builder interface that all builders implement
export interface BaseBuilder {
  build(): BuilderResult;
}

// Enhanced builder interface that provides direct Aptos SDK compatibility
export interface EnhancedBaseBuilder {
  build(): EnhancedBuilderResult;
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

  protected createEnhancedBuilderResult(
    typeArguments: string[] = [],
    functionArguments: any[] = []
  ): EnhancedBuilderResult {
    const baseResult = this.createBuilderResult(typeArguments, functionArguments);
    
    return {
      ...baseResult,
      toTransactionData(): InputEntryFunctionData {
        return {
          function: baseResult.function,
          typeArguments: baseResult.typeArguments || [],
          functionArguments: baseResult.functionArguments,
        };
      },
    };
  }
}

// Placeholder export to prevent module resolution errors
export const BUILDERS_MODULE = 'builders';
