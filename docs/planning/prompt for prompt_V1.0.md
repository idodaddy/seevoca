# SeeVoca: Antigravity용 전체 개발 문서 생성

## Context
- 글로벌 어린이 영어 학습 플랫폼
- 스토리 비디오 → Defense 게임 학습 방식
- GCP + Next.js 기반
- AI 자동화 콘텐츠 생성

## 목표
Antigravity에 복사해서 바로 개발 시작할 수 있는
모듈별 개발 가이드 세트 생성

## 문서 요구사항

### 📁 문서 구조

```
seevoca-docs/
├── 00_README.md                    # 프로젝트 개요 + 문서 맵
│
├── 01_BUSINESS/
│   ├── business-plan.md           # 비즈니스 모델, 타겟, 수익
│   └── market-analysis.md         # 경쟁사, 시장 크기
│
├── 02_PRODUCT/
│   ├── product-overview.md        # 제품 개요
│   ├── map-system.md              # 맵/스테이지 시스템 상세
│   ├── story-learning.md          # 스토리 기반 학습 방식
│   └── defense-game.md            # Defense 게임 메커니즘
│
├── 03_TECH/
│   ├── architecture.md            # 전체 시스템 아키텍처 (GCP)
│   ├── database-schema.md         # Firestore 스키마
│   ├── api-design.md              # API 엔드포인트
│   └── content-pipeline.md        # AI 자동화 파이프라인
│
├── 04_DEVELOPMENT/                 # 👈 Antigravity용 핵심!
│   ├── 00-getting-started.md      # 개발 환경 셋업
│   ├── 01-project-init.md         # Next.js + GCP 초기화
│   ├── 02-auth-system.md          # Google 로그인
│   ├── 03-map-ui.md               # 맵 화면 구현
│   ├── 04-video-player.md         # 비디오 플레이어
│   ├── 05-defense-game.md         # 게임 로직
│   ├── 06-payment.md              # Paddle 결제
│   ├── 07-admin-pipeline.md       # 콘텐츠 자동화
│   └── 08-deployment.md           # Cloud Run 배포
│
└── 05_GUIDES/
    ├── antigravity-guide.md       # Antigravity 사용 가이드
    └── troubleshooting.md         # 자주 발생하는 문제
```

### 📋 각 개발 모듈 포맷 (04_DEVELOPMENT/XX-*.md)

```markdown
---
module: XX
title: [모듈명]
estimated_time: X hours
dependencies: [Module YY]
antigravity_ready: true
---

# Module XX: [제목]

## 🎯 이 모듈의 목표
[30초 안에 읽고 이해할 수 있는 명확한 목표]

## ✅ 완료 기준
- [ ] 기능 A 동작
- [ ] 기능 B 테스트 통과
- [ ] UI에서 확인 가능

## 📦 사전 준비
- Module YY 완료
- 환경 변수: `NEXT_PUBLIC_XXX`
- 패키지: `npm install XXX`

## 🛠️ 구현

### Step 1: [단계명] (예상: 30분)
[무엇을 왜 하는지]

**파일 생성: `app/xxx/page.tsx`**
```typescript
// 전체 코드 (복사 가능)
'use client';

export default function XXX() {
  // ...
}
```

**설명:**
- Line 3: ...
- Line 7: ...

### Step 2: [단계명] (예상: 45분)
...

## 🧪 테스트
```bash
# 로컬 테스트
npm run dev

# 브라우저에서 확인
http://localhost:3000/xxx
```

**확인 사항:**
- [ ] UI가 표시됨
- [ ] 클릭 시 동작함
- [ ] 에러 없음

## 🐛 트러블슈팅
**문제: XXX 에러**
→ 해결: YYY 확인

## 📚 참고
- [관련 문서](../03_TECH/xxx.md)
- 다음: Module XX+1

## 💾 Commit
```bash
git add .
git commit -m "feat: implement module XX - [기능]"
```
```

### 🎯 핵심 원칙

1. **자기 완결성 (Self-contained)**
   - 각 모듈만 읽고도 구현 가능
   - 필요한 모든 코드 포함
   - 외부 참조 최소화

2. **실행 가능성 (Executable)**
   - 코드 복사 → 붙여넣기 → 실행
   - 테스트 명령어 명시
   - 예상 결과 제시

3. **적정 크기 (Right-sized)**
   - 모듈당 2-4시간 구현
   - 너무 크면 분할 (04-a, 04-b)
   - 너무 작으면 병합

4. **진행 추적 (Trackable)**
   - 체크리스트 제공
   - 예상 시간 명시
   - 완료 기준 명확

5. **상호 연결 (Interconnected)**
   - 모듈 간 참조 링크
   - 의존성 명시
   - 전체 흐름도 제공

### 🚀 Antigravity 사용 최적화

각 모듈은 다음과 같이 사용:

```
1. Antigravity 열기
2. 모듈 파일 전체 복사
3. "이 가이드대로 구현해줘" 프롬프트
4. 생성된 코드 검토
5. 테스트
6. 다음 모듈로
```

**Antigravity용 프롬프트 템플릿:**
```
아래 개발 가이드를 따라서 정확히 구현해줘.
파일 경로, 코드 구조 모두 가이드대로.

[Module XX 내용 전체 붙여넣기]

추가 요청:
- TypeScript strict mode 준수
- 에러 처리 완벽히
- 주석은 한국어로
- 파일별로 구분해서 생성
```

### 📊 문서 검증 요구사항

생성된 문서는 다음을 만족해야 함:

1. **완성도**
   - [ ] README에 전체 문서 맵
   - [ ] 각 모듈에 체크리스트
   - [ ] 모든 코드 실행 가능
   
2. **연결성**
   - [ ] 모듈 간 순서 명확
   - [ ] 의존성 표시
   - [ ] 상호 참조 링크
   
3. **명확성**
   - [ ] 기술 용어 설명
   - [ ] 예상 시간 명시
   - [ ] 완료 기준 정의

4. **Antigravity 최적화**
   - [ ] 각 모듈이 독립적으로 프롬프트 가능
   - [ ] 파일 경로 명확히 명시
   - [ ] 코드 블록 완전함 (일부가 아닌 전체)

## 산출물

**1차 (Core + MVP):**
- README.md
- 02_PRODUCT/product-overview.md
- 02_PRODUCT/map-system.md
- 03_TECH/architecture.md
- 04_DEVELOPMENT/00-getting-started.md
- 04_DEVELOPMENT/01-project-init.md
- 04_DEVELOPMENT/02-auth-system.md
- 04_DEVELOPMENT/03-map-ui.md

**2차 (게임 + 결제):**
- 02_PRODUCT/defense-game.md
- 04_DEVELOPMENT/04-video-player.md
- 04_DEVELOPMENT/05-defense-game.md
- 04_DEVELOPMENT/06-payment.md

**3차 (자동화 + 배포):**
- 01_BUSINESS/business-plan.md
- 03_TECH/content-pipeline.md
- 04_DEVELOPMENT/07-admin-pipeline.md
- 04_DEVELOPMENT/08-deployment.md
- 05_GUIDES/antigravity-guide.md

## 우선순위 명시
**[HIGH]** 1차 산출물 (MVP 개발 가능)
**[MEDIUM]** 2차 산출물 (수익화)
**[LOW]** 3차 산출물 (확장/최적화)

## 특별 요청

### 코드 스타일
- TypeScript strict mode
- ESLint + Prettier 준수
- 주석: 한국어
- 함수/변수명: 영어 (camelCase)

### 파일 명명 규칙
- 컴포넌트: PascalCase (예: `MapView.tsx`)
- 유틸리티: kebab-case (예: `string-utils.ts`)
- 페이지: Next.js 규칙 따름 (예: `page.tsx`)

### 환경 변수 관리
모든 민감 정보는 환경 변수로:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Paddle
NEXT_PUBLIC_PADDLE_VENDOR_ID=
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=

# GCP
GCP_PROJECT_ID=
GCP_SERVICE_ACCOUNT_KEY=

# AI APIs
ANTHROPIC_API_KEY=
RUNWAY_API_KEY=
ELEVENLABS_API_KEY=
```

### Git 전략
```
main - 프로덕션
develop - 개발
feature/module-XX - 각 모듈 개발

각 모듈 완료 시:
feature/module-XX → develop → PR → review → merge
```

## 추가 요구사항

### 1. 다이어그램 포함
각 기술 문서에 Mermaid 다이어그램 포함:
- 시스템 아키텍처
- 데이터 플로우
- 사용자 여정

### 2. 예제 데이터
테스트용 샘플 데이터 제공:
- `data/sample-words.json` (20개 단어)
- `data/sample-story.json` (스토리 템플릿)
- `data/test-user.json` (테스트 계정)

### 3. 비용 추정
각 모듈에 예상 비용 명시:
- GCP 리소스
- 외부 API (Runway, ElevenLabs 등)
- 월간 예상 운영 비용

### 4. 성능 목표
- 페이지 로딩: < 2초
- 비디오 재생 시작: < 1초
- API 응답: < 500ms
- Lighthouse 점수: > 90

### 5. 접근성
- WCAG 2.1 AA 준수
- 키보드 네비게이션
- 스크린 리더 지원
- 색상 대비 (4.5:1)

## 시작 신호

위 요구사항을 모두 이해했다면:
1. 전체 문서 구조 확인
2. 1차 산출물부터 시작
3. 각 파일 생성 전 파일명과 목적 명시
4. 순차적으로 문서 생성

준비되었으면 "1차 산출물 생성을 시작합니다" 라고 말하고 시작해줘.
