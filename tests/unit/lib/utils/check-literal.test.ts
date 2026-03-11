import { describe, it, expect } from 'vitest'
import { isInArray } from 'lib/utils/check-literal'

describe('isInArray', () => {
  it('returns true when item exists in array', () => {
    expect(isInArray('a', ['a', 'b', 'c'] as const)).toBe(true)
  })

  it('returns false when item does not exist in array', () => {
    expect(isInArray('d', ['a', 'b', 'c'] as const)).toBe(false)
  })

  it('works with number arrays', () => {
    expect(isInArray(1, [1, 2, 3] as const)).toBe(true)
    expect(isInArray(4, [1, 2, 3] as const)).toBe(false)
  })
})
