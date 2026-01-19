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
