import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchWeather } from './weather'

const mockFetch = (data: unknown) =>
  vi.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  } as Response)

describe('fetchWeather', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('Open-Meteo 응답을 WeatherData로 변환한다', async () => {
    mockFetch({
      daily: {
        weathercode: [0],
        temperature_2m_max: [24.3],
        temperature_2m_min: [12.1],
        precipitation_probability_max: [10],
        windspeed_10m_max: [3.2],
      },
    })

    const result = await fetchWeather(35.33, 127.73, '2025-06-07')
    expect(result.condition).toBe('clear')
    expect(result.tempHigh).toBe(24)
    expect(result.tempLow).toBe(12)
    expect(result.precipitationProbability).toBe(10)
    expect(result.windSpeed).toBe(3)
  })

  it('weathercode 65(비)를 rainy로 변환한다', async () => {
    mockFetch({
      daily: {
        weathercode: [65],
        temperature_2m_max: [18],
        temperature_2m_min: [10],
        precipitation_probability_max: [80],
        windspeed_10m_max: [5],
      },
    })
    const result = await fetchWeather(35.33, 127.73, '2025-06-07')
    expect(result.condition).toBe('rainy')
  })

  it('API 오류 시 예외를 던진다', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false, status: 500 } as Response)
    await expect(fetchWeather(35.33, 127.73, '2025-06-07')).rejects.toThrow('Open-Meteo error')
  })
})
