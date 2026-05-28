import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchTrainSchedules } from './train'

describe('fetchTrainSchedules', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('KORAIL_API_KEY 미설정 시 빈 배열을 반환한다', async () => {
    vi.stubEnv('KORAIL_API_KEY', '')
    const result = await fetchTrainSchedules('서울역', '구례구역', '2025-06-07')
    expect(result).toEqual([])
    vi.unstubAllEnvs()
  })

  it('API 응답을 TrainSchedule[]로 변환한다', async () => {
    vi.stubEnv('KORAIL_API_KEY', 'test-key')
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: {
          body: {
            items: {
              item: [
                {
                  depplandtime: '202506070610',
                  arrplandtime: '202506070845',
                  traingradename: 'KTX',
                },
              ],
            },
          },
        },
      }),
    } as Response)

    const result = await fetchTrainSchedules('서울역', '구례구역', '2025-06-07')
    expect(result).toHaveLength(1)
    expect(result[0].departure).toBe('06:10')
    expect(result[0].arrival).toBe('08:45')
    expect(result[0].type).toBe('KTX')
    vi.unstubAllEnvs()
  })
})
