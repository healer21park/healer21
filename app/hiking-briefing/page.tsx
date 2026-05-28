'use client'

import { useRef, useState } from 'react'
import { HikingLayout } from '@/components/hiking-briefing/HikingLayout'
import { SearchForm } from '@/components/hiking-briefing/SearchForm'
import { KakaoMap } from '@/components/hiking-briefing/KakaoMap'
import { WeatherCard } from '@/components/hiking-briefing/WeatherCard'
import { ShelterCard } from '@/components/hiking-briefing/ShelterCard'
import { TrainCard } from '@/components/hiking-briefing/TrainCard'
import { MarathonCard } from '@/components/hiking-briefing/MarathonCard'
import { ContentCard } from '@/components/hiking-briefing/ContentCard'
import { BriefingSkeleton } from '@/components/hiking-briefing/BriefingSkeleton'
import { useBriefing } from '@/hooks/useBriefing'
import { getMountain } from '@/config/mountains'
import type { BriefingQuery, MountainId } from '@/types/hiking'

function CardShell({
  title,
  icon,
  children,
  error,
  onRetry,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  error?: string | null
  onRetry?: () => void
}) {
  return (
    <div className="border border-border rounded-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="p-3">
        {error ? (
          <div className="flex flex-col gap-2 items-center text-center">
            <p className="text-xs text-destructive">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="text-xs border border-border px-2 py-1 rounded-sm hover:bg-accent"
              >
                재시도
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default function HikingBriefingPage() {
  const { state, fetch: runBriefing, retrySection } = useBriefing()
  const [query, setQuery] = useState<BriefingQuery | null>(null)
  const [selectedMountain, setSelectedMountain] = useState<MountainId | null>(null)
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null)
  const [reversed, setReversed] = useState(false)
  const shelterRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const mapRef = useRef<{ panTo: (lat: number, lng: number) => void } | null>(null)

  const isLoading = Object.values(state).some((s) => s.loading)
  const hasBriefing = !!query

  const handleSubmit = (q: BriefingQuery) => {
    setQuery(q)
    setSelectedMountain(q.mountain)
    setSelectedTrailId(q.trailId)
    setReversed(q.reversed)
    runBriefing(q)
  }

  const mountain = selectedMountain ? getMountain(selectedMountain) : null
  const trail = mountain?.trails.find((t) => t.id === selectedTrailId) ?? null

  const handleShelterClick = (shelterId: string) => {
    const shelter = mountain?.shelters.find((s) => s.id === shelterId)
    if (shelter && mapRef.current) {
      mapRef.current.panTo(shelter.lat, shelter.lng)
    }
    shelterRefs.current[shelterId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <HikingLayout
      sidebar={
        <div className="flex flex-col gap-3 p-0">
          <SearchForm
            onSubmit={handleSubmit}
            onMountainChange={(id) => { setSelectedMountain(id); setSelectedTrailId(null) }}
            onTrailChange={(id, rev) => { setSelectedTrailId(id); setReversed(rev) }}
          />

          {isLoading && (
            <div className="px-4 pb-4">
              <BriefingSkeleton />
            </div>
          )}

          {hasBriefing && !isLoading && (
            <div className="px-4 pb-4 flex flex-col gap-3">
              {state.weather.data && (
                <CardShell title="날씨" error={state.weather.error} onRetry={query ? () => retrySection('weather', query) : undefined}>
                  <WeatherCard data={state.weather.data} />
                </CardShell>
              )}
              {state.weather.error && (
                <CardShell title="날씨" error={state.weather.error} onRetry={query ? () => retrySection('weather', query) : undefined}>
                  <span />
                </CardShell>
              )}

              {(state.shelters.data || state.shelters.error) && (
                <CardShell title="대피소" error={state.shelters.error} onRetry={query ? () => retrySection('shelters', query) : undefined}>
                  {state.shelters.data && (
                    <ShelterCard shelters={state.shelters.data} onSelect={handleShelterClick} />
                  )}
                </CardShell>
              )}

              {(state.trains.data || state.trains.error) && (
                <CardShell title="KTX·SRT" error={state.trains.error} onRetry={query ? () => retrySection('trains', query) : undefined}>
                  {state.trains.data && <TrainCard links={state.trains.data} />}
                </CardShell>
              )}

              {(state.marathons.data || state.marathons.error) && (
                <CardShell title="마라톤·트라이애슬론" error={state.marathons.error} onRetry={query ? () => retrySection('marathons', query) : undefined}>
                  {state.marathons.data && <MarathonCard events={state.marathons.data} />}
                </CardShell>
              )}

              {(state.content.data || state.content.error) && (
                <CardShell title="등산로 정보" error={state.content.error} onRetry={query ? () => retrySection('content', query) : undefined}>
                  {state.content.data && (
                    <ContentCard
                      data={state.content.data}
                    />
                  )}
                </CardShell>
              )}
            </div>
          )}
        </div>
      }
      map={
        <KakaoMap
          mountain={selectedMountain}
          trail={trail}
          shelters={mountain?.shelters ?? []}
          reversed={reversed}
          onShelterClick={handleShelterClick}
        />
      }
    />
  )
}
