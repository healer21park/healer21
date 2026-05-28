export type MountainId = 'jirisan' | 'seoraksan' | 'deogyusan' | 'sobaeksan'

export type Coords = {
  lat: number
  lng: number
}

export type TrailPoint = {
  name: string
  lat: number
  lng: number
}

export type Trail = {
  id: string
  name: string
  distanceKm: number
  durationHours: number
  startPoint: TrailPoint
  endPoint: TrailPoint
}

export type ShelterConfig = {
  id: string
  name: string
  lat: number
  lng: number
}

export type Mountain = {
  id: MountainId
  name: string
  center: Coords
  zoom: number
  nearestStation: string
  trails: Trail[]
  shelters: ShelterConfig[]
}

export type BriefingQuery = {
  mountain: MountainId
  date: string
  departureStation: string
  trailId: string
  reversed: boolean
}

export type WeatherCondition = 'clear' | 'cloudy' | 'rainy' | 'snowy'

export type WeatherData = {
  condition: WeatherCondition
  tempHigh: number
  tempLow: number
  precipitationProbability: number
  windSpeed: number
}

export type ShelterAvailability = {
  id: string
  name: string
  available: number | null
  capacity: number
}

export type TrainAvailability = 'available' | 'moderate' | 'soldout'

export type TrainSchedule = {
  departure: string
  arrival: string
  type: 'KTX' | 'SRT'
  availability: TrainAvailability
}

export type MarathonEvent = {
  name: string
  date: string
  region: string
  registrationDeadline: string
  officialUrl: string
}

export type BlogPost = {
  title: string
  date: string
  link: string
  description: string
}

export type YouTubeVideo = {
  title: string
  channelName: string
  thumbnailUrl: string
  link: string
}

export type ContentData = {
  blogs: BlogPost[]
  videos: YouTubeVideo[]
}
