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
