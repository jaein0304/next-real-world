import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

const TEST_DB_PATH = path.resolve(__dirname, '..', 'test.db')

export function setupTestDatabase() {
  // Remove existing test DB
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH)
  }

  // Push test schema to SQLite
  execSync('npx prisma db push --schema=prisma/schema.test.prisma --skip-generate', {
    env: {
      ...process.env,
      DATABASE_URL: `file:${TEST_DB_PATH}`,
    },
    stdio: 'pipe',
  })
}

export function teardownTestDatabase() {
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH)
  }
}
