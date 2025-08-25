// Types module exports
// This module contains all type definitions used throughout the SDK

import type { InputEntryFunctionData } from '@aptos-labs/ts-sdk';

// ===== MOVE PRIMITIVE TYPES =====
// These types provide type safety for Move primitive data structures

// Move address type - hex string starting with 0x
export type AccountAddress = `0x${string}`;
export type ObjectAddress = `0x${string}`;

// Move integer types with proper bounds
export type U8 = number & { __brand: 'U8' }; // 0 to 255
export type U16 = number & { __brand: 'U16' }; // 0 to 65535
export type U64 = string & { __brand: 'U64' }; // String representation for large numbers
export type U128 = string & { __brand: 'U128' }; // String representation for very large numbers
export type U256 = string & { __brand: 'U256' }; // String representation for very large numbers

// Move vector types
export type VectorU8 = Uint8Array;
export type VectorU64 = U64[];

// Move String type (UTF-8 encoded)
export type MoveString = string & { __brand: 'MoveString' };

// Move Option type
export type MoveOption<T> = T | undefined;

// Type guards and validators for Move types
export const MoveTypeValidators = {
  isValidU8: (value: number): value is U8 => Number.isInteger(value) && value >= 0 && value <= 255,

  isValidU16: (value: number): value is U16 =>
    Number.isInteger(value) && value >= 0 && value <= 65535,

  isValidU64: (value: string): value is U64 => {
    // Check if it's a valid numeric string that fits in u64
    const num = BigInt(value);
    return num >= 0n && num <= 18446744073709551615n; // 2^64 - 1
  },

  isValidAddress: (address: string): address is AccountAddress =>
    /^0x[a-fA-F0-9]{1,64}$/.test(address),

  isValidMoveString: (value: string): value is MoveString =>
    typeof value === 'string' && Buffer.byteLength(value, 'utf8') <= 65535, // Move String max length
};

// Helper functions to create Move types safely
export const MoveTypes = {
  u8: (value: number): U8 => {
    if (!MoveTypeValidators.isValidU8(value)) {
      throw new Error(`Invalid u8 value: ${value}. Must be 0-255`);
    }
    return value as U8;
  },

  u16: (value: number): U16 => {
    if (!MoveTypeValidators.isValidU16(value)) {
      throw new Error(`Invalid u16 value: ${value}. Must be 0-65535`);
    }
    return value as U16;
  },

  u64: (value: string | number | bigint): U64 => {
    const stringValue = value.toString();
    if (!MoveTypeValidators.isValidU64(stringValue)) {
      throw new Error(`Invalid u64 value: ${value}. Must be 0 to 2^64-1`);
    }
    return stringValue as U64;
  },

  address: (value: string): AccountAddress => {
    if (!MoveTypeValidators.isValidAddress(value)) {
      throw new Error(`Invalid address: ${value}. Must be hex string starting with 0x`);
    }
    return value as AccountAddress;
  },

  moveString: (value: string): MoveString => {
    if (!MoveTypeValidators.isValidMoveString(value)) {
      throw new Error(`Invalid Move string: too long or invalid encoding`);
    }
    return value as MoveString;
  },

  vectorU64: (values: (string | number | bigint)[]): VectorU64 => {
    return values.map(v => MoveTypes.u64(v));
  },

  option: <T>(value: T | null | undefined): T[] => {
    // Move Option<T> is represented as empty vector [] or single element [T]
    return value == null ? [] : [value];
  },
};

// Re-export network type
export type { NetworkName } from '../config/networks';

// Core protocol types
export interface ProtocolConfig {
  network: import('../config/networks').NetworkName;
  rpcUrl: string;
  faucetUrl?: string;
}

export interface LucidConfig {
  protocol: ProtocolConfig;
  moduleAddress?: string; // Optional override for module address
  timeout?: number;
  retries?: number;
}

// ===== HYBRID LOAN BOOK MODULE TYPES =====
// These match the Move module structure exactly

export interface LoanBookConfig {
  address: ObjectAddress;
}

export interface LoanConfig {
  address: ObjectAddress;
}

export interface BasicWhitelist {
  address: ObjectAddress;
}

export interface FungibleAssetMetadata {
  address: ObjectAddress;
}

export interface FacilityBaseDetails {
  address: ObjectAddress;
}

// Loan creation parameters with proper Move types
export interface LoanCreationParams {
  config: ObjectAddress;
  seed: VectorU8;
  borrower: AccountAddress;
  paymentSchedule: PaymentSchedule;
  paymentOrderBitmap: U8;
  faMetadata?: ObjectAddress;
  startTimeUs?: U64;
  riskScore?: U64;
}

// Loan repayment parameters
export interface LoanRepaymentParams {
  loan?: ObjectAddress;
  config?: ObjectAddress;
  loanSeed?: VectorU8;
  amount: U64;
  timestamp?: U64; // For historical repayments
}

// Document parameters
export interface DocumentParams {
  loan: ObjectAddress;
  name: MoveString;
  description: MoveString;
  hash: VectorU8;
}

// ===== MOVE MODULE SPECIFIC TYPES =====

// Enums matching Move module
export type FundingSource = U8; // 0 = Originator, 1 = LoanBookConfig
export const FUNDING_SOURCE = {
  ORIGINATOR: MoveTypes.u8(0),
  LOAN_BOOK_CONFIG: MoveTypes.u8(1),
} as const;

// Payment schedule types with proper Move type safety
export interface PaymentInterval {
  timeDueUs: U64; // Move u64 as string
  principal: U64; // Move u64 as string
  interest: U64; // Move u64 as string
  fee: U64; // Move u64 as string
}

// Validated payment schedule type
export interface PaymentSchedule {
  timeDueUs: VectorU64;
  principal: VectorU64;
  interest: VectorU64;
  fee: VectorU64;
}

// Payment order bitmap constants (u8 bitfield)
export const PAYMENT_ORDER_BITMAP = {
  PRINCIPAL_ONLY: MoveTypes.u8(1), // 001
  INTEREST_ONLY: MoveTypes.u8(2), // 010
  FEE_ONLY: MoveTypes.u8(4), // 100
  PRINCIPAL_INTEREST: MoveTypes.u8(3), // 011
  PRINCIPAL_FEE: MoveTypes.u8(5), // 101
  INTEREST_FEE: MoveTypes.u8(6), // 110
  ALL: MoveTypes.u8(7), // 111
} as const;

// Builder result types
export interface BuilderResult extends InputEntryFunctionData {
  // Additional metadata for debugging/logging
  functionName: string;
  moduleName: string;
}

// Enhanced builder result that can be used directly with aptos.signAndSubmitTransaction
export interface EnhancedBuilderResult extends BuilderResult {
  // Convenience methods for direct transaction handling
  toTransactionData(): InputEntryFunctionData;
}

// Transaction payload type
export interface TransactionPayload {
  [key: string]: unknown;
}

// Transaction types
export interface TransactionRequest {
  sender: string;
  payload: TransactionPayload;
  gasLimit?: number;
  maxGasAmount?: number;
  gasUnitPrice?: number;
}

export interface TransactionResponse {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
}

// Account types
export interface AccountInfo {
  address: string;
  sequenceNumber: string;
  authenticationKey: string;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Validates that all vectors in a payment schedule have the same length
 */
export function validatePaymentScheduleLengths(schedule: PaymentSchedule): void {
  const lengths = [
    schedule.timeDueUs.length,
    schedule.principal.length,
    schedule.interest.length,
    schedule.fee.length,
  ];

  const firstLength = lengths[0];
  if (!lengths.every(len => len === firstLength)) {
    throw new Error('All payment schedule vectors must have the same length');
  }

  if (firstLength === 0) {
    throw new Error('Payment schedule cannot be empty');
  }
}

/**
 * Creates a validated payment schedule from arrays
 */
export function createPaymentSchedule(
  timeDueUs: (string | number | bigint)[],
  principal: (string | number | bigint)[],
  interest: (string | number | bigint)[],
  fee: (string | number | bigint)[]
): PaymentSchedule {
  const schedule: PaymentSchedule = {
    timeDueUs: MoveTypes.vectorU64(timeDueUs),
    principal: MoveTypes.vectorU64(principal),
    interest: MoveTypes.vectorU64(interest),
    fee: MoveTypes.vectorU64(fee),
  };

  validatePaymentScheduleLengths(schedule);
  return schedule;
}

// Placeholder export to prevent module resolution errors
export const TYPES_MODULE = 'types';
