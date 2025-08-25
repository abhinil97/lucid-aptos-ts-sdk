import { LucidClient } from '../../src/clients';
import { LucidConfig, ProtocolConfig } from '../../src/types';

describe('LucidClient', () => {
  let validConfig: LucidConfig;

  beforeEach(() => {
    validConfig = {
      protocol: {
        network: 'testnet',
        rpcUrl: 'https://testnet.aptoslabs.com',
        faucetUrl: 'https://testnet.aptoslabs.com/faucet',
      },
      timeout: 30000,
      retries: 3,
    };
  });

  describe('Constructor', () => {
    it('should create a client with valid configuration', () => {
      const client = new LucidClient(validConfig);
      expect(client).toBeInstanceOf(LucidClient);
    });

    it('should throw error with invalid configuration', () => {
      expect(() => new LucidClient(null as any)).toThrow('Invalid configuration provided');
      expect(() => new LucidClient(undefined as any)).toThrow('Invalid configuration provided');
      expect(() => new LucidClient('string' as any)).toThrow('Invalid configuration provided');
    });
  });

  describe('Initialization', () => {
    it('should initialize successfully with valid config', () => {
      const client = new LucidClient(validConfig);
      expect(() => client.initialize()).not.toThrow();
      expect(client.isReady()).toBe(true);
    });

    it('should fail initialization without RPC URL', () => {
      const invalidConfig = {
        ...validConfig,
        protocol: { ...validConfig.protocol, rpcUrl: '' },
      };
      const client = new LucidClient(invalidConfig);
      expect(() => client.initialize()).toThrow('RPC URL is required');
    });
  });

  describe('Configuration Getters', () => {
    let client: LucidClient;

    beforeEach(() => {
      client = new LucidClient(validConfig);
      client.initialize();
    });

    it('should return configuration', () => {
      const config = client.getConfig();
      expect(config).toEqual(validConfig);
    });

    it('should return protocol configuration', () => {
      const protocolConfig = client.getProtocolConfig();
      expect(protocolConfig).toEqual(validConfig.protocol);
    });

    it('should return network', () => {
      expect(client.getNetwork()).toBe('testnet');
    });

    it('should return RPC URL', () => {
      expect(client.getRpcUrl()).toBe('https://testnet.aptoslabs.com');
    });

    it('should return faucet URL', () => {
      expect(client.getFaucetUrl()).toBe('https://testnet.aptoslabs.com/faucet');
    });

    it('should return timeout', () => {
      expect(client.getTimeout()).toBe(30000);
    });

    it('should return retries', () => {
      expect(client.getRetries()).toBe(3);
    });
  });

  describe('Configuration Updates', () => {
    let client: LucidClient;

    beforeEach(() => {
      client = new LucidClient(validConfig);
      client.initialize();
    });

    it('should update configuration', () => {
      const updates = { timeout: 60000 };
      client.updateConfig(updates);
      expect(client.getTimeout()).toBe(60000);
    });

    it('should preserve other configuration values', () => {
      const updates = { timeout: 60000 };
      client.updateConfig(updates);
      expect(client.getNetwork()).toBe('testnet');
      expect(client.getRpcUrl()).toBe('https://testnet.aptoslabs.com');
    });
  });

  describe('State Management', () => {
    let client: LucidClient;

    beforeEach(() => {
      client = new LucidClient(validConfig);
    });

    it('should start as not ready', () => {
      expect(client.isReady()).toBe(false);
    });

    it('should become ready after initialization', () => {
      expect(client.isReady()).toBe(false);
      client.initialize();
      expect(client.isReady()).toBe(true);
    });

    it('should reset to not ready', () => {
      client.initialize();
      expect(client.isReady()).toBe(true);
      client.reset();
      expect(client.isReady()).toBe(false);
    });
  });
}); 