# 산행·달리기 브리핑 웹앱

## 한 줄 정의

산 이름과 날짜를 입력하면, 날씨·대피소 빈자리·교통·마라톤 일정을 한 화면에 브리핑해주는 웹앱.

## HMW

> HMW — 한국인이 등산·달리기 계획을 세울 때 앱 5개를 오가며 겪는 반복 마찰을,
> 웹 한 곳에서 끝낼 수 있을까?

## 문제

등산/달리기 계획을 세울 때 지금 workaround:

1. 기상청 앱 → 날씨 확인
2. 국립공원 예약 앱 → 대피소 빈자리 확인
3. 코레일/SRT 앱 → 교통편 검색
4. 지도 앱 → 주변 주유소 검색
5. gorunning.kr → 마라톤 일정 확인

## 타겟 사용자

등산·달리기를 즐기는 한국인 (30~50대, 주말 활동 계획을 미리 세우는 사람)

## 핵심 기능 (MVP)

| 기능 | k-skill 패키지 | 비고 |
|---|---|---|
| 대피소 빈자리 조회 | `knps-shelter-vacancy` (기여 예정) | 지리산·설악산·덕유산·소백산 |
| 마라톤/트라이애슬론 일정 | `korean-marathon-schedule` | gorunning.kr + triathlon.or.kr |
| KTX·SRT 시간표 | k-skill 교통 스킬 | |
| 주변 주유소 | `cheap-gas-nearby` | |
| 날씨 | 기상청 API (직접 연동) | LLM 불필요 |

## Not Doing (MVP 범위 밖)

- 실제 예약 실행 (CAPTCHA로 자동화 불가)
- 자연어 입력 파싱 (LLM 없이 드롭다운 UI로 충분)
- 모바일 앱 (웹 PWA는 나중에)
- 로그인 / 사용자 계정

## 숨은 가정

| 범주 | 가정 |
|---|---|
| **Must Be True** | k-skill 스크래핑 스킬이 실제로 작동한다 (스크래핑 기반 → 깨질 위험 있음) |
| **Should Be True** | 등산 계획자가 앱 분산에 불편함을 느끼고 통합 도구를 원한다 |
| **Might Be True** | 모바일에서도 써야 채택률이 높다 |

## MVP 검증 순서

1. `knps-shelter-vacancy` 스킬 k-skill에 기여 → 실제 작동 확인
2. `korean-marathon-schedule` + 날씨 API 연동 로컬 테스트
3. Next.js로 브리핑 UI 구성 → 실제 사용해보기

## 기술 스택

- **Frontend**: Next.js + shadcn/ui
- **Data**: k-skill 패키지 + 기상청 API
- **LLM**: MVP에서는 불필요
