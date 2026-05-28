import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets } from 'lucide-react'
import type { WeatherData, WeatherCondition } from '@/types/hiking'

const conditionConfig: Record<WeatherCondition, { icon: React.ReactNode; label: string }> = {
  clear: { icon: <Sun className="size-6" />, label: '맑음' },
  cloudy: { icon: <Cloud className="size-6" />, label: '흐림' },
  rainy: { icon: <CloudRain className="size-6" />, label: '비' },
  snowy: { icon: <CloudSnow className="size-6" />, label: '눈' },
}

type WeatherCardProps = {
  data: WeatherData
}

export function WeatherCard({ data }: WeatherCardProps) {
  const config = conditionConfig[data.condition] ?? conditionConfig['cloudy']
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {config.icon}
        <span className="text-lg font-semibold">{config.label}</span>
      </div>
      <div className="text-sm">
        {data.tempHigh != null
          ? <>최고 <strong>{data.tempHigh}°C</strong> / 최저 <strong>{data.tempLow}°C</strong></>
          : <span className="text-muted-foreground text-xs">예보 범위 초과 (7일 이내만 표시)</span>}
      </div>
      {data.tempHigh != null && (
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Droplets className="size-3.5" />
            강수 {data.precipitationProbability}%
          </span>
          <span className="flex items-center gap-1">
            <Wind className="size-3.5" />
            풍속 {data.windSpeed}m/s
          </span>
        </div>
      )}
    </div>
  )
}
