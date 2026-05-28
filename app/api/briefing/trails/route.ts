import { NextRequest, NextResponse } from 'next/server'
import { fetchTrailSegments } from '@/services/trails'

export async function GET(req: NextRequest) {
  const mountainId = req.nextUrl.searchParams.get('mountainId') ?? ''
  if (!mountainId) {
    return NextResponse.json({ error: 'mountainId 파라미터가 필요합니다' }, { status: 400 })
  }

  if (!process.env.VWORLD_API_KEY) {
    return NextResponse.json({ segments: [], missing: true })
  }

  try {
    const segments = await fetchTrailSegments(mountainId)
    return NextResponse.json({ segments })
  } catch {
    return NextResponse.json({ segments: [], error: '등산로 데이터를 불러오지 못했습니다' })
  }
}
