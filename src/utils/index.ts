// Utils module exports
// This module contains utility functions used throughout the SDK

// Address utilities
export const isValidAptosAddress = (address: string): boolean => {
  // Basic Aptos address validation (64 character hex string)
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};

export const formatAddress = (address: string): string => {
  if (!isValidAptosAddress(address)) {
    throw new Error('Invalid Aptos address');
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Hex utilities
export const toHex = (value: string | number | Uint8Array): string => {
  if (value instanceof Uint8Array) {
    return (
      '0x' +
      Array.from(value)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    );
  }
  if (typeof value === 'string') {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(value);
    return (
      '0x' +
      Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    );
  }
  return '0x' + value.toString(16);
};

export const fromHex = (hex: string): Uint8Array => {
  if (!hex.startsWith('0x')) {
    hex = '0x' + hex;
  }
  const hexString = hex.slice(2);
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return bytes;
};

// Validation utilities
export const validateConfig = (config: unknown): boolean => {
  return config !== null && config !== undefined && typeof config === 'object';
};

// Placeholder export to prevent module resolution errors
export const UTILS_MODULE = 'utils';
