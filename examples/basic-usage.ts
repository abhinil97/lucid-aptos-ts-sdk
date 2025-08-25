// Basic utilities example for the Lucid Aptos Protocol TypeScript SDK
// Demonstrates core SDK utilities: address validation, hex conversion, and basic configuration
import { isValidAptosAddress, formatAddress, toHex, fromHex, LucidClient } from '../src';

async function basicUtilitiesExample() {
  console.log('🚀 Lucid SDK - Basic Utilities Example\n');

  // Example 1: Address validation and formatting
  console.log('📍 Address Utilities:');
  const addresses = [
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    '0xabcd', // Invalid - too short
    'not-an-address', // Invalid format
  ];

  addresses.forEach((address, index) => {
    console.log(`  ${index + 1}. ${address}`);
    if (isValidAptosAddress(address)) {
      console.log(`     ✅ Valid → ${formatAddress(address)}`);
    } else {
      console.log(`     ❌ Invalid`);
    }
  });

  // Example 2: Hex conversion utilities
  console.log('\n🔢 Hex Utilities:');
  const testString = 'Hello Aptos';
  const testNumber = 12345;
  const testBytes = new TextEncoder().encode('SDK');

  console.log(`  String "${testString}" → ${toHex(testString)}`);
  console.log(`  Number ${testNumber} → ${toHex(testNumber)}`);
  console.log(`  Bytes → ${toHex(testBytes)}`);
  
  const hexValue = '0x48656c6c6f204170746f73';
  console.log(`  Hex ${hexValue} → "${new TextDecoder().decode(fromHex(hexValue))}"`);

  // Example 3: Initialize LucidClient (basic configuration)
  console.log('\n🔧 Client Initialization:');
  try {
    const client = new LucidClient({
      protocol: {
        network: 'devnet',
        rpcUrl: 'https://devnet.aptoslabs.com',
      },
    });
    
    console.log(`  ✅ Client initialized for ${client.getNetwork()}`);
    console.log(`  📡 RPC URL: ${client.getRpcUrl()}`);
  } catch (error) {
    console.log(`  ❌ Client initialization failed: ${error}`);
  }

  console.log('\n✅ Basic utilities example completed!');
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  basicUtilitiesExample().catch(console.error);
}

export { basicUtilitiesExample }; 