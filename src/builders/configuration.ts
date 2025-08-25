// Configuration builders for Hybrid Loan Book with proper Move type safety
// Handles set_auto_pledge_config and other configuration functions

import { HybridLoanBookBuilder } from './base';
import type { EnhancedBuilderResult, ObjectAddress } from '../types';

/**
 * Builder for the set_auto_pledge_config function
 * Configure auto-pledge settings for a loan book
 */
export class SetAutoPledgeConfigBuilder extends HybridLoanBookBuilder {
  private config?: ObjectAddress;
  private enabled?: boolean;
  private facility?: ObjectAddress;

  constructor(moduleAddress: string) {
    super(moduleAddress, 'set_auto_pledge_config');
  }

  setConfig(config: ObjectAddress): this {
    this.config = config;
    return this;
  }

  setEnabled(enabled: boolean): this {
    this.enabled = enabled;
    return this;
  }

  setFacility(facility: ObjectAddress): this {
    this.facility = facility;
    return this;
  }

  build(): EnhancedBuilderResult {
    if (!this.config) throw new Error('Config is required');
    if (this.enabled === undefined) throw new Error('Enabled flag is required');
    if (!this.facility) throw new Error('Facility is required');

    const functionArguments = [this.config, this.enabled, this.facility];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Auto-pledge configuration parameters
 */
export interface AutoPledgeConfig {
  config: ObjectAddress;
  enabled: boolean;
  facility: ObjectAddress;
}

/**
 * Unified configuration builder that provides access to all configuration methods
 */
export class ConfigurationBuilder {
  private moduleAddress: string;

  constructor(moduleAddress: string) {
    this.moduleAddress = moduleAddress;
  }

  /**
   * Create auto-pledge config using validated parameters (recommended)
   */
  createAutoPledgeConfig(params: AutoPledgeConfig): SetAutoPledgeConfigBuilder {
    return new SetAutoPledgeConfigBuilder(this.moduleAddress)
      .setConfig(params.config)
      .setEnabled(params.enabled)
      .setFacility(params.facility);
  }

  /**
   * Create a set_auto_pledge_config builder
   */
  setAutoPledgeConfig(): SetAutoPledgeConfigBuilder {
    return new SetAutoPledgeConfigBuilder(this.moduleAddress);
  }
}

// Export utility functions for working with configurations
export const ConfigurationUtils = {
  /**
   * Validate facility address format
   */
  validateFacilityAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{1,64}$/.test(address);
  },

  /**
   * Validate loan book config address format
   */
  validateConfigAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{1,64}$/.test(address);
  },

  /**
   * Create auto-pledge configuration with validation
   */
  createValidatedAutoPledgeConfig(
    config: string,
    enabled: boolean,
    facility: string
  ): AutoPledgeConfig {
    if (!ConfigurationUtils.validateConfigAddress(config)) {
      throw new Error(`Invalid config address: ${config}`);
    }
    if (!ConfigurationUtils.validateFacilityAddress(facility)) {
      throw new Error(`Invalid facility address: ${facility}`);
    }

    return {
      config: config as ObjectAddress,
      enabled,
      facility: facility as ObjectAddress,
    };
  },
};
