import { Badge } from '@/components/ui/badge'
import type { ShelterAvailability } from '@/types/hiking'

type ShelterCardProps = {
  shelters: ShelterAvailability[]
  onSelect?: (shelterId: string) => void
}

export function ShelterCard({ shelters, onSelect }: ShelterCardProps) {
  return (
    <div className="flex flex-col gap-1">
      {shelters.map((shelter) => (
        <button
          key={shelter.id}
          type="button"
          onClick={() => onSelect?.(shelter.id)}
          className="flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent/50 text-left w-full"
          data-testid={`shelter-item-${shelter.id}`}
        >
          <span>{shelter.name}</span>
          {shelter.available === null ? (
            <Badge variant="secondary" className="text-xs">조회 실패</Badge>
          ) : shelter.available === 0 ? (
            <Badge variant="secondary" className="text-xs">만실</Badge>
          ) : (
            <Badge variant="outline" className="text-xs">잔여 {shelter.available}</Badge>
          )}
        </button>
      ))}
    </div>
  )
}
