// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const TEST_DB = path.resolve(__dirname, '..', '..', '..', 'test-comment.db')
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

describe('Comment model (SQLite integration)', () => {
  let userId: number
  let secondUserId: number
  let articleId: number

  it('creates prerequisite user and article', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'commenter',
        email: 'commenter@example.com',
        password: 'hashed_password',
      },
    })
    userId = user.id

    const secondUser = await prisma.user.create({
      data: {
        username: 'commenter2',
        email: 'commenter2@example.com',
        password: 'hashed_password',
      },
    })
    secondUserId = secondUser.id

    const article = await prisma.article.create({
      data: {
        slug: 'comment-test-article',
        title: 'Comment Test Article',
        description: 'Article for testing comments',
        body: 'Article body',
        authorId: userId,
      },
    })
    articleId = article.id

    expect(userId).toBeDefined()
    expect(secondUserId).toBeDefined()
    expect(articleId).toBeDefined()
  })

  it('creates a comment on an article', async () => {
    const comment = await prisma.comment.create({
      data: {
        body: 'This is a test comment',
        articleId,
        authorId: userId,
      },
    })

    expect(comment.id).toBeDefined()
    expect(comment.body).toBe('This is a test comment')
    expect(comment.articleId).toBe(articleId)
    expect(comment.authorId).toBe(userId)
    expect(comment.del).toBe(false)
    expect(comment.createdAt).toBeInstanceOf(Date)
    expect(comment.updatedAt).toBeInstanceOf(Date)
  })

  it('creates multiple comments on the same article', async () => {
    await prisma.comment.create({
      data: {
        body: 'Second comment',
        articleId,
        authorId: secondUserId,
      },
    })

    await prisma.comment.create({
      data: {
        body: 'Third comment',
        articleId,
        authorId: userId,
      },
    })
  })

  it('reads comments for an article', async () => {
    const comments = await prisma.comment.findMany({
      where: { articleId },
    })

    expect(comments).toHaveLength(3)
    const bodies = comments.map((c: any) => c.body).sort()
    expect(bodies).toEqual(['Second comment', 'Third comment', 'This is a test comment'])
  })

  it('reads comments with author and article relations', async () => {
    const comments = await prisma.comment.findMany({
      where: { articleId },
      include: {
        author: true,
        article: true,
      },
    })

    expect(comments).toHaveLength(3)
    for (const comment of comments) {
      expect(comment.author).not.toBeNull()
      expect(comment.author.username).toBeDefined()
      expect(comment.article).not.toBeNull()
      expect(comment.article.slug).toBe('comment-test-article')
    }
  })

  it('comment belongs to user relation', async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { comments: true },
    })

    expect(user!.comments.length).toBeGreaterThanOrEqual(2)
    for (const comment of user!.comments) {
      expect(comment.authorId).toBe(userId)
    }
  })

  it('comment belongs to article relation', async () => {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { comments: true },
    })

    expect(article!.comments).toHaveLength(3)
    for (const comment of article!.comments) {
      expect(comment.articleId).toBe(articleId)
    }
  })

  it('soft deletes a comment', async () => {
    const comments = await prisma.comment.findMany({
      where: { articleId, authorId: userId },
    })
    const commentId = comments[0].id

    const deleted = await prisma.comment.update({
      where: { id: commentId },
      data: { del: true },
    })

    expect(deleted.del).toBe(true)

    // Comment still exists in DB
    const found = await prisma.comment.findUnique({ where: { id: commentId } })
    expect(found).not.toBeNull()
    expect(found!.del).toBe(true)

    // Can filter out soft-deleted comments
    const activeComments = await prisma.comment.findMany({
      where: { articleId, del: false },
    })
    expect(activeComments).toHaveLength(2)
  })
})
