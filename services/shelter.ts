import type { ShelterAvailability } from '@/types/hiking'
import { getMountain } from '@/config/mountains'
import type { MountainId } from '@/types/hiking'

const DEPT_ID: Record<MountainId, string> = {
  jirisan: 'B01',
  seoraksan: 'B03',
  deogyusan: 'B05',
  sobaeksan: 'B12',
}

const KNPS_BASE = 'https://reservation.knps.or.kr'

export async function fetchShelterAvailability(
  mountainId: MountainId,
  date: string,
): Promise<ShelterAvailability[]> {
  const mountain = getMountain(mountainId)
  if (!mountain) throw new Error(`Unknown mountain: ${mountainId}`)

  const deptId = DEPT_ID[mountainId]
  const targetDate = date.replace(/-/g, '') // YYYYMMDD

  try {
    const params = new URLSearchParams({
      deptId,
      deptNm: mountain.name,
      isGreenpoint: 'false',
    })

    const res = await fetch(`${KNPS_BASE}/reservation/shelter/tabShelter.do`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': `${KNPS_BASE}/reservation/shelter/searchSimpleShelterReservation.do`,
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: params.toString(),
    })

    if (!res.ok) throw new Error(`KNPS HTTP ${res.status}`)

    const html = await res.text()
    return parseShelterHtml(html, mountain.shelters, targetDate)
  } catch {
    return mountain.shelters.map((s) => ({
      id: s.id,
      name: s.name,
      available: null,
      capacity: 0,
    }))
  }
}

type ShelterConfigLike = { id: string; name: string }

function parseShelterHtml(
  html: string,
  shelters: ShelterConfigLike[],
  targetDate: string,
): ShelterAvailability[] {
  // data-fclt-nm, data-use_dt, data-rsvt-cnt 속성을 한 블록에서 추출
  const blockRegex =
    /data-fclt-nm="([^"]+)"[\s\S]{0,500}?data-use_dt="(\d{8})"[\s\S]{0,400}?data-rsvt-cnt="(\d+)"/g

  const dateMap = new Map<string, number>()
  let match: RegExpExecArray | null
  let hasAnyMatch = false
  while ((match = blockRegex.exec(html)) !== null) {
    hasAnyMatch = true
    const [, name, date, cnt] = match
    if (date === targetDate) {
      const current = dateMap.get(name)
      if (current === undefined || Number(cnt) < current) {
        dateMap.set(name, Number(cnt))
      }
    }
  }

  return shelters.map((shelter) => {
    const available = dateMap.get(shelter.name) ?? (hasAnyMatch ? 0 : null)
    return { id: shelter.id, name: shelter.name, available, capacity: 0 }
  })
}
