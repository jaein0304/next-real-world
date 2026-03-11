import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from 'components/common/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders the spinner with status role', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders the Loading text for screen readers', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('applies wrap padding by default', () => {
    const { container } = render(<LoadingSpinner />)
    const outer = container.firstChild as HTMLElement
    expect(outer.className).toContain('py-24')
  })

  it('removes wrap padding when nowrap is true', () => {
    const { container } = render(<LoadingSpinner nowrap />)
    const outer = container.firstChild as HTMLElement
    expect(outer.className).not.toContain('py-24')
  })

  it('applies overlay styles when overlay is true', () => {
    render(<LoadingSpinner overlay />)
    const status = screen.getByRole('status')
    expect(status.className).toContain('absolute')
  })
})
