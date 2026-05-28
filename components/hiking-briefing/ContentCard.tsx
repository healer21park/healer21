'use client'

import { useState } from 'react'
import type { ContentData } from '@/types/hiking'

type ContentCardProps = {
  data: ContentData
  naverMissing?: boolean
  youtubeMissing?: boolean
}

type Tab = 'blog' | 'youtube'

export function ContentCard({ data, naverMissing, youtubeMissing }: ContentCardProps) {
  const [tab, setTab] = useState<Tab>('blog')

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setTab('blog')}
          className={`text-xs px-2 py-1 rounded-sm ${tab === 'blog' ? 'bg-accent font-medium' : 'hover:bg-accent/50'}`}
          data-testid="tab-blog"
        >
          블로그
        </button>
        <button
          type="button"
          onClick={() => setTab('youtube')}
          className={`text-xs px-2 py-1 rounded-sm ${tab === 'youtube' ? 'bg-accent font-medium' : 'hover:bg-accent/50'}`}
          data-testid="tab-youtube"
        >
          YouTube
        </button>
      </div>

      {tab === 'blog' && (
        <div className="flex flex-col gap-2">
          {naverMissing ? (
            <p className="text-xs text-muted-foreground">NAVER API 키 미설정</p>
          ) : data.blogs.length === 0 ? (
            <p className="text-xs text-muted-foreground">관련 콘텐츠 없음</p>
          ) : (
            data.blogs.map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col hover:bg-accent/50 rounded-sm p-1"
                data-testid={`blog-item-${i}`}
              >
                <span className="text-sm font-medium line-clamp-1">{post.title}</span>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </a>
            ))
          )}
        </div>
      )}

      {tab === 'youtube' && (
        <div className="flex flex-col gap-2">
          {youtubeMissing ? (
            <p className="text-xs text-muted-foreground">YouTube API 키 미설정</p>
          ) : data.videos.length === 0 ? (
            <p className="text-xs text-muted-foreground">관련 영상 없음</p>
          ) : (
            data.videos.map((video, i) => (
              <a
                key={i}
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-start hover:bg-accent/50 rounded-sm p-1"
                data-testid={`video-item-${i}`}
              >
                {video.thumbnailUrl && (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-16 h-11 object-cover rounded-sm flex-shrink-0"
                  />
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium line-clamp-2">{video.title}</span>
                  <span className="text-xs text-muted-foreground truncate">{video.channelName}</span>
                </div>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  )
}
