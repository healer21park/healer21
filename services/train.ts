import type { TrainSchedule } from '@/types/hiking'

// 공공데이터포털 KORAIL 열차운행정보 API
// https://www.data.go.kr
const KORAIL_API_URL =
  'http://apis.data.go.kr/1613000/TrainInfoService/getStrtpntAlocFndTrainInfo'

export async function fetchTrainSchedules(
  from: string,
  to: string,
  date: string,
): Promise<TrainSchedule[]> {
  const apiKey = process.env.KORAIL_API_KEY
  if (!apiKey) return []

  const dateStr = date.replace(/-/g, '')
  const params = new URLSearchParams({
    serviceKey: apiKey,
    numOfRows: '20',
    pageNo: '1',
    _type: 'json',
    depPlaceName: from,
    arrPlaceName: to,
    depPlandTime: dateStr,
    trainGradeCode: '00', // 전체
  })

  const res = await fetch(`${KORAIL_API_URL}?${params.toString()}`)
  if (!res.ok) throw new Error(`KORAIL API error: ${res.status}`)

  const json = await res.json()
  const items = json?.response?.body?.items?.item ?? []
  const list = Array.isArray(items) ? items : [items]

  return list.map((item: Record<string, string>) => ({
    departure: formatTime(String(item.depplandtime ?? '')),
    arrival: formatTime(String(item.arrplandtime ?? '')),
    type: item.traingradename?.includes('SRT') ? 'SRT' : 'KTX',
    availability: 'available' as const,
  }))
}

function formatTime(yyyymmddHHMM: string): string {
  if (yyyymmddHHMM.length < 12) return '--:--'
  return `${yyyymmddHHMM.slice(8, 10)}:${yyyymmddHHMM.slice(10, 12)}`
}
