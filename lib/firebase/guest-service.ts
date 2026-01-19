import { storage, STORAGE_KEYS } from '@/lib/utils';
import { GuestSession, GuestProgress } from '@/types';

/**
 * Guest Session 생성
 */
export function createGuestSession(): GuestSession {
    const session: GuestSession = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7일
        progress: [],
    };

    storage.set(STORAGE_KEYS.GUEST_SESSION, session);
    return session;
}

/**
 * Guest Session 가져오기
 */
export function getGuestSession(): GuestSession | null {
    const session = storage.get<GuestSession>(STORAGE_KEYS.GUEST_SESSION);

    if (!session) return null;

    // 만료 확인
    if (Date.now() > session.expiresAt) {
        storage.remove(STORAGE_KEYS.GUEST_SESSION);
        return null;
    }

    return session;
}

/**
 * Guest Progress 저장
 */
export function saveGuestProgress(progress: GuestProgress): void {
    let session = getGuestSession();

    if (!session) {
        session = createGuestSession();
    }

    // 기존 진행도 업데이트 또는 추가
    const index = session.progress.findIndex(p => p.stageId === progress.stageId);

    if (index >= 0) {
        session.progress[index] = progress;
    } else {
        session.progress.push(progress);
    }

    storage.set(STORAGE_KEYS.GUEST_SESSION, session);
}

/**
 * Guest Progress 가져오기
 */
export function getGuestProgress(stageId: string): GuestProgress | null {
    const session = getGuestSession();
    if (!session) return null;

    return session.progress.find(p => p.stageId === stageId) || null;
}

/**
 * Guest → User 마이그레이션
 */
export async function migrateGuestToUser(userId: string): Promise<void> {
    const session = getGuestSession();
    if (!session || session.progress.length === 0) return;

    // TODO: Firestore에 guest progress 저장
    // 지금은 localStorage만 클리어
    storage.remove(STORAGE_KEYS.GUEST_SESSION);

    console.log('Guest progress migrated for user:', userId);
}
