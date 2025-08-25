// Configuration builders for Hybrid Loan Book
// Handles set_auto_pledge_config and other configuration functions

import { HybridLoanBookBuilder } from "./index";
import type { BuilderResult, ObjectAddress } from "../types";

/**
 * Builder for the set_auto_pledge_config function
 * Configure auto-pledge settings for a loan book
 */
export class SetAutoPledgeConfigBuilder extends HybridLoanBookBuilder {
  private config?: ObjectAddress;
  private enabled?: boolean;
  private facility?: ObjectAddress;

  constructor(moduleAddress: string) {
    super(moduleAddress, "set_auto_pledge_config");
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

  build(): BuilderResult {
    if (!this.config) throw new Error("Config is required");
    if (this.enabled === undefined) throw new Error("Enabled flag is required");
    if (!this.facility) throw new Error("Facility is required");

    const functionArguments = [
      this.config,
      this.enabled,
      this.facility,
    ];

    return this.createBuilderResult([], functionArguments);
  }
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
   * Create a set_auto_pledge_config builder
   */
  setAutoPledgeConfig(): SetAutoPledgeConfigBuilder {
    return new SetAutoPledgeConfigBuilder(this.moduleAddress);
  }
}