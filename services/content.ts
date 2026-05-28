import type { ContentData, BlogPost, YouTubeVideo } from '@/types/hiking'

export async function fetchContent(query: string): Promise<ContentData> {
  const [blogs, videos] = await Promise.allSettled([
    fetchNaverBlogs(query),
    fetchYouTubeVideos(query),
  ])

  return {
    blogs: blogs.status === 'fulfilled' ? blogs.value : [],
    videos: videos.status === 'fulfilled' ? videos.value : [],
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

async function fetchYouTubeVideos(query: string): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return []

  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.searchParams.set('key', apiKey)
  url.searchParams.set('q', `${query} 등산`)
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('type', 'video')
  url.searchParams.set('maxResults', '5')
  url.searchParams.set('order', 'relevance')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`YouTube API ${res.status}`)

  const json = await res.json()
  return (json.items ?? []).map((item: Record<string, unknown>) => {
    const snippet = item.snippet as Record<string, unknown>
    const id = item.id as Record<string, string>
    return {
      title: String(snippet?.title ?? ''),
      channelName: String(snippet?.channelTitle ?? ''),
      thumbnailUrl: String((snippet?.thumbnails as Record<string, Record<string, string>>)?.medium?.url ?? ''),
      link: `https://www.youtube.com/watch?v=${id?.videoId ?? ''}`,
    }
  })
}

function stripHtml(str: string) {
  return str.replace(/<[^>]*>/g, '').trim()
}

function formatNaverDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
}
