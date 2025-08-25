// Error mappings for Hybrid Loan Book Move module
// Maps Move error codes to descriptive error messages

export const HYBRID_LOAN_BOOK_ERRORS = {
  1: 'E_NOT_ADMIN: Caller is not an admin',
  2: 'E_VECTOR_LENGTHS_MISMATCH: Vector lengths do not match',
  3: 'E_VECTOR_EMPTY: Vector is empty',
  4: 'E_NOT_BORROWER: Caller is not the borrower',
  5: 'E_DEPRECATED: Function is deprecated',
  6: 'E_INVALID_FUNDING_SOURCE: Invalid funding source',
  7: 'E_LOAN_BOOK_CONFIG_NOT_FOUND: Loan book config not found',
  8: 'E_LOAN_TRACKER_NOT_FOUND: Loan tracker not found',
  9: 'E_INSUFFICIENT_BALANCE: Insufficient balance',
  10: 'E_LOAN_ALREADY_EXISTS: Loan already exists',
} as const;

export type HybridLoanBookError = keyof typeof HYBRID_LOAN_BOOK_ERRORS;

/**
 * Get a descriptive error message for a given error code
 * @param errorCode The error code from the Move module
 * @returns A descriptive error message
 */
export function getErrorMessage(errorCode: number): string {
  return HYBRID_LOAN_BOOK_ERRORS[errorCode as HybridLoanBookError] || `Unknown error code: ${errorCode}`;
}

/**
 * Check if an error code is a known Hybrid Loan Book error
 * @param errorCode The error code to check
 * @returns True if the error code is known, false otherwise
 */
export function isKnownError(errorCode: number): errorCode is HybridLoanBookError {
  return errorCode in HYBRID_LOAN_BOOK_ERRORS;
}