'use client'

import type { ContentData } from '@/types/hiking'

type ContentCardProps = {
  data: ContentData
}

export function ContentCard({ data }: ContentCardProps) {
  return (
    <div className="flex flex-col gap-2">
      {data.blogs.length === 0 ? (
        <p className="text-xs text-muted-foreground">관련 블로그 없음</p>
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
  )
}
