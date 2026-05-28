import { NextRequest, NextResponse } from 'next/server'
import { fetchContent } from '@/services/content'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') ?? ''
  if (!query) {
    return NextResponse.json({ error: 'query 파라미터가 필요합니다' }, { status: 400 })
  }

  const data = await fetchContent(query)
  return NextResponse.json(data)
}
