# hiking-briefing 구현 계획

## 아키텍처 결정

| 결정 | 선택 | 이유 |
|---|---|---|
| 지도 | Kakao Maps JS SDK (`next/script` + `useEffect`) | 한국 지도 품질·POI 최고, k-skill과 동일 생태계 |
| 날씨 | Open-Meteo REST API | 무료·무키, 위경도 기반 조회, MVP에 충분 |
| 기차 시간표 | 공공데이터포털 KORAIL OpenAPI | 서버사이드 API 키, 공식 운행 데이터 |
| 마라톤 | `korean-marathon-schedule` npm 패키지 | k-skill 기여 패키지, gorunning.kr + triathlon.or.kr 통합 |
| 대피소 | KNPS 예약시스템 HTTP 스크래핑 | 공개 API 없음 — 고위험, 조기 검증 필요 |
| 데이터 페칭 | Route Handlers (`app/api/briefing/*/route.ts`) | 외부 API 키 서버사이드 보호, GET 캐싱 가능 |
| 산 데이터 | 정적 config (`config/mountains.ts`) | 변경 빈도 낮음, API 불필요 |
| 클라이언트 상태 | React hooks (useState + useReducer) | 서버 없는 UI 상태만 관리, 외부 라이브러리 불필요 |

## 인프라 리소스

| 리소스 | 유형 | 선언 위치 | 생성 Task |
|---|---|---|---|
| `NEXT_PUBLIC_KAKAO_MAP_API_KEY` | Env var (public) | `.env.local` | Task 3 |
| `KORAIL_API_KEY` | Env var (server-only) | `.env.local` | Task 8 |
| `NAVER_CLIENT_ID` | Env var (server-only) | `.env.local` | Task 10 |
| `NAVER_CLIENT_SECRET` | Env var (server-only) | `.env.local` | Task 10 |
| `YOUTUBE_API_KEY` | Env var (server-only) | `.env.local` | Task 10 |

## 데이터 모델

### Mountain (정적 config)
- `id`: `'jirisan' | 'seoraksan' | 'deogyusan' | 'sobaeksan'`
- `name`: string
- `center`: `{ lat: number; lng: number }`
- `zoom`: number
- `nearestStation`: string — KTX·SRT 도착역
- `trails`: Trail[]
- `shelters`: ShelterConfig[]

### Trail (추천 등산로)
- `id`: string
- `name`: string — 예: "성삼재 → 천왕봉 종주"
- `distanceKm`: number
- `durationHours`: number
- `startPoint`: `{ name: string; lat: number; lng: number }`
- `endPoint`: `{ name: string; lat: number; lng: number }`

### ShelterConfig (정적 위치)
- `id`: string
- `name`: string
- `lat`: number
- `lng`: number

### BriefingQuery (폼 입력)
- `mountain`: Mountain['id']
- `date`: string — ISO date
- `departureStation`: string
- `trailId`: string
- `reversed`: boolean — 역순 여부

### WeatherData
- `condition`: `'clear' | 'cloudy' | 'rainy' | 'snowy'`
- `tempHigh`: number
- `tempLow`: number
- `precipitationProbability`: number
- `windSpeed`: number

### ShelterAvailability
- `id`: string
- `name`: string
- `available`: number | null — null = 조회 실패
- `capacity`: number

### TrainSchedule
- `departure`: string — HH:mm
- `arrival`: string — HH:mm
- `type`: `'KTX' | 'SRT'`
- `availability`: `'available' | 'moderate' | 'soldout'`

### MarathonEvent
- `name`: string
- `date`: string
- `region`: string
- `registrationDeadline`: string
- `officialUrl`: string

## 필요 스킬

| 스킬 | 적용 Task | 용도 |
|---|---|---|
| next-best-practices | Task 3, 10 | RSC 경계, Suspense 패턴, Route Handler |
| shadcn | Task 4, 6–9 | FieldGroup/Field, Select, Card, Badge, Skeleton |
| vercel-react-best-practices | Task 10 | 병렬 fetch, useEffect 패턴 |

## 영향 받는 파일

| 파일 경로 | 변경 유형 | 관련 Task |
|---|---|---|
| `app/hiking-briefing/page.tsx` | New | Task 2 |
| `types/hiking.ts` | New | Task 1 |
| `types/kakao.d.ts` | New | Task 3 |
| `config/mountains.ts` | New | Task 1 |
| `components/hiking-briefing/HikingLayout.tsx` | New | Task 2 |
| `components/hiking-briefing/KakaoMap.tsx` | New | Task 3 |
| `components/hiking-briefing/SearchForm.tsx` | New | Task 4 |
| `components/hiking-briefing/TrailSelector.tsx` | New | Task 4 |
| `components/hiking-briefing/WeatherCard.tsx` | New | Task 6 |
| `components/hiking-briefing/ShelterCard.tsx` | New | Task 7 |
| `components/hiking-briefing/TrainCard.tsx` | New | Task 8 |
| `components/hiking-briefing/MarathonCard.tsx` | New | Task 9 |
| `components/hiking-briefing/BriefingSkeleton.tsx` | New | Task 10 |
| `services/weather.ts` | New | Task 6 |
| `services/shelter.ts` | New | Task 7 |
| `services/train.ts` | New | Task 8 |
| `services/marathon.ts` | New | Task 9 |
| `app/api/briefing/weather/route.ts` | New | Task 6 |
| `app/api/briefing/shelter/route.ts` | New | Task 7 |
| `app/api/briefing/train/route.ts` | New | Task 8 |
| `app/api/briefing/marathon/route.ts` | New | Task 9 |
| `services/content.ts` | New | Task 10 |
| `app/api/briefing/content/route.ts` | New | Task 10 |
| `components/hiking-briefing/ContentCard.tsx` | New | Task 10 |
| `hooks/useBriefing.ts` | New | Task 11 |
| `app/hiking-briefing/page.tsx` | Modify | Task 10 |
| `components/ui/skeleton.tsx` | New | Task 10 (shadcn add skeleton) |

---

## Tasks

### Task 1: 타입 정의 + 산 정적 데이터

- **담당 시나리오**: S1, S2, S2-1, S2-2 (데이터 계층)
- **크기**: S (2 파일)
- **의존성**: None
- **구현 대상**:
  - `types/hiking.ts`
  - `config/mountains.ts`
  - `types/hiking.test.ts`
- **수용 기준**:
  - [ ] `mountains` config에 지리산·설악산·덕유산·소백산 4개 항목이 있다
  - [ ] 지리산 config에 `trails` 배열이 1개 이상 있고, 각 trail은 `startPoint`·`endPoint`·`distanceKm`·`durationHours`를 포함한다
  - [ ] 지리산 config에 `shelters` 배열이 1개 이상 있고, 각 shelter는 `id`·`name`·`lat`·`lng`를 포함한다
  - [ ] TypeScript 컴파일이 에러 없이 통과한다
- **검증**: `bun run build` — 타입 에러 없음

---

### Task 2: 페이지 레이아웃 셸

- **담당 시나리오**: S1 (레이아웃 구조)
- **크기**: S (2 파일)
- **의존성**: Task 1
- **구현 대상**:
  - `app/hiking-briefing/page.tsx`
  - `components/hiking-briefing/HikingLayout.tsx`
  - `components/hiking-briefing/HikingLayout.test.tsx`
- **수용 기준**:
  - [ ] `/hiking-briefing` 접속 시 왼쪽 사이드패널(300px)과 오른쪽 지도 패널이 나란히 렌더링된다
  - [ ] 모바일(375px) 뷰포트에서 사이드패널과 지도 패널이 세로로 쌓인다
- **검증**: `bun run test -- HikingLayout`

---

### Task 3: 카카오 지도 — 전국뷰 + 산 줌인 ⚠️ 고위험

> Kakao Maps JS SDK 연동이 이 feature의 가장 큰 미지수. 조기 검증으로 fail-fast.

- **담당 시나리오**: S1 (초기 지도), S2 (산 선택 줌인)
- **크기**: M (3 파일)
- **의존성**: Task 2
- **참조**:
  - [Kakao Maps JS SDK 문서](https://apis.map.kakao.com/web/guide/)
  - next-best-practices — `scripts.md` (next/script afterInteractive 패턴)
- **구현 대상**:
  - `types/kakao.d.ts` — `window.kakao.maps` 최소 타입 선언
  - `components/hiking-briefing/KakaoMap.tsx` — `'use client'`, `next/script` 로드
  - `components/hiking-briefing/KakaoMap.test.tsx`
  - `.env.local.example` — `NEXT_PUBLIC_KAKAO_MAP_API_KEY=` 추가
- **수용 기준**:
  - [ ] `NEXT_PUBLIC_KAKAO_MAP_API_KEY` 없이 빌드 시 명확한 오류 메시지가 표시된다
  - [ ] `/hiking-briefing` 접속 시 한국 전체가 보이는 지도가 렌더링된다
  - [ ] `mountain="jirisan"` prop 전달 시 지도가 지리산 중심으로 줌인된다
  - [ ] `mountain` prop이 변경될 때 지도가 새 산으로 이동한다
- **검증**: Browser MCP — `/hiking-briefing` 접속, 산 선택 전/후 지도 상태 스크린샷 → `artifacts/hiking-briefing/evidence/task-3-map.png`

---

### Checkpoint: Tasks 1–3 이후
- [ ] `bun run test` — 전체 테스트 통과
- [ ] `bun run build` — 빌드 성공
- [ ] `/hiking-briefing`에서 지도 렌더링 및 mountain prop 변경 시 줌 동작 확인

---

### Task 4: 입력 폼 + 추천 등산로 선택 + 역순 전환

- **담당 시나리오**: S1 (폼), S2 (산 선택), S2-1 (등산로 선택), S2-2 (역순)
- **크기**: M (3 파일)
- **의존성**: Task 1, Task 2
- **참조**:
  - shadcn — `forms.md` (FieldGroup + Field, Select, data-invalid)
- **구현 대상**:
  - `components/hiking-briefing/SearchForm.tsx`
  - `components/hiking-briefing/TrailSelector.tsx` — 추천 등산로 목록 + 역순 버튼
  - `components/hiking-briefing/SearchForm.test.tsx`
- **수용 기준**:
  - [ ] 산을 선택하면 해당 산의 추천 등산로 목록이 표시된다 (이름·거리·소요시간 포함)
  - [ ] 등산로를 선택하면 출발지·도착지 필드가 해당 trail의 `startPoint`·`endPoint` 이름으로 자동 채워진다
  - [ ] 역순 버튼 클릭 시 출발지·도착지가 서로 바뀐다
  - [ ] 역순 상태에서 다른 등산로 선택 시 역순이 해제되고 새 trail의 기본 방향으로 설정된다
  - [ ] 모든 필수 필드(산·날짜·기차 출발역·등산로)가 채워졌을 때만 "브리핑 보기" 버튼이 활성화된다
- **검증**: `bun run test -- SearchForm`

---

### Task 5: 지도 경로 + 대피소 마커

- **담당 시나리오**: S2-1 (경로 표시), S3 (마커)
- **크기**: S (1 파일 확장)
- **의존성**: Task 3, Task 4
- **구현 대상**:
  - `components/hiking-briefing/KakaoMap.tsx` — `trail`, `shelters`, `reversed` prop 추가
- **수용 기준**:
  - [ ] `trail` prop 전달 시 출발지→도착지 폴리라인이 지도에 표시된다
  - [ ] `reversed=true` 시 폴리라인 방향(화살표)이 반전된다
  - [ ] `shelters` prop 전달 시 각 대피소 위치에 마커가 표시된다
  - [ ] 마커 클릭 시 `onShelterClick(shelterId)` 콜백이 호출된다
- **검증**: Browser MCP — 지리산·성삼재→천왕봉 선택 후 경로선·대피소 마커 스크린샷 → `artifacts/hiking-briefing/evidence/task-5-route.png`

---

### Checkpoint: Tasks 4–5 이후
- [ ] `bun run test` — 전체 테스트 통과
- [ ] `bun run build` — 빌드 성공
- [ ] 폼 입력 → 지도 경로 + 대피소 마커 표시까지 end-to-end 동작 확인

---

### Task 6: 날씨 API + 날씨 카드

- **담당 시나리오**: S4-1
- **크기**: M (3 파일)
- **의존성**: Task 1
- **참조**:
  - [Open-Meteo API 문서](https://open-meteo.com/en/docs) — `temperature_2m_max`, `temperature_2m_min`, `precipitation_probability_max`, `windspeed_10m_max`, `weathercode`
  - next-best-practices — `route-handlers.md`
- **구현 대상**:
  - `services/weather.ts` — Open-Meteo fetch, WMO weathercode → condition 변환
  - `app/api/briefing/weather/route.ts` — `GET ?lat=&lng=&date=`
  - `components/hiking-briefing/WeatherCard.tsx`
  - `services/weather.test.ts`
- **수용 기준**:
  - [ ] `GET /api/briefing/weather?lat=35.33&lng=127.73&date=2025-06-07` 응답에 `condition`, `tempHigh`, `tempLow`, `precipitationProbability`, `windSpeed`가 포함된다
  - [ ] 날씨 카드에 날씨 상태 아이콘, 최고/최저 기온, 강수확률, 풍속이 표시된다
- **검증**: `bun run test -- weather`

---

### Task 7: 대피소 조회 + 대피소 카드 ⚠️ 고위험

> KNPS 예약시스템 스크래핑은 사이트 구조 변경 또는 차단 가능성 있음. 실패 시 plan 재조정.

- **담당 시나리오**: S4-2, S3 (대피소 잔여 인원)
- **크기**: M (3 파일)
- **의존성**: Task 1, Task 5
- **참조**:
  - KNPS 예약시스템: `https://reservation.knps.or.kr/reservation/shelter/searchSimpleShelterReservation.do`
- **구현 대상**:
  - `services/shelter.ts` — KNPS HTTP POST 요청, HTML 파싱
  - `app/api/briefing/shelter/route.ts` — `GET ?mountainId=&date=`
  - `components/hiking-briefing/ShelterCard.tsx` — 목록, 잔여 배지(만실/숫자), `onSelect` 콜백
  - `services/shelter.test.ts`
- **수용 기준**:
  - [ ] `GET /api/briefing/shelter?mountainId=jirisan&date=2025-06-07` 응답에 `ShelterAvailability[]`가 반환된다
  - [ ] 잔여 인원이 있는 대피소는 숫자 배지로, 0인 대피소는 만실 배지로 표시된다
  - [ ] 스크래핑 실패 시 `available: null`로 응답하고 카드에 오류 표시를 한다 (앱 전체가 깨지지 않는다)
  - [ ] 대피소 항목 클릭 시 `onSelect(shelterId)` 콜백이 호출된다
- **검증**: `bun run test -- shelter`; 스크래핑 실패 케이스는 Mock 처리 후 테스트

---

### Task 8: KTX·SRT 시간표 + 교통 카드

- **담당 시나리오**: S4-3
- **크기**: M (3 파일)
- **의존성**: Task 1
- **참조**:
  - [공공데이터포털 KORAIL 열차 운행정보 API](https://www.data.go.kr) — 키 발급 후 `KORAIL_API_KEY` 설정 필요
- **구현 대상**:
  - `services/train.ts` — KORAIL API fetch, TrainSchedule[] 변환
  - `app/api/briefing/train/route.ts` — `GET ?from=&to=&date=`
  - `components/hiking-briefing/TrainCard.tsx`
  - `services/train.test.ts`
- **수용 기준**:
  - [ ] `KORAIL_API_KEY` 미설정 시 카드에 "API 키 미설정" 안내가 표시된다
  - [ ] `GET /api/briefing/train?from=서울역&to=구례구역&date=2025-06-07` 응답에 `TrainSchedule[]`가 반환된다
  - [ ] 카드에 출발·도착·열차 종류·잔여석 상태가 표시된다
- **검증**: `bun run test -- train` (API 응답 Mock)

---

### Task 9: 마라톤 일정 + 마라톤 카드

- **담당 시나리오**: S4-4
- **크기**: M (3 파일)
- **의존성**: None
- **참조**:
  - `korean-marathon-schedule` npm 패키지 — `bun add korean-marathon-schedule`
- **구현 대상**:
  - `services/marathon.ts` — `searchEvents()` 래핑, ±30일 필터
  - `app/api/briefing/marathon/route.ts` — `GET ?date=`
  - `components/hiking-briefing/MarathonCard.tsx`
  - `services/marathon.test.ts`
- **수용 기준**:
  - [ ] `GET /api/briefing/marathon?date=2025-06-07` 응답에 날짜 기준 ±30일 이내 `MarathonEvent[]`가 반환된다
  - [ ] 대회가 없으면 "근방 대회 없음" 문구가 카드에 표시된다
  - [ ] 각 대회에 이름·날짜·지역·접수 마감일·공식 사이트 링크가 표시된다
- **검증**: `bun run test -- marathon`

---

### Task 10: 등산로 콘텐츠 — 네이버 블로그 + YouTube

- **담당 시나리오**: S4-5
- **크기**: M (3 파일)
- **의존성**: Task 4 (등산로 선택 이벤트)
- **참조**:
  - [네이버 검색 Open API — 블로그](https://developers.naver.com/docs/serviceapi/search/blog/blog.md) — `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 필요
  - [YouTube Data API v3 — search](https://developers.google.com/youtube/v3/docs/search/list) — `YOUTUBE_API_KEY` 필요
- **구현 대상**:
  - `services/content.ts` — 네이버 블로그 검색, YouTube 검색, 결과 병합
  - `app/api/briefing/content/route.ts` — `GET ?query=성삼재+천왕봉+등산`
  - `components/hiking-briefing/ContentCard.tsx` — 블로그/YouTube 탭 전환
  - `services/content.test.ts`
  - `.env.local.example` — `NAVER_CLIENT_ID=`, `NAVER_CLIENT_SECRET=`, `YOUTUBE_API_KEY=` 추가
- **수용 기준**:
  - [ ] `GET /api/briefing/content?query=성삼재+천왕봉+등산` 응답에 네이버 블로그 게시글 목록(제목·작성일·링크)이 포함된다
  - [ ] 같은 응답에 YouTube 동영상 목록(제목·채널명·썸네일URL·링크)이 포함된다
  - [ ] 콘텐츠 카드에서 블로그/YouTube 탭을 전환할 수 있다
  - [ ] 각 항목 클릭 시 새 탭으로 외부 링크가 열린다
  - [ ] API 키 미설정 시 해당 플랫폼 섹션에 "API 키 미설정" 안내가 표시된다 (다른 플랫폼은 정상 표시)
- **검증**: `bun run test -- content` (API 응답 Mock)

---

### Checkpoint: Tasks 6–10 이후
- [ ] `bun run test` — 전체 테스트 통과
- [ ] `bun run build` — 빌드 성공
- [ ] 날씨·대피소·교통·마라톤·콘텐츠 5개 섹션이 각각 독립적으로 데이터를 반환하는 것 확인

---

### Task 11: 브리핑 오케스트레이션 — 병렬 로딩·스켈레톤

- **담당 시나리오**: S4 (로딩), 전체 통합
- **크기**: M (3 파일)
- **의존성**: Task 4, 6, 7, 8, 9, 10
- **참조**:
  - vercel-react-best-practices — `async-parallel.md`
  - shadcn — `bun dlx shadcn@latest add skeleton`
- **구현 대상**:
  - `components/ui/skeleton.tsx` — shadcn skeleton 설치
  - `hooks/useBriefing.ts` — 4개 API 병렬 fetch, 섹션별 loading/error/data 상태
  - `components/hiking-briefing/BriefingSkeleton.tsx` — 4개 섹션 스켈레톤
  - `app/hiking-briefing/page.tsx` 수정 — 폼 + 결과 통합
- **수용 기준**:
  - [ ] "브리핑 보기" 클릭 후 4개 섹션의 스켈레톤 UI가 즉시 표시된다
  - [ ] 각 섹션 데이터는 도착하는 순서대로 스켈레톤을 교체해 표시된다 (다른 섹션 로딩과 무관하게)
  - [ ] 4개 API는 병렬로 호출된다 (순차 호출 금지)
- **검증**: `bun run test -- useBriefing`; Browser MCP — 브리핑 버튼 클릭 후 섹션별 로딩 확인

---

### Task 12: 유효성 검사 + 섹션 오류 처리

- **담당 시나리오**: S5, S6
- **크기**: S (기존 파일 확장)
- **의존성**: Task 4, Task 10
- **구현 대상**:
  - `components/hiking-briefing/SearchForm.tsx` 수정 — 필수 필드 오류 상태
  - 각 Card 컴포넌트 수정 — 오류 상태 + 재시도 버튼
- **수용 기준**:
  - [ ] 산·날짜·기차 출발역 중 하나라도 비어 있는 상태에서 "브리핑 보기" 클릭 시 브리핑이 시작되지 않는다
  - [ ] 비어 있는 필드에 오류 표시(`data-invalid`)가 나타난다
  - [ ] 특정 섹션 API 실패 시 해당 카드에 오류 메시지와 재시도 버튼이 표시된다
  - [ ] 재시도 버튼 클릭 시 해당 섹션만 다시 요청한다
- **검증**: `bun run test -- SearchForm` (validation case); `bun run test -- useBriefing` (error retry case)

---

### Task 13: 지도–대피소 클릭 연동

- **담당 시나리오**: S3, S4-2
- **크기**: S (이벤트 콜백 연결)
- **의존성**: Task 5, Task 7, Task 11
- **구현 대상**:
  - `app/hiking-briefing/page.tsx` 수정 — `onShelterClick` ↔ 지도 `panTo` 연결
- **수용 기준**:
  - [ ] 사이드패널 대피소 목록에서 항목을 클릭하면 지도가 해당 대피소 좌표로 이동한다
  - [ ] 지도의 대피소 마커를 클릭하면 사이드패널의 해당 항목이 뷰포트에 나타난다
- **검증**: Browser MCP — 대피소 항목 클릭 전·후 지도 위치 비교 스크린샷 → `artifacts/hiking-briefing/evidence/task-12-sync.png`

---

### Checkpoint: 최종 (Tasks 11–13 이후)
- [ ] `bun run test` — 전체 테스트 통과
- [ ] `bun run build` — 빌드 성공
- [ ] 지리산·2025-06-07·서울역·성삼재→천왕봉 입력 후 전체 브리핑 end-to-end 동작 확인
- [ ] 역순 버튼 → 천왕봉→성삼재로 경로 반전 확인
- [ ] 대피소 목록–지도 클릭 연동 확인

---

## 미결정 항목

- KNPS 스크래핑 실패 시 대체 수단 (공공데이터포털에 국립공원 대피소 API 있는지 확인 필요) — Task 7 착수 전 조사
- 지리산 외 3개 산의 추천 등산로·대피소 상세 데이터 수집 — Task 1에서 지리산 우선, 나머지는 Task 1 이후 보완
