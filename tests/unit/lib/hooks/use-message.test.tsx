import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { MessageProvider, useMessageHandler } from 'lib/hooks/use-message'

vi.mock('@apollo/client/react', () => ({
  useApolloClient: () => ({
    resetStore: vi.fn(),
  }),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => ({
    toString: () => '',
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('lib/hooks/use-token', () => ({
  useToken: () => ({
    token: '',
    handleChangeToken: vi.fn(),
  }),
  TokenProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('lib/hooks/use-router-methods', () => ({
  usePush: () => vi.fn(),
  useReplace: () => vi.fn(),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  return <MessageProvider>{children}</MessageProvider>
}

describe('useMessageHandler', () => {
  it('returns null message by default', () => {
    const { result } = renderHook(() => useMessageHandler(), { wrapper })
    expect(result.current.message).toBeNull()
  })

  it('sets success message', () => {
    const { result } = renderHook(() => useMessageHandler(), { wrapper })

    act(() => {
      result.current.success({ content: 'Operation succeeded', mode: 'alert' })
    })

    expect(result.current.message).toEqual({
      content: 'Operation succeeded',
      type: 'success',
      mode: 'alert',
    })
  })

  it('sets error message', () => {
    const { result } = renderHook(() => useMessageHandler(), { wrapper })

    act(() => {
      result.current.error({ content: 'Something went wrong', mode: 'toast' })
    })

    expect(result.current.message).toEqual({
      content: 'Something went wrong',
      type: 'error',
      mode: 'toast',
    })
  })

  it('sets info message', () => {
    const { result } = renderHook(() => useMessageHandler(), { wrapper })

    act(() => {
      result.current.info({ content: 'For your information', mode: 'alert' })
    })

    expect(result.current.message).toEqual({
      content: 'For your information',
      type: 'info',
      mode: 'alert',
    })
  })

  it('dismiss clears message', () => {
    const { result } = renderHook(() => useMessageHandler(), { wrapper })

    act(() => {
      result.current.success({ content: 'Temporary message', mode: 'alert' })
    })

    expect(result.current.message).not.toBeNull()

    act(() => {
      result.current.dismiss()
    })

    expect(result.current.message).toBeNull()
  })

  it('returns default context when used outside provider', () => {
    const { result } = renderHook(() => useMessageHandler())
    expect(result.current.message).toBeNull()
    expect(typeof result.current.dismiss).toBe('function')
    expect(typeof result.current.success).toBe('function')
    expect(typeof result.current.error).toBe('function')
    expect(typeof result.current.info).toBe('function')
  })
})
