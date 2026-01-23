# 🌊 SeeVoca - Visual Vocabulary Learning Platform

> 스토리 비디오와 게임을 통해 영어 단어를 배우는 글로벌 어린이 학습 플랫폼

---

## 📖 프로젝트 개요

SeeVoca는 5-12세 어린이를 대상으로 한 혁신적인 영어 학습 플랫폼입니다. 전통적인 암기식 학습이 아닌, **3분 스토리 비디오**를 시청한 후 **Defense 게임**으로 복습하는 독창적인 학습 방식을 제공합니다.

### 🎯 핵심 특징

- **🎬 스토리 기반 학습**: AI 생성 3분 클레이 애니메이션으로 20개 단어 학습
- **🎮 Defense 게임**: 비디오 속 단어가 떨어지면 매칭하며 복습 (각 단어 3회 반복)
- **🗺️ 맵 시스템**: 10개 맵 × 7개 스테이지 = 총 1,400개 단어
- **🤖 AI 자동화**: 단어 리스트만 입력하면 비디오, 게임 에셋 자동 생성
- **🌍 글로벌**: Paddle 결제로 전 세계 135개국 지원

### 🏗️ 기술 스택

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- **PWA (Progressive Web App)** 📱
  - 모바일/태블릿에 앱처럼 설치 가능
  - 오프라인 지원 (Service Worker)
  - 푸시 알림
  - 네이티브 앱 느낌의 UX

**Backend & Infrastructure**
- GCP Cloud Run (서버리스)
- Firestore (NoSQL DB)
- Cloud Storage + CDN
- Firebase Authentication
- Cloud Functions

**결제 & AI**
- Paddle (글로벌 결제)
- Anthropic Claude (스토리 생성)
- Google Veo 3.1 (비디오 생성)
- ElevenLabs (음성 합성)

---

## 📁 문서 구조

### 📊 비즈니스 & 기획
- [01_BUSINESS/business-plan.md](01_BUSINESS/business-plan.md) - 비즈니스 모델, 수익 구조
- [02_PRODUCT/product-overview.md](02_PRODUCT/product-overview.md) - 제품 전체 개요
- [02_PRODUCT/map-system.md](02_PRODUCT/map-system.md) - 맵/스테이지 시스템 상세 설계
- [02_PRODUCT/story-learning.md](02_PRODUCT/story-learning.md) - 스토리 학습 방식
- [02_PRODUCT/defense-game.md](02_PRODUCT/defense-game.md) - Defense 게임 메커니즘

### 🔧 기술 아키텍처
- [03_TECH/architecture.md](03_TECH/architecture.md) - GCP 기반 시스템 아키텍처
- [03_TECH/database-schema.md](03_TECH/database-schema.md) - Firestore 스키마 설계
- [03_TECH/api-design.md](03_TECH/api-design.md) - API 엔드포인트
- [03_TECH/content-pipeline.md](03_TECH/content-pipeline.md) - AI 콘텐츠 자동화 파이프라인

### 💻 개발 가이드 (Antigravity용)
- [04_DEVELOPMENT/00-getting-started.md](04_DEVELOPMENT/00-getting-started.md) - 개발 환경 셋업
- [04_DEVELOPMENT/01-project-init.md](04_DEVELOPMENT/01-project-init.md) - Next.js + GCP 프로젝트 초기화
- [04_DEVELOPMENT/02-auth-system.md](04_DEVELOPMENT/02-auth-system.md) - Firebase Google 로그인
- [04_DEVELOPMENT/03-map-ui.md](04_DEVELOPMENT/03-map-ui.md) - 맵/스테이지 UI 구현
- [04_DEVELOPMENT/04-video-player.md](04_DEVELOPMENT/04-video-player.md) - 비디오 플레이어
- [04_DEVELOPMENT/05-defense-game.md](04_DEVELOPMENT/05-defense-game.md) - Defense 게임 로직
- [04_DEVELOPMENT/06-payment.md](04_DEVELOPMENT/06-payment.md) - Paddle 결제 통합
- [04_DEVELOPMENT/07-admin-pipeline.md](04_DEVELOPMENT/07-admin-pipeline.md) - 콘텐츠 자동화 관리자
- [04_DEVELOPMENT/08-deployment.md](04_DEVELOPMENT/08-deployment.md) - Cloud Run 배포

### 📚 가이드 & 참고
- [05_GUIDES/antigravity-guide.md](05_GUIDES/antigravity-guide.md) - Antigravity 사용 가이드
- [05_GUIDES/troubleshooting.md](05_GUIDES/troubleshooting.md) - 문제 해결

---

## 🚀 빠른 시작

### 1. 문서 읽기 순서 (처음 시작하는 경우)

```
1. README.md (현재 문서) ← 여기!
2. 02_PRODUCT/product-overview.md (제품 이해)
3. 03_TECH/architecture.md (기술 아키텍처 파악)
4. 04_DEVELOPMENT/00-getting-started.md (개발 환경 셋업)
5. 04_DEVELOPMENT/01-project-init.md (프로젝트 시작)
```

### 2. 개발 순서 (MVP 구축)

```
Module 00: 환경 셋업 (1-2시간)
  ↓
Module 01: 프로젝트 초기화 (2-3시간)
  ↓
Module 02: 로그인 시스템 (2-3시간)
  ↓
Module 03: 맵 UI (3-4시간)
  ↓
MVP 완성! 🎉
```

### 3. Antigravity 사용법

각 개발 모듈은 Antigravity에 바로 복사해서 사용할 수 있습니다:

```
1. 04_DEVELOPMENT/XX-*.md 파일 열기
2. 전체 내용 복사
3. Antigravity에 붙여넣기
4. "이 가이드대로 구현해줘" 입력
5. 생성된 코드 확인 및 테스트
```

---

## 📊 프로젝트 현황

### MVP 범위
- ✅ Map 1 (8 스테이지, 160개 단어)
- ✅ Google 로그인 + Guest Mode
- ✅ 스토리 비디오 플레이어 (다중 해상도)
- ✅ Defense 게임 (감성적 피드백)
- ✅ Paddle 결제 (Map 2+ 언락)
- ✅ **PWA 지원** (앱처럼 설치 가능)
- ✅ 오프라인 보상 (상장 PDF)
- ✅ 인터랙티브 로딩 화면

### 개발 일정
```
Week 1-2:  환경 셋업 + 프로젝트 초기화
Week 3-4:  인증 + 맵 UI
Week 5-6:  비디오 플레이어 + 게임
Week 7-8:  결제 시스템
Week 9-10: 테스트 + 배포
```

### 예상 비용 (월간)
```
GCP (MVP):
- Cloud Run: $0-10 (프리티어)
- Firestore: $0-5 (프리티어)
- Cloud Storage: $1-2
- Total: ~$1-17/월

AI 콘텐츠 생성 (1회성):
- Veo 3.1: $12/비디오 × 8 = $96
- Claude API: ~$1
- ElevenLabs: ~$1
- Total: ~$98 (Map 1 전체)
```

---

## 🎯 주요 기능 플로우

### 사용자 여정

```
1. 홈페이지 방문 (seevoca.com)
   ↓
2. Map 1 확인 (8개 스테이지)
   ↓
3. Stage 1 클릭 (FREE)
   ↓
4. 3분 스토리 비디오 시청
   "Max the Hungry Dog" 🐶
   ↓
5. Defense 게임 자동 시작
   20개 단어 × 3회 반복
   ↓
6. 클리어! ⭐⭐⭐
   ↓
7. Stage 2 시도 → "Sign in" 팝업
   ↓
8. Google 로그인 (클릭 1번)
   ↓
9. "Unlock Map 1 for $8.99" 팝업
   ↓
10. Paddle 결제 (30초)
   ↓
11. Stage 2-8 즉시 플레이! 🎉
```

### 콘텐츠 생성 파이프라인

```
입력: 20개 단어 리스트
   ↓
Claude: 스토리 생성 (자동)
   ↓
Veo 3.1: 비디오 생성 (자동)
   ↓
Vision AI: 단어 타임스탬프 감지 (자동)
   ↓
OpenCV: 100×100 애니메이션 추출 (자동)
   ↓
ElevenLabs: 발음 오디오 생성 (자동)
   ↓
출력: 비디오 + 20개 애니메이션 + 20개 오디오
   ↓
GCS 업로드 + Firestore 업데이트 (자동)
   ↓
완료! 검수만 하면 됨 ✅
```

---

## 🛠️ 개발 환경 요구사항

### 필수 도구
```bash
Node.js: v18.0.0+
npm: v9.0.0+
Git: v2.30.0+
```

### 필수 계정
- [ ] Google Cloud Platform 계정
- [ ] Firebase 프로젝트
- [ ] Paddle 계정
- [ ] Anthropic API 키
- [ ] Runway API 키 (비디오 생성용)
- [ ] ElevenLabs API 키 (음성 생성용)

### 권장 에디터
- Antigravity (AI 코딩 지원)
- VS Code (대안)

---

## 📦 프로젝트 구조

```
seevoca/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 페이지
│   ├── (marketing)/              # 홈, About 등
│   ├── learn/                    # 학습 페이지
│   ├── games/                    # 게임 페이지
│   ├── progress/                 # 진행도 페이지
│   └── api/                      # API Routes
│       ├── auth/
│       ├── payment/
│       └── webhooks/
│
├── components/                   # React 컴포넌트
│   ├── auth/
│   ├── game/
│   ├── map/
│   ├── video/
│   └── ui/
│
├── lib/                          # 유틸리티 & 설정
│   ├── firebase/
│   ├── paddle/
│   ├── gcp/
│   └── utils/
│
├── public/                       # 정적 파일
│   ├── images/
│   └── fonts/
│
├── scripts/                      # 자동화 스크립트
│   └── content-pipeline/
│
└── gcp/                          # GCP 설정
    ├── Dockerfile
    └── cloudbuild.yaml
```

---

## 🔗 유용한 링크

### 공식 문서
- [Next.js Docs](https://nextjs.org/docs)
- [GCP Docs](https://cloud.google.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Paddle Docs](https://developer.paddle.com)

### 외부 API
- [Anthropic API](https://docs.anthropic.com)
- [Runway ML](https://runwayml.com/docs)
- [ElevenLabs](https://elevenlabs.io/docs)

### 커뮤니티
- GitHub Issues: (프로젝트 시작 후 생성)
- Discord: (추후 생성)

---

## 🤝 기여 가이드

현재는 개인 프로젝트로 시작하지만, 향후 오픈소스화 예정입니다.

---

## 📄 라이선스

MIT License (예정)

---

## 📮 연락처

- 웹사이트: https://seevoca.com (구축 예정)
- 이메일: (추후 공개)

---

## 🎯 다음 단계

1. **지금 바로 시작**: [04_DEVELOPMENT/00-getting-started.md](04_DEVELOPMENT/00-getting-started.md)로 이동
2. **제품 이해**: [02_PRODUCT/product-overview.md](02_PRODUCT/product-overview.md) 읽기
3. **아키텍처 파악**: [03_TECH/architecture.md](03_TECH/architecture.md) 확인

---

**Let's build something amazing! 🚀**

*Last updated: 2025-01-19*
