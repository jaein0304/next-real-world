// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const TEST_DB = path.resolve(__dirname, '..', '..', '..', 'test-article.db')
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

describe('Article model (SQLite integration)', () => {
  let authorId: number

  it('creates a user as author', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'articleauthor',
        email: 'author@example.com',
        password: 'hashed_password',
      },
    })

    authorId = user.id
    expect(user.id).toBeDefined()
  })

  it('creates an article', async () => {
    const article = await prisma.article.create({
      data: {
        slug: 'test-article',
        title: 'Test Article',
        description: 'A test article description',
        body: 'The body of the test article',
        authorId,
      },
    })

    expect(article.id).toBeDefined()
    expect(article.slug).toBe('test-article')
    expect(article.title).toBe('Test Article')
    expect(article.description).toBe('A test article description')
    expect(article.body).toBe('The body of the test article')
    expect(article.authorId).toBe(authorId)
    expect(article.del).toBe(false)
    expect(article.favoritesCount).toBe(0)
    expect(article.createdAt).toBeInstanceOf(Date)
    expect(article.updatedAt).toBeInstanceOf(Date)
  })

  it('reads article by slug', async () => {
    const article = await prisma.article.findFirst({
      where: { slug: 'test-article' },
    })

    expect(article).not.toBeNull()
    expect(article!.slug).toBe('test-article')
    expect(article!.title).toBe('Test Article')
  })

  it('reads article with author relation', async () => {
    const article = await prisma.article.findFirst({
      where: { slug: 'test-article' },
      include: { author: true },
    })

    expect(article).not.toBeNull()
    expect(article!.author).not.toBeNull()
    expect(article!.author.username).toBe('articleauthor')
  })

  it('updates article fields', async () => {
    const article = await prisma.article.findFirst({
      where: { slug: 'test-article' },
    })

    const updated = await prisma.article.update({
      where: { id: article!.id },
      data: {
        title: 'Updated Title',
        description: 'Updated description',
        body: 'Updated body content',
      },
    })

    expect(updated.title).toBe('Updated Title')
    expect(updated.description).toBe('Updated description')
    expect(updated.body).toBe('Updated body content')
    expect(updated.slug).toBe('test-article') // slug unchanged
  })

  it('soft deletes an article', async () => {
    const article = await prisma.article.findFirst({
      where: { slug: 'test-article' },
    })

    const deleted = await prisma.article.update({
      where: { id: article!.id },
      data: { del: true },
    })

    expect(deleted.del).toBe(true)

    // Article still exists in DB, just marked as deleted
    const found = await prisma.article.findFirst({
      where: { slug: 'test-article' },
    })
    expect(found).not.toBeNull()
    expect(found!.del).toBe(true)

    // Can filter out soft-deleted articles
    const notDeleted = await prisma.article.findFirst({
      where: { slug: 'test-article', del: false },
    })
    expect(notDeleted).toBeNull()

    // Restore for subsequent tests
    await prisma.article.update({
      where: { id: article!.id },
      data: { del: false },
    })
  })

  it('enforces unique slug constraint', async () => {
    await expect(
      prisma.article.create({
        data: {
          slug: 'test-article',
          title: 'Duplicate Slug Article',
          description: 'Another article',
          body: 'Body text',
          authorId,
        },
      })
    ).rejects.toThrow()
  })

  it('connects tags to an article via ArticlesTags', async () => {
    // Create tags
    const tag1 = await prisma.tag.create({ data: { name: 'javascript' } })
    const tag2 = await prisma.tag.create({ data: { name: 'testing' } })

    // Create a new article with tags
    const article = await prisma.article.create({
      data: {
        slug: 'tagged-article',
        title: 'Tagged Article',
        description: 'An article with tags',
        body: 'Body with tags',
        authorId,
        tags: {
          create: [
            { tagId: tag1.id },
            { tagId: tag2.id },
          ],
        },
      },
      include: {
        tags: { include: { tag: true } },
      },
    })

    expect(article.tags).toHaveLength(2)
    const tagNames = article.tags.map((at: any) => at.tag.name).sort()
    expect(tagNames).toEqual(['javascript', 'testing'])
  })

  it('enforces unique tag name constraint', async () => {
    await expect(
      prisma.tag.create({ data: { name: 'javascript' } })
    ).rejects.toThrow()
  })

  it('lists articles by author', async () => {
    const articles = await prisma.article.findMany({
      where: { authorId },
    })

    expect(articles.length).toBeGreaterThanOrEqual(2)
    for (const article of articles) {
      expect(article.authorId).toBe(authorId)
    }
  })
})
