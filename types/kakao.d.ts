declare namespace kakao.maps {
  class Map {
    constructor(container: HTMLElement, options: MapOptions)
    setCenter(latlng: LatLng): void
    setLevel(level: number): void
    panTo(latlng: LatLng): void
  }

  class LatLng {
    constructor(lat: number, lng: number)
    getLat(): number
    getLng(): number
  }

  class Marker {
    constructor(options: { position: LatLng; map?: Map; title?: string })
    setMap(map: Map | null): void
    getPosition(): LatLng
  }

  class Polyline {
    constructor(options: {
      path: LatLng[]
      strokeWeight?: number
      strokeColor?: string
      strokeOpacity?: number
      strokeStyle?: string
      endArrow?: boolean
    })
    setMap(map: Map | null): void
  }

  type MapOptions = {
    center: LatLng
    level: number
  }

  namespace event {
    function addListener(
      target: Marker | Map,
      type: string,
      handler: () => void,
    ): void
  }
}

interface Window {
  kakao: typeof kakao
}
