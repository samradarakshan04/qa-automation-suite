import { describe, it, expect } from 'vitest';
import { isValidEmail, isStrongPassword, sanitizeUsername } from './validators';

/**
 * Traceability: TC-UNIT-001 through TC-UNIT-006 (see docs/test-plan.md)
 */
describe('isValidEmail', () => {
  it('TC-UNIT-001: accepts a well-formed email', () => {
    expect(isValidEmail('jane.doe@4tel.com.au')).toBe(true);
  });

  it('TC-UNIT-002: rejects an email missing the @ symbol', () => {
    expect(isValidEmail('jane.doe4tel.com.au')).toBe(false);
  });
});

describe('isStrongPassword', () => {
  it('TC-UNIT-003: accepts a password with uppercase, number, and 8+ chars', () => {
    expect(isStrongPassword('Newcastle1')).toBe(true);
  });

  it('TC-UNIT-004: rejects a password under 8 characters', () => {
    expect(isStrongPassword('Aa1')).toBe(false);
  });

  it('TC-UNIT-005: rejects a password with no uppercase letter', () => {
    expect(isStrongPassword('newcastle1')).toBe(false);
  });
});

describe('sanitizeUsername', () => {
  it('TC-UNIT-006: trims, lowercases, and strips invalid characters', () => {
    expect(sanitizeUsername('  Samra.D! ')).toBe('samra.d');
  });
});
