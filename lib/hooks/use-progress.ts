'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuthStore } from '@/lib/store/auth-store';
import { UserProgress, Stage } from '@/types';
import { getGuestSession } from '@/lib/firebase/guest-service';

/**
 * 사용자 진행도 가져오기
 */
export function useUserProgress() {
    const { user, isGuest } = useAuthStore();
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProgress() {
            // 게스트 모드 로직
            if (isGuest) {
                const guestSession = getGuestSession();
                // 게스트는 map_1만 접근 및 언락
                setProgress({
                    userId: guestSession?.id || 'guest',
                    currentMap: 'map_1',
                    currentStage: 'map_1_stage_1',
                    completedStages: guestSession?.progress.map(p => p.stageId) || [],
                    completedMaps: [],
                    totalWordsLearned: 0,
                    totalStarsEarned: guestSession?.progress.reduce((sum, p) => sum + p.stars, 0) || 0,
                    currentStreak: 0,
                    unlockedMaps: ['map_1'],
                });
                setIsLoading(false);
                return;
            }

            // 로그인하지 않은 경우 (초기 로딩 제외)
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'user_progress', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProgress(docSnap.data() as UserProgress);
                } else {
                    // 유저 문서가 없으면 기본값 (새 유저)
                    setProgress({
                        userId: user.uid,
                        currentMap: 'map_1',
                        currentStage: 'map_1_stage_1',
                        completedStages: [],
                        completedMaps: [],
                        totalWordsLearned: 0,
                        totalStarsEarned: 0,
                        currentStreak: 0,
                        unlockedMaps: ['map_1'],
                    });
                }
            } catch (error) {
                console.error('Failed to fetch progress:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProgress();
    }, [user, isGuest]);

    return { progress, isLoading };
}

/**
 * 스테이지 상태 계산
 */
export type StageStatus = 'locked' | 'unlocked' | 'completed';

export function getStageStatus(
    stage: Stage,
    progress: UserProgress | null,
    isGuest: boolean = false
): StageStatus {
    if (!stage) return 'locked';

    // Free 스테이지는 항상 언락
    if (stage.isFree) return 'unlocked';

    // 진행도 데이터 없으면 잠금
    if (!progress) return 'locked';

    // 완료했는지 확인
    if (progress.completedStages.includes(stage.id)) {
        return 'completed';
    }

    // 게스트는 무료 스테이지 외에는 모두 잠금 (또는 해제 로직 추가 가능)
    if (isGuest && !stage.isFree) {
        return 'locked';
    }

    // 언락 조건 확인
    if (stage.unlockRequirement?.type === 'payment') {
        const requiredMapId = stage.unlockRequirement.value;
        if (requiredMapId && progress.unlockedMaps.includes(requiredMapId)) {
            return 'unlocked';
        }
        return 'locked';
    }

    if (stage.unlockRequirement?.type === 'previous_stage') {
        const prevStageId = stage.unlockRequirement.value;
        if (prevStageId && progress.completedStages.includes(prevStageId)) {
            return 'unlocked';
        }
        // 이전 스테이지 조건이 없으면 기본적으로 unlocked (첫 스테이지 등)
        if (!prevStageId) return 'unlocked';

        return 'locked';
    }

    // 기본값 unlocked (조건 없으면)
    return 'unlocked';
}

/**
 * 스테이지 별점 가져오기
 */
export function getStageStars(stageId: string, progress: UserProgress | null): number {
    if (!progress) return 0;
    // 실제로는 stage_progress 등 별도 컬렉션이나 필드에서 가져와야 함
    // 임시로 완료 시 3점 반환
    if (progress.completedStages.includes(stageId)) {
        return 3;
    }
    return 0;
}
