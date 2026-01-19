import {
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/types';

const googleProvider = new GoogleAuthProvider();

/**
 * Google 로그인
 */
export async function signInWithGoogle(): Promise<User> {
    try {
        // Google 팝업 로그인
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        // Firestore에서 사용자 문서 확인
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        let userData: User;

        if (userDoc.exists()) {
            // 기존 사용자 - 마지막 로그인 업데이트
            userData = userDoc.data() as User;
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
                lastLoginAt: Timestamp.now(),
            });
        } else {
            // 신규 사용자 - 문서 생성
            userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName || 'User',
                photoURL: firebaseUser.photoURL || undefined,
                createdAt: Timestamp.now(),
                lastLoginAt: Timestamp.now(),
                purchases: [],
            };

            await setDoc(doc(db, 'users', firebaseUser.uid), userData);

            // 사용자 진행도 초기화
            await initializeUserProgress(firebaseUser.uid);
        }

        return userData;
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<void> {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
}

/**
 * 인증 상태 구독
 */
export function onAuthChange(
    callback: (user: User | null, firebaseUser: FirebaseUser | null) => void
): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            // 로그인 상태 - Firestore에서 데이터 가져오기
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.exists() ? (userDoc.data() as User) : null;
            callback(userData, firebaseUser);
        } else {
            // 로그아웃 상태
            callback(null, null);
        }
    });
}

/**
 * 현재 사용자 가져오기
 */
export async function getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    return userDoc.exists() ? (userDoc.data() as User) : null;
}

/**
 * 사용자 진행도 초기화 (신규 사용자)
 */
async function initializeUserProgress(userId: string): Promise<void> {
    const initialProgress = {
        userId,
        currentMap: 'map_1',
        currentStage: 'map_1_stage_1',
        completedStages: [],
        completedMaps: [],
        totalWordsLearned: 0,
        totalStarsEarned: 0,
        currentStreak: 0,
        unlockedMaps: ['map_1'], // Map 1은 기본 언락
    };

    await setDoc(doc(db, 'user_progress', userId), initialProgress);
}
