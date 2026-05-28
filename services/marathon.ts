import type { MarathonEvent } from '@/types/hiking'

export async function fetchMarathonEvents(date: string): Promise<MarathonEvent[]> {
  const target = new Date(date)
  const from = new Date(target)
  from.setDate(from.getDate() - 30)
  const to = new Date(target)
  to.setDate(to.getDate() + 30)

  const toStr = (d: Date) => d.toISOString().slice(0, 10)

  try {
    const { searchEvents } = await import('korean-marathon-schedule')
    const events = await searchEvents({
      dateFrom: toStr(from),
      dateTo: toStr(to),
    })

    return (events as Record<string, string>[]).map((e) => ({
      name: stripHtml(e.title ?? e.name ?? ''),
      date: e.date ?? '',
      region: e.region ?? e.location ?? '',
      registrationDeadline: e.registrationDeadline ?? e.deadline ?? '',
      officialUrl: e.officialWebsite ?? e.link ?? e.url ?? '',
    }))
  } catch {
    return []
  }
}

function stripHtml(str: string) {
  return str.replace(/<[^>]*>/g, '').trim()
}
