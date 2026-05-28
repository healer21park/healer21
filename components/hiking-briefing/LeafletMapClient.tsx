'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MountainId, ShelterConfig, Trail } from '@/types/hiking'
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
  const start = trail ? (reversed ? trail.endPoint : trail.startPoint) : null
  const end = trail ? (reversed ? trail.startPoint : trail.endPoint) : null
  const polylinePath: [number, number][] = start && end
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

      {polylinePath.length > 0 && (
        <Polyline
          positions={polylinePath}
          pathOptions={{ color: '#374151', weight: 3, dashArray: '8 4' }}
        />
      )}

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
