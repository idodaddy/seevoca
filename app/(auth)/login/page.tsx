'use client';

import { useRouter } from 'next/navigation';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const { user, setGuest } = useAuthStore();

    // 이미 로그인되어 있으면 리다이렉트
    useEffect(() => {
        if (user) {
            router.push('/learn');
        }
    }, [user, router]);

    const handleSuccess = () => {
        router.push('/learn');
    };

    const handleError = (error: Error) => {
        alert('Login failed: ' + error.message);
    };

    const handleGuestLogin = () => {
        setGuest(true);
        router.push('/learn');
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-brand-200/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-secondary-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full max-w-md p-6 relative z-10">

                {/* Logo Section */}
                <div className="text-center mb-8 animate-fade-in-up">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:scale-105 transition-transform">
                        <span className="text-4xl">🌊</span>
                        <span className="font-heading font-bold text-3xl text-brand-700 tracking-tight">SeeVoca</span>
                    </Link>
                    <p className="text-slate-500 text-lg">Your magical journey begins here</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 animate-fade-in-up delay-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                        Welcome Back! 👋
                    </h2>

                    {/* Google Sign In */}
                    <div className="flex justify-center mb-8">
                        <GoogleSignInButton
                            onSuccess={handleSuccess}
                            onError={handleError}
                        />
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/50 backdrop-blur text-slate-500">or start exploring</span>
                        </div>
                    </div>

                    {/* Guest Mode */}
                    <button
                        onClick={handleGuestLogin}
                        className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-brand-200 text-brand-600 font-semibold hover:bg-brand-50 hover:border-brand-300 transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>🚀</span>
                        <span>Continue as Guest</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>

                    <p className="mt-3 text-center text-xs text-slate-400">
                        Guest progress is saved on this device only
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-slate-400 text-sm animate-fade-in-up delay-200">
                    <p>© 2026 SeeVoca. Making learning fun.</p>
                </div>
            </div>
        </div>
    );
}
