// Types module exports  
// This module contains all type definitions used throughout the SDK

import type { InputEntryFunctionData } from "@aptos-labs/ts-sdk";
// Following aptos-ts-sdk patterns
export type AccountAddress = string;
export type ObjectAddress = string;

// Re-export network type
export type { NetworkName } from "../config/networks";

// Core protocol types
export interface ProtocolConfig {
  network: import("../config/networks").NetworkName;
  rpcUrl: string;
  faucetUrl?: string;
}

export interface LucidConfig {
  protocol: ProtocolConfig;
  moduleAddress?: string; // Optional override for module address
  timeout?: number;
  retries?: number;
}

// Hybrid Loan Book specific types following Move module structure
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

// Enums matching Move module
export type FundingSource = 0 | 1; // 0 = Originator, 1 = LoanBookConfig

// Payment schedule types
export interface PaymentInterval {
  timeDueUs: string; // u64 as string
  principal: string; // u64 as string  
  interest: string; // u64 as string
  fee: string; // u64 as string
}

// Builder result types
export interface BuilderResult extends InputEntryFunctionData {
  // Additional metadata for debugging/logging
  functionName: string;
  moduleName: string;
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

// Placeholder export to prevent module resolution errors
export const TYPES_MODULE = 'types';
