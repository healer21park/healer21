import type { TrainSchedule } from '@/types/hiking'

type TrainCardProps = {
  schedules: TrainSchedule[]
  from: string
  to: string
  apiKeyMissing?: boolean
}

const availabilityLabel: Record<TrainSchedule['availability'], string> = {
  available: '○ 여유',
  moderate: '△ 보통',
  soldout: '× 매진',
}

export function TrainCard({ schedules, from, to, apiKeyMissing }: TrainCardProps) {
  if (apiKeyMissing) {
    return (
      <p className="text-xs text-muted-foreground">
        KORAIL_API_KEY가 설정되지 않았습니다.
      </p>
    )
  }

  if (schedules.length === 0) {
    return <p className="text-xs text-muted-foreground">열차 시간표가 없습니다.</p>
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">
        {from} → {to}
      </p>
      <div className="grid grid-cols-4 text-xs text-muted-foreground pb-1 border-b border-border">
        <span>출발</span>
        <span>도착</span>
        <span>종류</span>
        <span>잔여</span>
      </div>
      {schedules.map((s, i) => (
        <div key={i} className="grid grid-cols-4 text-sm py-1 border-b border-border last:border-0">
          <span>{s.departure}</span>
          <span>{s.arrival}</span>
          <span>{s.type}</span>
          <span className="text-xs">{availabilityLabel[s.availability]}</span>
        </div>
      ))}
    </div>
  )
}
