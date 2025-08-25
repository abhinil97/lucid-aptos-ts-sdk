// Advanced LucidClient example for the Lucid Aptos Protocol TypeScript SDK
// Demonstrates LucidClient configuration, network management, and advanced utilities
import { 
  LucidClient, 
  isValidAptosAddress,
  formatAddress,
  toHex,
  fromHex 
} from '../src';

async function lucidClientAdvancedExample() {
  console.log('🚀 LucidClient - Advanced Configuration & Network Management\n');

  try {
    // Example 1: Multi-network client configuration
    console.log('🌐 Multi-network configuration...');
    const networks = ['devnet', 'testnet', 'mainnet'] as const;
    const clients = networks.map(network => {
      try {
        return {
          network,
          client: new LucidClient({
            protocol: {
              network,
              rpcUrl: `https://${network}.aptoslabs.com`,
              faucetUrl: network !== 'mainnet' ? `https://${network}.aptoslabs.com/faucet` : undefined,
            },
            timeout: 30000,
            retries: 3,
          })
        };
      } catch (error) {
        console.log(`   ❌ Failed to initialize ${network}: ${error}`);
        return null;
      }
    }).filter(Boolean);

    clients.forEach(item => {
      if (item) {
        console.log(`   ✅ ${item.network}: ${item.client.getRpcUrl()}`);
      }
    });

    // Use testnet client for remaining examples
    const testnetClient = clients.find(c => c?.network === 'testnet')?.client;
    if (!testnetClient) throw new Error('Failed to initialize testnet client');

    // Example 2: Advanced address validation and analysis
    console.log('\n📍 Advanced address analysis...');
    const addressSamples = [
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      '0x0000000000000000000000000000000000000000000000000000000000000001', // System address
      '0x1', // Short form
      '0xabcdef', // Too short
      'invalid-format',
      '0x' + 'f'.repeat(64), // Max address
    ];

    addressSamples.forEach((address, index) => {
      console.log(`   ${index + 1}. ${address}`);
      if (isValidAptosAddress(address)) {
        console.log(`      ✅ Valid → ${formatAddress(address)}`);
        console.log(`      🏷️  Type: ${address === '0x0000000000000000000000000000000000000000000000000000000000000001' ? 'System' : 'User'}`);
      } else {
        console.log(`      ❌ Invalid`);
        console.log(`      💡 Reason: ${address.length < 66 ? 'Too short' : address.length > 66 ? 'Too long' : 'Invalid format'}`);
      }
    });

    // Example 3: Advanced hex utilities with different data types
    console.log('\n🔢 Advanced hex operations...');
    const testData = [
      { name: 'ASCII String', value: 'Hello, Lucid SDK!' },
      { name: 'Unicode String', value: '🚀 Aptos 区块链' },
      { name: 'Number', value: 1234567890 },
      { name: 'Large Number', value: BigInt('18446744073709551615') },
      { name: 'Bytes', value: new TextEncoder().encode('Binary data') },
    ];

    testData.forEach(({ name, value }) => {
      try {
        const hexValue = toHex(value as any);
        console.log(`   ${name}: ${value} → ${hexValue}`);
        
        if (typeof value === 'string') {
          const decoded = new TextDecoder().decode(fromHex(hexValue));
          console.log(`      Decoded back: "${decoded}"`);
        }
      } catch (error) {
        console.log(`   ${name}: Error converting ${value} - ${error}`);
      }
    });

    // Example 4: Client configuration management
    console.log('\n⚙️ Dynamic configuration management...');
    console.log(`   Initial config:`);
    console.log(`   • Network: ${testnetClient.getNetwork()}`);
    console.log(`   • RPC URL: ${testnetClient.getRpcUrl()}`);
    console.log(`   • Timeout: ${testnetClient.getTimeout()}ms`);
    console.log(`   • Retries: ${testnetClient.getRetries()}`);

    // Update configuration
    const configs = [
      { timeout: 60000, name: 'Extended timeout' },
      { retries: 5, name: 'More retries' },
      { timeout: 15000, retries: 1, name: 'Fast but unreliable' },
    ];

    configs.forEach(({ name, ...config }) => {
      testnetClient.updateConfig(config);
      console.log(`   Updated (${name}): timeout=${testnetClient.getTimeout()}ms, retries=${testnetClient.getRetries()}`);
    });

    // Example 5: Error handling patterns
    console.log('\n🛡️ Comprehensive error handling...');
    
    // Test invalid configurations
    const invalidConfigs = [
      { config: null, name: 'null config' },
      { config: { protocol: null }, name: 'null protocol' },
      { config: { protocol: { network: 'invalid' } }, name: 'invalid network' },
    ];

    invalidConfigs.forEach(({ config, name }) => {
      try {
        new LucidClient(config as any);
        console.log(`   ⚠️  Unexpectedly succeeded with ${name}`);
      } catch (error) {
        console.log(`   ✅ Correctly failed with ${name}: ${error instanceof Error ? error.message.slice(0, 50) : error}...`);
      }
    });

    // Test invalid address operations
    const invalidAddresses = ['', '0x', '0x123', 'not-hex', 'too-long' + 'x'.repeat(100)];
    invalidAddresses.forEach(addr => {
      try {
        formatAddress(addr);
        console.log(`   ⚠️  Unexpectedly formatted invalid address: ${addr}`);
      } catch (error) {
        console.log(`   ✅ Correctly rejected "${addr}": ${error instanceof Error ? error.message : error}`);
      }
    });

    // Example 6: Performance and resource management
    console.log('\n⚡ Performance considerations...');
    
    // Multiple client creation (resource management)
    console.log(`   Testing resource management with multiple clients...`);
    const startTime = Date.now();
    const multipleClients = Array.from({ length: 10 }, (_, i) => {
      return new LucidClient({
        protocol: {
          network: 'devnet',
          rpcUrl: 'https://devnet.aptoslabs.com',
        },
        timeout: 5000,
      });
    });
    
    const endTime = Date.now();
    console.log(`   ✅ Created ${multipleClients.length} clients in ${endTime - startTime}ms`);
    console.log(`   📊 Average: ${((endTime - startTime) / multipleClients.length).toFixed(2)}ms per client`);

    // Hex conversion performance
    console.log(`   Testing hex conversion performance...`);
    const largeString = 'x'.repeat(10000);
    const hexStartTime = Date.now();
    for (let i = 0; i < 1000; i++) {
      toHex(largeString);
    }
    const hexEndTime = Date.now();
    console.log(`   ✅ 1000 hex conversions of 10KB string: ${hexEndTime - hexStartTime}ms`);

  } catch (error) {
    console.error('❌ Advanced example failed:', error);
    
    if (error instanceof Error) {
      console.error(`   Error details: ${error.name}: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack: ${error.stack.split('\n')[1]?.trim()}`);
      }
    }
  }

  console.log('\n✅ LucidClient advanced example completed!');
  console.log('\n🎯 Advanced patterns demonstrated:');
  console.log('   • Multi-network client management');
  console.log('   • Advanced address validation');
  console.log('   • Complex hex operations');
  console.log('   • Dynamic configuration updates');
  console.log('   • Comprehensive error handling');
  console.log('   • Performance testing');
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  lucidClientAdvancedExample().catch(console.error);
}

export { lucidClientAdvancedExample }; 