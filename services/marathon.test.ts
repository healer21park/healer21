import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchMarathonEvents } from './marathon'

vi.mock('korean-marathon-schedule', () => ({
  searchEvents: vi.fn(),
}))

describe('fetchMarathonEvents', () => {
  let searchEventsMock: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('korean-marathon-schedule')
    searchEventsMock = mod.searchEvents as ReturnType<typeof vi.fn>
  })

  it('±30일 이내 마라톤 이벤트를 반환한다', async () => {
    searchEventsMock.mockResolvedValueOnce([
      {
        title: '섬진강 봄 하프마라톤',
        date: '2025-06-14',
        region: '전남 구례',
        registrationDeadline: '2025-05-30',
        officialWebsite: 'https://example.com',
      },
    ])

    const result = await fetchMarathonEvents('2025-06-07')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('섬진강 봄 하프마라톤')
    expect(result[0].region).toBe('전남 구례')
    expect(result[0].officialUrl).toBe('https://example.com')
  })

  it('searchEvents 오류 시 빈 배열을 반환한다', async () => {
    searchEventsMock.mockRejectedValueOnce(new Error('network'))
    const result = await fetchMarathonEvents('2025-06-07')
    expect(result).toEqual([])
  })

  it('HTML 태그를 이름에서 제거한다', async () => {
    searchEventsMock.mockResolvedValueOnce([
      { title: '<b>서울 마라톤</b>', date: '2025-06-10', region: '서울' },
    ])
    const result = await fetchMarathonEvents('2025-06-07')
    expect(result[0].name).toBe('서울 마라톤')
  })
})
