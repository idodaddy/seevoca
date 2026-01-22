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

// ============================================
// Map & Stage Types
// ============================================

export interface Map {
    id: string;
    order: number;
    name_en: string;
    name_ko: string;
    icon: string;
    theme: string;
    difficulty: number;
    totalStages: number;
    totalWords: number;
    unlockRequirement: UnlockRequirement;
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
    unlockRequirement: UnlockRequirement;
}

export interface UnlockRequirement {
    type: 'free' | 'payment' | 'previous_stage';
    value?: string; // mapId for payment, stageId for previous_stage
}

export interface StageProgress {
    stageId: string;
    stars: number; // 0-3
    score: number;
    completedAt: Timestamp;
    wordsLearned: number;
}
