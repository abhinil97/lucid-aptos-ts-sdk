// Documents builders for Hybrid Loan Book with proper Move type safety
// Handles add_document and add_document_for functions

import { HybridLoanBookBuilder } from './base';
import type {
  EnhancedBuilderResult,
  AccountAddress,
  ObjectAddress,
  VectorU8,
  MoveString,
  DocumentParams,
} from '../types';
import { MoveTypes } from '../types';

/**
 * Builder for the add_document function
 * Add a document to a loan
 */
export class AddDocumentBuilder extends HybridLoanBookBuilder {
  private loan?: ObjectAddress;
  private name?: MoveString;
  private description?: MoveString;
  private hash?: VectorU8;

  constructor(moduleAddress: string) {
    super(moduleAddress, 'add_document');
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setName(name: string): this {
    this.name = MoveTypes.moveString(name);
    return this;
  }

  setDescription(description: string): this {
    this.description = MoveTypes.moveString(description);
    return this;
  }

  setHash(hash: VectorU8): this {
    this.hash = hash;
    return this;
  }

  setHashFromString(hashString: string): this {
    this.hash = new TextEncoder().encode(hashString);
    return this;
  }

  setHashFromHex(hexHash: string): this {
    // Remove 0x prefix if present
    const cleanHex = hexHash.startsWith('0x') ? hexHash.slice(2) : hexHash;
    const matches = cleanHex.match(/.{1,2}/g);
    this.hash = new Uint8Array(matches ? matches.map(byte => parseInt(byte, 16)) : []);
    return this;
  }

  build(): EnhancedBuilderResult {
    if (!this.loan) throw new Error('Loan is required');
    if (!this.name) throw new Error('Document name is required');
    if (!this.description) throw new Error('Document description is required');
    if (!this.hash) throw new Error('Document hash is required');

    const functionArguments = [this.loan, this.name, this.description, Array.from(this.hash)];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Builder for the add_document_for function
 * Add a document to a loan (with additional sender parameter)
 * Note: The Move function has _sender parameter which appears to be unused
 */
export class AddDocumentForBuilder extends HybridLoanBookBuilder {
  private sender?: AccountAddress;
  private loan?: ObjectAddress;
  private name?: MoveString;
  private description?: MoveString;
  private hash?: VectorU8;

  constructor(moduleAddress: string) {
    super(moduleAddress, 'add_document_for');
  }

  setSender(sender: AccountAddress): this {
    this.sender = sender;
    return this;
  }

  setLoan(loan: ObjectAddress): this {
    this.loan = loan;
    return this;
  }

  setName(name: string): this {
    this.name = MoveTypes.moveString(name);
    return this;
  }

  setDescription(description: string): this {
    this.description = MoveTypes.moveString(description);
    return this;
  }

  setHash(hash: VectorU8): this {
    this.hash = hash;
    return this;
  }

  setHashFromString(hashString: string): this {
    this.hash = new TextEncoder().encode(hashString);
    return this;
  }

  setHashFromHex(hexHash: string): this {
    // Remove 0x prefix if present
    const cleanHex = hexHash.startsWith('0x') ? hexHash.slice(2) : hexHash;
    const matches = cleanHex.match(/.{1,2}/g);
    this.hash = new Uint8Array(matches ? matches.map(byte => parseInt(byte, 16)) : []);
    return this;
  }

  build(): EnhancedBuilderResult {
    if (!this.sender) throw new Error('Sender is required');
    if (!this.loan) throw new Error('Loan is required');
    if (!this.name) throw new Error('Document name is required');
    if (!this.description) throw new Error('Document description is required');
    if (!this.hash) throw new Error('Document hash is required');

    const functionArguments = [
      this.sender,
      this.loan,
      this.name,
      this.description,
      Array.from(this.hash),
    ];

    return this.createEnhancedBuilderResult([], functionArguments);
  }
}

/**
 * Unified document management builder that provides access to all document methods
 */
export class DocumentBuilder {
  private moduleAddress: string;

  constructor(moduleAddress: string) {
    this.moduleAddress = moduleAddress;
  }

  /**
   * Create a document using validated parameters (recommended)
   */
  createDocument(params: DocumentParams): AddDocumentBuilder {
    return new AddDocumentBuilder(this.moduleAddress)
      .setLoan(params.loan)
      .setName(params.name)
      .setDescription(params.description)
      .setHash(params.hash);
  }

  /**
   * Create an add_document builder
   */
  addDocument(): AddDocumentBuilder {
    return new AddDocumentBuilder(this.moduleAddress);
  }

  /**
   * Create an add_document_for builder
   */
  addDocumentFor(): AddDocumentForBuilder {
    return new AddDocumentForBuilder(this.moduleAddress);
  }
}

// Export utility functions for working with documents
export const DocumentUtils = {
  /**
   * Generate SHA-256 hash of document content
   */
  async generateDocumentHash(content: string | Uint8Array): Promise<VectorU8> {
    const encoder = new TextEncoder();
    const data = typeof content === 'string' ? encoder.encode(content) : content;

    // Use Web Crypto API for hashing
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(hashBuffer);
  },

  /**
   * Generate IPFS-style hash (placeholder - would need actual IPFS implementation)
   */
  generateIPFSHash(content: string | Uint8Array): VectorU8 {
    // This is a simplified version - in production you'd want actual IPFS hashing
    const encoder = new TextEncoder();
    const data = typeof content === 'string' ? encoder.encode(content) : content;

    if (!data) {
      throw new Error('Content cannot be null or undefined');
    }

    // Simple hash for demonstration (NOT production ready)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const byte = data[i];
      if (byte !== undefined) {
        hash = ((hash << 5) - hash + byte) & 0xffffffff;
      }
    }

    // Convert to bytes
    const hashBytes = new Uint8Array(4);
    hashBytes[0] = (hash >>> 24) & 0xff;
    hashBytes[1] = (hash >>> 16) & 0xff;
    hashBytes[2] = (hash >>> 8) & 0xff;
    hashBytes[3] = hash & 0xff;

    return hashBytes;
  },

  /**
   * Create document hash from hex string
   */
  hashFromHex(hexString: string): VectorU8 {
    const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    return new Uint8Array(cleanHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
  },

  /**
   * Convert document hash to hex string
   */
  hashToHex(hash: VectorU8): string {
    return (
      '0x' +
      Array.from(hash)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
    );
  },

  /**
   * Validate document name/description length
   */
  validateDocumentString(str: string, maxLength: number = 255): boolean {
    return str.length > 0 && str.length <= maxLength && Buffer.byteLength(str, 'utf8') <= maxLength;
  },

  /**
   * Create a document metadata object
   */
  createDocumentMetadata(
    name: string,
    description: string,
    mimeType?: string,
    size?: number,
    uploadedAt?: Date
  ): {
    name: MoveString;
    description: MoveString;
    metadata: {
      mimeType?: string;
      size?: number;
      uploadedAt?: string;
    };
  } {
    if (!DocumentUtils.validateDocumentString(name)) {
      throw new Error('Document name is invalid or too long');
    }
    if (!DocumentUtils.validateDocumentString(description)) {
      throw new Error('Document description is invalid or too long');
    }

    return {
      name: MoveTypes.moveString(name),
      description: MoveTypes.moveString(description),
      metadata: {
        ...(mimeType && { mimeType }),
        ...(size !== undefined && { size }),
        ...(uploadedAt && { uploadedAt: uploadedAt.toISOString() }),
      },
    };
  },
};
