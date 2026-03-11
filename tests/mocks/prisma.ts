import { PrismaClient } from '@prisma/client'
import { vi } from 'vitest'

// For unit tests: mock Prisma client
export function createMockPrismaClient() {
  return {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    article: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    comment: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tag: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    favorites: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    follows: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
    $disconnect: vi.fn(),
  } as unknown as PrismaClient
}

// For integration tests: real Prisma client with test SQLite DB
export function createTestPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./test.db',
      },
    },
  })
}
