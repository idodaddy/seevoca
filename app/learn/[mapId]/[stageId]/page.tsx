'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStage, useMap } from '@/lib/hooks/use-maps';
import { useUserProgress, getStageStatus, getStageStars } from '@/lib/hooks/use-progress';
import { useAuthStore } from '@/lib/store/auth-store';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { cn } from '@/lib/utils';

interface StageDetailPageProps {
    params: Promise<{ mapId: string; stageId: string }>;
}

export default function StageDetailPage({ params }: StageDetailPageProps) {
    return (
        <ProtectedRoute>
            <StageDetailContent params={params} />
        </ProtectedRoute>
    );
}

function StageDetailContent({ params }: StageDetailPageProps) {
    const { mapId, stageId } = use(params);
    const router = useRouter();
    const { isGuest } = useAuthStore();

    const { stage, isLoading: stageLoading, error: stageError } = useStage(stageId);
    const { map, isLoading: mapLoading } = useMap(mapId);
    const { progress, isLoading: progressLoading } = useUserProgress();

    const isLoading = stageLoading || mapLoading || progressLoading;

    // 스테이지 상태
    const status = stage ? getStageStatus(stage, progress, isGuest) : 'locked';
    const stars = stage ? getStageStars(stage.id, progress) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => router.push(`/learn/${mapId}`)}
                        className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition font-medium"
                    >
                        <span>←</span>
                        <span>Back to {map?.name_en || 'Map'}</span>
                    </button>
                </div>
            </header>

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-500">Loading stage...</p>
                </div>
            )}

            {/* Error State */}
            {stageError && (
                <div className="text-center py-32">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">스테이지를 찾을 수 없습니다</h2>
                    <p className="text-slate-500 mb-4">{stageError.message}</p>
                    <Link
                        href={`/learn/${mapId}`}
                        className="inline-block px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
                    >
                        맵으로 돌아가기
                    </Link>
                </div>
            )}

            {/* Main Content */}
            {!isLoading && !stageError && stage && (
                <main className="container mx-auto px-4 py-8">
                    {/* Stage Info Card */}
                    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                        {/* Thumbnail / Header */}
                        <div className={cn(
                            'aspect-video flex items-center justify-center',
                            'bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600'
                        )}>
                            <div className="text-center">
                                <span className="text-8xl drop-shadow-lg">
                                    {stage.isBoss ? '👑' : getCategoryEmoji(stage.category)}
                                </span>
                                {stage.isBoss && (
                                    <p className="mt-2 text-white/80 uppercase tracking-wide text-sm font-semibold">
                                        Boss Stage
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {/* Stage Number Badge */}
                            <div className="flex items-center justify-center mb-4">
                                <span className={cn(
                                    'px-4 py-1 rounded-full text-sm font-semibold',
                                    'bg-brand-100 text-brand-700'
                                )}>
                                    Stage {stage.stageNumber}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">
                                {stage.title_en}
                            </h1>
                            <p className="text-slate-500 text-center mb-2">{stage.title_ko}</p>
                            <p className="text-slate-600 text-center mb-6">{stage.description}</p>

                            {/* Stars (if completed) */}
                            {status === 'completed' && (
                                <div className="flex justify-center gap-1 mb-6">
                                    {Array(3).fill(0).map((_, i) => (
                                        <span
                                            key={i}
                                            className={cn(
                                                'text-3xl',
                                                i < stars ? 'text-yellow-400 drop-shadow' : 'text-slate-200'
                                            )}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="text-center p-4 bg-brand-50 rounded-xl">
                                    <div className="text-2xl font-bold text-brand-600">{stage.wordCount}</div>
                                    <div className="text-sm text-slate-500">Words</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-xl">
                                    <div className="text-2xl font-bold text-purple-600">3min</div>
                                    <div className="text-sm text-slate-500">Video</div>
                                </div>
                                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                                    <div className="text-2xl font-bold text-emerald-600">2min</div>
                                    <div className="text-sm text-slate-500">Game</div>
                                </div>
                            </div>

                            {/* Progress (placeholder) */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-slate-500 mb-2">
                                    <span>Your Progress</span>
                                    <span>0/{stage.wordCount} words</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div className="bg-brand-500 h-2 rounded-full w-0" />
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            {status === 'locked' ? (
                                <div className="text-center">
                                    <div className="text-5xl mb-4">🔒</div>
                                    <p className="text-slate-500 mb-4">이전 스테이지를 먼저 완료해주세요</p>
                                    <button
                                        onClick={() => router.push(`/learn/${mapId}`)}
                                        className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-300 transition"
                                    >
                                        맵으로 돌아가기
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <button className={cn(
                                        'flex-1 py-4 rounded-xl font-semibold transition-all',
                                        'bg-gradient-to-r from-brand-500 to-brand-600 text-white',
                                        'hover:from-brand-600 hover:to-brand-700',
                                        'shadow-lg shadow-brand-500/25',
                                        'flex items-center justify-center gap-2'
                                    )}>
                                        <span>🎓</span>
                                        <span>Start Learning</span>
                                    </button>
                                    <button className={cn(
                                        'flex-1 py-4 rounded-xl font-semibold transition-all',
                                        'bg-slate-100 text-slate-700 hover:bg-slate-200',
                                        'flex items-center justify-center gap-2'
                                    )}>
                                        <span>🎮</span>
                                        <span>Play Game</span>
                                    </button>
                                </div>
                            )}

                            {/* Best Score (if completed) */}
                            {status === 'completed' && (
                                <div className="mt-6 text-center text-sm text-slate-400">
                                    <p>Best Score: 95% | Time: 2:34</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Module Status */}
                    <div className="mt-8 text-center text-sm text-slate-400">
                        <p>✅ Module 03 Complete - Map UI!</p>
                        <p className="mt-1">Next: Module 04 - Video Player</p>
                    </div>
                </main>
            )}
        </div>
    );
}

// 카테고리별 이모지 반환
function getCategoryEmoji(category: string): string {
    const categoryEmojis: Record<string, string> = {
        animals: '🐶',
        nature: '🌸',
        food: '🍕',
        family: '👨‍👩‍👧',
        school: '📚',
        sports: '⚽',
        weather: '🌤️',
        travel: '✈️',
        review: '📝',
    };
    return categoryEmojis[category] || '📖';
}
