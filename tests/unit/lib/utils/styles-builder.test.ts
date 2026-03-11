import { describe, it, expect } from 'vitest'
import { joinStyles, joinStylesFromArray } from 'lib/utils/styles-builder'

describe('joinStyles', () => {
  it('joins style values from a record', () => {
    const result = joinStyles({ base: 'text-lg', color: 'text-red-500' })
    expect(result).toBe('text-lg text-red-500')
  })

  it('returns empty string for empty record', () => {
    expect(joinStyles({})).toBe('')
  })
})

describe('joinStylesFromArray', () => {
  it('joins string arguments with spaces', () => {
    expect(joinStylesFromArray('text-lg', 'text-red-500')).toBe('text-lg text-red-500')
  })

  it('filters out false and undefined values', () => {
    expect(joinStylesFromArray('text-lg', false, undefined, 'font-bold')).toBe('text-lg font-bold')
  })

  it('returns empty string when all values are falsy', () => {
    expect(joinStylesFromArray(false, undefined)).toBe('')
  })
})
