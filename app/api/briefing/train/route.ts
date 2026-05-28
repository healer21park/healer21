import { NextRequest, NextResponse } from 'next/server'
import { buildTrainLinks } from '@/services/train'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const date = searchParams.get('date') ?? ''

  if (!from || !to || !date) {
    return NextResponse.json({ error: 'from, to, date 파라미터가 필요합니다' }, { status: 400 })
  }

  return NextResponse.json(buildTrainLinks(from, to, date))
}
