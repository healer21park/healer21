import type { Mountain } from '@/types/hiking'

export const mountains: Mountain[] = [
  {
    id: 'jirisan',
    name: '지리산',
    center: { lat: 35.3376, lng: 127.7325 },
    zoom: 12,
    nearestStation: '구례구역',
    trails: [
      {
        id: 'jirisan-1',
        name: '성삼재 → 천왕봉 종주',
        distanceKm: 27,
        durationHours: 11,
        startPoint: { name: '성삼재', lat: 35.3485, lng: 127.6088 },
        endPoint: { name: '천왕봉', lat: 35.3376, lng: 127.7325 },
      },
      {
        id: 'jirisan-2',
        name: '화엄사 → 노고단',
        distanceKm: 8.5,
        durationHours: 4,
        startPoint: { name: '화엄사', lat: 35.2937, lng: 127.5919 },
        endPoint: { name: '노고단', lat: 35.3393, lng: 127.6350 },
      },
      {
        id: 'jirisan-3',
        name: '중산리 → 천왕봉',
        distanceKm: 9.8,
        durationHours: 5,
        startPoint: { name: '중산리', lat: 35.2944, lng: 127.7218 },
        endPoint: { name: '천왕봉', lat: 35.3376, lng: 127.7325 },
      },
    ],
    shelters: [
      { id: 'jirisan-nogodan', name: '노고단대피소', lat: 35.3393, lng: 127.6350 },
      { id: 'jirisan-yeonhacheon', name: '연하천대피소', lat: 35.3503, lng: 127.6570 },
      { id: 'jirisan-byeoksolyeong', name: '벽소령대피소', lat: 35.3487, lng: 127.6758 },
      { id: 'jirisan-seseok', name: '세석대피소', lat: 35.3404, lng: 127.7044 },
      { id: 'jirisan-jangteomok', name: '장터목대피소', lat: 35.3402, lng: 127.7211 },
      { id: 'jirisan-chibatmok', name: '치밭목대피소', lat: 35.3323, lng: 127.7297 },
    ],
  },
  {
    id: 'seoraksan',
    name: '설악산',
    center: { lat: 38.1194, lng: 128.4653 },
    zoom: 12,
    nearestStation: '강릉역',
    trails: [
      {
        id: 'seoraksan-1',
        name: '오색 → 대청봉',
        distanceKm: 6.5,
        durationHours: 4,
        startPoint: { name: '오색', lat: 38.0525, lng: 128.4733 },
        endPoint: { name: '대청봉', lat: 38.1194, lng: 128.4653 },
      },
      {
        id: 'seoraksan-2',
        name: '백담사 → 대청봉',
        distanceKm: 15.7,
        durationHours: 8,
        startPoint: { name: '백담사', lat: 38.1167, lng: 128.4021 },
        endPoint: { name: '대청봉', lat: 38.1194, lng: 128.4653 },
      },
    ],
    shelters: [
      { id: 'seoraksan-jungcheong', name: '중청대피소', lat: 38.1143, lng: 128.4597 },
      { id: 'seoraksan-socheong', name: '소청대피소', lat: 38.1122, lng: 128.4561 },
      { id: 'seoraksan-huiungak', name: '희운각대피소', lat: 38.1018, lng: 128.4745 },
    ],
  },
  {
    id: 'deogyusan',
    name: '덕유산',
    center: { lat: 35.8730, lng: 127.7494 },
    zoom: 12,
    nearestStation: '남원역',
    trails: [
      {
        id: 'deogyusan-1',
        name: '무주리조트 → 향적봉',
        distanceKm: 3.0,
        durationHours: 1.5,
        startPoint: { name: '무주리조트', lat: 35.8932, lng: 127.7351 },
        endPoint: { name: '향적봉', lat: 35.8730, lng: 127.7494 },
      },
      {
        id: 'deogyusan-2',
        name: '영각사 → 향적봉',
        distanceKm: 9.0,
        durationHours: 5,
        startPoint: { name: '영각사', lat: 35.8327, lng: 127.7247 },
        endPoint: { name: '향적봉', lat: 35.8730, lng: 127.7494 },
      },
    ],
    shelters: [
      { id: 'deogyusan-hyangjeokbong', name: '향적봉대피소', lat: 35.8730, lng: 127.7494 },
      { id: 'deogyusan-baengnyeonsa', name: '백련사대피소', lat: 35.8647, lng: 127.7631 },
    ],
  },
  {
    id: 'sobaeksan',
    name: '소백산',
    center: { lat: 37.0826, lng: 128.4930 },
    zoom: 12,
    nearestStation: '영주역',
    trails: [
      {
        id: 'sobaeksan-1',
        name: '죽령 → 비로봉',
        distanceKm: 8.7,
        durationHours: 4.5,
        startPoint: { name: '죽령', lat: 37.0252, lng: 128.4386 },
        endPoint: { name: '비로봉', lat: 37.0826, lng: 128.4930 },
      },
      {
        id: 'sobaeksan-2',
        name: '희방사 → 비로봉',
        distanceKm: 5.6,
        durationHours: 3,
        startPoint: { name: '희방사', lat: 37.0506, lng: 128.4751 },
        endPoint: { name: '비로봉', lat: 37.0826, lng: 128.4930 },
      },
    ],
    shelters: [
      { id: 'sobaeksan-birobong', name: '비로봉대피소', lat: 37.0826, lng: 128.4930 },
      { id: 'sobaeksan-yeonhwabong', name: '연화봉대피소', lat: 37.0944, lng: 128.5014 },
    ],
  },
]

export const getMountain = (id: string) =>
  mountains.find((m) => m.id === id) ?? null
