# Move Type Safety Implementation Summary

This document outlines the comprehensive type safety improvements made to the Lucid Aptos TypeScript SDK to properly map and validate Move primitive data types.

## Overview of Changes

### 1. Enhanced Type Definitions (`src/types/index.ts`)

#### New Move Primitive Types
- **`U8`**: 0-255 range with runtime validation
- **`U16`**: 0-65535 range with runtime validation  
- **`U64`**: String-based for large numbers (0 to 2^64-1)
- **`U128`** & **`U256`**: String-based for very large numbers
- **`VectorU8`**: Properly typed as `Uint8Array`
- **`VectorU64`**: Array of validated U64 strings
- **`MoveString`**: UTF-8 validated with length limits
- **`AccountAddress`** & **`ObjectAddress`**: Hex strings with `0x` prefix validation

#### Type Validators & Constructors
```typescript
export const MoveTypeValidators = {
  isValidU8: (value: number): value is U8 => /* validation logic */,
  isValidU64: (value: string): value is U64 => /* BigInt validation */,
  isValidAddress: (address: string): address is AccountAddress => /* hex validation */,
  // ... more validators
};

export const MoveTypes = {
  u8: (value: number): U8 => /* safe constructor */,
  u64: (value: string | number | bigint): U64 => /* safe constructor */,
  address: (value: string): AccountAddress => /* safe constructor */,
  option: <T>(value: T | null | undefined): T[] => /* Move Option handling */,
  // ... more constructors
};
```

#### Payment Schedule Validation
```typescript
export function validatePaymentScheduleLengths(schedule: PaymentSchedule): void;
export function createPaymentSchedule(/* validated creation */): PaymentSchedule;
```

### 2. Builder Improvements

#### Loan Creation (`src/builders/loan-creation.ts`)
**Before:**
```typescript
private timeDueUs: string[] = [];
private principalPayments: string[] = [];
// No validation, loose typing
```

**After:**
```typescript
private paymentSchedule?: PaymentSchedule;
// Comprehensive validation with utility methods

setPaymentSchedule(
  timeDueUs: (string | number | bigint)[],
  principalPayments: (string | number | bigint)[],
  interestPayments: (string | number | bigint)[],
  feePayments: (string | number | bigint)[] 
): this {
  this.paymentSchedule = createPaymentSchedule(/* validated creation */);
  return this;
}
```

**New Utility Functions:**
- `setSeedFromString()`: UTF-8 encoding
- `setSeedFromHex()`: Hex string parsing
- `setPaymentScheduleFromIntervals()`: Object-based schedule setting
- `LoanCreationUtils.createEqualPaymentSchedule()`: Helper for equal payments

#### Loan Repayment (`src/builders/loan-repayment.ts`)
**Improvements:**
- All amounts use `U64` with validation
- Seed handling with string/hex conversion methods
- Timestamp utilities with microsecond precision
- Amount conversion utilities for decimal handling

#### Document Management (`src/builders/documents.ts`)
**Improvements:**
- `MoveString` validation for names/descriptions
- `VectorU8` for document hashes with utility functions
- Hash generation utilities (SHA-256, IPFS-style)
- Proper optional property handling

#### Payment Schedule (`src/builders/payment-schedule.ts`)
**Improvements:**
- All numeric values use proper Move types
- Runtime validation for all setters
- Type-safe parameter handling

### 3. Type Safety Features

#### Runtime Validation
All builders now validate input at runtime:
```typescript
setAmount(amount: string | number | bigint): this {
  this.amount = MoveTypes.u64(amount); // Validates and throws on error
  return this;
}
```

#### Option Type Handling
Proper Move `Option<T>` representation:
```typescript
// Move Option<T> becomes [] (none) or [T] (some)
MoveTypes.option(this.faMetadata) // Returns [] or [ObjectAddress]
```

#### Vector Length Validation
Payment schedules validate that all vectors have equal length:
```typescript
validatePaymentScheduleLengths(schedule); // Throws if mismatched
```

#### Address Validation
All addresses validated as proper hex strings:
```typescript
MoveTypes.address("0x1234..."); // Validates format and throws on error
```

## Key Improvements

### 1. **Type Safety**
- Branded types prevent mixing incompatible values
- Runtime validation catches errors early
- Move-specific constraints enforced

### 2. **Developer Experience**
- Clear error messages with context
- Utility functions for common operations
- Flexible input types (string/number/bigint) with conversion

### 3. **Move Compatibility**
- Exact mapping to Move primitive types
- Proper Option<T> handling
- Vector type safety with length validation
- Address format compliance

### 4. **Utility Functions**
- Payment schedule generators
- Hash computation utilities
- Timestamp handling for microsecond precision
- Amount conversion between decimal and smallest units

## Usage Examples

### Creating a Loan with Type Safety
```typescript
import { MoveTypes, LoanCreationUtils } from "./types";

// Create payment schedule with validation
const schedule = LoanCreationUtils.createEqualPaymentSchedule(
  3,                    // 3 payments
  Date.now() * 1000,   // Start time in microseconds
  30 * 24 * 60 * 60 * 1000 * 1000, // 30 days in microseconds
  "100000",            // Principal per payment (validated as U64)
  "5000",              // Interest per payment
  "1000"               // Fee per payment
);

const builder = new OfferLoanSimpleBuilder(moduleAddress)
  .setConfig("0x123...")                    // Validated as ObjectAddress
  .setSeedFromString("unique-loan-seed")    // UTF-8 encoded to VectorU8
  .setBorrower("0xabc...")                  // Validated as AccountAddress
  .setPaymentScheduleFromIntervals([        // Type-safe schedule
    {
      timeDueUs: Date.now() * 1000 + 30 * 24 * 60 * 60 * 1000 * 1000,
      principal: "100000",
      interest: "5000", 
      fee: "1000"
    }
  ])
  .setPaymentOrderBitmap(7)                 // Validated as U8
  .setRiskScore("800");                     // Validated as U64

const result = builder.build(); // Fully validated transaction
```

### Repaying a Loan with Amount Conversion
```typescript
import { LoanRepaymentUtils } from "./builders/loan-repayment";

// Convert decimal amount to smallest unit (6 decimals)
const amount = LoanRepaymentUtils.convertToSmallestUnit(100.50, 6); // "100500000"

const builder = new RepayLoanBySeedBuilder(moduleAddress)
  .setConfig("0x123...")
  .setLoanSeedFromHex("0xabcd1234")         // Hex to VectorU8
  .setAmount(amount);                       // Validated U64

const result = builder.build();
```

## Error Handling

The new type system provides clear, actionable error messages:

```typescript
// Invalid U8 value
MoveTypes.u8(300); // Error: Invalid u8 value: 300. Must be 0-255

// Invalid address format  
MoveTypes.address("invalid"); // Error: Invalid address: invalid. Must be hex string starting with 0x

// Mismatched vector lengths
createPaymentSchedule([1], [1, 2], [1], [1]); // Error: All payment schedule vectors must have the same length
```

## Migration Guide

### For Existing Code
1. Update imports to include new types
2. Replace string arrays with proper Move types
3. Add validation calls where needed
4. Use utility functions for complex operations

### New Development
1. Use typed builders from the start
2. Leverage utility functions for common patterns
3. Take advantage of runtime validation
4. Use branded types for type safety

This implementation provides a robust, type-safe foundation for interacting with the Hybrid Loan Book Move module while maintaining excellent developer experience and preventing common errors.