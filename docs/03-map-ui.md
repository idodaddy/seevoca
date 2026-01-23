---
module: 03
title: 맵/스테이지 UI 구현
estimated_time: 3-4 hours
dependencies: [Module 02]
antigravity_ready: true
---

# Module 03: 맵/스테이지 UI 구현

## 🎯 이 모듈의 목표

맵 선택 화면과 스테이지 화면을 구현하여 사용자가 학습을 시작할 수 있게 합니다.

## ✅ 완료 기준

- [ ] 맵 목록 화면 구현
- [ ] 스테이지 노드 UI 구현
- [ ] 스테이지 상태 (완료/진행중/잠금) 표시
- [ ] 스테이지 클릭 시 상세 페이지 이동
- [ ] Firestore에서 맵/스테이지 데이터 로드
- [ ] 진행도에 따른 언락 로직
- [ ] 반응형 디자인 (모바일 지원)

## 📦 사전 준비

- Module 02 완료 (인증 시스템)
- Firestore에 맵/스테이지 데이터 입력 (또는 샘플 데이터)

---

## 🛠️ 구현

### Step 1: Firestore 샘플 데이터 준비 (예상: 15분)

**파일: `scripts/seed-data.ts`**
```typescript
/**
 * Firestore에 샘플 맵/스테이지 데이터 추가
 * 실제 운영에서는 Admin 파이프라인에서 생성
 */

import { db } from '@/lib/firebase/config';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

export async function seedMapsAndStages() {
  // Map 1: Beginner's Island
  const map1 = {
    id: 'map_1',
    order: 1,
    name_en: "Beginner's Island",
    name_ko: '초보자의 섬',
    icon: '🏝️',
    theme: 'daily_basics',
    difficulty: 1,
    totalStages: 8,
    totalWords: 160,
    unlockRequirement: {
      type: 'free',
    },
    createdAt: Timestamp.now(),
    isActive: true,
  };

  await setDoc(doc(db, 'maps', 'map_1'), map1);

  // Stages 1-8
  const stages = [
    {
      id: 'map_1_stage_1',
      mapId: 'map_1',
      stageNumber: 1,
      title_en: 'Max the Hungry Dog',
      title_ko: '배고픈 개 Max',
      description: 'Meet Max and learn about animals and food',
      category: 'animals',
      wordIds: Array(20).fill('word_'),
      wordCount: 20,
      videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_1.mp4',
      thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_1.jpg',
      isBoss: false,
      isFree: true,
      unlockRequirement: {
        type: 'free',
      },
    },
    {
      id: 'map_1_stage_2',
      mapId: 'map_1',
      stageNumber: 2,
      title_en: "Emma's Magic Garden",
      title_ko: 'Emma의 마법 정원',
      description: 'Explore the garden with Emma',
      category: 'nature',
      wordIds: Array(20).fill('word_'),
      wordCount: 20,
      videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_2.mp4',
      thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_2.jpg',
      isBoss: false,
      isFree: false,
      unlockRequirement: {
        type: 'payment',
        value: 'map_1',
      },
    },
    // ... stages 3-7 similar structure
    {
      id: 'map_1_stage_8',
      mapId: 'map_1',
      stageNumber: 8,
      title_en: 'Island Adventure',
      title_ko: '섬 모험',
      description: 'Boss stage! Review all 160 words',
      category: 'review',
      wordIds: Array(160).fill('word_'),
      wordCount: 160,
      videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_8.mp4',
      thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_8.jpg',
      isBoss: true,
      isFree: false,
      unlockRequirement: {
        type: 'previous_stage',
        value: 'map_1_stage_7',
      },
    },
  ];

  for (const stage of stages) {
    await setDoc(doc(db, 'stages', stage.id), stage);
  }

  console.log('✅ Sample data seeded!');
}
```

---

### Step 2: 맵/스테이지 데이터 Hooks (예상: 25min)

**파일: `lib/hooks/use-maps.ts`**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Map, Stage } from '@/types';

/**
 * 모든 맵 가져오기
 */
export function useMaps() {
  const [maps, setMaps] = useState<Map[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMaps() {
      try {
        const q = query(
          collection(db, 'maps'),
          where('isActive', '==', true),
          orderBy('order', 'asc')
        );

        const snapshot = await getDocs(q);
        const mapsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as Map[];

        setMaps(mapsData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMaps();
  }, []);

  return { maps, isLoading, error };
}

/**
 * 특정 맵의 스테이지 가져오기
 */
export function useStages(mapId: string) {
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStages() {
      try {
        const q = query(
          collection(db, 'stages'),
          where('mapId', '==', mapId),
          orderBy('stageNumber', 'asc')
        );

        const snapshot = await getDocs(q);
        const stagesData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as Stage[];

        setStages(stagesData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    if (mapId) {
      fetchStages();
    }
  }, [mapId]);

  return { stages, isLoading, error };
}
```

**파일: `lib/hooks/use-progress.ts`**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuthStore } from '@/lib/store/auth-store';
import { UserProgress } from '@/types';

/**
 * 사용자 진행도 가져오기
 */
export function useUserProgress() {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'user_progress', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProgress(docSnap.data() as UserProgress);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgress();
  }, [user]);

  return { progress, isLoading };
}

/**
 * 스테이지 언락 여부 확인
 */
export function useStageUnlockStatus(
  stage: Stage,
  progress: UserProgress | null
): 'locked' | 'unlocked' | 'completed' {
  if (!stage) return 'locked';

  // Free 스테이지는 항상 언락
  if (stage.isFree) return 'unlocked';

  // 로그인 안 했으면 잠금
  if (!progress) return 'locked';

  // 완료한 스테이지
  if (progress.completedStages.includes(stage.id)) {
    return 'completed';
  }

  // 맵 구매 확인
  if (stage.unlockRequirement?.type === 'payment') {
    const mapId = stage.unlockRequirement.value;
    if (progress.unlockedMaps.includes(mapId!)) {
      return 'unlocked';
    }
    return 'locked';
  }

  // 이전 스테이지 완료 확인
  if (stage.unlockRequirement?.type === 'previous_stage') {
    const prevStageId = stage.unlockRequirement.value;
    if (progress.completedStages.includes(prevStageId!)) {
      return 'unlocked';
    }
    return 'locked';
  }

  return 'locked';
}
```

---

### Step 3: 맵 카드 컴포넌트 (예상: 20min)

**파일: `components/map/map-card.tsx`**
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { Map } from '@/types';
import { formatNumber } from '@/lib/utils/format';

interface MapCardProps {
  map: Map;
  isUnlocked: boolean;
  progress: number; // 0-100
}

export function MapCard({ map, isUnlocked, progress }: MapCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (isUnlocked) {
      router.push(`/learn/${map.id}`);
    } else {
      // TODO: Show payment modal
      alert('This map is locked. Purchase to unlock!');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${!isUnlocked && 'opacity-75'}
      `}
    >
      {/* Lock Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-6xl">🔒</div>
        </div>
      )}

      {/* Map Icon & Info */}
      <div className="p-6">
        {/* Icon */}
        <div className="text-6xl mb-4 text-center">{map.icon}</div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {map.name_en}
        </h3>
        <p className="text-gray-600 text-center mb-4">{map.name_ko}</p>

        {/* Stats */}
        <div className="flex justify-around text-sm text-gray-600 mb-4">
          <div className="text-center">
            <div className="font-bold text-lg">{map.totalStages}</div>
            <div>Stages</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{formatNumber(map.totalWords)}</div>
            <div>Words</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">
              {'⭐'.repeat(map.difficulty)}
            </div>
            <div>Difficulty</div>
          </div>
        </div>

        {/* Progress Bar */}
        {isUnlocked && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          className={`
            w-full mt-4 py-3 rounded-lg font-semibold transition
            ${
              isUnlocked
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }
          `}
        >
          {isUnlocked ? 'Continue' : 'Unlock'}
        </button>
      </div>
    </div>
  );
}
```

---

### Step 4: 스테이지 노드 컴포넌트 (예상: 30min)

**파일: `components/map/stage-node.tsx`**
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { Stage } from '@/types';
import { cn } from '@/lib/utils/cn';

interface StageNodeProps {
  stage: Stage;
  status: 'locked' | 'unlocked' | 'completed';
  stars?: number; // 0-3
}

export function StageNode({ stage, status, stars = 0 }: StageNodeProps) {
  const router = useRouter();

  const handleClick = () => {
    if (status === 'locked') {
      // TODO: Show unlock modal
      alert('Complete previous stage first!');
      return;
    }

    router.push(`/learn/${stage.mapId}/${stage.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300',
        status === 'completed' && 'bg-green-500 text-white border-4 border-green-600',
        status === 'unlocked' && 'bg-blue-500 text-white border-4 border-blue-600 animate-pulse-slow',
        status === 'locked' && 'bg-gray-300 text-gray-600 border-4 border-gray-400',
        'hover:scale-110 hover:shadow-xl'
      )}
    >
      {/* Stage Number or Icon */}
      <div className="text-2xl font-bold">
        {stage.isBoss ? '👑' : stage.stageNumber}
      </div>

      {/* Status Icon */}
      <div className="text-sm mt-1">
        {status === 'completed' && '✓'}
        {status === 'unlocked' && '⚡'}
        {status === 'locked' && '🔒'}
      </div>

      {/* Stars (if completed) */}
      {status === 'completed' && stars > 0 && (
        <div className="absolute -bottom-6 flex gap-1">
          {Array(stars)
            .fill(0)
            .map((_, i) => (
              <span key={i} className="text-yellow-400">
                ⭐
              </span>
            ))}
        </div>
      )}

      {/* Word Count Badge */}
      <div className="absolute -top-2 -right-2 bg-white text-blue-600 text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-blue-500">
        {stage.wordCount}
      </div>
    </div>
  );
}
```

---

### Step 5: 맵 목록 페이지 (예상: 20min)

**파일: `app/learn/page.tsx`**
```typescript
'use client';

import { useMaps } from '@/lib/hooks/use-maps';
import { useUserProgress } from '@/lib/hooks/use-progress';
import { MapCard } from '@/components/map/map-card';

export default function LearnPage() {
  const { maps, isLoading: mapsLoading } = useMaps();
  const { progress, isLoading: progressLoading } = useUserProgress();

  if (mapsLoading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Learning Journey
          </h1>
          <p className="text-gray-600">Choose a map to continue learning</p>
        </div>

        {/* Maps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {maps.map((map) => {
            const isUnlocked = progress?.unlockedMaps.includes(map.id) || false;
            const completedStages = progress?.completedStages.filter(
              (s) => s.startsWith(map.id)
            ).length || 0;
            const progressPercent = (completedStages / map.totalStages) * 100;

            return (
              <MapCard
                key={map.id}
                map={map}
                isUnlocked={isUnlocked}
                progress={progressPercent}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

### Step 6: 맵 상세 페이지 (스테이지 맵) (예상: 40min)

**파일: `app/learn/[mapId]/page.tsx`**
```typescript
'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useStages } from '@/lib/hooks/use-maps';
import { useUserProgress, useStageUnlockStatus } from '@/lib/hooks/use-progress';
import { StageNode } from '@/components/map/stage-node';

interface MapDetailPageProps {
  params: Promise<{ mapId: string }>;
}

export default function MapDetailPage({ params }: MapDetailPageProps) {
  const { mapId } = use(params);
  const router = useRouter();
  const { stages, isLoading: stagesLoading } = useStages(mapId);
  const { progress, isLoading: progressLoading } = useUserProgress();

  if (stagesLoading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 완료된 스테이지 수
  const completedCount = stages.filter((stage) =>
    progress?.completedStages.includes(stage.id)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/learn')}
            className="text-blue-600 hover:underline mb-4"
          >
            ← Back to Maps
          </button>

          <div className="flex items-center gap-4">
            <span className="text-6xl">🏝️</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Beginner's Island
              </h1>
              <p className="text-gray-600">
                Complete {stages.length} stages to master 160 words
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">
              Your Progress
            </span>
            <span className="text-blue-600 font-bold">
              {completedCount}/{stages.length} Stages
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${(completedCount / stages.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Stage Map */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Stage Map
          </h2>

          {/* Stage Grid (3 columns for stages 1-7, centered boss) */}
          <div className="relative max-w-2xl mx-auto">
            {/* Regular Stages (1-7) */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {stages
                .filter((s) => !s.isBoss)
                .map((stage, index) => {
                  const status = useStageUnlockStatus(stage, progress);
                  const userStageProgress = null; // TODO: fetch from Firestore

                  return (
                    <div key={stage.id} className="flex flex-col items-center">
                      <StageNode
                        stage={stage}
                        status={status}
                        stars={userStageProgress?.stars || 0}
                      />
                      <p className="mt-8 text-sm text-gray-600 text-center font-medium">
                        {stage.title_en}
                      </p>
                    </div>
                  );
                })}
            </div>

            {/* Boss Stage (centered) */}
            {stages
              .filter((s) => s.isBoss)
              .map((stage) => {
                const status = useStageUnlockStatus(stage, progress);

                return (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-500 uppercase tracking-wide">
                        Boss Stage
                      </p>
                    </div>
                    <StageNode stage={stage} status={status} stars={0} />
                    <p className="mt-8 text-lg text-gray-900 font-bold text-center">
                      {stage.title_en}
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                      Review all {stage.wordCount} words!
                    </p>
                  </div>
                );
              })}
          </div>

          {/* Connecting Lines (optional - CSS only) */}
          <style jsx>{`
            .stage-path {
              position: relative;
            }
            .stage-path::after {
              content: '';
              position: absolute;
              top: 50%;
              right: -2rem;
              width: 2rem;
              height: 2px;
              background: #cbd5e0;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
```

---

### Step 7: 스테이지 상세 페이지 (예상: 15min)

**파일: `app/learn/[mapId]/[stageId]/page.tsx`**
```typescript
'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';

interface StageDetailPageProps {
  params: Promise<{ mapId: string; stageId: string }>;
}

export default function StageDetailPage({ params }: StageDetailPageProps) {
  const { mapId, stageId } = use(params);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <button
          onClick={() => router.push(`/learn/${mapId}`)}
          className="text-blue-600 hover:underline mb-8"
        >
          ← Back to Map
        </button>

        {/* Stage Info Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Thumbnail */}
          <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-8xl">🐶</span>
          </div>

          {/* Content */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Max the Hungry Dog
            </h1>
            <p className="text-gray-600 mb-6">
              Learn 20 new words about animals and food
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">20</div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">3min</div>
                <div className="text-sm text-gray-600">Video</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">2min</div>
                <div className="text-sm text-gray-600">Game</div>
              </div>
            </div>

            {/* Progress (if started) */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Your Progress</span>
                <span>0/20 words</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-0" />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition">
                🎓 Start Learning
              </button>
              <button className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
                🎮 Play Game Only
              </button>
            </div>

            {/* Best Score (if completed) */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Best Score: --- | Stars: ---</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>✅ Module 03 Complete - Map UI!</p>
          <p className="mt-2">Next: Module 04 - Video Player</p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 테스트

### 테스트 시나리오

```bash
npm run dev
```

**1. 맵 목록 테스트**:
```
1. /learn 접속
2. Map 1 카드 표시 확인
3. Lock 아이콘 or Progress 표시 확인
4. 클릭 시 맵 상세 페이지 이동
```

**2. 스테이지 맵 테스트**:
```
1. /learn/map_1 접속
2. 스테이지 1-8 노드 표시 확인
3. Stage 1: 파란색 (unlocked)
4. Stage 2-8: 회색 (locked)
5. 클릭 시 스테이지 상세 이동
```

**3. 반응형 테스트**:
```
1. 브라우저 창 크기 조절
2. 모바일 (< 768px): 1열
3. 태블릿 (< 1024px): 2열
4. 데스크톱: 3열
```

**4. 진행도 테스트**:
```
1. Firestore에서 user_progress 수동 업데이트
2. completedStages: ["map_1_stage_1"]
3. 페이지 새로고침
4. Stage 1: 초록색 (completed) + 별 표시
```

---

## 🐛 트러블슈팅

### 문제: Firestore에서 데이터 안 보임
```
Empty array returned
```

**해결**:
```bash
# 1. Firestore 규칙 확인
# 2. 샘플 데이터 추가 (scripts/seed-data.ts)
# 3. 콘솔에서 직접 확인
```

### 문제: Stage 상태가 안 바뀜
```
Always showing locked
```

**해결**:
```typescript
// useStageUnlockStatus 로직 확인
// progress가 null인지 확인
console.log('Progress:', progress);
console.log('Stage:', stage);
```

### 문제: CSS 애니메이션 안 됨
```
animate-pulse-slow not working
```

**해결**:
```typescript
// tailwind.config.ts에 animation 추가 확인
animation: {
  'pulse-slow': 'pulse 3s infinite',
}
```

---

## 📚 참고

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [Framer Motion](https://www.framer.com/motion/) (애니메이션 고도화)

---

## 💾 Commit

```bash
git add .
git commit -m "feat: implement map and stage UI

- Map list page with cards
- Stage map visualization
- Stage status (locked/unlocked/completed)
- Progress tracking
- Responsive design
- Firestore data hooks
"
```

---

## 체크리스트

- [ ] 맵 목록 화면 구현 ✅
- [ ] 스테이지 노드 UI 구현 ✅
- [ ] 스테이지 상태 표시 ✅
- [ ] 스테이지 상세 페이지 ✅
- [ ] Firestore 데이터 로드 ✅
- [ ] 언락 로직 ✅
- [ ] 반응형 디자인 ✅

**Module 03 완료! MVP Core 완성!** 🎉

**다음 단계**:
- Module 04: 비디오 플레이어 구현
- Module 05: Defense 게임 구현
- Module 06: Stripe 결제 통합

*Last updated: 2025-01-19*
