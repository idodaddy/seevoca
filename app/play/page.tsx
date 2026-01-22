'use client';

import { useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useStages, useMap } from '@/lib/hooks/use-maps';
import { useUserProgress, getStageStatus, getStageStars } from '@/lib/hooks/use-progress';
import { useAuthStore } from '@/lib/store/auth-store';
import { WorldMap } from '@/components/map/world-map';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserProfile } from '@/components/auth/user-profile';
import { useMaps } from '@/lib/hooks/use-maps';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Stage } from '@/types';

export default function PlayPage() {
    return (
        <ProtectedRoute>
            <PlayContent />
        </ProtectedRoute>
    );
}

function PlayContent() {
    const { user, isGuest } = useAuthStore();
    const { maps, isLoading: mapsLoading } = useMaps();
    const { progress, isLoading: progressLoading } = useUserProgress();

    // UI 상태 관리용 (progress 로딩 전에는 기본값 'map_1' 사용)
    const [activeMapId, setActiveMapId] = useState('map_1');

    // progress가 로드되면 현재 맵 업데이트
    useEffect(() => {
        if (progress?.currentMap) {
            setActiveMapId(progress.currentMap);
        }
    }, [progress]);

    // 사용자가 탭을 클릭했을 때 맵 변경
    const handleMapSelect = (mapId: string) => {
        setActiveMapId(mapId);
    };

    const { map, isLoading: mapLoading } = useMap(activeMapId);
    const { stages, isLoading: stagesLoading } = useStages(activeMapId);

    const isLoading = mapsLoading || progressLoading || mapLoading || stagesLoading;

    // DEBUG: 데이터 로딩 상태 확인 (JSON Stringify for better visibility)
    console.log('PlayPage Debug:', JSON.stringify({
        isLoading,
        activeMapId,
        mapsCount: maps.length,
        mapLoaded: !!map,
        stagesCount: stages.length,
        progressMap: progress?.currentMap
    }, null, 2));

    // 스테이지 상태 계산 함수
    const computeStageStatus = useMemo(() => {
        // stages가 없으면 항상 'locked'를 반환하는 함수 제공
        if (!stages || stages.length === 0) {
            return (_stage: Stage) => 'locked' as const;
        }
        return (stage: typeof stages[0]) => getStageStatus(stage, progress, isGuest);
    }, [stages, progress, isGuest]);

    const computeStageStars = useMemo(() => {
        return (stageId: string) => getStageStars(stageId, progress);
    }, [progress]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <span className="text-2xl">🌊</span>
                        <span className="font-heading font-bold text-xl text-brand-700">SeeVoca</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* 맵 선택 탭 */}
                        <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                            {maps.length > 0 ? maps.map((m) => {
                                const isUnlocked = m.unlockRequirement?.type === 'free'
                                    || progress?.unlockedMaps.includes(m.id);
                                const isActive = m.id === activeMapId;

                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => isUnlocked && handleMapSelect(m.id)}
                                        disabled={!isUnlocked}
                                        className={cn(
                                            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
                                            isActive && 'bg-white shadow text-brand-600',
                                            !isActive && isUnlocked && 'text-slate-600 hover:bg-white/50',
                                            !isUnlocked && 'text-slate-400 cursor-not-allowed'
                                        )}
                                    >
                                        <span>{m.icon}</span>
                                        <span className="hidden lg:inline">{m.name_en}</span>
                                        {!isUnlocked && <span>🔒</span>}
                                    </button>
                                );
                            }) : (
                                <div className="px-3 py-1.5 text-sm text-slate-400">Loading maps...</div>
                            )}
                        </div>

                        {/* Guest Banner */}
                        {isGuest && (
                            <Link
                                href="/login"
                                className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-medium hover:bg-yellow-200 transition"
                            >
                                로그인하여 진행도 저장 →
                            </Link>
                        )}

                        {/* User Profile */}
                        {user && <UserProfile />}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {/* Loading State */}
                {isLoading && stages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-slate-500">Loading world map...</p>
                    </div>
                )}

                {/* World Map */}
                {(stages.length > 0) && (
                    <div className="max-w-5xl mx-auto">
                        {/* Stats Bar */}
                        {progress && (
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-4 mb-6">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-xl font-bold text-brand-600">
                                            {progress.totalWordsLearned}
                                        </div>
                                        <div className="text-xs text-slate-500">Words</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-yellow-500">
                                            {progress.totalStarsEarned} ⭐
                                        </div>
                                        <div className="text-xs text-slate-500">Stars</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-emerald-500">
                                            {progress.currentStreak} 🔥
                                        </div>
                                        <div className="text-xs text-slate-500">Streak</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* World Map Component */}
                        <WorldMap
                            stages={stages}
                            getStageStatus={computeStageStatus}
                            getStageStars={computeStageStars}
                            mapName={map?.name_en || 'Loading Map...'}
                            mapIcon={map?.icon || '🗺️'}
                        />

                        {/* Mobile Map Selector */}
                        <div className="md:hidden mt-6 flex gap-2 overflow-x-auto pb-2">
                            {maps.map((m) => {
                                const isUnlocked = m.unlockRequirement?.type === 'free'
                                    || progress?.unlockedMaps.includes(m.id);
                                const isActive = m.id === activeMapId;

                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => isUnlocked && handleMapSelect(m.id)}
                                        disabled={!isUnlocked}
                                        className={cn(
                                            'flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2',
                                            isActive && 'bg-brand-500 text-white shadow-lg',
                                            !isActive && isUnlocked && 'bg-white text-slate-600 shadow',
                                            !isUnlocked && 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        )}
                                    >
                                        <span>{m.icon}</span>
                                        <span>{m.name_en}</span>
                                        {!isUnlocked && <span>🔒</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && (stages.length === 0 || !map) && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🗺️</div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">맵 데이터를 불러올 수 없습니다</h2>
                        <p className="text-slate-500 mb-4">
                            Map ID: <span className="font-mono bg-slate-100 px-1 rounded">{activeMapId}</span><br />
                            Stages: {stages.length} / Map Found: {map ? 'Yes' : 'No'}
                        </p>
                        <Link
                            href="/dev/seed"
                            className="inline-block px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition"
                        >
                            샘플 데이터 생성하기
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
