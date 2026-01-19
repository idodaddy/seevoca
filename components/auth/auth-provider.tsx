'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { onAuthChange } from '@/lib/firebase/auth-service';
import { migrateGuestToUser, getGuestSession } from '@/lib/firebase/guest-service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading, setGuest, clearUser } = useAuthStore();

    useEffect(() => {
        // 인증 상태 구독
        const unsubscribe = onAuthChange(async (user, firebaseUser) => {
            if (user && firebaseUser) {
                // 로그인됨
                setUser(user, firebaseUser);

                // Guest progress 마이그레이션
                await migrateGuestToUser(user.uid);
            } else {
                // 로그아웃됨
                clearUser();

                // Guest session 확인
                const guestSession = getGuestSession();
                if (guestSession) {
                    setGuest(true);
                }
            }
        });

        return () => unsubscribe();
    }, [setUser, setLoading, setGuest, clearUser]);

    return <>{children}</>;
}
