'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { TrailSelector } from './TrailSelector'
import { mountains } from '@/config/mountains'
import type { BriefingQuery, MountainId } from '@/types/hiking'

type SearchFormProps = {
  onSubmit: (query: BriefingQuery) => void
  onMountainChange?: (id: MountainId | null) => void
  onTrailChange?: (trailId: string, reversed: boolean) => void
}

type FormErrors = {
  mountain?: string
  date?: string
  departureStation?: string
}

export function SearchForm({ onSubmit, onMountainChange, onTrailChange }: SearchFormProps) {
  const [mountainId, setMountainId] = useState<MountainId | ''>('')
  const [date, setDate] = useState('')
  const [departureStation, setDepartureStation] = useState('')
  const [trailId, setTrailId] = useState<string | null>(null)
  const [reversed, setReversed] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const selectedMountain = mountains.find((m) => m.id === mountainId) ?? null

  const handleMountainChange = (value: string) => {
    const id = value as MountainId
    setMountainId(id)
    setTrailId(null)
    setReversed(false)
    setErrors((e) => ({ ...e, mountain: undefined }))
    onMountainChange?.(id || null)
  }

  const handleSelectTrail = (id: string) => {
    setTrailId(id)
    setReversed(false)
    onTrailChange?.(id, false)
  }

  const handleToggleReverse = () => {
    setReversed((r) => {
      const next = !r
      if (trailId) onTrailChange?.(trailId, next)
      return next
    })
  }

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!mountainId) e.mountain = '산을 선택하세요'
    if (!date) e.date = '날짜를 입력하세요'
    if (!departureStation.trim()) e.departureStation = '기차 출발역을 입력하세요'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit({
      mountain: mountainId as MountainId,
      date,
      departureStation: departureStation.trim(),
      trailId: trailId ?? '',
      reversed,
    })
  }

  const isReady =
    !!mountainId && !!date && !!departureStation.trim()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <div>
        <p className="text-base font-semibold">산행 브리핑</p>
        <p className="text-xs text-muted-foreground mt-1">
          등산 전 날씨·대피소·교통 정보를 한 번에 확인하세요.
        </p>
      </div>

      <div className="flex flex-col gap-1" data-invalid={!!errors.mountain || undefined}>
        <Label htmlFor="mountain" className="text-xs uppercase tracking-wide text-muted-foreground">
          산 선택
        </Label>
        <select
          id="mountain"
          value={mountainId}
          onChange={(e) => handleMountainChange(e.target.value)}
          aria-invalid={!!errors.mountain || undefined}
          className="w-full border border-border rounded-sm px-2 py-1.5 text-sm bg-background aria-invalid:border-destructive"
          data-testid="mountain-select"
        >
          <option value="">— 산을 선택하세요 —</option>
          {mountains.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        {errors.mountain && (
          <p className="text-xs text-destructive" data-testid="mountain-error">
            {errors.mountain}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1" data-invalid={!!errors.date || undefined}>
        <Label htmlFor="date" className="text-xs uppercase tracking-wide text-muted-foreground">
          날짜
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            setErrors((er) => ({ ...er, date: undefined }))
          }}
          aria-invalid={!!errors.date || undefined}
          data-testid="date-input"
          className="text-sm"
        />
        {errors.date && (
          <p className="text-xs text-destructive" data-testid="date-error">
            {errors.date}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1" data-invalid={!!errors.departureStation || undefined}>
        <Label htmlFor="departure" className="text-xs uppercase tracking-wide text-muted-foreground">
          기차 출발역
        </Label>
        <Input
          id="departure"
          type="text"
          placeholder="예: 서울역"
          value={departureStation}
          onChange={(e) => {
            setDepartureStation(e.target.value)
            setErrors((er) => ({ ...er, departureStation: undefined }))
          }}
          aria-invalid={!!errors.departureStation || undefined}
          data-testid="departure-input"
          className="text-sm"
        />
        {errors.departureStation && (
          <p className="text-xs text-destructive" data-testid="departure-error">
            {errors.departureStation}
          </p>
        )}
      </div>

      {selectedMountain && (
        <TrailSelector
          trails={selectedMountain.trails}
          selectedTrailId={trailId}
          reversed={reversed}
          onSelectTrail={handleSelectTrail}
          onToggleReverse={handleToggleReverse}
        />
      )}

      <Button
        type="submit"
        disabled={!isReady}
        className="w-full"
        data-testid="submit-button"
      >
        브리핑 보기
      </Button>
    </form>
  )
}
