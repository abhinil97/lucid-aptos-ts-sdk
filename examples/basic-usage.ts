// Basic usage example for the Lucid Aptos Protocol TypeScript SDK
import { TransactionBuilder, AccountBuilder, isValidAptosAddress, formatAddress } from '../src';

async function basicExample() {
  console.log('🚀 Lucid Aptos Protocol TypeScript SDK - Basic Usage Example');

  // Example 1: Address validation
  const testAddress = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  console.log(`\n📍 Address Validation:`);
  console.log(`Address: ${testAddress}`);
  console.log(`Is valid: ${isValidAptosAddress(testAddress)}`);
  console.log(`Formatted: ${formatAddress(testAddress)}`);

  // Example 2: Building a transaction
  console.log(`\n📝 Transaction Builder:`);
  const transaction = new TransactionBuilder()
    .setSender(testAddress)
    .setPayload({ function: 'transfer', args: ['0x...', 100] })
    .setGasLimit(3000)
    .setMaxGasAmount(3000)
    .setGasUnitPrice(150)
    .build();
  
  console.log('Transaction:', JSON.stringify(transaction, null, 2));

  // Example 3: Building an account
  console.log(`\n👤 Account Builder:`);
  const account = new AccountBuilder()
    .setAddress(testAddress)
    .setSequenceNumber('42')
    .setAuthenticationKey('0x...')
    .build();
  
  console.log('Account:', JSON.stringify(account, null, 2));

  console.log(`\n✅ Basic example completed successfully!`);
}

// Run the example
if (require.main === module) {
  basicExample().catch(console.error);
}

export { basicExample }; 