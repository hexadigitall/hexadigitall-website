/** @jest-environment node */
import type { SanityClient } from '@sanity/client';

// Use global jest types and loosen mock typing to avoid tight coupling with Sanity's types
export const mockCommit = (globalThis as any).jest.fn();
export const mockSet = (globalThis as any).jest.fn().mockReturnThis();
export const mockPatch = (globalThis as any).jest.fn().mockReturnThis();
export const mockFetch = (globalThis as any).jest.fn();
export const mockTransaction = (globalThis as any).jest.fn().mockReturnThis();

export const mockClient: any = {
  fetch: mockFetch,
  transaction: mockTransaction,
  patch: mockPatch,
  set: mockSet,
  commit: mockCommit,
  config: jest.fn(),
  withConfig: jest.fn(),
  listen: jest.fn(),
  observable: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  createIfNotExists: jest.fn(),
  createOrReplace: jest.fn(),
  mutate: jest.fn(),
  getDocument: jest.fn(),
  getDocuments: jest.fn()
};