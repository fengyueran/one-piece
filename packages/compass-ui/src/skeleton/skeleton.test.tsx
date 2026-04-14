import React from 'react'
import { render, screen } from '@testing-library/react'

import { ThemeProvider } from '../theme'
import Skeleton from './skeleton'

describe('Skeleton', () => {
  it('should render avatar and rows when loading', () => {
    render(
      <ThemeProvider>
        <Skeleton avatar rows={2} />
      </ThemeProvider>,
    )

    expect(document.querySelector('.compass-skeleton-avatar')).toBeInTheDocument()
    expect(document.querySelectorAll('.compass-skeleton-row')).toHaveLength(2)
  })

  it('should render children when loading is false', () => {
    render(
      <ThemeProvider>
        <Skeleton loading={false}>
          <div>真实内容</div>
        </Skeleton>
      </ThemeProvider>,
    )

    expect(screen.getByText('真实内容')).toBeInTheDocument()
    expect(document.querySelector('.compass-skeleton')).not.toBeInTheDocument()
  })
})
