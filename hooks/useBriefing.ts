'use client'

import { useState, useCallback } from 'react'
import type {
  BriefingQuery,
  WeatherData,
  ShelterAvailability,
  TrainSchedule,
  MarathonEvent,
  ContentData,
} from '@/types/hiking'
import { getMountain } from '@/config/mountains'

type SectionState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

export type BriefingState = {
  weather: SectionState<WeatherData>
  shelters: SectionState<ShelterAvailability[]>
  trains: SectionState<{ schedules: TrainSchedule[]; apiKeyMissing?: boolean }>
  marathons: SectionState<MarathonEvent[]>
  content: SectionState<ContentData>
}

const initialSection = <T>(): SectionState<T> => ({
  data: null,
  loading: false,
  error: null,
})

const loadingSection = <T>(): SectionState<T> => ({
  data: null,
  loading: true,
  error: null,
})

export function useBriefing() {
  const [state, setState] = useState<BriefingState>({
    weather: initialSection(),
    shelters: initialSection(),
    trains: initialSection(),
    marathons: initialSection(),
    content: initialSection(),
  })

  const setSection = <K extends keyof BriefingState>(
    key: K,
    update: Partial<BriefingState[K]>,
  ) => {
    setState((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...update },
    }))
  }

  const fetch = useCallback(async (query: BriefingQuery) => {
    const mountain = getMountain(query.mountain)
    if (!mountain) return

    // 모든 섹션 로딩 상태로 초기화
    setState({
      weather: loadingSection(),
      shelters: loadingSection(),
      trains: loadingSection(),
      marathons: loadingSection(),
      content: loadingSection(),
    })

    const trailQuery = (() => {
      const trail = mountain.trails.find((t) => t.id === query.trailId)
      if (!trail) return mountain.name
      return query.reversed
        ? `${trail.endPoint.name} ${trail.startPoint.name}`
        : `${trail.startPoint.name} ${trail.endPoint.name}`
    })()

    // 병렬 fetch — 각 섹션 독립적으로 업데이트
    Promise.allSettled([
      window
        .fetch(
          `/api/briefing/weather?lat=${mountain.center.lat}&lng=${mountain.center.lng}&date=${query.date}`,
        )
        .then((r) => r.json())
        .then((data) => setSection('weather', { data, loading: false }))
        .catch(() => setSection('weather', { loading: false, error: '날씨 정보를 불러오지 못했습니다' })),

      window
        .fetch(`/api/briefing/shelter?mountainId=${query.mountain}&date=${query.date}`)
        .then((r) => r.json())
        .then((data) => setSection('shelters', { data, loading: false }))
        .catch(() => setSection('shelters', { loading: false, error: '대피소 정보를 불러오지 못했습니다' })),

      window
        .fetch(
          `/api/briefing/train?from=${encodeURIComponent(query.departureStation)}&to=${encodeURIComponent(mountain.nearestStation)}&date=${query.date}`,
        )
        .then((r) => r.json())
        .then((data) =>
          setSection('trains', {
            data: { schedules: data.schedules ?? [], apiKeyMissing: !!data.error },
            loading: false,
          }),
        )
        .catch(() => setSection('trains', { loading: false, error: '열차 정보를 불러오지 못했습니다' })),

      window
        .fetch(`/api/briefing/marathon?date=${query.date}`)
        .then((r) => r.json())
        .then((data) => setSection('marathons', { data, loading: false }))
        .catch(() => setSection('marathons', { loading: false, error: '마라톤 일정을 불러오지 못했습니다' })),

      window
        .fetch(`/api/briefing/content?query=${encodeURIComponent(trailQuery)}`)
        .then((r) => r.json())
        .then((data) => setSection('content', { data, loading: false }))
        .catch(() => setSection('content', { loading: false, error: '콘텐츠를 불러오지 못했습니다' })),
    ])
  }, [])

  const retrySection = useCallback(
    async (key: keyof BriefingState, query: BriefingQuery) => {
      setSection(key, { loading: true, error: null } as Partial<BriefingState[typeof key]>)
      await fetch(query)
    },
    [fetch],
  )

  return { state, fetch, retrySection }
}
