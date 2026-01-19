---
module: 02
title: 인증 시스템 (Google 로그인) - Antigravity Edition
estimated_time: 2-3 hours
dependencies: [Module 01]
antigravity_ready: true
---

# Module 02: 인증 시스템 (Antigravity Edition)

## 🎯 이 모듈의 목표

Firebase Authentication을 이용해 Google 로그인을 구현하고, Guest Mode를 지원합니다.
**Antigravity Edition**에서는 단순한 로그인이 아닌, **사용자의 여정이 시작되는 몰입감 있는 경험**을 제공합니다.

## ✅ 완료 기준

- [ ] **Type Definition**: `types/index.ts`에 User, Guest 관련 타입 정의
- [ ] **State Management**: `zustand`를 이용한 강력한 인증 상태 관리
- [ ] **Auth Service**: Firebase Auth + Firestore 연동 (자동 데이터 초기화)
- [ ] **Guest Mode**: 로컬 스토리지 기반 게스트 세션 관리
- [ ] **Premium UI**:
    - [ ] `Login Page`: 글래스모피즘, 그라데이션, 애니메이션이 적용된 아름다운 디자인
    - [ ] `UserProfile`: 드롭다운 애니메이션이 포함된 세련된 프로필 메뉴
- [ ] **Protection**: 인증되지 않은 사용자의 접근 제어 (Redirect)

## 📦 사전 준비

- Module 01 완료 (프로젝트 초기화)
- Firebase/Google Cloud 설정 완료

---

## 🛠️ 구현

### Step 1: 타입 정의 (Types)

**파일: `types/index.ts`**
(Module 01에서 건너뛴 파일을 여기서 생성합니다)

```typescript
import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  purchases: string[]; // 구매한 map IDs
}

export interface UserProgress {
  userId: string;
  currentMap: string;   // e.g., 'map_1'
  currentStage: string; // e.g., 'map_1_stage_1'
  completedStages: string[];
  completedMaps: string[];
  totalWordsLearned: number;
  totalStarsEarned: number;
  currentStreak: number;
  unlockedMaps: string[];
}

export interface GuestSession {
  id: string;
  createdAt: number;
  expiresAt: number;
  progress: GuestProgress[];
}

export interface GuestProgress {
  stageId: string;
  stars: number;
  completedAt: number;
}
```

### Step 2: 인증 상태 관리 (Zustand)

**파일: `lib/store/auth-store.ts`**
(로딩 상태, 유저, 게스트 여부를 전역 관리)

```typescript
import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isGuest: boolean;
  
  setUser: (user: User | null, firebaseUser: FirebaseUser | null) => void;
  setGuest: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  isLoading: true,
  isGuest: false,

  setUser: (user, firebaseUser) => set({ 
    user, 
    firebaseUser, 
    isLoading: false, 
    isGuest: false 
  }),
  
  setGuest: (isGuest) => set({ 
    isGuest, 
    isLoading: false 
  }),

  setLoading: (isLoading) => set({ isLoading }),
  
  clearUser: () => set({ 
    user: null, 
    firebaseUser: null, 
    isLoading: false, 
    isGuest: false 
  }),
}));
```

### Step 3: 인증 서비스 (Firebase & Guest)

**파일: `lib/firebase/auth-service.ts`**
(Google 로그인 로직 + Firestore 사용자 자동 생성 + UserProgress 초기화 1-1)

**파일: `lib/firebase/guest-service.ts`**
(Guest 세션 생성 및 로컬 스토리지 관리)

### Step 4: Auth Provider (Global Wrapper)

**파일: `components/auth/auth-provider.tsx`**
(앱 실행 시 Firebase Auth 상태 감지 및 Store 업데이트)

### Step 5: Premium Login Page UI

**파일: `app/(auth)/login/page.tsx`**

단순한 흰 박스가 아닌, **SeeVoca의 브랜딩이 녹아있는 프리미엄 디자인**으로 구현합니다.

- **Background**: `bg-gradient-to-br from-brand-50 via-white to-brand-50`
- **Card**: Glassmorphism (`bg-white/70 backdrop-blur-lg`) + `shadow-2xl`
- **Animation**: `animate-fade-in-up` 적용
- **Illustration**: 3D Floating Icons (비행기, 책 등) 주변 배치

### Step 6: User Profile Component

**파일: `components/auth/user-profile.tsx`**
(헤더에 들어갈 프로필. 클릭 시 부드럽게 펼쳐지는 드롭다운 메뉴 구현)

### Step 7: Protected Route (Optional but recommended)

**파일: `components/auth/protected-route.tsx`**
(로그인 안 된 유저가 `/learn` 접근 시 `/login`으로 튕겨내는 HOC 컴포넌트)

---

## 🧪 테스트 계획

1.  **신규 가입**: Google 로그인 시도 -> Firestore `users` 및 `user_progress` 컬렉션 생성 확인.
    - `currentMap`: 'map_1', `currentStage`: 'map_1_stage_1' 확인.
2.  **재로그인**: 로그아웃 후 다시 로그인 -> 기존 데이터 로드 확인.
3.  **게스트 모드**: 로그인 없이 Guest로 시작 -> 로컬 스토리지에 세션 생성 확인.
4.  **UI 반응형**: 모바일 화면에서 로그인 페이지 깨짐 없는지 확인.
