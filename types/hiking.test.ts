import { describe, it, expect } from 'vitest'
import { mountains, getMountain } from '@/config/mountains'

describe('mountains config', () => {
  it('4개 산이 모두 있다', () => {
    expect(mountains).toHaveLength(4)
    const ids = mountains.map((m) => m.id)
    expect(ids).toContain('jirisan')
    expect(ids).toContain('seoraksan')
    expect(ids).toContain('deogyusan')
    expect(ids).toContain('sobaeksan')
  })

  it('지리산 trails가 1개 이상이고 필수 필드를 포함한다', () => {
    const jirisan = getMountain('jirisan')
    expect(jirisan).not.toBeNull()
    expect(jirisan!.trails.length).toBeGreaterThanOrEqual(1)
    for (const trail of jirisan!.trails) {
      expect(trail.startPoint).toHaveProperty('name')
      expect(trail.startPoint).toHaveProperty('lat')
      expect(trail.startPoint).toHaveProperty('lng')
      expect(trail.endPoint).toHaveProperty('name')
      expect(trail.endPoint).toHaveProperty('lat')
      expect(trail.endPoint).toHaveProperty('lng')
      expect(typeof trail.distanceKm).toBe('number')
      expect(typeof trail.durationHours).toBe('number')
    }
  })

  it('지리산 shelters가 1개 이상이고 필수 필드를 포함한다', () => {
    const jirisan = getMountain('jirisan')
    expect(jirisan!.shelters.length).toBeGreaterThanOrEqual(1)
    for (const shelter of jirisan!.shelters) {
      expect(typeof shelter.id).toBe('string')
      expect(typeof shelter.name).toBe('string')
      expect(typeof shelter.lat).toBe('number')
      expect(typeof shelter.lng).toBe('number')
    }
  })

  it('getMountain은 없는 id에 null을 반환한다', () => {
    expect(getMountain('unknown')).toBeNull()
  })
})
