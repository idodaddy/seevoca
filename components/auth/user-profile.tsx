'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { signOut } from '@/lib/firebase/auth-service';
import Link from 'next/link';

export function UserProfile() {
    const { user, firebaseUser } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!user || !firebaseUser) return null;

    const handleSignOut = async () => {
        try {
            setIsLoading(true);
            await signOut();
        } catch (error) {
            console.error('Sign out failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full bg-white border border-slate-200 hover:border-brand-200 hover:shadow-md transition-all group"
            >
                <span className="font-medium text-slate-700 text-sm pl-1">{user.displayName}</span>
                <img
                    src={user.photoURL || 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border border-slate-100 group-hover:scale-105 transition-transform"
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-fade-in-up origin-top-right">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-slate-50">
                            <p className="font-bold text-slate-900">{user.displayName}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            <Link
                                href="/progress"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <span>📊</span> My Progress
                            </Link>
                            <Link
                                href="/settings"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <span>⚙️</span> Settings
                            </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-slate-50 mt-1 pt-1">
                            <button
                                onClick={handleSignOut}
                                disabled={isLoading}
                                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? 'Signing out...' : '🚪 Sign Out'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
