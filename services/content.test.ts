import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchContent } from './content'

describe('fetchContent', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('NAVER/YOUTUBE 키 미설정 시 빈 배열을 반환한다', async () => {
    vi.stubEnv('NAVER_CLIENT_ID', '')
    vi.stubEnv('NAVER_CLIENT_SECRET', '')
    vi.stubEnv('YOUTUBE_API_KEY', '')
    const result = await fetchContent('성삼재 천왕봉')
    expect(result.blogs).toEqual([])
    expect(result.videos).toEqual([])
  })

  it('네이버 블로그 결과를 BlogPost[]로 변환한다', async () => {
    vi.stubEnv('NAVER_CLIENT_ID', 'id')
    vi.stubEnv('NAVER_CLIENT_SECRET', 'secret')
    vi.stubEnv('YOUTUBE_API_KEY', '')
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { title: '<b>지리산</b> 종주기', postdate: '20250601', link: 'https://blog.naver.com/1', description: '후기' },
        ],
      }),
    } as Response)
    const result = await fetchContent('성삼재 천왕봉')
    expect(result.blogs).toHaveLength(1)
    expect(result.blogs[0].title).toBe('지리산 종주기')
    expect(result.blogs[0].date).toBe('2025-06-01')
  })

  it('한 플랫폼 오류 시 나머지 플랫폼은 정상 반환한다', async () => {
    vi.stubEnv('NAVER_CLIENT_ID', 'id')
    vi.stubEnv('NAVER_CLIENT_SECRET', 'secret')
    vi.stubEnv('YOUTUBE_API_KEY', 'key')
    // 네이버는 실패, YouTube는 성공
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({ ok: false, status: 500 } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: { videoId: 'abc123' },
              snippet: { title: '지리산 영상', channelTitle: '채널', thumbnails: { medium: { url: 'https://img' } } },
            },
          ],
        }),
      } as Response)

    const result = await fetchContent('성삼재 천왕봉')
    expect(result.blogs).toEqual([])
    expect(result.videos).toHaveLength(1)
    expect(result.videos[0].title).toBe('지리산 영상')
  })
})
