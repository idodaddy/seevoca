'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuthStore } from '@/lib/store/auth-store';

export default function LearnPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Learner Dashboard</h1>
                <p className="text-slate-600">
                    Welcome to the learning area! If you can see this, you are authenticated.
                </p>
                <div className="mt-8 p-4 bg-white rounded-lg shadow border border-slate-100">
                    <p className="font-mono text-sm">
                        Current User: <DebugUser />
                    </p>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function DebugUser() {
    const { user, isGuest } = useAuthStore();
    if (isGuest) return <span className="text-orange-500">Guest Mode</span>;
    return <span className="text-blue-500">{user?.email}</span>;
}
