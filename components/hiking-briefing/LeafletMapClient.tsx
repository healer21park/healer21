'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MountainId, ShelterConfig, Trail } from '@/types/hiking'
import type { TrailSegment } from '@/services/trails'
import { getMountain } from '@/config/mountains'

// 기본 마커 아이콘 CDN으로 수정 (webpack 번들 깨짐 방지)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const shelterIcon = L.divIcon({
  className: '',
  html: '<div style="width:10px;height:10px;border-radius:50%;background:#374151;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4);"></div>',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
})

const startIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:white;border:3px solid #374151;box-shadow:0 1px 3px rgba(0,0,0,.4);"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const endIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#374151;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4);"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

// 난이도별 색상
const DIFFICULTY_COLOR: Record<TrailSegment['difficulty'], string> = {
  '상': '#dc2626',   // 빨강
  '중': '#d97706',   // 주황
  '하': '#16a34a',   // 초록
  '기타': '#6b7280', // 회색
}

const KOREA_CENTER: [number, number] = [36.5, 127.5]
const KOREA_ZOOM = 7

type Props = {
  mountain: MountainId | null
  trail?: Trail | null
  shelters?: ShelterConfig[]
  reversed?: boolean
  onShelterClick?: (shelterId: string) => void
}

function MapController({ mountain }: { mountain: MountainId | null }) {
  const map = useMap()
  useEffect(() => {
    if (!mountain) {
      map.setView(KOREA_CENTER, KOREA_ZOOM, { animate: true })
      return
    }
    const config = getMountain(mountain)
    if (config) {
      map.setView([config.center.lat, config.center.lng], config.zoom, { animate: true })
    }
  }, [mountain, map])
  return null
}

export default function LeafletMapClient({
  mountain,
  trail,
  shelters = [],
  reversed = false,
  onShelterClick,
}: Props) {
  const [trailSegments, setTrailSegments] = useState<TrailSegment[]>([])

  // 산 선택 시 V-World 등산로 데이터 페치
  useEffect(() => {
    if (!mountain) { setTrailSegments([]); return }
    fetch(`/api/briefing/trails?mountainId=${mountain}`)
      .then((r) => r.json())
      .then((data) => setTrailSegments(data.segments ?? []))
      .catch(() => setTrailSegments([]))
  }, [mountain])

  const start = trail ? (reversed ? trail.endPoint : trail.startPoint) : null
  const end = trail ? (reversed ? trail.startPoint : trail.endPoint) : null

  // V-World 데이터 없을 때만 직선 경로 표시
  const fallbackPath: [number, number][] =
    trailSegments.length === 0 && start && end
      ? [[start.lat, start.lng], [end.lat, end.lng]]
      : []

  return (
    <MapContainer
      center={KOREA_CENTER}
      zoom={KOREA_ZOOM}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController mountain={mountain} />

      {/* V-World 실제 등산로 세그먼트 */}
      {trailSegments.map((seg, i) => (
        <Polyline
          key={i}
          positions={seg.coordinates}
          pathOptions={{
            color: DIFFICULTY_COLOR[seg.difficulty],
            weight: 2.5,
            opacity: 0.8,
          }}
        />
      ))}

      {/* V-World 없을 때 직선 fallback */}
      {fallbackPath.length > 0 && (
        <Polyline
          positions={fallbackPath}
          pathOptions={{ color: '#374151', weight: 3, dashArray: '8 4' }}
        />
      )}

      {/* 출발·도착 마커 */}
      {start && (
        <Marker position={[start.lat, start.lng]} icon={startIcon}>
          <Popup>{start.name} (출발)</Popup>
        </Marker>
      )}
      {end && (
        <Marker position={[end.lat, end.lng]} icon={endIcon}>
          <Popup>{end.name} (도착)</Popup>
        </Marker>
      )}

      {/* 대피소 마커 */}
      {shelters.map((shelter) => (
        <Marker
          key={shelter.id}
          position={[shelter.lat, shelter.lng]}
          icon={shelterIcon}
          eventHandlers={{ click: () => onShelterClick?.(shelter.id) }}
        >
          <Popup>{shelter.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
