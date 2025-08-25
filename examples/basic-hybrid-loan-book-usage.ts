// Basic usage example for Hybrid Loan Book SDK
// Shows how to use the type-safe builders and submit transactions

import { HybridLoanBookClient } from "../src/clients/hybrid-loan-book-client";
import { Account } from "@aptos-labs/ts-sdk";

async function basicUsageExample() {
  // Initialize the SDK
  const sdk = new HybridLoanBookClient({
    protocol: {
      network: 'devnet', // or 'testnet', 'mainnet'
      rpcUrl: 'https://devnet.aptoslabs.com',
      // rpcUrl: 'custom-rpc-url', // optional override
    },
    // moduleAddress: '0x...', // optional override
  });

  // Create some example accounts
  const originator = Account.generate();
  const borrower = Account.generate();

  // Example 1: Create a loan offer using the builder
  const loanOfferTxn = sdk.loanCreation.offerLoanSimple()
    .setConfig("0x123...") // LoanBookConfig address
    .setSeed(new TextEncoder().encode("unique_loan_seed"))
    .setBorrower(borrower.accountAddress.toString())
    .setPaymentSchedule(
      ["1672531200000000"], // time due (microseconds)
      ["100000"],           // principal payments  
      ["5000"],             // interest payments
      ["1000"]              // fee payments
    )
    .setPaymentOrderBitmap(7) // 111 binary - principal, interest, fee
    .setRiskScore("800")
    .build();

  // Option A: Submit using our SDK wrapper
  try {
    const result = await sdk.submitTransaction(originator, loanOfferTxn);
    console.log(`Transaction successful: ${result.hash}`);
  } catch (error) {
    console.error("Transaction failed:", error);
  }

  // Option B: Use directly with aptos-ts-sdk  
  // (This is the main integration point you wanted)
  const aptos = sdk.getAptosClient();
  const transactionData = await sdk.createTransaction(loanOfferTxn);

  const transaction = await aptos.transaction.build.simple({
    sender: originator.accountAddress,
    data: transactionData,
  });

  const committedTxn = await aptos.signAndSubmitTransaction({
    signer: originator,
    transaction
  });

  await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
  console.log(`Committed transaction: ${committedTxn.hash}`);

  // Example 2: Repay a loan
  const repaymentTxn = sdk.loanRepayment.repayLoan()
    .setLoan("0xabc...") // Loan object address
    .setAmount("50000")  // Amount to repay
    .build();

  // Can submit either way as shown above
  const repaymentData = await sdk.createTransaction(repaymentTxn);

  // Example 3: Update payment schedule (admin only)
  const updateScheduleTxn = sdk.paymentSchedule.updateCurrentPaymentFee()
    .setLoan("0xabc...") // Loan object address
    .setNewFee("2000")   // New fee amount
    .build();

  // Example 4: Add document to loan (admin only)
  const addDocumentTxn = sdk.documents.addDocument()
    .setLoan("0xabc...")
    .setName("Contract Agreement")
    .setDescription("Main loan contract document")
    .setHash(new TextEncoder().encode("document_hash_here"))
    .build();

  // Example 5: Configure auto-pledge (admin only)
  const configTxn = sdk.configuration.setAutoPledgeConfig()
    .setConfig("0x123...")     // LoanBookConfig address
    .setEnabled(true)
    .setFacility("0xdef...")   // Facility address
    .build();

  console.log("All builders created successfully!");
}

// Gas estimation example
async function gasEstimationExample() {
  const sdk = new HybridLoanBookClient();
  const account = Account.generate();

  const txn = sdk.loanRepayment.repayLoan()
    .setLoan("0xabc...")
    .setAmount("100000")
    .build();

  try {
    const gasEstimate = await sdk.estimateGas(account, txn);
    console.log("Gas estimate:", gasEstimate);
  } catch (error) {
    console.error("Gas estimation failed:", error);
  }
}

export { basicUsageExample, gasEstimationExample };