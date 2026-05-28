export type TrailSegment = {
  coordinates: [number, number][] // [lat, lng] for Leaflet
  difficulty: '상' | '중' | '하' | '기타'
  distanceM: number
  upMinutes: number
  downMinutes: number
}

const MOUNTAIN_NAMES: Record<string, string> = {
  jirisan: '지리산',
  seoraksan: '설악산',
  deogyusan: '덕유산',
  sobaeksan: '소백산',
}

export async function fetchTrailSegments(mountainId: string): Promise<TrailSegment[]> {
  const apiKey = process.env.VWORLD_API_KEY
  if (!apiKey) return []

  const mountainName = MOUNTAIN_NAMES[mountainId]
  if (!mountainName) return []

  const url = new URL('https://api.vworld.kr/req/data')
  url.searchParams.set('service', 'data')
  url.searchParams.set('request', 'GetFeature')
  url.searchParams.set('data', 'LT_L_FRSTCLIMB')
  url.searchParams.set('key', apiKey)
  url.searchParams.set('attrFilter', `mntn_nm:=:${mountainName}`)
  url.searchParams.set('format', 'json')
  url.searchParams.set('size', '1000')
  url.searchParams.set('page', '1')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`V-World API ${res.status}`)

  const json = await res.json()
  const features = json?.response?.result?.featureCollection?.features ?? []

  return features.map((f: Record<string, unknown>) => {
    const geom = f.geometry as { coordinates: [number, number][] }
    const props = f.properties as Record<string, string>

    // V-World는 [lng, lat] 순서 → Leaflet은 [lat, lng] 순서로 변환
    const coordinates: [number, number][] = (geom.coordinates ?? []).map(
      ([lng, lat]: [number, number]) => [lat, lng],
    )

    const difficulty = parseDifficulty(props.cat_nam)
    return {
      coordinates,
      difficulty,
      distanceM: Number(props.sec_len) || 0,
      upMinutes: Number(props.up_min) || 0,
      downMinutes: Number(props.dn_min) || 0,
    }
  })
}

function parseDifficulty(cat: string): TrailSegment['difficulty'] {
  if (!cat) return '기타'
  if (cat.includes('상')) return '상'
  if (cat.includes('중')) return '중'
  if (cat.includes('하')) return '하'
  return '기타'
}
