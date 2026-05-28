# hiking-briefing learnings

---
category: tooling
applied: not-yet
---
## process.env 모듈 레벨 캡처 → vi.stubEnv 패턴

**상황**: Task 3 (KakaoMap), Task 8 (train service) — 환경변수를 모듈 레벨 `const API_KEY = process.env.X`로 캡처하면 `vi.stubEnv`가 효과 없음.
**판단**: 모든 서비스/컴포넌트에서 env var를 함수 본문 내부에서 `process.env.X`로 읽도록 수정. 패턴을 발견한 즉시 KakaoMap·train 두 곳 모두 수정.
**다시 마주칠 가능성**: 높음 — Next.js + Vitest 환경에서 env var를 읽는 코드는 항상 이 함정에 빠질 수 있음.

---
category: tooling
applied: not-yet
---
## vi.mock + require 조합 → dynamic import로 전환

**상황**: Task 9 (marathon service) — `vi.mock('korean-marathon-schedule', factory)`로 mock을 선언한 뒤 `require()`로 접근하면 mock 함수를 받지 못함.
**판단**: 서비스 코드와 테스트 코드 모두 dynamic `import()`로 전환. Vitest의 mock hoisting은 `import`와 함께 동작하도록 설계됨.
**다시 마주칠 가능성**: 높음 — CJS 패키지를 ESM 환경에서 mock할 때 반복 발생.

---
category: task-ordering
applied: not-yet
---
## Task 5 (지도 경로/마커)가 Task 3에서 이미 구현됨

**상황**: Task 3에서 KakaoMap을 구현할 때 plan의 Task 5 범위인 `trail`, `shelters`, `reversed`, `onShelterClick` prop까지 함께 구현함.
**판단**: 중복 구현 없이 Task 5를 completed로 마킹. plan의 Task 분리가 Kakao Maps prop 설계와 맞지 않았음 — 지도 컴포넌트 prop은 한 번에 설계하는 게 자연스러움.
**다시 마주칠 가능성**: 중간 — "지도 초기화"와 "지도 인터랙션"을 별도 Task로 쪼개면 이런 중복이 발생함. 지도 관련 Task는 합치는 게 낫다.

---
category: tooling
applied: not-yet
---
## Playwright e2e 테스트가 Vitest에 감지됨

**상황**: Task Checkpoint 1 — `bun run test` 실행 시 `e2e/smoke.spec.ts`가 Vitest에 잡혀 실패.
**판단**: `vitest.config.ts`의 `exclude`에 `e2e/**` 추가. 초기 프로젝트 설정 누락이었으나 첫 전체 테스트 실행에서 발견.
**다시 마주칠 가능성**: 중간 — 새 프로젝트 setup 시 vitest exclude에 e2e 디렉토리를 기본으로 포함해야 함.

---
category: spec-ambiguity
applied: not-yet
---
## KNPS 대피소 스크래핑 — API 파라미터 불확실

**상황**: Task 7 — WebFetch로 KNPS 예약시스템 구조를 확인했으나 정확한 POST 파라미터명과 응답 JSON 구조를 확인하지 못함. 산 코드(B011004 등)는 확인.
**판단**: 파싱 실패 시 `available: null`로 graceful fallback을 구현하고 진행. 실제 브라우저 DevTools로 XHR 요청을 캡처해 파라미터를 확인하는 것이 정확한 방법 — Human review에서 검증 요청.
**다시 마주칠 가능성**: 높음 — 공개 API 없는 한국 정부 사이트 스크래핑은 항상 이 패턴.
