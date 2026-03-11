// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

const TEST_DB = path.resolve(__dirname, '..', '..', '..', 'test.db')
const DATABASE_URL = `file:${TEST_DB}`

let prisma: any

beforeAll(async () => {
  // Clean up existing test DB
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB)

  // Push schema to SQLite (client already generated via prisma generate --schema=prisma/schema.test.prisma)
  execSync('npx prisma db push --schema=prisma/schema.test.prisma --skip-generate', {
    env: { ...process.env, DATABASE_URL },
    stdio: 'pipe',
  })

  // Use require for node_modules path (avoids Vite resolution issues)
  const testClientPath = path.resolve(__dirname, '..', '..', '..', 'node_modules', '.prisma', 'test-client')
  const { PrismaClient } = require(testClientPath)
  prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } })
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
