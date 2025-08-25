// Basic Hybrid Loan Book SDK Example
// Demonstrates core loan book operations: creating loans, repayments, documents, and configuration

import { HybridLoanBookClient } from "../src/clients/hybrid-loan-book-client";
import { Account } from "@aptos-labs/ts-sdk";

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
    // Example 1: Create a loan offer
    console.log('📝 Creating a loan offer...');
    const loanOffer = sdk.loanCreation.offerLoanSimple()
      .setConfig("0x123abc...") // LoanBookConfig address
      .setSeed(new TextEncoder().encode("unique_loan_seed"))
      .setBorrower(borrower.accountAddress.toString())
      .setPaymentSchedule(
        ["1672531200000000"], // Payment due times (microseconds)
        ["100000"],           // Principal payments  
        ["5000"],             // Interest payments
        ["1000"]              // Fee payments
      )
      .setPaymentOrderBitmap(7) // Binary 111: principal + interest + fees
      .setRiskScore("750")
      .build();

    console.log(`   Function: ${loanOffer.function}`);
    console.log(`   ✅ Loan offer built successfully`);

    // Example 2: Make a loan repayment
    console.log('\n💰 Creating loan repayment...');
    const repayment = sdk.loanRepayment.repayLoan()
      .setLoan("0xdef456...") // Loan object address
      .setAmount("25000")     // Repayment amount
      .build();

    console.log(`   Function: ${repayment.function}`);
    console.log(`   ✅ Repayment built successfully`);

    // Example 3: Add a document to loan
    console.log('\n📋 Adding loan document...');
    const document = sdk.documents.addDocument()
      .setLoan("0xdef456...")
      .setName("Loan Agreement")
      .setDescription("Primary loan contract document")
      .setHash(new TextEncoder().encode("doc_hash_123"))
      .build();

    console.log(`   Function: ${document.function}`);
    console.log(`   ✅ Document built successfully`);

    // Example 4: Configure auto-pledge
    console.log('\n⚙️ Setting auto-pledge configuration...');
    const config = sdk.configuration.setAutoPledgeConfig()
      .setConfig("0x123abc...")
      .setEnabled(true)
      .setFacility("0x789ghi...")
      .build();

    console.log(`   Function: ${config.function}`);
    console.log(`   ✅ Configuration built successfully`);

    // Example 5: Update payment fee
    console.log('\n💸 Updating payment fee...');
    const feeUpdate = sdk.documents.updateCurrentPaymentFee()
      .setLoan("0xdef456...")
      .setNewFee("1500")
      .build();

    console.log(`   Function: ${feeUpdate.function}`);
    console.log(`   ✅ Fee update built successfully`);

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

    // Example 6: Gas estimation
    console.log('\n⛽ Gas Estimation:');
    try {
      const gasEstimate = await sdk.estimateGas(originator, repayment);
      console.log(`   Estimated gas: ${gasEstimate} units`);
    } catch (error) {
      console.log(`   Gas estimation failed: ${error instanceof Error ? error.message : error}`);
    }

  } catch (error) {
    console.error('❌ Example failed:', error);
  }

  console.log('\n✅ Basic hybrid loan book example completed!');
  console.log('🔗 All builders return enhanced results with .toTransactionData() for direct Aptos SDK integration');
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  hybridLoanBookBasicExample().catch(console.error);
}

export { hybridLoanBookBasicExample };