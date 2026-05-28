'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import type { MountainId, ShelterConfig, Trail } from '@/types/hiking'
import { getMountain } from '@/config/mountains'

type KakaoMapProps = {
  mountain: MountainId | null
  trail?: Trail | null
  shelters?: ShelterConfig[]
  reversed?: boolean
  onShelterClick?: (shelterId: string) => void
}

// 한국 전체가 보이는 기본 뷰
const KOREA_CENTER = { lat: 36.5, lng: 127.5 }
const KOREA_ZOOM = 7

export function KakaoMap({
  mountain,
  trail,
  shelters = [],
  reversed = false,
  onShelterClick,
}: KakaoMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const markerRefs = useRef<kakao.maps.Marker[]>([])
  const polylineRef = useRef<kakao.maps.Polyline | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p className="text-sm text-destructive">
          NEXT_PUBLIC_KAKAO_MAP_API_KEY가 설정되지 않았습니다.
        </p>
      </div>
    )
  }

  // 지도 초기화
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return

    const { kakao } = window
    if (!kakao?.maps) return

    const center = new kakao.maps.LatLng(KOREA_CENTER.lat, KOREA_CENTER.lng)
    mapRef.current = new kakao.maps.Map(containerRef.current, {
      center,
      level: KOREA_ZOOM,
    })
  }, [scriptLoaded])

  // 산 변경 시 줌인
  useEffect(() => {
    if (!mapRef.current) return
    const { kakao } = window
    if (!kakao?.maps) return

    if (!mountain) {
      mapRef.current.setCenter(new kakao.maps.LatLng(KOREA_CENTER.lat, KOREA_CENTER.lng))
      mapRef.current.setLevel(KOREA_ZOOM)
      return
    }

    const config = getMountain(mountain)
    if (!config) return

    mapRef.current.setCenter(new kakao.maps.LatLng(config.center.lat, config.center.lng))
    mapRef.current.setLevel(config.zoom)
  }, [mountain, scriptLoaded])

  // 경로 + 대피소 마커 업데이트
  useEffect(() => {
    if (!mapRef.current) return
    const { kakao } = window
    if (!kakao?.maps) return

    // 기존 마커 제거
    markerRefs.current.forEach((m) => m.setMap(null))
    markerRefs.current = []

    // 기존 폴리라인 제거
    polylineRef.current?.setMap(null)
    polylineRef.current = null

    // 대피소 마커
    shelters.forEach((shelter) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(shelter.lat, shelter.lng),
        map: mapRef.current!,
        title: shelter.name,
      })
      if (onShelterClick) {
        kakao.maps.event.addListener(marker, 'click', () => {
          onShelterClick(shelter.id)
        })
      }
      markerRefs.current.push(marker)
    })

    // 경로 폴리라인
    if (trail) {
      const start = reversed ? trail.endPoint : trail.startPoint
      const end = reversed ? trail.startPoint : trail.endPoint
      const path = [
        new kakao.maps.LatLng(start.lat, start.lng),
        new kakao.maps.LatLng(end.lat, end.lng),
      ]
      polylineRef.current = new kakao.maps.Polyline({
        path,
        strokeWeight: 4,
        strokeColor: '#374151',
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
        endArrow: true,
      })
      polylineRef.current.setMap(mapRef.current)
    }
  }, [trail, shelters, reversed, onShelterClick, scriptLoaded])

  return (
    <>
      <Script
        src={`//dapi.kakao.com/maps/sdk/v2/kakaomap.cls.js?appkey=${apiKey}&libraries=services`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} className="w-full h-full" data-testid="kakao-map" />
    </>
  )
}

export function panMapTo(map: kakao.maps.Map, lat: number, lng: number) {
  map.panTo(new window.kakao.maps.LatLng(lat, lng))
}
