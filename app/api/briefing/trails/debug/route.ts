import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.VWORLD_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'no key' })

  const url = new URL('https://api.vworld.kr/req/data')
  url.searchParams.set('service', 'data')
  url.searchParams.set('request', 'GetFeature')
  url.searchParams.set('data', 'LT_L_FRSTCLIMB')
  url.searchParams.set('key', apiKey)
  url.searchParams.set('attrFilter', 'mntn_nm:=:지리산')
  url.searchParams.set('format', 'json')
  url.searchParams.set('size', '3')

  const res = await fetch(url.toString())
  const json = await res.json()
  return NextResponse.json(json)
}
