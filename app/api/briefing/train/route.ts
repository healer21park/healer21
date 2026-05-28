import { NextRequest, NextResponse } from 'next/server'
import { fetchTrainSchedules } from '@/services/train'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const date = searchParams.get('date') ?? ''

  if (!from || !to || !date) {
    return NextResponse.json({ error: 'from, to, date 파라미터가 필요합니다' }, { status: 400 })
  }

  if (!process.env.KORAIL_API_KEY) {
    return NextResponse.json({ error: 'KORAIL_API_KEY가 설정되지 않았습니다', schedules: [] })
  }

  try {
    const schedules = await fetchTrainSchedules(from, to, date)
    return NextResponse.json({ schedules })
  } catch {
    return NextResponse.json({ error: '열차 시간표를 불러오지 못했습니다', schedules: [] }, { status: 502 })
  }
}
