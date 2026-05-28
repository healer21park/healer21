import type { ContentData, BlogPost } from '@/types/hiking'

export async function fetchContent(query: string): Promise<ContentData> {
  try {
    const blogs = await fetchNaverBlogs(query)
    return { blogs }
  } catch {
    return { blogs: [] }
  }
}

async function fetchNaverBlogs(query: string): Promise<BlogPost[]> {
  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  if (!clientId || !clientSecret) return []

  const url = new URL('https://openapi.naver.com/v1/search/blog.json')
  url.searchParams.set('query', `${query} 등산`)
  url.searchParams.set('display', '5')
  url.searchParams.set('sort', 'date')

  const res = await fetch(url.toString(), {
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
  })
  if (!res.ok) throw new Error(`Naver API ${res.status}`)

  const json = await res.json()
  return (json.items ?? []).map((item: Record<string, string>) => ({
    title: stripHtml(item.title ?? ''),
    date: item.postdate ? formatNaverDate(item.postdate) : '',
    link: item.link ?? '',
    description: stripHtml(item.description ?? ''),
  }))
}

function stripHtml(str: string) {
  return str.replace(/<[^>]*>/g, '').trim()
}

function formatNaverDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
}
