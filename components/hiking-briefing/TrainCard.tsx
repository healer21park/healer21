import { ExternalLink } from 'lucide-react'
import type { TrainLinks } from '@/services/train'

type TrainCardProps = {
  links: TrainLinks
}

export function TrainCard({ links }: TrainCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        {links.from} → {links.to} · {links.date}
      </p>
      <div className="flex flex-col gap-2">
        <a
          href={links.korailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2.5 border border-border rounded-sm hover:bg-accent text-sm transition-colors"
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">코레일 (KTX)</span>
            <span className="text-xs text-muted-foreground">korail.com에서 시간표 확인 및 예매</span>
          </div>
          <ExternalLink className="size-4 text-muted-foreground flex-shrink-0" />
        </a>
        <a
          href={links.srtUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2.5 border border-border rounded-sm hover:bg-accent text-sm transition-colors"
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">SRT</span>
            <span className="text-xs text-muted-foreground">srail.kr에서 시간표 확인 및 예매</span>
          </div>
          <ExternalLink className="size-4 text-muted-foreground flex-shrink-0" />
        </a>
      </div>
    </div>
  )
}
