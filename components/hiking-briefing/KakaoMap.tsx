'use client'

import dynamic from 'next/dynamic'
import type { MountainId, ShelterConfig, Trail } from '@/types/hiking'

type KakaoMapProps = {
  mountain: MountainId | null
  trail?: Trail | null
  shelters?: ShelterConfig[]
  reversed?: boolean
  onShelterClick?: (shelterId: string) => void
}

// Leaflet은 SSR 불가 → ssr: false로 클라이언트에서만 로드
const LeafletMap = dynamic(() => import('./LeafletMapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
      지도 로딩 중...
    </div>
  ),
})

export function KakaoMap(props: KakaoMapProps) {
  return <LeafletMap {...props} />
}

export function panMapTo(_map: unknown, _lat: number, _lng: number) {
  // Leaflet 전환 후 지도 ref 방식으로 변경 필요 시 구현
}
