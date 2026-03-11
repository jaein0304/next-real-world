// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const TEST_DB = path.resolve(__dirname, '..', '..', '..', 'test.db')
const DATABASE_URL = `file:${TEST_DB}`

let prisma: any

beforeAll(async () => {
  // Clean up existing test DB
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB)

  // Push schema to SQLite
  execSync(`npx prisma db push --schema=prisma/schema.test.prisma --url="${DATABASE_URL}" --force-reset`, {
    env: { ...process.env, PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: 'yes' },
    stdio: 'pipe',
  })

  // Use better-sqlite3 adapter with Prisma 7 test client
  const testClientPath = path.resolve(__dirname, '..', '..', '..', 'node_modules', '.prisma', 'test-client', 'client.ts')

  // Dynamic import for the generated TS client
  const { PrismaClient } = await import(testClientPath)
  const adapter = new PrismaBetterSqlite3({ url: TEST_DB })
  prisma = new PrismaClient({ adapter })
})

afterAll(async () => {
  if (prisma) await prisma.$disconnect()
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB)
})

describe('User model (SQLite integration)', () => {
  it('creates a user', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
      },
    })

    expect(user.id).toBeDefined()
    expect(user.username).toBe('testuser')
    expect(user.email).toBe('test@example.com')
  })

  it('enforces unique email constraint', async () => {
    await expect(
      prisma.user.create({
        data: {
          username: 'another',
          email: 'test@example.com',
          password: 'hashed_password',
        },
      })
    ).rejects.toThrow()
  })

  it('enforces unique username constraint', async () => {
    await expect(
      prisma.user.create({
        data: {
          username: 'testuser',
          email: 'different@example.com',
          password: 'hashed_password',
        },
      })
    ).rejects.toThrow()
  })

  it('finds user by email', async () => {
    const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } })
    expect(user).not.toBeNull()
    expect(user!.username).toBe('testuser')
  })
})
