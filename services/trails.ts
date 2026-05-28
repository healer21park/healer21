export type TrailSegment = {
  coordinates: [number, number][] // [lat, lng] for Leaflet
  difficulty: '상' | '중' | '하' | '기타'
  distanceM: number
  upMinutes: number
  downMinutes: number
}

// 산별 경계 박스 [minLng, minLat, maxLng, maxLat]
const MOUNTAIN_BOX: Record<string, [number, number, number, number]> = {
  jirisan:   [127.40, 35.20, 127.85, 35.55],
  seoraksan: [128.30, 38.00, 128.65, 38.25],
  deogyusan: [127.60, 35.70, 127.95, 36.00],
  sobaeksan: [128.30, 37.00, 128.65, 37.20],
}

export async function fetchTrailSegments(mountainId: string): Promise<TrailSegment[]> {
  const apiKey = process.env.VWORLD_API_KEY
  if (!apiKey) return []

  const box = MOUNTAIN_BOX[mountainId]
  if (!box) return []

  const appDomain = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const url = new URL('https://api.vworld.kr/req/data')
  url.searchParams.set('service', 'data')
  url.searchParams.set('request', 'GetFeature')
  url.searchParams.set('data', 'LT_L_FRSTCLIMB')
  url.searchParams.set('key', apiKey)
  url.searchParams.set('domain', appDomain)
  url.searchParams.set('geomFilter', `BOX(${box.join(',')})`)
  url.searchParams.set('format', 'json')
  url.searchParams.set('size', '1000')
  url.searchParams.set('page', '1')

  const res = await fetch(url.toString(), {
    headers: { Referer: appDomain },
  })
  if (!res.ok) throw new Error(`V-World API ${res.status}`)

  const json = await res.json()
  if (json?.response?.status !== 'OK') return []

  const features = json?.response?.result?.featureCollection?.features ?? []

  const segments: TrailSegment[] = []
  for (const f of features) {
    const geom = f.geometry as {
      type: string
      coordinates: any
    }
    const props = f.properties as Record<string, string>
    const difficulty = parseDifficulty(props.cat_nam)
    const distanceM = Number(props.sec_len) || 0
    const upMinutes = Number(props.up_min) || 0
    const downMinutes = Number(props.dn_min) || 0

    if (geom.type === 'LineString') {
      const coords = (geom.coordinates as [number, number][]).map(
        ([lng, lat]) => [lat, lng] as [number, number],
      )
      segments.push({ coordinates: coords, difficulty, distanceM, upMinutes, downMinutes })
    } else if (geom.type === 'MultiLineString') {
      for (const line of geom.coordinates as [number, number][][]) {
        const coords = line.map(([lng, lat]) => [lat, lng] as [number, number])
        segments.push({ coordinates: coords, difficulty, distanceM, upMinutes, downMinutes })
      }
    }
  }

  return segments
}

function parseDifficulty(cat: string): TrailSegment['difficulty'] {
  if (!cat) return '기타'
  if (cat.includes('상')) return '상'
  if (cat.includes('중')) return '중'
  if (cat.includes('하')) return '하'
  return '기타'
}
