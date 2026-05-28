import type { MarathonEvent } from '@/types/hiking'

type MarathonCardProps = {
  events: MarathonEvent[]
}

export function MarathonCard({ events }: MarathonCardProps) {
  if (events.length === 0) {
    return <p className="text-xs text-muted-foreground">근방 대회 없음</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {events.map((e, i) => (
        <div key={i} className="border-b border-border pb-2 last:border-0">
          <div className="font-medium text-sm">{e.name}</div>
          <div className="text-xs text-muted-foreground">
            {e.date} · {e.region}
            {e.registrationDeadline && ` · 접수마감 ${e.registrationDeadline}`}
          </div>
          {e.officialUrl && (
            <a
              href={e.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline"
            >
              공식 사이트 →
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
