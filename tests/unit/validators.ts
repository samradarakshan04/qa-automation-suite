/**
 * Small validation utilities representative of logic a Software Assurance
 * Engineer might unit-test in isolation, separate from UI/API-level checks.
 */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): boolean {
  // At least 8 chars, one uppercase, one number
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export function sanitizeUsername(username: string): string {
  return username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
}
