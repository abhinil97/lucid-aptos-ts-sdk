// Advanced Hybrid Loan Book SDK Example  
// Demonstrates complex scenarios: batch operations, error handling, multi-step workflows

import { HybridLoanBookClient } from "../src/clients/hybrid-loan-book-client";
import { Account } from "@aptos-labs/ts-sdk";

async function hybridLoanBookAdvancedExample() {
  console.log('🚀 Hybrid Loan Book SDK - Advanced Example\n');

  // Initialize SDK with custom configuration
  const sdk = new HybridLoanBookClient({
    protocol: {
      network: 'testnet',
      rpcUrl: 'https://testnet.aptoslabs.com',
    },
    timeout: 60000,
    retries: 3,
  });

  const aptos = sdk.getAptosClient();

  // Create multiple accounts for complex scenarios
  const originator = Account.generate();
  const borrower1 = Account.generate();
  const borrower2 = Account.generate();
  const admin = Account.generate();

  console.log('👥 Generated accounts for advanced scenarios');
  console.log(`   Originator: ${originator.accountAddress.toString().slice(0, 12)}...`);
  console.log(`   Borrower 1: ${borrower1.accountAddress.toString().slice(0, 12)}...`);
  console.log(`   Borrower 2: ${borrower2.accountAddress.toString().slice(0, 12)}...\n`);

  try {
    // Scenario 1: Multi-payment schedule loan
    console.log('🏦 Creating complex multi-payment loan...');
    const complexLoan = sdk.loanCreation.offerLoanSimple()
      .setConfig("0x123abc...")
      .setSeed(new TextEncoder().encode("complex_loan_seed"))
      .setBorrower(borrower1.accountAddress.toString())
      .setPaymentSchedule(
        // Monthly payments over 6 months
        [
          "1672531200000000", // Jan 2024
          "1675123200000000", // Feb 2024  
          "1677542400000000", // Mar 2024
          "1680134400000000", // Apr 2024
          "1682726400000000", // May 2024
          "1685318400000000", // Jun 2024
        ],
        ["20000", "20000", "20000", "20000", "20000", "20000"], // Principal
        ["1000", "800", "600", "400", "200", "100"],            // Interest (decreasing)
        ["500", "500", "500", "500", "500", "500"]              // Fixed fees
      )
      .setPaymentOrderBitmap(7) // All payment types
      .setRiskScore("850")
      .build();

    const paymentSchedule = complexLoan.functionArguments[2];
    const paymentCount = Array.isArray(paymentSchedule) ? paymentSchedule.length : 'unknown';
    console.log(`   ✅ Complex loan with ${paymentCount} payments`);

    // Scenario 2: Batch document operations
    console.log('\n📚 Batch document operations...');
    const documents = [
      {
        name: "Loan Agreement",
        description: "Primary loan contract",
        hash: new TextEncoder().encode("agreement_hash_1")
      },
      {
        name: "Collateral Documentation", 
        description: "Asset backing documentation",
        hash: new TextEncoder().encode("collateral_hash_2")
      },
      {
        name: "Credit Report",
        description: "Borrower credit assessment",
        hash: new TextEncoder().encode("credit_hash_3")
      }
    ];

    const documentTransactions = documents.map(doc => 
      sdk.documents.addDocument()
        .setLoan("0xdef456...")
        .setName(doc.name)
        .setDescription(doc.description)
        .setHash(doc.hash)
        .build()
    );

    console.log(`   ✅ Built ${documentTransactions.length} document transactions`);

    // Scenario 3: Payment schedule management
    console.log('\n📅 Advanced payment schedule management...');
    
    // Update multiple payment components
    const scheduleUpdates = [
      sdk.documents.updateCurrentPaymentFee()
        .setLoan("0xdef456...")
        .setNewFee("800")
        .build(),
      
      sdk.documents.updateCurrentPaymentFee()
        .setLoan("0xdef456...")
        .setNewFee("1200")
        .build(),
      
      sdk.documents.updateCurrentPaymentFee()
        .setLoan("0xdef456...")
        .setNewFee("900")
        .build()
    ];

    console.log(`   ✅ Built ${scheduleUpdates.length} schedule update transactions`);

    // Scenario 4: Configuration management workflow
    console.log('\n⚙️ Advanced configuration workflow...');
    
    // Multiple configuration changes
    const configUpdates = [
      sdk.configuration.setAutoPledgeConfig()
        .setConfig("0x123abc...")
        .setEnabled(true)
        .setFacility("0x789ghi...")
        .build(),
        
      // Additional config operations would go here
      // This demonstrates the builder pattern for complex workflows
    ];

    console.log(`   ✅ Configuration workflow prepared`);

    // Scenario 5: Error handling and transaction validation
    console.log('\n🛡️ Advanced error handling...');
    
    try {
      // Example: Invalid loan repayment (amount too high)
      const invalidRepayment = sdk.loanRepayment.repayLoan()
        .setLoan("0xdef456...")
        .setAmount("999999999999") // Extremely high amount
        .build();

      // Validate transaction before submission
      console.log(`   ⚠️  Testing invalid repayment: ${invalidRepayment.function}`);
      
      // Gas estimation can help catch issues early
      const gasEstimate = await sdk.estimateGas(borrower1, invalidRepayment);
      console.log(`   💸 Gas estimate: ${gasEstimate} (may indicate issues if very high)`);
      
    } catch (error) {
      console.log(`   ✅ Caught validation error: ${error instanceof Error ? error.message : error}`);
    }

    // Scenario 6: Complex workflow simulation
    console.log('\n🔄 Simulating complete loan lifecycle...');
    
    const loanLifecycle = {
      // 1. Create loan
      creation: complexLoan,
      
      // 2. Add initial documents
      documentation: documentTransactions[0],
      
      // 3. First payment
      firstPayment: sdk.loanRepayment.repayLoan()
        .setLoan("0xdef456...")
        .setAmount("21000") // Principal + Interest + Fee
        .build(),
        
      // 4. Update payment schedule after first payment
      scheduleUpdate: scheduleUpdates[0],
      
      // 5. Final payment
      finalPayment: sdk.loanRepayment.repayLoan()
        .setLoan("0xdef456...")
        .setAmount("120600") // Remaining balance
        .build()
    };

    console.log(`   📋 Lifecycle simulation:`);
    Object.entries(loanLifecycle).forEach(([step, transaction]) => {
      console.log(`      ${step}: ${transaction.function}`);
    });

    // Scenario 7: Performance considerations
    console.log('\n⚡ Performance optimization examples...');
    
    // Batch gas estimation
    const transactionsToEstimate = [
      complexLoan,
      documentTransactions[0],
      scheduleUpdates[0]
    ];

    console.log(`   🔍 Estimating gas for ${transactionsToEstimate.length} transactions...`);
    const gasEstimates = await Promise.allSettled(
      transactionsToEstimate.map(tx => sdk.estimateGas(originator, tx))
    );

    let totalGas = 0;
    gasEstimates.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const gasValue = typeof result.value === 'object' ? result.value.estimatedGasUsed : result.value;
        totalGas += gasValue;
        console.log(`      Transaction ${index + 1}: ${gasValue} gas`);
      } else {
        console.log(`      Transaction ${index + 1}: Failed to estimate`);
      }
    });
    
    console.log(`   📊 Total estimated gas: ${totalGas} units`);

    // Scenario 8: Transaction metadata and debugging
    console.log('\n🔍 Transaction introspection...');
    
    const sampleTx = documentTransactions[0];
        console.log(`   📋 Transaction Details:`);  
    console.log(`      Module: ${sampleTx.moduleName}`);
    console.log(`      Function: ${sampleTx.functionName}`);
    console.log(`      Arguments: ${sampleTx.functionArguments.length} items`);
    console.log(`      Type Args: ${sampleTx.typeArguments?.length || 0} items`);
    console.log(`      Full Function: ${sampleTx.function}`);

  } catch (error) {
    console.error('❌ Advanced example failed:', error);
    
    // Provide debugging information
    if (error instanceof Error) {
      console.error(`   Error type: ${error.constructor.name}`);
      console.error(`   Error message: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack trace: ${error.stack.slice(0, 200)}...`);
      }
    }
  }

  console.log('\n✅ Advanced hybrid loan book example completed!');
  console.log('\n🎓 Advanced patterns demonstrated:');
  console.log('   • Complex multi-payment loans');
  console.log('   • Batch document operations');
  console.log('   • Payment schedule management');
  console.log('   • Configuration workflows');
  console.log('   • Error handling and validation');
  console.log('   • Complete lifecycle simulation');
  console.log('   • Performance optimization');
  console.log('   • Transaction introspection');
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  hybridLoanBookAdvancedExample().catch(console.error);
}

export { hybridLoanBookAdvancedExample };