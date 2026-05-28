import { HikingLayout } from '@/components/hiking-briefing/HikingLayout'

export default function HikingBriefingPage() {
  return (
    <HikingLayout
      sidebar={<div className="p-4 text-sm text-muted-foreground">사이드패널</div>}
      map={<div className="w-full h-full bg-muted flex items-center justify-center text-sm text-muted-foreground">지도</div>}
    />
  )
}
