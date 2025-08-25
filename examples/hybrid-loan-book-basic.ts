// Basic Hybrid Loan Book SDK Example
// Demonstrates core loan book operations: creating loans, repayments, documents, and configuration

import { HybridLoanBookClient } from "../src/clients/hybrid-loan-book-client";
import { Account } from "@aptos-labs/ts-sdk";
import { PAYMENT_ORDER_BITMAP, MoveTypes } from "../src/types";
import { LoanCreationUtils } from "../src/builders/loan-creation";

async function hybridLoanBookBasicExample() {
  console.log('🚀 Hybrid Loan Book SDK - Basic Example\n');

  // Initialize the SDK
  const sdk = new HybridLoanBookClient({
    protocol: {
      network: 'devnet',
      rpcUrl: 'https://devnet.aptoslabs.com',
    },
    // moduleAddress: '0x...', // Optional: override default module address
  });

  // Create example accounts
  const originator = Account.generate();
  const borrower = Account.generate();

  console.log(`👤 Originator: ${originator.accountAddress.toString().slice(0, 10)}...`);
  console.log(`👤 Borrower: ${borrower.accountAddress.toString().slice(0, 10)}...\n`);

  // Get Aptos client for transaction submission
  const aptos = sdk.getAptosClient();

  try {
    // Example 1: Create a loan offer with type safety
    console.log('📝 Creating a loan offer...');
    const loanOffer = sdk.loanCreation.offerLoanSimple()
      .setConfig("0x123abc...") // LoanBookConfig address
      .setSeedFromString("unique_loan_seed") // Type-safe seed creation
      .setBorrower(MoveTypes.address("0x" + borrower.accountAddress.toString().slice(2)))
      .setPaymentSchedule(
        ["1672531200000000"], // Payment due times (microseconds)
        ["100000"],           // Principal payments (validated as U64)
        ["5000"],             // Interest payments (validated as U64)
        ["1000"]              // Fee payments (validated as U64)
      )
      .setPaymentOrderBitmap(PAYMENT_ORDER_BITMAP.ALL) // Type-safe bitmap
      .setRiskScore(750) // Type-safe U64 conversion
      .build();

    console.log(`   Function: ${loanOffer.function}`);
    console.log(`   ✅ Loan offer built successfully with type safety`);

    // Example 2: Make a loan repayment with validation
    console.log('\n💰 Creating loan repayment...');
    const repayment = sdk.loanRepayment.repayLoan()
      .setLoan("0xdef456...") // Loan object address
      .setAmount(25000)       // Repayment amount (auto-validated as U64)
      .build();

    console.log(`   Function: ${repayment.function}`);
    console.log(`   ✅ Repayment built successfully with validation`);

    // Example 3: Add a document to loan with proper hash handling
    console.log('\n📋 Adding loan document...');
    const document = sdk.documents.addDocument()
      .setLoan("0xdef456...")
      .setName("Loan Agreement") // Validated MoveString
      .setDescription("Primary loan contract document") // Validated MoveString
      .setHashFromString("doc_hash_123") // Type-safe hash creation
      .build();

    console.log(`   Function: ${document.function}`);
    console.log(`   ✅ Document built successfully with validation`);

    // Example 4: Configure auto-pledge
    console.log('\n⚙️ Setting auto-pledge configuration...');
    const config = sdk.configuration.setAutoPledgeConfig()
      .setConfig("0x123abc...")
      .setEnabled(true)
      .setFacility("0x789ghi...")
      .build();

    console.log(`   Function: ${config.function}`);
    console.log(`   ✅ Configuration built successfully`);

    // Example 5: Update payment fee (corrected builder usage)
    console.log('\n💸 Updating payment fee...');
    const feeUpdate = sdk.paymentSchedule.updateCurrentPaymentFee()
      .setLoan("0xdef456...")
      .setNewFee(1500) // Type-safe U64 validation
      .build();

    console.log(`   Function: ${feeUpdate.function}`);
    console.log(`   ✅ Fee update built successfully with validation`);

    // Example 6: Using utility functions for complex scenarios
    console.log('\n🛠️ Using utility functions for complex operations...');
    
    // Create equal payment schedule
    const equalPayments = LoanCreationUtils.createEqualPaymentSchedule(
      3,                    // 3 payments
      Date.now() * 1000,   // Start time in microseconds
      30 * 24 * 60 * 60 * 1000 * 1000, // 30 days interval
      "50000",             // Principal per payment
      "2500",              // Interest per payment
      "500"                // Fee per payment
    );

    const complexLoan = sdk.loanCreation.offerLoanSimple()
      .setConfig("0x123abc...")
      .setSeedFromHex("0x" + Buffer.from("complex_seed", 'utf8').toString('hex'))
      .setBorrower(MoveTypes.address("0x" + borrower.accountAddress.toString().slice(2)))
      .setPaymentSchedule(
        equalPayments.timeDueUs,
        equalPayments.principal,
        equalPayments.interest,
        equalPayments.fee
      )
      .setPaymentOrderBitmap(PAYMENT_ORDER_BITMAP.ALL)
      .setRiskScore(800)
      .build();

    console.log(`   ✅ Complex loan created with utility functions`);

    console.log('\n🎯 Transaction Submission Options:');
    console.log('\n   Option A: Direct submission (Recommended)');
    console.log(`   const result = await aptos.signAndSubmitTransaction({
     signer: originator,
     transaction: loanOffer.toTransactionData()
   });`);

    console.log('\n   Option B: Via SDK wrapper');
    console.log(`   const result = await sdk.submitTransaction(originator, loanOffer);`);

    console.log('\n   Option C: Legacy approach');
    console.log(`   const transactionData = await sdk.createTransaction(loanOffer);
   const transaction = await aptos.transaction.build.simple({
     sender: originator.accountAddress,
     data: transactionData,
   });
   const result = await aptos.signAndSubmitTransaction({ signer: originator, transaction });`);

    // Example 7: Gas estimation
    console.log('\n⛽ Gas Estimation:');
    try {
      const gasEstimate = await sdk.estimateGas(originator, repayment);
      console.log(`   Estimated gas: ${gasEstimate} units`);
    } catch (error) {
      console.log(`   Gas estimation failed: ${error instanceof Error ? error.message : error}`);
    }

    // Example 8: Error handling with type validation
    console.log('\n⚠️ Demonstrating type safety error handling:');
    try {
      // This will throw a validation error
      const invalidBitmap = sdk.loanCreation.offerLoanSimple()
        .setConfig("0x123...")
        .setSeedFromString("test")
        .setBorrower("0x123...")
        .setPaymentSchedule(["1"], ["100"], ["10"], ["1"])
        .setPaymentOrderBitmap(999) // Invalid U8 value
        .build();
    } catch (error) {
      console.log(`   ✅ Caught validation error: ${error instanceof Error ? error.message : error}`);
    }

  } catch (error) {
    console.error('❌ Example failed:', error);
  }

  console.log('\n✅ Basic hybrid loan book example completed!');
  console.log('🔗 All builders use enhanced type safety with runtime validation');
  console.log('🛡️ Move type compatibility ensures transaction success');
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  hybridLoanBookBasicExample().catch(console.error);
}

export { hybridLoanBookBasicExample };