---
module: 01
title: 프로젝트 초기화 (Next.js + GCP)
estimated_time: 2-3 hours
dependencies: [Module 00]
antigravity_ready: true
---

# Module 01: 프로젝트 초기화

## 🎯 이 모듈의 목표

Next.js 프로젝트를 생성하고 GCP와 연동하여 SeeVoca의 기본 구조를 완성합니다.

## ✅ 완료 기준

- [ ] Next.js 14 프로젝트 생성 완료
- [ ] TypeScript + Tailwind CSS 설정 완료
- [ ] Firebase SDK 연동 완료
- [ ] 기본 페이지 구조 생성 완료
- [ ] 로컬 개발 서버 실행 성공
- [ ] Git 저장소 초기화 완료

## 📦 사전 준비

- Module 00 완료 (개발 환경 셋업)
- Node.js v18+ 설치됨
- GCP 프로젝트 생성됨
- Firebase 프로젝트 생성됨

---

## 🛠️ 구현

### Step 1: Next.js 프로젝트 생성 (예상: 10분)

```bash
# 프로젝트 디렉토리 생성
npx create-next-app@latest seevoca

# 설정 옵션:
# ✓ TypeScript? Yes
# ✓ ESLint? Yes
# ✓ Tailwind CSS? Yes
# ✓ src/ directory? No
# ✓ App Router? Yes
# ✓ Import alias? Yes (@/*)

# 프로젝트로 이동
cd seevoca
```

**설명**:
- `create-next-app`: Next.js 공식 CLI
- `@latest`: 최신 버전 (14.x)
- App Router: 최신 라우팅 시스템

---

### Step 2: 추가 패키지 설치 (예상: 10분)

```bash
# Firebase SDK
npm install firebase

# 상태 관리 (Zustand)
npm install zustand

# 애니메이션 (Framer Motion)
npm install framer-motion

# 유틸리티
npm install clsx tailwind-merge
npm install class-variance-authority

# 개발 도구
npm install -D @types/node
```

**설명**:
- `firebase`: Firebase SDK (Auth, Firestore)
- `zustand`: 가벼운 상태 관리
- `framer-motion`: 부드러운 애니메이션
- `clsx`, `tailwind-merge`: 클래스명 유틸리티
- `class-variance-authority`: 컴포넌트 variants

---

### Step 3: 프로젝트 구조 생성 (예상: 15분)

```bash
# 디렉토리 생성
mkdir -p app/(auth)
mkdir -p app/(marketing)
mkdir -p app/learn
mkdir -p app/games
mkdir -p app/progress
mkdir -p app/api/auth
mkdir -p app/api/payment
mkdir -p components/auth
mkdir -p components/game
mkdir -p components/map
mkdir -p components/video
mkdir -p components/ui
mkdir -p lib/firebase
mkdir -p lib/stripe
mkdir -p lib/gcp
mkdir -p lib/utils
mkdir -p public/images
mkdir -p public/fonts
```

**최종 구조**:
```
seevoca/
├── app/
│   ├── (auth)/              # 인증 관련 페이지
│   │   ├── login/
│   │   └── signup/
│   ├── (marketing)/         # 마케팅 페이지
│   │   ├── page.tsx         # 홈페이지
│   │   ├── about/
│   │   └── pricing/
│   ├── learn/               # 학습 페이지
│   │   └── [mapId]/
│   │       └── [stageId]/
│   ├── games/               # 게임 페이지
│   │   └── defense/
│   ├── progress/            # 진행도 페이지
│   └── api/                 # API Routes
│       ├── auth/
│       └── payment/
├── components/
│   ├── auth/                # 인증 컴포넌트
│   ├── game/                # 게임 컴포넌트
│   ├── map/                 # 맵 컴포넌트
│   ├── video/               # 비디오 컴포넌트
│   └── ui/                  # UI 컴포넌트
├── lib/
│   ├── firebase/            # Firebase 설정
│   ├── stripe/              # Stripe 설정
│   ├── gcp/                 # GCP 유틸리티
│   └── utils/               # 공통 유틸리티
└── public/
    ├── images/
    └── fonts/
```

---

### Step 4: 환경 변수 설정 (예상: 10분)

**파일: `.env.local`**
```bash
# Firebase (Module 00에서 확보한 값)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seevoca-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seevoca-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seevoca-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# GCP
GCP_PROJECT_ID=seevoca-dev
GOOGLE_APPLICATION_CREDENTIALS=./gcp-key.json

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# AI APIs (선택)
ANTHROPIC_API_KEY=sk-ant-...
VEO_API_KEY=...
ELEVENLABS_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**파일: `.env.example`** (Git에 커밋용)
```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# GCP
GCP_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# AI APIs
ANTHROPIC_API_KEY=
VEO_API_KEY=
ELEVENLABS_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

### Step 5: Firebase 초기화 (예상: 15분)

**파일: `lib/firebase/config.ts`**
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase 초기화 (중복 방지)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 서비스 초기화
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

**설명**:
- `getApps()`: 중복 초기화 방지
- `auth`: 인증 서비스
- `db`: Firestore 데이터베이스
- `storage`: Cloud Storage

---

### Step 6: 유틸리티 함수 생성 (예상: 15분)

**파일: `lib/utils/cn.ts`**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind 클래스 병합 유틸리티
 * 중복된 클래스를 자동으로 제거
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**파일: `lib/utils/storage.ts`**
```typescript
/**
 * localStorage 유틸리티 (Guest Mode용)
 */

interface StorageItem<T> {
  value: T;
  timestamp: number;
}

export const storage = {
  /**
   * 값 저장
   */
  set: <T>(key: string, value: T): void => {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  /**
   * 값 가져오기
   */
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed: StorageItem<T> = JSON.parse(item);
      return parsed.value;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * 값 삭제
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  /**
   * 모두 삭제
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },

  /**
   * 만료된 항목인지 확인 (옵션)
   */
  isExpired: (key: string, maxAge: number): boolean => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return true;

      const parsed: StorageItem<unknown> = JSON.parse(item);
      const age = Date.now() - parsed.timestamp;
      return age > maxAge;
    } catch (error) {
      return true;
    }
  },
};

// Guest Mode용 키 상수
export const STORAGE_KEYS = {
  GUEST_PROGRESS: 'seevoca_guest_progress',
  GUEST_SESSION: 'seevoca_guest_session',
  USER_PREFERENCES: 'seevoca_user_prefs',
} as const;
```

**파일: `lib/utils/format.ts`**
```typescript
/**
 * 포맷팅 유틸리티
 */

/**
 * 숫자를 3자리마다 쉼표로 구분
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * 가격 포맷 ($8.99)
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 날짜 포맷
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * 상대 시간 (2 days ago)
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * 퍼센트 포맷 (85%)
 */
export function formatPercent(value: number, total: number): string {
  const percent = Math.round((value / total) * 100);
  return `${percent}%`;
}
```

---

### Step 7: 타입 정의 (예상: 20분)

**파일: `types/index.ts`**
```typescript
/**
 * SeeVoca 공통 타입 정의
 */

import { Timestamp } from 'firebase/firestore';

// ============ Map & Stage ============

export interface Map {
  id: string;
  order: number;
  name_en: string;
  name_ko: string;
  icon: string;
  theme: string;
  difficulty: 1 | 2 | 3;
  totalStages: number;
  totalWords: number;
  unlockRequirement?: {
    type: 'free' | 'payment' | 'completion';
    value?: string;
  };
  createdAt: Timestamp;
  isActive: boolean;
}

export interface Stage {
  id: string;
  mapId: string;
  stageNumber: number;
  title_en: string;
  title_ko: string;
  description: string;
  category: string;
  wordIds: string[];
  wordCount: number;
  videoUrl: string;
  thumbnailUrl: string;
  isBoss: boolean;
  isFree: boolean;
  unlockRequirement?: {
    type: 'free' | 'login' | 'payment' | 'previous_stage';
    value?: string;
  };
}

export interface Word {
  id: string;
  word: string;
  translation_ko: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';
  difficulty: 1 | 2 | 3;
  animationUrl: string;
  audioUrl: string;
  exampleSentence?: string;
}

// ============ User & Progress ============

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  purchases: string[]; // mapIds
  preferences?: UserPreferences;
}

export interface UserPreferences {
  ageGroup: 'junior' | 'senior';
  uiComplexity: 'simple' | 'advanced';
  gameSpeed: 'slow' | 'normal' | 'fast';
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface UserProgress {
  userId: string;
  currentMap: string;
  currentStage: string;
  completedStages: string[];
  completedMaps: string[];
  totalWordsLearned: number;
  totalStarsEarned: number;
  currentStreak: number;
  unlockedMaps: string[];
}

export interface UserStageProgress {
  userId: string;
  stageId: string;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  videoWatched: boolean;
  videoProgress: number;
  bestScore: number;
  stars: 0 | 1 | 2 | 3;
  accuracy: number;
  attempts: number;
  wordsLearned: string[];
  wordsMastered: string[];
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  lastPlayedAt: Timestamp;
}

// ============ Game ============

export interface GameSession {
  id: string;
  userId: string;
  stageId: string;
  score: number;
  accuracy: number;
  wordsCorrect: number;
  wordsIncorrect: number;
  wordsMissed: number;
  stars: 0 | 1 | 2 | 3;
  duration: number;
  createdAt: Timestamp;
}

export interface FallingWord {
  id: string;
  word: Word;
  position: { x: number; y: number };
  velocity: number;
  isAnswered: boolean;
}

// ============ Payment ============

export interface Purchase {
  id: string;
  userId: string;
  mapId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Timestamp;
}

// ============ Guest Mode ============

export interface GuestProgress {
  sessionId: string;
  stageId: string;
  videoWatched: boolean;
  gameCompleted: boolean;
  score: number;
  stars: number;
  timestamp: number;
}

export interface GuestSession {
  id: string;
  createdAt: number;
  expiresAt: number;
  progress: GuestProgress[];
}
```

---

### Step 8: Tailwind 설정 커스터마이징 (예상: 10분)

**파일: `tailwind.config.ts`**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SeeVoca 브랜드 컬러
        brand: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff', // Primary
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },
        // 게임 컬러
        game: {
          correct: '#52c41a',
          incorrect: '#ff4d4f',
          missed: '#faad14',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'shake': 'shake 0.5s',
        'fall': 'fall 3s linear',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        fall: {
          '0%': { transform: 'translateY(-100px)' },
          '100%': { transform: 'translateY(calc(100vh + 100px))' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### Step 9: 기본 레이아웃 생성 (예상: 20분)

**파일: `app/layout.tsx`**
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SeeVoca - Learn English Through Stories',
  description: 'Interactive English vocabulary learning platform for kids aged 5-12',
  keywords: ['English learning', 'vocabulary', 'kids education', 'language learning'],
  openGraph: {
    title: 'SeeVoca - Learn English Through Stories',
    description: '1,600 words • 80 stories • Fun games',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

**파일: `app/page.tsx`**
```typescript
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            🌊 SeeVoca
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Learn English Vocabulary Through Stories & Games
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Perfect for kids aged 5-12 • 1,600 words • 80 animated stories
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-white text-blue-500 border-2 border-blue-500 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="text-xl font-bold mb-2">Animated Stories</h3>
            <p className="text-gray-600">
              3-minute clay animation videos with 20 words each
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-5xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">Defense Games</h3>
            <p className="text-gray-600">
              Fun games that reinforce learning through play
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor learning with detailed insights and badges
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>✅ Module 01 Complete - Project Initialized!</p>
          <p className="mt-2">Next: Module 02 - Authentication System</p>
        </div>
      </div>
    </main>
  );
}
```

---

### Step 10: Git 초기화 (예상: 5분)

**파일: `.gitignore`**
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Environment
.env
.env.local
.env*.local

# Secrets
gcp-key.json
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
*.swp
*.swo
Thumbs.db

# IDE
.vscode/
.idea/
*.sublime-*

# Misc
*.log
.turbo
```

```bash
# Git 초기화
git init

# 첫 커밋
git add .
git commit -m "feat: initial project setup

- Next.js 14 with TypeScript
- Firebase integration
- Tailwind CSS configured
- Basic project structure
- Utility functions
- Type definitions
"
```

---

## 🧪 테스트

### 로컬 서버 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 확인
# → http://localhost:3000
```

**확인 사항**:
- [ ] 페이지가 정상적으로 로드됨
- [ ] "SeeVoca" 제목 표시됨
- [ ] 버튼 3개 표시됨
- [ ] Tailwind 스타일 적용됨
- [ ] 콘솔에 에러 없음

### 빌드 테스트

```bash
# 프로덕션 빌드
npm run build

# 빌드 성공 확인
# ✓ Compiled successfully
```

---

## 🐛 트러블슈팅

### 문제: Firebase 초기화 에러
```
Error: Firebase configuration not found
```

**해결**:
```bash
# .env.local 파일 확인
cat .env.local

# 환경 변수가 모두 설정되어 있는지 확인
# NEXT_PUBLIC_FIREBASE_* 값들이 있어야 함
```

### 문제: Tailwind 스타일 적용 안됨
```
클래스명은 있지만 스타일이 안 보임
```

**해결**:
```bash
# globals.css에 Tailwind directives 확인
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# 개발 서버 재시작
npm run dev
```

### 문제: TypeScript 에러
```
Cannot find module '@/...'
```

**해결**:
```json
// tsconfig.json 확인
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 📚 참고

### 공식 문서
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs/web/setup)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 다음 단계
- Module 02에서 Google 로그인 구현
- Firebase Auth 연동
- 사용자 세션 관리

---

## 💾 Commit

```bash
git add .
git commit -m "feat: complete module 01 - project initialization"
```

---

## 체크리스트

최종 확인:
- [ ] Next.js 14 프로젝트 생성 ✅
- [ ] 모든 패키지 설치 ✅
- [ ] 프로젝트 구조 생성 ✅
- [ ] 환경 변수 설정 ✅
- [ ] Firebase 설정 ✅
- [ ] 유틸리티 함수 ✅
- [ ] 타입 정의 ✅
- [ ] Tailwind 커스터마이징 ✅
- [ ] 기본 레이아웃 ✅
- [ ] Git 초기화 ✅
- [ ] 로컬 서버 실행 ✅

**모두 완료했으면 Module 02로!** 🚀

*Last updated: 2025-01-19*
