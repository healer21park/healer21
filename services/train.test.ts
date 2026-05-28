import { describe, it, expect } from 'vitest'
import { buildTrainLinks } from './train'

describe('buildTrainLinks', () => {
  it('출발역·도착역·날짜를 포함한 코레일 URL을 생성한다', () => {
    const result = buildTrainLinks('서울역', '구례구역', '2025-06-07')
    expect(result.korailUrl).toContain('korail.com')
    expect(result.korailUrl).toContain('20250607')
    expect(result.korailUrl).toContain(encodeURIComponent('서울역'))
  })

  it('SRT URL을 생성한다', () => {
    const result = buildTrainLinks('수서역', '진주역', '2025-06-07')
    expect(result.srtUrl).toContain('srail.kr')
    expect(result.srtUrl).toContain('20250607')
  })

  it('from·to·date 필드를 반환한다', () => {
    const result = buildTrainLinks('서울역', '구례구역', '2025-06-07')
    expect(result.from).toBe('서울역')
    expect(result.to).toBe('구례구역')
    expect(result.date).toBe('2025-06-07')
  })
})
