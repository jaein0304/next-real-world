import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import Compose from 'lib/utils/compose'

function ProviderA({ children }: { children: React.ReactNode }) {
  return <div data-testid='provider-a'>{children}</div>
}

function ProviderB({ children }: { children: React.ReactNode }) {
  return <div data-testid='provider-b'>{children}</div>
}

function ProviderC({ children }: { children: React.ReactNode }) {
  return <div data-testid='provider-c'>{children}</div>
}

describe('Compose', () => {
  it('renders children without providers', () => {
    render(
      <Compose components={[]}>
        <span>Hello</span>
      </Compose>
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('wraps children with a single provider', () => {
    render(
      <Compose components={[ProviderA]}>
        <span>Content</span>
      </Compose>
    )
    expect(screen.getByTestId('provider-a')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('composes multiple providers in correct order', () => {
    const { container } = render(
      <Compose components={[ProviderA, ProviderB, ProviderC]}>
        <span>Nested</span>
      </Compose>
    )
    // ProviderA should be outermost, ProviderC innermost
    const a = screen.getByTestId('provider-a')
    const b = screen.getByTestId('provider-b')
    const c = screen.getByTestId('provider-c')

    expect(a).toContainElement(b)
    expect(b).toContainElement(c)
    expect(c).toContainElement(screen.getByText('Nested'))
  })

  it('renders children text content correctly through providers', () => {
    render(
      <Compose components={[ProviderA, ProviderB]}>
        <span>Deep child</span>
      </Compose>
    )
    expect(screen.getByText('Deep child')).toBeInTheDocument()
  })
})
