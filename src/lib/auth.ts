/**
 * Password hashing and verification utilities for user authentication
 * Uses Node.js crypto for secure password handling without external dependencies
 */

import crypto from 'crypto'

/**
 * Generate a random salt for password hashing
 */
export function generateSalt(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Hash a password with a salt using PBKDF2
 * @param password - Plain text password
 * @param salt - Salt to use (or generate one if not provided)
 * @returns Object containing hash and salt
 */
export function hashPassword(
  password: string,
  salt?: string
): { hash: string; salt: string } {
  const useSalt = salt || generateSalt()
  const hash = crypto
    .pbkdf2Sync(password, useSalt, 100000, 64, 'sha512')
    .toString('hex')
  return { hash, salt: useSalt }
}

/**
 * Verify a password against a stored hash
 * @param password - Plain text password to verify
 * @param hash - Stored password hash
 * @param salt - Salt used to create the hash
 * @returns True if password matches, false otherwise
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: newHash } = hashPassword(password, salt)
  return newHash === hash
}

/**
 * Generate a temporary password for new users
 * @returns A readable temporary password
 */
export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

/**
 * Validate password strength
 * Must be at least 8 characters, contain uppercase, lowercase, number, and special char
 */
export function isPasswordStrong(password: string): boolean {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  if (!/[!@#$%^&*]/.test(password)) return false
  return true
}
