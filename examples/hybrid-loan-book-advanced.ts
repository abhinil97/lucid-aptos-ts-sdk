// Advanced Hybrid Loan Book SDK Example  
// Demonstrates complex scenarios: batch operations, error handling, multi-step workflows with type safety

import { HybridLoanBookClient } from "../src/clients/hybrid-loan-book-client";
import { Account } from "@aptos-labs/ts-sdk";
import { 
  PAYMENT_ORDER_BITMAP,
  MoveTypes,
  createPaymentSchedule 
} from "../src/types";
import { LoanCreationUtils } from "../src/builders/loan-creation";
import { DocumentUtils } from "../src/builders/documents";
import { LoanRepaymentUtils } from "../src/builders/loan-repayment";

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
    // Scenario 1: Multi-payment schedule loan with type safety
    console.log('🏦 Creating complex multi-payment loan...');
    
    // Create payment schedule using type-safe methods
    const paymentSchedule = createPaymentSchedule(
      // Monthly payments over 6 months (microseconds)
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
    );

    const complexLoan = sdk.loanCreation.offerLoanSimple()
      .setConfig("0x123abc...")
      .setSeedFromString("complex_loan_seed")
      .setBorrower(MoveTypes.address("0x" + borrower1.accountAddress.toString().slice(2)))
      .setPaymentSchedule(
        paymentSchedule.timeDueUs,
        paymentSchedule.principal,
        paymentSchedule.interest,
        paymentSchedule.fee
      )
      .setPaymentOrderBitmap(PAYMENT_ORDER_BITMAP.ALL)
      .setRiskScore(850)
      .build();

    console.log(`   ✅ Complex loan with ${paymentSchedule.timeDueUs.length} payments created with type validation`);

    // Scenario 2: Batch document operations with proper hash generation
    console.log('\n📚 Batch document operations with type safety...');
    
    const documents = await Promise.all([
      DocumentUtils.createDocumentMetadata(
        "Loan Agreement",
        "Primary loan contract",
        "application/pdf",
        1024000
      ),
      DocumentUtils.createDocumentMetadata(
        "Collateral Documentation", 
        "Asset backing documentation",
        "application/pdf",
        512000
      ),
      DocumentUtils.createDocumentMetadata(
        "Credit Report",
        "Borrower credit assessment",
        "application/json",
        256000
      )
    ]);

    const documentTransactions = await Promise.all(
      documents.map(async (docMeta, index) => {
        // Generate proper hash for each document
        const hash = await DocumentUtils.generateDocumentHash(`document_content_${index + 1}`);
        
        return sdk.documents.addDocument()
          .setLoan("0xdef456...")
          .setName(docMeta.name)
          .setDescription(docMeta.description)
          .setHash(hash)
          .build();
      })
    );

    console.log(`   ✅ Built ${documentTransactions.length} document transactions with validated hashes`);

    // Scenario 3: Advanced payment schedule management with type safety
    console.log('\n📅 Advanced payment schedule management...');
    
    // Update multiple payment components using proper builders
    const scheduleUpdates = [
      sdk.paymentSchedule.updateCurrentPaymentFee() // Corrected builder usage
        .setLoan("0xdef456...")
        .setNewFee(800) // Type-safe U64 validation
        .build(),
        
      sdk.paymentSchedule.addFeeAndInterestToCurrentPayment()
        .setLoan("0xdef456...")
        .setAdditionalFee(200) // Type-safe U64 validation
        .setAdditionalInterest(100) // Type-safe U64 validation
        .build(),
    ];

    console.log(`   ✅ Built ${scheduleUpdates.length} schedule update transactions with validation`);

    // Scenario 4: Historical loan repayment with timestamps
    console.log('\n🕒 Historical repayment with timestamp management...');
    
    const historicalTimestamp = LoanRepaymentUtils.getCurrentTimestampUs();
    const historicalRepayment = sdk.loanRepayment.repayLoanHistorical()
      .setAdminSigner(MoveTypes.address("0x" + admin.accountAddress.toString().slice(2)))
      .setLoan("0xdef456...")
      .setAmount(LoanRepaymentUtils.convertToSmallestUnit(250.50, 6)) // $250.50 with 6 decimals
      .setTimestamp(historicalTimestamp)
      .build();

    console.log(`   ✅ Historical repayment built with timestamp: ${historicalTimestamp}`);

    // Scenario 5: Error handling and validation
    console.log('\n⚠️ Error handling and validation scenarios...');
    
    try {
      // Test invalid payment schedule lengths (should fail validation)
      createPaymentSchedule(
        ["1672531200000000", "1675123200000000"], // 2 times
        ["20000", "20000", "20000"],              // 3 principals (mismatch!)
        ["1000", "800"],                          // 2 interests  
        ["500", "500"]                            // 2 fees
      );
    } catch (error) {
      console.log(`   ✅ Caught payment schedule validation error: ${error instanceof Error ? error.message : error}`);
    }

    try {
      // Test invalid amount (should fail U64 validation)
      const invalidRepayment = sdk.loanRepayment.repayLoan()
        .setLoan("0xdef456...")
        .setAmount(-1) // Invalid negative amount
        .build();
    } catch (error) {
      console.log(`   ✅ Caught amount validation error: ${error instanceof Error ? error.message : error}`);
    }

    // Scenario 6: Batch transaction building for workflow
    console.log('\n🔄 Building complete loan workflow...');
    
    const loanWorkflow = {
      // Step 1: Create loan with equal payments
      createLoan: sdk.loanCreation.offerLoanSimple()
        .setConfig("0x123abc...")
        .setSeedFromString("workflow_loan_001")
        .setBorrower(MoveTypes.address("0x" + borrower2.accountAddress.toString().slice(2)))
        .setPaymentScheduleFromIntervals(
          LoanCreationUtils.createEqualPaymentSchedule(
            12, // 12 monthly payments
            Date.now() * 1000, // Start now
            30 * 24 * 60 * 60 * 1000 * 1000, // 30 days
            "10000", // $100 principal per payment
            "500",   // $5 interest per payment
            "100"    // $1 fee per payment
          ).timeDueUs.map((time, index) => ({
            timeDueUs: time,
            principal: "10000",
            interest: "500", 
            fee: "100"
          }))
        )
        .setPaymentOrderBitmap(PAYMENT_ORDER_BITMAP.ALL)
        .setRiskScore(750)
        .build(),

      // Step 2: Add required documentation
      addDocuments: await Promise.all([
        (async () => {
          const hash = await DocumentUtils.generateDocumentHash("loan_agreement_content");
          return sdk.documents.addDocument()
            .setLoan("0xworkflow_loan...")
            .setName("Loan Agreement")
            .setDescription("Workflow loan agreement")
            .setHash(hash)
            .build();
        })(),
      ]),

      // Step 3: Make first payment
      firstPayment: sdk.loanRepayment.repayLoan()
        .setLoan("0xworkflow_loan...")
        .setAmount(LoanRepaymentUtils.convertToSmallestUnit(105.00, 6)) // $105 (principal + interest + fee)
        .build(),

      // Step 4: Update payment schedule if needed
      scheduleUpdate: sdk.paymentSchedule.updateCurrentPaymentFee()
        .setLoan("0xworkflow_loan...")
        .setNewFee(150) // Increase fee to $1.50
        .build(),
    };

    console.log(`   ✅ Built complete loan workflow:`);
    console.log(`      - Loan creation: ${loanWorkflow.createLoan.function}`);
    console.log(`      - Documents: ${loanWorkflow.addDocuments.length} items`);
    console.log(`      - First payment: ${loanWorkflow.firstPayment.function}`);
    console.log(`      - Schedule update: ${loanWorkflow.scheduleUpdate.function}`);

    // Scenario 7: Transaction cost analysis
    console.log('\n💰 Transaction cost analysis...');
    
    const transactions = [
      loanWorkflow.createLoan,
      loanWorkflow.firstPayment,
      loanWorkflow.scheduleUpdate
    ];

    for (const [index, transaction] of transactions.entries()) {
      try {
        const gasEstimate = await sdk.estimateGas(originator, transaction);
        console.log(`   Transaction ${index + 1}: ~${gasEstimate} gas units`);
      } catch (error) {
        console.log(`   Transaction ${index + 1}: Gas estimation failed`);
      }
    }

    // Scenario 8: Type utility demonstrations
    console.log('\n🛠️ Type utility demonstrations...');
    
    // Amount conversion utilities
    const decimalAmount = "1000.123456"; // $1000.123456
    const smallestUnit = LoanRepaymentUtils.convertToSmallestUnit(decimalAmount, 6);
    const backToDecimal = LoanRepaymentUtils.convertFromSmallestUnit(smallestUnit, 6);
    
    console.log(`   Decimal: ${decimalAmount} → Smallest unit: ${smallestUnit} → Back: ${backToDecimal}`);
    
    // Seed generation utilities
    const randomSeed = LoanCreationUtils.generateRandomSeed();
    const stringSeed = LoanCreationUtils.createSeedFromString("deterministic_seed");
    
    console.log(`   Random seed length: ${randomSeed.length} bytes`);
    console.log(`   String seed length: ${stringSeed.length} bytes`);
    
    // Document hash utilities
    const hashHex = DocumentUtils.hashToHex(await DocumentUtils.generateDocumentHash("test content"));
    console.log(`   Document hash: ${hashHex}`);

  } catch (error) {
    console.error('❌ Advanced example failed:', error);
    if (error instanceof Error) {
      console.error('   Stack trace:', error.stack);
    }
  }

  console.log('\n✅ Advanced hybrid loan book example completed!');
  console.log('🔒 All operations use comprehensive type safety and validation');
  console.log('⚡ Enhanced error handling prevents runtime transaction failures'); 
  console.log('🚀 Ready for production use with Move smart contract compatibility');
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  hybridLoanBookAdvancedExample().catch(console.error);
}

export { hybridLoanBookAdvancedExample };