# Lucid Aptos Protocol TypeScript SDK Implementation Roadmap

## Overview

This document outlines the comprehensive roadmap for implementing a TypeScript SDK for the Lucid Aptos Protocol, focusing on the hybrid loan book system and its dependencies. The SDK will provide developers with easy-to-use abstractions for integrating lending, borrowing, and facility management functionalities.

## Project Architecture Analysis

### Core Dependencies Hierarchy
Based on the deployment order and module analysis:

1. **Foundation Layer**
   - `pact-misc` - Utility functions and common patterns
   - `pact-utils` - Core utilities (whitelist, aggregates, time series)
   - `pact-deployment-utils` - Deployment and upgrade utilities

2. **Token & Access Control Layer**
   - `pact-token-utils` - Zero Value Tokens (ZVT) and token management
   - `pact-enrichers` - Document management, escrow, risk scoring

3. **Core Business Logic Layer**
   - `pact-borrowing-base` - Borrowing base calculations and validation
   - `pact-facilities-core` - Facility management core functionality
   - `pact-loanbook-core` - Core loan book operations

4. **Advanced Features Layer**
   - `pact-shares` - Share management and exchange
   - `pact-waterfalls` - Payment waterfall logic
   - `pact-facilities-orchestration` - Facility orchestration and automation

5. **Application Layer**
   - `pact-hybrid-book` - **Primary SDK Target** - Hybrid loan book implementation
   - `pact-zvt-books` - ZVT-specific loan books

## Key Module Analysis

### Hybrid Loan Book (`pact::hybrid_loan_book`)

**Core Structures:**
- `LoanBookConfig` - Configuration for loan books
- `LoanContext` - Individual loan context with references
- `LoanTracker` - Seed-to-loan mapping for efficient lookups
- `AutoPledgeConfig` - Automatic facility pledging configuration

**Primary Entry Functions:**
1. **Loan Book Management**
   - `new_loan_book()` - Create new loan book
   - `enable_loan_tracker()` - Enable loan tracking by seed
   - `set_auto_pledge_config()` - Configure automatic pledging

2. **Loan Origination**
   - `offer_loan()` - Create new loan offer
   - `offer_loan_simple()` - Simplified loan creation

3. **Loan Repayment**
   - `repay_loan()` - Standard loan repayment
   - `repay_loan_by_seed()` - Repay using loan seed
   - `repay_loan_historical()` - Historical repayment with timestamp

4. **Loan Administration**
   - `update_current_payment_fee()` - Update payment fees
   - `update_payment_schedule()` - Modify payment schedules
   - `add_document()` - Add loan documentation

5. **View Functions**
   - `is_admin()` - Check admin status
   - `resolve_loan()` - Get loan by seed
   - `loan_exists()` - Check loan existence
   - `get_auto_pledge_address()` - Get auto-pledge facility

### Core Dependencies

**Loan Book Core (`pact::loan_book`):**
- Fundamental loan operations
- Payment schedule management
- Fee collection and distribution
- NFT-based loan representation

**Zero Value Token (`pact_token_utils::zero_value_token`):**
- Programmable token with transfer restrictions
- Admin-controlled minting and burning
- Whitelist-based transfer permissions

**Facility Core (`pact::facility_core`):**
- Multi-party lending facilities
- Capital collection and distribution
- Time-based draw and recycle periods

## SDK Implementation Roadmap

### Phase 1: Foundation & Core Infrastructure (Weeks 1-3)

#### 1.1 Project Setup & Architecture
- [ ] Initialize TypeScript project with proper tooling
  - Vite/Rollup for bundling
  - TypeScript 5.x with strict configuration
  - ESLint, Prettier for code quality
  - Jest for testing
  - Typedoc for documentation generation

- [ ] Aptos Integration Layer
  - [ ] Aptos SDK integration (`@aptos-labs/ts-sdk`)
  - [ ] Network configuration management (mainnet, testnet, devnet)
  - [ ] Account and signer management utilities
  - [ ] Transaction building and submission helpers

#### 1.2 Core Type Definitions
- [ ] Move type mappings to TypeScript
  ```typescript
  // Core types
  interface LoanBookConfig {
    loan_book: string; // Object<LoanBook>
    extend_ref: ExtendRef;
    loan_starter_ref: LoanStarterRef;
    historical_loan_book_ref: HistoricalLoanBookRef;
    default_fa_metadata: string; // Object<Metadata>
    funding_source: FundingSource;
  }

  interface LoanInterval {
    time_due_us: bigint;
    principal: bigint;
    interest: bigint;
    fee: bigint;
    status: number;
  }

  enum FundingSource {
    Originator = 0,
    LoanBookConfig = 1
  }
  ```

- [ ] Error code mappings and custom error classes
- [ ] Event type definitions for contract events

#### 1.3 Base Client Infrastructure
- [ ] `LucidClient` - Main SDK entry point
  ```typescript
  class LucidClient {
    constructor(
      network: AptosNetwork,
      private key?: string,
      options?: LucidClientOptions
    );
    
    // Module-specific clients
    get hybridLoanBook(): HybridLoanBookClient;
    get facilities(): FacilityClient;
    get tokens(): TokenClient;
  }
  ```

- [ ] Transaction builder utilities
- [ ] Response parsing and type conversion utilities

### Phase 2: Hybrid Loan Book Core Implementation (Weeks 4-6)

#### 2.1 Loan Book Management
- [ ] `HybridLoanBookClient` implementation
  ```typescript
  class HybridLoanBookClient {
    // Loan book creation and configuration
    async createLoanBook(params: CreateLoanBookParams): Promise<LoanBookResult>;
    async enableLoanTracker(loanBookAddress: string): Promise<TransactionResult>;
    async setAutoPledgeConfig(params: AutoPledgeParams): Promise<TransactionResult>;
    
    // View functions
    async isAdmin(loanBookAddress: string, userAddress: string): Promise<boolean>;
    async getLoanBook(configAddress: string): Promise<string>;
    async hasLoanTracker(configAddress: string): Promise<boolean>;
  }
  ```

#### 2.2 Loan Origination System
- [ ] Loan creation utilities
  ```typescript
  interface CreateLoanParams {
    configAddress: string;
    seed: Uint8Array;
    borrower: string;
    paymentSchedule: LoanInterval[];
    paymentOrderBitmap: number;
    faMetadata?: string;
    startTimeUs?: bigint;
    riskScore?: number;
  }
  
  // High-level loan creation
  async offerLoan(params: CreateLoanParams): Promise<LoanResult>;
  async offerLoanSimple(params: CreateLoanParams): Promise<LoanResult>;
  ```

- [ ] Payment schedule utilities
  ```typescript
  class PaymentScheduleBuilder {
    static createMonthlyPayments(
      principal: bigint,
      interestRate: number,
      termMonths: number,
      startDate: Date
    ): LoanInterval[];
    
    static createCustomSchedule(
      payments: PaymentDefinition[]
    ): LoanInterval[];
  }
  ```

#### 2.3 Loan Query and Management
- [ ] Loan lookup and resolution
  ```typescript
  // Loan resolution by seed
  async resolveLoan(configAddress: string, seed: Uint8Array): Promise<string>;
  async loanExists(configAddress: string, seed: Uint8Array): Promise<boolean>;
  
  // Loan information retrieval
  async getLoanDetails(loanAddress: string): Promise<LoanDetails>;
  async getRemainingDebt(loanAddress: string): Promise<bigint>;
  async getPaymentSchedule(loanAddress: string): Promise<LoanInterval[]>;
  ```

### Phase 3: Repayment & Administration (Weeks 7-8)

#### 3.1 Repayment System
- [ ] Standard repayment functions
  ```typescript
  // Repayment operations
  async repayLoan(loanAddress: string, amount: bigint): Promise<TransactionResult>;
  async repayLoanBySeed(
    configAddress: string, 
    seed: Uint8Array, 
    amount: bigint
  ): Promise<TransactionResult>;
  
  // Historical repayment (admin only)
  async repayLoanHistorical(
    loanAddress: string,
    amount: bigint,
    timestamp: bigint,
    adminSigner: Account
  ): Promise<TransactionResult>;
  ```

- [ ] Repayment calculation utilities
  ```typescript
  class RepaymentCalculator {
    static calculatePaymentAllocation(
      remainingDebt: bigint,
      paymentAmount: bigint,
      currentSchedule: LoanInterval[]
    ): PaymentAllocation;
    
    static calculateEarlyPayoffAmount(loanAddress: string): Promise<bigint>;
  }
  ```

#### 3.2 Administrative Functions
- [ ] Payment schedule management
  ```typescript
  // Admin functions for loan management
  async updateCurrentPaymentFee(
    loanAddress: string,
    newFee: bigint,
    adminSigner: Account
  ): Promise<TransactionResult>;
  
  async updatePaymentSchedule(
    loanAddress: string,
    newSchedule: LoanInterval[],
    adminSigner: Account
  ): Promise<TransactionResult>;
  ```

- [ ] Document management
  ```typescript
  async addDocument(
    loanAddress: string,
    name: string,
    description: string,
    hash: Uint8Array,
    adminSigner: Account
  ): Promise<TransactionResult>;
  ```

### Phase 4: Token & Facility Integration (Weeks 9-10)

#### 4.1 Zero Value Token Integration
- [ ] `TokenClient` for ZVT management
  ```typescript
  class TokenClient {
    // ZVT creation and management
    async createZVT(params: CreateZVTParams): Promise<TokenResult>;
    async toggleUnlocked(tokenAddress: string, unlocked: boolean): Promise<TransactionResult>;
    async mint(tokenAddress: string, amount: bigint, recipient: string): Promise<TransactionResult>;
    
    // Access control
    async toggleAdmin(tokenAddress: string, address: string, isAdmin: boolean): Promise<TransactionResult>;
    async isAdmin(tokenAddress: string, address: string): Promise<boolean>;
    
    // Balance and transfer operations
    async getBalance(tokenAddress: string, accountAddress: string): Promise<bigint>;
    async transfer(tokenAddress: string, recipient: string, amount: bigint): Promise<TransactionResult>;
  }
  ```

#### 4.2 Facility Integration
- [ ] `FacilityClient` for facility operations
  ```typescript
  class FacilityClient {
    // Facility creation and management
    async createFacility(params: CreateFacilityParams): Promise<FacilityResult>;
    async pledge(facilityAddress: string, loanAddress: string): Promise<TransactionResult>;
    
    // Capital management
    async depositCapital(facilityAddress: string, amount: bigint): Promise<TransactionResult>;
    async requestCapitalCall(facilityAddress: string, amount: bigint): Promise<TransactionResult>;
    
    // View functions
    async getFacilityDetails(facilityAddress: string): Promise<FacilityDetails>;
    async getAvailableCapital(facilityAddress: string): Promise<bigint>;
  }
  ```

### Phase 5: Advanced Features & Utilities (Weeks 11-12)

#### 5.1 Event Monitoring & Subscriptions
- [ ] Event subscription system
  ```typescript
  class EventMonitor {
    // Subscribe to loan events
    subscribeToLoanEvents(
      loanBookAddress: string,
      callback: (event: LoanEvent) => void
    ): EventSubscription;
    
    // Subscribe to facility events
    subscribeToFacilityEvents(
      facilityAddress: string,
      callback: (event: FacilityEvent) => void
    ): EventSubscription;
    
    // Historical event queries
    async getLoanHistory(loanAddress: string, fromVersion?: bigint): Promise<LoanEvent[]>;
  }
  ```

#### 5.2 Analytics & Reporting
- [ ] Analytics utilities
  ```typescript
  class LoanAnalytics {
    // Portfolio analytics
    async getPortfolioSummary(loanBookAddress: string): Promise<PortfolioSummary>;
    async getPerformanceMetrics(loanBookAddress: string): Promise<PerformanceMetrics>;
    
    // Risk analytics
    async getRiskDistribution(loanBookAddress: string): Promise<RiskDistribution>;
    async getDefaultProbability(loanAddress: string): Promise<number>;
  }
  ```

#### 5.3 Batch Operations
- [ ] Batch processing utilities
  ```typescript
  class BatchOperations {
    // Batch loan operations
    async batchOfferLoans(loans: CreateLoanParams[]): Promise<BatchResult<LoanResult>>;
    async batchRepayments(repayments: RepaymentParams[]): Promise<BatchResult<TransactionResult>>;
    
    // Bulk data retrieval
    async getBulkLoanDetails(loanAddresses: string[]): Promise<LoanDetails[]>;
  }
  ```

### Phase 6: Testing, Documentation & Optimization (Weeks 13-14)

#### 6.1 Comprehensive Testing
- [ ] Unit tests for all SDK components
- [ ] Integration tests with local Aptos testnet
- [ ] End-to-end workflow tests
- [ ] Performance benchmarking
- [ ] Error handling and edge case testing

#### 6.2 Documentation & Examples
- [ ] Complete API documentation with TypeDoc
- [ ] Getting started guide
- [ ] Code examples for common use cases:
  ```typescript
  // Example: Create and fund a loan
  const client = new LucidClient('testnet', privateKey);
  
  // Create loan book
  const loanBook = await client.hybridLoanBook.createLoanBook({
    originator: originatorAddress,
    baseName: "My Loan Book",
    defaultToken: tokenAddress,
    fundingSource: FundingSource.Originator
  });
  
  // Create a loan
  const loan = await client.hybridLoanBook.offerLoan({
    configAddress: loanBook.address,
    seed: new TextEncoder().encode("loan-001"),
    borrower: borrowerAddress,
    paymentSchedule: PaymentScheduleBuilder.createMonthlyPayments(
      BigInt(100000), // $100k principal
      0.05, // 5% annual rate
      12, // 12 months
      new Date()
    ),
    paymentOrderBitmap: 7 // Principal, interest, fees
  });
  ```

- [ ] Migration guides for different versions
- [ ] Best practices and security considerations

#### 6.3 Performance Optimization
- [ ] Transaction batching optimization
- [ ] Caching strategies for frequently accessed data
- [ ] Connection pooling and retry logic
- [ ] Bundle size optimization

### Phase 7: Advanced SDK Features (Weeks 15-16)

#### 7.1 SDK Extensions
- [ ] Plugin system for custom functionality
- [ ] Webhook integration for event notifications
- [ ] Multi-signature support for administrative functions
- [ ] Integration with popular DeFi protocols

#### 7.2 Developer Experience
- [ ] CLI tool for common operations
- [ ] React hooks for frontend integration
- [ ] Code generation for custom loan types
- [ ] Development environment setup scripts

## Technical Specifications

### Architecture Patterns
- **Modular Design**: Each major contract module has its own client class
- **Builder Pattern**: Complex objects (payment schedules, configurations) use builders
- **Observer Pattern**: Event monitoring and subscriptions
- **Factory Pattern**: Creating different types of loans and facilities

### Error Handling Strategy
```typescript
// Custom error hierarchy
class LucidSDKError extends Error {
  constructor(message: string, public code: string, public cause?: Error) {
    super(message);
  }
}

class TransactionError extends LucidSDKError {
  constructor(message: string, public txHash: string, cause?: Error) {
    super(message, 'TRANSACTION_ERROR', cause);
  }
}

class ValidationError extends LucidSDKError {
  constructor(message: string, public field: string) {
    super(message, 'VALIDATION_ERROR');
  }
}
```

### Configuration Management
```typescript
interface LucidSDKConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  nodeUrl?: string;
  maxRetries?: number;
  timeoutMs?: number;
  defaultGasLimit?: bigint;
  cacheConfig?: CacheConfig;
}
```

## Deployment Strategy

### Package Structure
```
lucid-aptos-sdk/
├── src/
│   ├── clients/
│   │   ├── hybrid-loan-book.ts
│   │   ├── facility.ts
│   │   └── token.ts
│   ├── types/
│   │   ├── contracts.ts
│   │   ├── responses.ts
│   │   └── events.ts
│   ├── utils/
│   │   ├── transaction.ts
│   │   ├── conversion.ts
│   │   └── validation.ts
│   ├── builders/
│   │   ├── payment-schedule.ts
│   │   └── loan-config.ts
│   └── index.ts
├── examples/
├── docs/
└── tests/
```

### Distribution
- [ ] NPM package with proper semantic versioning
- [ ] CDN distribution for browser usage
- [ ] TypeScript declaration files
- [ ] Source maps for debugging

## Success Metrics

### Developer Experience Metrics
- Time to first successful loan creation: < 10 minutes
- API documentation completeness: 100%
- Test coverage: > 90%
- Bundle size: < 500KB (compressed)

### Performance Metrics
- Transaction submission time: < 2 seconds
- Query response time: < 500ms
- Batch operation efficiency: > 80% success rate

### Adoption Metrics
- Number of integrating projects
- Community feedback and contributions
- Issue resolution time

## Risk Mitigation

### Security Considerations
- [ ] Input validation for all parameters
- [ ] Safe transaction building practices
- [ ] Private key handling best practices
- [ ] Audit trail for administrative operations

### Maintenance Strategy
- [ ] Automated testing pipeline
- [ ] Dependency security monitoring
- [ ] Regular security audits
- [ ] Version compatibility matrix

This roadmap provides a comprehensive plan for building a production-ready TypeScript SDK for the Lucid Aptos Protocol, with particular focus on the hybrid loan book functionality while maintaining extensibility for the broader protocol ecosystem.