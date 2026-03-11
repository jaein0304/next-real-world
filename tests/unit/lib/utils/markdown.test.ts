import { describe, it, expect } from 'vitest'
import markdown from 'lib/utils/markdown'

describe('Markdown', () => {
  it('parses basic markdown to HTML', () => {
    const result = markdown.parse('**bold**')
    expect(result).toContain('<strong>bold</strong>')
  })

  it('parses GFM line breaks', () => {
    const result = markdown.parse('line1\nline2')
    expect(result).toContain('<br>')
  })

  it('parses code blocks with language', () => {
    const result = markdown.parse('```javascript\nconst x = 1;\n```')
    expect(result).toContain('<code')
    expect(result).toContain('const')
  })

  it('returns singleton instance', () => {
    const instance1 = markdown
    const instance2 = markdown
    expect(instance1).toBe(instance2)
  })
})
