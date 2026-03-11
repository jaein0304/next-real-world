import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { TokenProvider, useToken } from 'lib/hooks/use-token'
import React from 'react'

function wrapper({ children }: { children: React.ReactNode }) {
  return <TokenProvider>{children}</TokenProvider>
}

describe('useToken', () => {
  it('returns empty token by default', () => {
    const { result } = renderHook(() => useToken(), { wrapper })
    expect(result.current.token).toBe('')
  })

  it('updates token via handleChangeToken', () => {
    const { result } = renderHook(() => useToken(), { wrapper })

    act(() => {
      result.current.handleChangeToken('test-jwt-token')
    })

    expect(result.current.token).toBe('test-jwt-token')
  })

  it('returns default context when used outside provider', () => {
    const { result } = renderHook(() => useToken())
    expect(result.current.token).toBe('')
    expect(typeof result.current.handleChangeToken).toBe('function')
  })
})
