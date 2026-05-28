import { Skeleton } from '@/components/ui/skeleton'

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

export function BriefingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <CardShell title="날씨">
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-4 w-36 mb-1" />
        <Skeleton className="h-3 w-48" />
      </CardShell>
      <CardShell title="대피소">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </CardShell>
      <CardShell title="KTX·SRT">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full" />
      </CardShell>
      <CardShell title="마라톤·트라이애슬론">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </CardShell>
      <CardShell title="등산로 정보">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </CardShell>
    </div>
  )
}
