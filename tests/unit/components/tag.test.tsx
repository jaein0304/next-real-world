import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Tag from 'components/common/Tag'

describe('Tag', () => {
  it('renders children text', () => {
    render(<Tag>javascript</Tag>)
    expect(screen.getByText('javascript')).toBeInTheDocument()
  })

  it('applies default size m', () => {
    const { container } = render(<Tag>test</Tag>)
    const tag = container.firstChild as HTMLElement
    expect(tag.className).toContain('text-lg')
  })

  it('applies small size styles', () => {
    const { container } = render(<Tag size='s'>test</Tag>)
    const tag = container.firstChild as HTMLElement
    expect(tag.className).toContain('text-sm')
  })

  it('applies outline styles when outlined', () => {
    const { container } = render(<Tag outlined>test</Tag>)
    const tag = container.firstChild as HTMLElement
    expect(tag.className).toContain('text-gray-400')
  })

  it('applies custom className', () => {
    const { container } = render(<Tag className='custom-class'>test</Tag>)
    const tag = container.firstChild as HTMLElement
    expect(tag.className).toContain('custom-class')
  })
})
