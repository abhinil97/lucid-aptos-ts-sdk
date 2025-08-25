// Advanced usage example for the Lucid Aptos Protocol TypeScript SDK
import { 
  LucidClient, 
  TransactionBuilder, 
  AccountBuilder,
  isValidAptosAddress,
  formatAddress,
  toHex,
  fromHex 
} from '../src';

async function advancedExample() {
  console.log('🚀 Lucid Aptos Protocol TypeScript SDK - Advanced Usage Example');

  try {
    // Example 1: Initialize Lucid Client
    console.log('\n🔧 Initializing Lucid Client...');
    const client = new LucidClient({
      protocol: {
        network: 'testnet',
        rpcUrl: 'https://testnet.aptoslabs.com',
        faucetUrl: 'https://testnet.aptoslabs.com/faucet',
      },
      timeout: 30000,
      retries: 3,
    });

    await client.initialize();
    console.log(`✅ Client initialized successfully on ${client.getNetwork()}`);
    console.log(`📡 RPC URL: ${client.getRpcUrl()}`);
    console.log(`⏱️  Timeout: ${client.getTimeout()}ms`);
    console.log(`🔄 Retries: ${client.getRetries()}`);

    // Example 2: Address Management
    console.log('\n📍 Address Management...');
    const addresses = [
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      'invalid-address',
    ];

    addresses.forEach((address, index) => {
      console.log(`Address ${index + 1}: ${address}`);
      if (isValidAptosAddress(address)) {
        console.log(`  ✅ Valid: ${formatAddress(address)}`);
      } else {
        console.log(`  ❌ Invalid address`);
      }
    });

    // Example 3: Complex Transaction Building
    console.log('\n📝 Complex Transaction Building...');
    const senderAddress = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    
    const transaction = new TransactionBuilder()
      .setSender(senderAddress)
      .setPayload({
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: [
          '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          1000000, // 1 APT (6 decimals)
        ],
      })
      .setGasLimit(5000)
      .setMaxGasAmount(5000)
      .setGasUnitPrice(200)
      .build();

    console.log('Transaction Details:');
    console.log(`  Sender: ${formatAddress(transaction.sender)}`);
    console.log(`  Gas Limit: ${transaction.gasLimit}`);
    console.log(`  Max Gas Amount: ${transaction.maxGasAmount}`);
    console.log(`  Gas Unit Price: ${transaction.gasUnitPrice}`);
    console.log(`  Payload: ${JSON.stringify(transaction.payload, null, 2)}`);

    // Example 4: Account Management
    console.log('\n👤 Account Management...');
    const accounts = [
      new AccountBuilder()
        .setAddress('0x1111111111111111111111111111111111111111111111111111111111111111')
        .setSequenceNumber('0')
        .setAuthenticationKey('0x1111111111111111111111111111111111111111111111111111111111111111')
        .build(),
      new AccountBuilder()
        .setAddress('0x2222222222222222222222222222222222222222222222222222222222222222')
        .setSequenceNumber('42')
        .setAuthenticationKey('0x2222222222222222222222222222222222222222222222222222222222222222')
        .build(),
    ];

    accounts.forEach((account, index) => {
      console.log(`Account ${index + 1}:`);
      console.log(`  Address: ${formatAddress(account.address)}`);
      console.log(`  Sequence: ${account.sequenceNumber}`);
      console.log(`  Auth Key: ${formatAddress(account.authenticationKey)}`);
    });

    // Example 5: Hex Utilities
    console.log('\n🔢 Hex Utilities...');
    const testString = 'Hello, Aptos!';
    const testNumber = 12345;
    const testBuffer = Buffer.from('Aptos Protocol', 'utf8');

    console.log(`String "${testString}" to hex: ${toHex(testString)}`);
    console.log(`Number ${testNumber} to hex: ${toHex(testNumber)}`);
    console.log(`Buffer to hex: ${toHex(testBuffer)}`);

    const hexString = '0x48656c6c6f2c204170746f7321';
    const decodedString = fromHex(hexString).toString('utf8');
    console.log(`Hex "${hexString}" from hex: "${decodedString}"`);

    // Example 6: Configuration Updates
    console.log('\n⚙️ Configuration Updates...');
    const originalTimeout = client.getTimeout();
    client.updateConfig({ timeout: 60000 });
    console.log(`Updated timeout from ${originalTimeout}ms to ${client.getTimeout()}ms`);

    // Example 7: Error Handling
    console.log('\n🚨 Error Handling...');
    try {
      const invalidClient = new LucidClient(null as any);
    } catch (error) {
      console.log(`✅ Caught expected error: ${error}`);
    }

    try {
      formatAddress('invalid-address');
    } catch (error) {
      console.log(`✅ Caught expected error: ${error}`);
    }

    console.log('\n✅ Advanced example completed successfully!');
    console.log('\n📚 Next steps:');
    console.log('  - Implement actual RPC calls to Aptos network');
    console.log('  - Add transaction signing and submission');
    console.log('  - Implement account creation and management');
    console.log('  - Add event listening and subscription');

  } catch (error) {
    console.error('❌ Advanced example failed:', error);
  }
}

// Run the example
if (require.main === module) {
  advancedExample().catch(console.error);
}

export { advancedExample }; 