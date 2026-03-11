import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CustomLink from 'components/common/CustomLink'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => ({
    toString: () => '',
  }),
}))

describe('CustomLink', () => {
  it('renders link with correct href', () => {
    render(<CustomLink href='/articles'>Articles</CustomLink>)
    const link = screen.getByRole('link', { name: 'Articles' })
    expect(link).toHaveAttribute('href', '/articles')
  })

  it('renders children correctly', () => {
    render(
      <CustomLink href='/test'>
        <span>Child content</span>
      </CustomLink>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('applies primary mode styling', () => {
    const { container } = render(
      <CustomLink href='/test' mode='primary'>
        Primary
      </CustomLink>
    )
    const link = container.firstChild as HTMLElement
    expect(link.className).toContain('text-primary')
  })

  it('applies secondary mode styling', () => {
    const { container } = render(
      <CustomLink href='/test' mode='secondary'>
        Secondary
      </CustomLink>
    )
    const link = container.firstChild as HTMLElement
    expect(link.className).toContain('text-gray-500')
  })

  it('renders with underlined prop', () => {
    const { container } = render(
      <CustomLink href='/test' underlined>
        Underlined
      </CustomLink>
    )
    const link = container.firstChild as HTMLElement
    expect(link.className).toContain('hover:underline')
  })

  it('applies no mode-specific styling with mode none', () => {
    const { container } = render(
      <CustomLink href='/test' mode='none'>
        Default
      </CustomLink>
    )
    const link = container.firstChild as HTMLElement
    expect(link.className).not.toContain('text-primary')
    expect(link.className).not.toContain('text-gray-500')
  })

  it('applies custom className', () => {
    const { container } = render(
      <CustomLink href='/test' className='extra-class'>
        Styled
      </CustomLink>
    )
    const link = container.firstChild as HTMLElement
    expect(link.className).toContain('extra-class')
  })
})
