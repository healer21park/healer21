declare module 'korean-marathon-schedule' {
  type SearchOptions = {
    dateFrom?: string
    dateTo?: string
    keyword?: string
    includeTriathlon?: boolean
  }

  type EventItem = Record<string, string>

  export function searchEvents(options?: SearchOptions): Promise<EventItem[]>
}
