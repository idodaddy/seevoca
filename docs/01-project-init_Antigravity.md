---
module: 01-Antigravity
title: 프로젝트 초기화 (Premium Upgrade)
estimated_time: 2-3 hours
dependencies: [Module 00]
antigravity_ready: true
---

# Module 01: 프로젝트 초기화 (Premium Edition)

## 🎯 업그레이드 목표

기존 `01-project-init.md`의 기능적 요구사항을 모두 충족하면서, **"Premium Kids Education Platform"**에 걸맞은 디자인 시스템과 코드 구조를 도입합니다.

## ✅ 추가된 완료 기준

- [ ] 디자인 시스템 구축 (Typography, Color Palette, Neo-brutalism/Glassmorphism mix)
- [ ] 고급 애니메이션 설정 (Tailwind Keyframes)
- [ ] `lucide-react` 아이콘 통합
- [ ] SEO 최적화된 메타데이터 설정

---

## 🛠️ 구현 가이드

### Step 1: Next.js 프로젝트 생성 (Premium)

```bash
# 이미 폴더가 존재하므로 현재 폴더에 설치
npx create-next-app@latest . --typescript --tailwind --eslint

# 질문에 대한 답변:
# Would you like to use `src/` directory? No
# Would you like to use App Router? Yes
# Would you like to customize the default import alias (@/*)? Yes
```

### Step 2: 필수 패키지 설치

```bash
# Core & State
npm install firebase zustand

# UI & Animation
npm install framer-motion clsx tailwind-merge class-variance-authority lucide-react

# Fonts (Next.js 내장 Google Fonts 사용 예정: Outfit + Inter)
```

### Step 3: 프로젝트 구조 (Refined)

```
seevoca/
├── app/
│   ├── (auth)/              # Route Group for Auth
│   ├── (marketing)/         # Route Group for Landing, Pricing
│   │   └── page.tsx         # "Killer" Landing Page
│   ├── learn/               # Main App Area
│   │   └── [mapId]/
│   │       └── [stageId]/
│   ├── api/
│   └── layout.tsx           # Global Layout (Font setup)
├── components/
│   ├── ui/                  # Atom Level (Button, Card, Badge)
│   ├── features/            # Feature Level (Map, VideoPlayer)
│   ├── layout/              # Header, Footer, Sidebar
│   └── providers/           # Context Providers
├── lib/
│   ├── firebase/
│   ├── paddle/              # Changed from Stripe
│   └── utils/
├── types/
└── public/
```

### Step 4: 환경 변수 설정

`Module 00`에서 생성한 `.env.local` 사용.

### Step 5: 프리미엄 디자인 토큰 설정 (`tailwind.config.ts`)

아이들에게 친근하면서도 현대적인 **"Soft Pop"** 스타일을 정의합니다.

- **Colors**:
  - `primary`: `#4F46E5` (Indigo 600) -> 신뢰감
  - `secondary`: `#F472B6` (Pink 400) -> 에너지
  - `accent`: `#FBBF24` (Amber 400) -> 재미/보상
  - `background`: `#F8FAFC` (Slate 50) -> 눈이 편안함
- **Fonts**:
  - Headings: `Outfit` (Rounded, friendly)
  - Body: `Inter` (Clean, legible)

### Step 6: 유틸리티 (`lib/utils.ts`)

`cn` 함수 및 `formatCurrency`, `formatDuration` 등 필수 유틸리티 통합.

### Step 7: "WOW" 랜딩 페이지 구현

단순한 텍스트 나열이 아닌, **인터랙티브한 경험**을 제공합니다.
- Hero Section: 3D 느낌의 Floating Elements 애니메이션
- Features: Hover 시 살짝 떠오르는 Glassmorphism 카드
- CTA: Pulse 효과가 있는 "Jelly" 버튼

---

## 📝 코드 스니펫 미리보기

### `lib/utils.ts`
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `app/layout.tsx` (Font Setup)
```typescript
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
```

---

**Next Step**: 이 가이드를 바탕으로 실제 코드 작성을 시작합니다.
