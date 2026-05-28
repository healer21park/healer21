import { NextRequest, NextResponse } from 'next/server'
import { fetchShelterAvailability } from '@/services/shelter'
import type { MountainId } from '@/types/hiking'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const mountainId = searchParams.get('mountainId') as MountainId | null
  const date = searchParams.get('date') ?? ''

  if (!mountainId || !date) {
    return NextResponse.json({ error: 'mountainId, date 파라미터가 필요합니다' }, { status: 400 })
  }

  const data = await fetchShelterAvailability(mountainId, date)
  return NextResponse.json(data)
}
