import { render, screen } from '@testing-library/react'
import { KakaoMap } from './KakaoMap'

// Kakao Maps SDK는 브라우저 전용이므로 테스트에서 mock
vi.mock('next/script', () => ({
  default: ({ onLoad }: { onLoad?: () => void }) => {
    onLoad?.()
    return null
  },
}))

describe('KakaoMap', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('API 키 미설정 시 오류 메시지를 표시한다', () => {
    vi.stubEnv('NEXT_PUBLIC_KAKAO_MAP_API_KEY', '')
    render(<KakaoMap mountain={null} />)
    expect(
      screen.getByText(/NEXT_PUBLIC_KAKAO_MAP_API_KEY/),
    ).toBeInTheDocument()
  })

  it('API 키가 있으면 지도 컨테이너를 렌더링한다', () => {
    vi.stubEnv('NEXT_PUBLIC_KAKAO_MAP_API_KEY', 'test-key')
    render(<KakaoMap mountain={null} />)
    expect(screen.getByTestId('kakao-map')).toBeInTheDocument()
  })
})
