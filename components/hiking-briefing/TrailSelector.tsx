'use client'

import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Trail } from '@/types/hiking'

type TrailSelectorProps = {
  trails: Trail[]
  selectedTrailId: string | null
  reversed: boolean
  onSelectTrail: (trailId: string) => void
  onToggleReverse: () => void
}

export function TrailSelector({
  trails,
  selectedTrailId,
  reversed,
  onSelectTrail,
  onToggleReverse,
}: TrailSelectorProps) {
  const selected = trails.find((t) => t.id === selectedTrailId)
  const startName = selected
    ? reversed
      ? selected.endPoint.name
      : selected.startPoint.name
    : null
  const endName = selected
    ? reversed
      ? selected.startPoint.name
      : selected.endPoint.name
    : null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        추천 등산로
      </p>
      <div className="flex flex-col gap-1">
        {trails.map((trail) => (
          <button
            key={trail.id}
            type="button"
            onClick={() => onSelectTrail(trail.id)}
            className={`text-left px-3 py-2 rounded-sm border text-sm transition-colors ${
              selectedTrailId === trail.id
                ? 'border-foreground bg-accent'
                : 'border-border hover:bg-accent/50'
            }`}
          >
            <span className="font-medium">{trail.name}</span>
            <span className="text-muted-foreground text-xs ml-2">
              {trail.distanceKm}km · {trail.durationHours}h
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 text-xs border border-border rounded-sm px-2 py-1 bg-muted/50">
            <span className="text-muted-foreground">출발: </span>
            <span data-testid="start-point">{startName}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-7 flex-shrink-0"
            onClick={onToggleReverse}
            aria-label="출발지·도착지 역순"
            data-testid="reverse-button"
          >
            <ArrowUpDown className="size-3.5" />
          </Button>
          <div className="flex-1 text-xs border border-border rounded-sm px-2 py-1 bg-muted/50">
            <span className="text-muted-foreground">도착: </span>
            <span data-testid="end-point">{endName}</span>
          </div>
        </div>
      )}
    </div>
  )
}
