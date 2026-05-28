import { NextRequest, NextResponse } from 'next/server'
import { fetchMarathonEvents } from '@/services/marathon'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date') ?? ''
  if (!date) {
    return NextResponse.json({ error: 'date 파라미터가 필요합니다' }, { status: 400 })
  }

  const events = await fetchMarathonEvents(date)
  return NextResponse.json(events)
}
