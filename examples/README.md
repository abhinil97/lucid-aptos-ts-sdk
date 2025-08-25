# Lucid Aptos SDK Examples

This directory contains examples demonstrating how to use the Lucid Aptos Protocol TypeScript SDK. Each example is focused on specific capabilities and use cases.

## 📁 Example Files

### 1. `basic-usage.ts` - SDK Fundamentals
**When to use:** New to the SDK or need basic utilities

**Demonstrates:**
- Address validation and formatting
- Hex conversion utilities
- Basic `LucidClient` initialization
- Core SDK utility functions

**Run:** `npm run example:basic`

```typescript
import { isValidAptosAddress, formatAddress, toHex, fromHex, LucidClient } from '../src';
```

---

### 2. `hybrid-loan-book-basic.ts` - Loan Book Basics
**When to use:** Getting started with loan book operations

**Demonstrates:**
- `HybridLoanBookClient` setup
- Creating loan offers
- Making loan repayments
- Adding documents to loans
- Basic configuration management
- Transaction submission options (direct, SDK wrapper, legacy)
- Gas estimation

**Run:** `npm run example:hybrid-basic`

```typescript
import { HybridLoanBookClient } from "../src/clients/hybrid-loan-book-client";
```

---

### 3. `hybrid-loan-book-advanced.ts` - Complex Loan Operations  
**When to use:** Advanced loan scenarios and production patterns

**Demonstrates:**
- Complex multi-payment loans
- Batch document operations
- Payment schedule management
- Configuration workflows
- Error handling and validation
- Complete loan lifecycle simulation
- Performance optimization
- Transaction introspection
- Debugging techniques

**Run:** `npm run example:hybrid-advanced`

---

### 4. `advanced-usage.ts` - Advanced LucidClient
**When to use:** Advanced SDK configuration and network management

**Demonstrates:**
- Multi-network client management
- Advanced address validation
- Complex hex operations with various data types
- Dynamic configuration updates
- Comprehensive error handling
- Performance testing and resource management

**Run:** `npm run example:advanced`

```typescript
import { LucidClient, isValidAptosAddress, formatAddress, toHex, fromHex } from '../src';
```

## 🚀 Getting Started

### Prerequisites
```bash
npm install
```

### Running Examples

#### Using npm scripts (Recommended)
```bash
# Basic SDK utilities
npm run example:basic

# Hybrid Loan Book - Basic operations
npm run example:hybrid-basic

# Hybrid Loan Book - Advanced scenarios
npm run example:hybrid-advanced

# Advanced LucidClient usage
npm run example:advanced
```

#### Alternative: Direct tsx/node execution
```bash
# Make sure tsx is installed
npm install -g tsx

# Run examples directly
tsx examples/basic-usage.ts
tsx examples/hybrid-loan-book-basic.ts
tsx examples/hybrid-loan-book-advanced.ts
tsx examples/advanced-usage.ts
```

## 🔄 Learning Path

1. **Start here:** `basic-usage.ts` - Learn SDK fundamentals
2. **Loan basics:** `hybrid-loan-book-basic.ts` - Core loan operations
3. **Advanced loans:** `hybrid-loan-book-advanced.ts` - Complex scenarios
4. **SDK mastery:** `advanced-usage.ts` - Advanced client management

## 💡 Key Concepts

### Transaction Submission Patterns

**✅ Recommended (Direct Submission):**
```typescript
const transaction = sdk.loanRepayment.repayLoan()
  .setLoan("0x...")
  .setAmount("50000")
  .build();

const result = await aptos.signAndSubmitTransaction({
  signer: account,
  transaction: transaction.toTransactionData()
});
```

**✅ SDK Wrapper:**
```typescript
const result = await sdk.submitTransaction(account, transaction);
```

**⚠️ Legacy (Still Supported):**
```typescript
const transactionData = await sdk.createTransaction(transaction);
const tx = await aptos.transaction.build.simple({
  sender: account.accountAddress,
  data: transactionData,
});
const result = await aptos.signAndSubmitTransaction({ signer: account, transaction: tx });
```

### Builder Pattern
All hybrid loan book operations use the builder pattern:
```typescript
const transaction = sdk.namespace.operation()
  .setParam1(value1)
  .setParam2(value2)
  .build();
```

### Enhanced Builder Results
All builders return enhanced results with:
- `.toTransactionData()` - Direct Aptos SDK compatibility
- `.function` - Full function name
- `.functionName` - Function name only
- `.moduleName` - Module name
- `.typeArguments` - Type arguments array
- `.functionArguments` - Function arguments array

## 🔧 Network Configuration

### Devnet (Development)
```typescript
{
  protocol: {
    network: 'devnet',
    rpcUrl: 'https://devnet.aptoslabs.com',
  }
}
```

### Testnet (Testing)
```typescript
{
  protocol: {
    network: 'testnet', 
    rpcUrl: 'https://testnet.aptoslabs.com',
  }
}
```

### Mainnet (Production)
```typescript
{
  protocol: {
    network: 'mainnet',
    rpcUrl: 'https://mainnet.aptoslabs.com',
  }
}
```

## 🐛 Common Issues

1. **Address Format:** Ensure addresses are 66 characters (including '0x' prefix)
2. **Network Mismatch:** Verify client network matches your target network
3. **Gas Estimation Errors:** May fail if smart contracts aren't deployed on the target network (expected in examples)
4. **ES Module Errors:** Ensure you're using `npm run example:*` commands or tsx directly
5. **Error Handling:** Always wrap SDK operations in try-catch blocks

## 📚 Further Reading

- [Main SDK Documentation](../README.md)
- [Hybrid Loan Book Summary](../HYBRID_LOAN_BOOK_SDK_SUMMARY.md)
- [SDK Roadmap](../lucid-aptos-sdk-roadmap.md)