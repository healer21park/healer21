import { render, screen } from '@testing-library/react'
import { HikingLayout } from './HikingLayout'

describe('HikingLayout', () => {
  it('사이드바와 지도 영역을 렌더링한다', () => {
    render(
      <HikingLayout
        sidebar={<div data-testid="sidebar">사이드바</div>}
        map={<div data-testid="map">지도</div>}
      />,
    )
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('map')).toBeInTheDocument()
  })

  it('사이드바는 aside 엘리먼트다', () => {
    const { container } = render(
      <HikingLayout sidebar={<span />} map={<span />} />,
    )
    expect(container.querySelector('aside')).toBeInTheDocument()
  })
})
