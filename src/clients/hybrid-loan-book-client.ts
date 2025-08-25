// Hybrid Loan Book Client for interacting with the pact::hybrid_loan_book module
// Main SDK client that orchestrates all builders and provides transaction submission

import { Aptos, AptosConfig, Network, Account } from '@aptos-labs/ts-sdk';
import type { InputEntryFunctionData, UserTransactionResponse } from '@aptos-labs/ts-sdk';
import type { LucidConfig, BuilderResult, NetworkName } from '../types';
import { DEFAULT_NETWORK_CONFIGS } from '../config/networks';
import { LoanCreationBuilder } from '../builders/loan-creation';
import { LoanRepaymentBuilder } from '../builders/loan-repayment';
import { PaymentScheduleBuilder } from '../builders/payment-schedule';
import { DocumentBuilder } from '../builders/documents';
import { ConfigurationBuilder } from '../builders/configuration';

/**
 * Main client for interacting with the Hybrid Loan Book module
 * Provides type-safe builders for all loan book functions
 */
export class HybridLoanBookClient {
  private aptos: Aptos;
  private config: LucidConfig;
  private moduleAddress: string;

  // Builder instances
  public readonly loanCreation: LoanCreationBuilder;
  public readonly loanRepayment: LoanRepaymentBuilder;
  public readonly paymentSchedule: PaymentScheduleBuilder;
  public readonly documents: DocumentBuilder;
  public readonly configuration: ConfigurationBuilder;

  constructor(config: Partial<LucidConfig> = {}) {
    // Set up default configuration
    const network = config.protocol?.network || 'devnet';
    const networkConfig = DEFAULT_NETWORK_CONFIGS[network as NetworkName];

    this.config = {
      protocol: {
        network,
        rpcUrl: config.protocol?.rpcUrl || networkConfig.rpcUrl,
        ...(networkConfig.faucetUrl && {
          faucetUrl: config.protocol?.faucetUrl || networkConfig.faucetUrl,
        }),
      },
      moduleAddress: config.moduleAddress || networkConfig.moduleAddress,
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
    };

    this.moduleAddress = this.config.moduleAddress!;

    // Initialize Aptos SDK client
    const aptosConfig = new AptosConfig({
      network: this.getAptosNetwork(network),
      fullnode: this.config.protocol.rpcUrl,
    });
    this.aptos = new Aptos(aptosConfig);

    // Initialize builders
    this.loanCreation = new LoanCreationBuilder(this.moduleAddress);
    this.loanRepayment = new LoanRepaymentBuilder(this.moduleAddress);
    this.paymentSchedule = new PaymentScheduleBuilder(this.moduleAddress);
    this.documents = new DocumentBuilder(this.moduleAddress);
    this.configuration = new ConfigurationBuilder(this.moduleAddress);
  }

  /**
   * Convert our NetworkName to Aptos SDK Network
   */
  private getAptosNetwork(network: NetworkName): Network {
    switch (network) {
      case 'mainnet':
        return Network.MAINNET;
      case 'testnet':
        return Network.TESTNET;
      case 'devnet':
        return Network.DEVNET;
      default:
        return Network.DEVNET;
    }
  }

  /**
   * Get the current configuration
   */
  getConfig(): LucidConfig {
    return { ...this.config };
  }

  /**
   * Get the module address
   */
  getModuleAddress(): string {
    return this.moduleAddress;
  }

  /**
   * Get the underlying Aptos client
   */
  getAptosClient(): Aptos {
    return this.aptos;
  }

  /**
   * Build a transaction from a BuilderResult
   * This converts our BuilderResult to the format expected by aptos-ts-sdk
   */
  buildTransaction(builderResult: BuilderResult): InputEntryFunctionData {
    return {
      function: builderResult.function,
      typeArguments: builderResult.typeArguments || [],
      functionArguments: builderResult.functionArguments,
    };
  }

  /**
   * Submit a transaction using our SDK wrapper
   * This is a convenience method that wraps aptos-ts-sdk functionality
   */
  async submitTransaction(
    signer: Account,
    builderResult: BuilderResult
  ): Promise<UserTransactionResponse> {
    try {
      // Build the transaction
      const transactionData = this.buildTransaction(builderResult);

      // Create the transaction
      const transaction = await this.aptos.transaction.build.simple({
        sender: signer.accountAddress,
        data: transactionData,
      });

      // Sign and submit
      const pendingTxn = await this.aptos.signAndSubmitTransaction({
        signer,
        transaction,
      });

      // Wait for confirmation
      const response = await this.aptos.waitForTransaction({
        transactionHash: pendingTxn.hash,
      });

      return response as UserTransactionResponse;
    } catch (error) {
      throw new Error(
        `Transaction failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Simulate a transaction without submitting it
   * Useful for gas estimation and testing
   */
  async simulateTransaction(signer: Account, builderResult: BuilderResult): Promise<any> {
    try {
      const transactionData = this.buildTransaction(builderResult);

      const transaction = await this.aptos.transaction.build.simple({
        sender: signer.accountAddress,
        data: transactionData,
      });

      return await this.aptos.transaction.simulate.simple({
        signerPublicKey: signer.publicKey,
        transaction,
      });
    } catch (error) {
      throw new Error(
        `Simulation failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(
    signer: Account,
    builderResult: BuilderResult
  ): Promise<{
    gasUnitPrice: number;
    maxGasAmount: number;
    estimatedGasUsed: number;
  }> {
    const simulation = await this.simulateTransaction(signer, builderResult);
    return {
      gasUnitPrice: Number(simulation[0].gas_unit_price),
      maxGasAmount: Number(simulation[0].max_gas_amount),
      estimatedGasUsed: Number(simulation[0].gas_used),
    };
  }

  /**
   * Create a simple transaction that users can submit directly with aptos-ts-sdk
   * This is the main integration point - returns InputEntryFunctionData
   */
  async createTransaction(builderResult: BuilderResult): Promise<InputEntryFunctionData> {
    return this.buildTransaction(builderResult);
  }
}
