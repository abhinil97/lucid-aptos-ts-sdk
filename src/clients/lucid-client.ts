import type { LucidConfig, ProtocolConfig } from '../types';
import { validateConfig } from '../utils';

/**
 * Main client for interacting with the Lucid Aptos Protocol
 */
export class LucidClient {
  private config: LucidConfig;
  private isInitialized: boolean = false;

  constructor(config: LucidConfig) {
    if (!validateConfig(config)) {
      throw new Error('Invalid configuration provided');
    }
    this.config = config;
  }

  /**
   * Initialize the client
   */
  initialize(): void {
    try {
      // Validate protocol configuration
      if (!this.config.protocol.rpcUrl) {
        throw new Error('RPC URL is required');
      }

      // TODO: Add connection testing and validation
      // TODO: Add authentication setup if needed

      this.isInitialized = true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to initialize Lucid client: ${errorMessage}`);
    }
  }

  /**
   * Check if the client is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get the current configuration
   */
  getConfig(): LucidConfig {
    return { ...this.config };
  }

  /**
   * Get protocol configuration
   */
  getProtocolConfig(): ProtocolConfig {
    return { ...this.config.protocol };
  }

  /**
   * Get network information
   */
  getNetwork(): string {
    return this.config.protocol.network;
  }

  /**
   * Get RPC URL
   */
  getRpcUrl(): string {
    return this.config.protocol.rpcUrl;
  }

  /**
   * Get faucet URL if available
   */
  getFaucetUrl(): string | undefined {
    return this.config.protocol.faucetUrl;
  }

  /**
   * Get timeout configuration
   */
  getTimeout(): number | undefined {
    return this.config.timeout;
  }

  /**
   * Get retry configuration
   */
  getRetries(): number | undefined {
    return this.config.retries;
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<LucidConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Reset client to uninitialized state
   */
  reset(): void {
    this.isInitialized = false;
  }
}
