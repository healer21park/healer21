import { render, screen } from '@testing-library/react'
import { KakaoMap } from './KakaoMap'

// dynamic import는 테스트에서 loading fallback을 반환
vi.mock('next/dynamic', () => ({
  default: (_fn: unknown, options: { loading?: () => React.ReactNode }) => {
    const LoadingComponent = options?.loading
    return function MockDynamic() {
      return LoadingComponent ? LoadingComponent() : null
    }
  },
}))

describe('KakaoMap', () => {
  it('지도 로딩 중 fallback을 렌더링한다', () => {
    render(<KakaoMap mountain={null} />)
    expect(screen.getByText('지도 로딩 중...')).toBeInTheDocument()
  })

  it('mountain prop을 전달받아 렌더링한다', () => {
    render(<KakaoMap mountain="jirisan" />)
    expect(screen.getByText('지도 로딩 중...')).toBeInTheDocument()
  })
})
