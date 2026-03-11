import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CustomButton from 'components/common/CustomButton'

describe('CustomButton', () => {
  it('renders with default props', () => {
    render(<CustomButton>Click me</CustomButton>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
  })

  it('renders with size s', () => {
    const { container } = render(<CustomButton size='s'>Small</CustomButton>)
    const button = container.firstChild as HTMLElement
    expect(button.className).toContain('px-2')
    expect(button.className).toContain('py-1')
  })

  it('renders with size m (default)', () => {
    const { container } = render(<CustomButton>Medium</CustomButton>)
    const button = container.firstChild as HTMLElement
    expect(button.className).toContain('px-3.5')
    expect(button.className).toContain('py-2')
  })

  it('renders with size l', () => {
    const { container } = render(<CustomButton size='l'>Large</CustomButton>)
    const button = container.firstChild as HTMLElement
    expect(button.className).toContain('px-5')
    expect(button.className).toContain('text-xl')
  })

  it('renders with primary color (default)', () => {
    const { container } = render(<CustomButton>Primary</CustomButton>)
    const button = container.firstChild as HTMLElement
    expect(button.className).toContain('bg-primary')
    expect(button.className).toContain('text-white')
  })

  it('renders with secondary color', () => {
    const { container } = render(<CustomButton color='secondary'>Secondary</CustomButton>)
    const button = container.firstChild as HTMLElement
    expect(button.className).toContain('bg-gray-400')
    expect(button.className).toContain('text-white')
  })

  it('renders with danger color', () => {
    const { container } = render(<CustomButton color='danger'>Danger</CustomButton>)
    const button = container.firstChild as HTMLElement
    expect(button.className).toContain('bg-red-600')
    expect(button.className).toContain('text-white')
  })

  it('renders outlined variant', () => {
    const { container } = render(<CustomButton outlined>Outlined</CustomButton>)
    const button = container.firstChild as HTMLElement
    expect(button.className).toContain('bg-transparent')
    expect(button.className).toContain('text-primary')
  })

  it('renders outlined secondary variant', () => {
    const { container } = render(
      <CustomButton outlined color='secondary'>
        Outlined Secondary
      </CustomButton>
    )
    const button = container.firstChild as HTMLElement
    expect(button.className).toContain('bg-transparent')
    expect(button.className).toContain('text-gray-400')
  })

  it('passes disabled prop', () => {
    render(<CustomButton disabled>Disabled</CustomButton>)
    const button = screen.getByRole('button', { name: 'Disabled' })
    expect(button).toBeDisabled()
  })

  it('passes onClick handler', () => {
    const handleClick = vi.fn()
    render(<CustomButton onClick={handleClick}>Clickable</CustomButton>)
    fireEvent.click(screen.getByRole('button', { name: 'Clickable' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    const { container } = render(<CustomButton className='my-custom-class'>Styled</CustomButton>)
    const button = container.firstChild as HTMLElement
    expect(button.className).toContain('my-custom-class')
  })
})
