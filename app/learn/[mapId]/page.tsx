'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMap, useStages } from '@/lib/hooks/use-maps';
import { useUserProgress, getStageStatus, getStageStars } from '@/lib/hooks/use-progress';
import { useAuthStore } from '@/lib/store/auth-store';
import { StageNode } from '@/components/map/stage-node';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { cn } from '@/lib/utils';

interface MapDetailPageProps {
    params: Promise<{ mapId: string }>;
}

export default function MapDetailPage({ params }: MapDetailPageProps) {
    return (
        <ProtectedRoute>
            <MapDetailContent params={params} />
        </ProtectedRoute>
    );
}

function MapDetailContent({ params }: MapDetailPageProps) {
    const { mapId } = use(params);
    const router = useRouter();
    const { isGuest } = useAuthStore();

    const { map, isLoading: mapLoading, error: mapError } = useMap(mapId);
    const { stages, isLoading: stagesLoading, error: stagesError } = useStages(mapId);
    const { progress, isLoading: progressLoading } = useUserProgress();

    const isLoading = mapLoading || stagesLoading || progressLoading;
    const error = mapError || stagesError;

    // 완료된 스테이지 수 계산
    const completedCount = stages.filter((stage) =>
        progress?.completedStages.includes(stage.id)
    ).length;

    // 일반 스테이지와 보스 스테이지 분리
    const regularStages = stages.filter(s => !s.isBoss);
    const bossStage = stages.find(s => s.isBoss);

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => router.push('/learn')}
                        className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition font-medium"
                    >
                        <span>←</span>
                        <span>Back to Maps</span>
                    </button>
                </div>
            </header>

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-500">Loading stages...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-32">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">맵을 찾을 수 없습니다</h2>
                    <p className="text-slate-500 mb-4">{error.message}</p>
                    <Link
                        href="/learn"
                        className="inline-block px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
                    >
                        맵 목록으로 돌아가기
                    </Link>
                </div>
            )}

            {/* Main Content */}
            {!isLoading && !error && map && (
                <main className="container mx-auto px-4 py-8">
                    {/* Map Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-6xl drop-shadow-lg">{map.icon}</span>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                                {map.name_en}
                            </h1>
                            <p className="text-slate-500">
                                Complete {stages.length} stages to master {map.totalWords} words
                            </p>
                        </div>
                    </div>

                    {/* Guest Mode Banner */}
                    {isGuest && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎁</span>
                                <div>
                                    <p className="font-semibold text-yellow-800">Guest Mode</p>
                                    <p className="text-sm text-yellow-600">Stage 1만 무료로 체험할 수 있어요</p>
                                </div>
                            </div>
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg font-semibold hover:bg-yellow-500 transition text-sm"
                            >
                                로그인하기
                            </Link>
                        </div>
                    )}

                    {/* Progress Card */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6 mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-slate-900">
                                Your Progress
                            </span>
                            <span className="text-brand-600 font-bold">
                                {completedCount}/{stages.length} Stages
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-brand-400 to-brand-600 h-4 rounded-full transition-all duration-500"
                                style={{
                                    width: `${stages.length > 0 ? (completedCount / stages.length) * 100 : 0}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Stage Map */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                            Stage Map
                        </h2>

                        {/* Empty State */}
                        {stages.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">🏗️</div>
                                <p className="text-slate-500">스테이지가 아직 준비 중이에요!</p>
                            </div>
                        )}

                        {/* Regular Stages Grid */}
                        {regularStages.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-8 mb-12">
                                {regularStages.map((stage) => {
                                    const status = getStageStatus(stage, progress, isGuest);
                                    const stars = getStageStars(stage.id, progress);

                                    return (
                                        <StageNode
                                            key={stage.id}
                                            stage={stage}
                                            status={status}
                                            stars={stars}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* Boss Stage (centered) */}
                        {bossStage && (
                            <div className="flex flex-col items-center pt-8 border-t border-slate-100">
                                <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-4">
                                    🏆 Boss Stage
                                </p>
                                <StageNode
                                    stage={bossStage}
                                    status={getStageStatus(bossStage, progress, isGuest)}
                                    stars={getStageStars(bossStage.id, progress)}
                                />
                                <p className="mt-4 text-slate-600 text-center">
                                    Review all {bossStage.wordCount} words!
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
}
