import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchShelterAvailability } from './shelter'

describe('fetchShelterAvailability', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('스크래핑 실패 시 available: null로 graceful fallback한다', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('network error'))
    const result = await fetchShelterAvailability('jirisan', '2025-06-07')
    expect(result.length).toBeGreaterThan(0)
    result.forEach((s) => {
      expect(s.available).toBeNull()
      expect(s.id).toBeTruthy()
      expect(s.name).toBeTruthy()
    })
  })

  it('HTTP 오류 시 available: null로 fallback한다', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false, status: 503 } as Response)
    const result = await fetchShelterAvailability('jirisan', '2025-06-07')
    expect(result.every((s) => s.available === null)).toBe(true)
  })

  it('응답에 잔여 인원 숫자가 있으면 파싱한다', async () => {
    const fakeHtml = `
      <i data-fclt-nm="노고단대피소" data-use_dt="20250607" data-rsvt-cnt="8"></i>
      <i data-fclt-nm="장터목대피소" data-use_dt="20250607" data-rsvt-cnt="0"></i>
    `
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      text: async () => fakeHtml,
    } as Response)

    const result = await fetchShelterAvailability('jirisan', '2025-06-07')
    const nogodan = result.find((s) => s.name === '노고단대피소')
    expect(nogodan?.available).toBe(8)
  })

  it('스크래핑은 성공했으나 특정 대피소/날짜 정보가 HTML에 누락된 경우 available: 0으로 처리한다', async () => {
    // 20250607 데이터만 존재하고 20250608 데이터는 없음
    const fakeHtml = `
      <i data-fclt-nm="노고단대피소" data-use_dt="20250607" data-rsvt-cnt="8"></i>
    `
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      text: async () => fakeHtml,
    } as Response)

    const result = await fetchShelterAvailability('jirisan', '2025-06-08')
    const nogodan = result.find((s) => s.name === '노고단대피소')
    expect(nogodan?.available).toBe(0)
  })

  it('지리산 shelters 목록을 반환한다', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('fail'))
    const result = await fetchShelterAvailability('jirisan', '2025-06-07')
    const names = result.map((s) => s.name)
    expect(names).toContain('노고단대피소')
    expect(names).toContain('장터목대피소')
  })
})
