import type { WeatherData, WeatherCondition } from '@/types/hiking'

// WMO Weather Code → condition 변환
// https://open-meteo.com/en/docs#weathervariables
function toCondition(code: number): WeatherCondition {
  if (code === 0 || code === 1) return 'clear'
  if (code <= 3) return 'cloudy'
  if (code >= 71 && code <= 77) return 'snowy'
  if (code >= 51) return 'rainy'
  if (code >= 45) return 'cloudy'
  return 'cloudy'
}

export async function fetchWeather(
  lat: number,
  lng: number,
  date: string,
): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lng))
  url.searchParams.set('daily', [
    'weathercode',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_probability_max',
    'windspeed_10m_max',
  ].join(','))
  url.searchParams.set('timezone', 'Asia/Seoul')
  url.searchParams.set('start_date', date)
  url.searchParams.set('end_date', date)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`)

  const json = await res.json()
  const daily = json.daily

  return {
    condition: toCondition(daily.weathercode[0]),
    tempHigh: Math.round(daily.temperature_2m_max[0]),
    tempLow: Math.round(daily.temperature_2m_min[0]),
    precipitationProbability: daily.precipitation_probability_max[0] ?? 0,
    windSpeed: Math.round(daily.windspeed_10m_max[0]),
  }
}
