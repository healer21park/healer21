import { NextRequest, NextResponse } from 'next/server'
import { fetchWeather } from '@/services/weather'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = Number(searchParams.get('lat'))
  const lng = Number(searchParams.get('lng'))
  const date = searchParams.get('date') ?? ''

  if (!lat || !lng || !date) {
    return NextResponse.json({ error: 'lat, lng, date 파라미터가 필요합니다' }, { status: 400 })
  }

  try {
    const data = await fetchWeather(lat, lng, date)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: '날씨 정보를 불러오지 못했습니다' }, { status: 502 })
  }
}
