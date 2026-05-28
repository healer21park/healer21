import type { ShelterAvailability } from '@/types/hiking'
import { getMountain } from '@/config/mountains'
import type { MountainId } from '@/types/hiking'

// 국립공원 예약시스템 산 코드
const MOUNTAIN_CODES: Record<MountainId, string> = {
  jirisan: 'B011004',
  seoraksan: 'B031002',
  deogyusan: 'B051001',
  sobaeksan: 'B122002',
}

const KNPS_BASE = 'https://reservation.knps.or.kr'

export async function fetchShelterAvailability(
  mountainId: MountainId,
  date: string,
): Promise<ShelterAvailability[]> {
  const mountain = getMountain(mountainId)
  if (!mountain) throw new Error(`Unknown mountain: ${mountainId}`)

  const mountainCode = MOUNTAIN_CODES[mountainId]

  try {
    const params = new URLSearchParams({
      parkCode: mountainCode,
      searchDate: date,
    })

    const res = await fetch(
      `${KNPS_BASE}/reservation/shelter/searchMonthReservation.do`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': `${KNPS_BASE}/reservation/shelter/searchSimpleShelterReservation.do`,
          'User-Agent': 'Mozilla/5.0',
        },
        body: params.toString(),
      },
    )

    if (!res.ok) throw new Error(`KNPS HTTP ${res.status}`)

    const html = await res.text()
    return parseShelterHtml(html, mountain.shelters, date)
  } catch {
    // 스크래핑 실패 시 null availability로 fallback
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
  _date: string,
): ShelterAvailability[] {
  // HTML에서 대피소별 잔여 인원 파싱 시도
  // 파싱 실패 시 null fallback
  return shelters.map((shelter) => {
    try {
      // 대피소 이름을 포함하는 테이블 행에서 숫자 추출 시도
      const namePattern = shelter.name.replace('대피소', '')
      const regex = new RegExp(
        `${escapeRegex(namePattern)}[\\s\\S]{0,300}?(\\d+)\\s*명`,
        'i',
      )
      const match = html.match(regex)
      if (match) {
        return { id: shelter.id, name: shelter.name, available: Number(match[1]), capacity: 0 }
      }
    } catch {
      // ignore
    }
    return { id: shelter.id, name: shelter.name, available: null, capacity: 0 }
  })
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
