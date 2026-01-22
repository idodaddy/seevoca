'use client';

import { useRouter } from 'next/navigation';
import { Map } from '@/types';
import { formatNumber, cn } from '@/lib/utils';

interface MapCardProps {
    map: Map;
    isUnlocked: boolean;
    progress: number; // 0-100
}

export function MapCard({ map, isUnlocked, progress }: MapCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (isUnlocked) {
            router.push(`/learn/${map.id}`);
        } else {
            // TODO: Show payment modal
            alert('이 맵은 잠겨있습니다. 구매 후 이용해주세요!');
        }
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                'relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden cursor-pointer',
                'border border-white/50 transition-all duration-300',
                'hover:shadow-2xl hover:-translate-y-2 hover:border-brand-200',
                !isUnlocked && 'opacity-80'
            )}
        >
            {/* Lock Overlay */}
            {!isUnlocked && (
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-6xl drop-shadow-lg">🔒</div>
                </div>
            )}

            {/* Gradient Header */}
            <div className={cn(
                'h-24 flex items-center justify-center',
                'bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600'
            )}>
                <span className="text-6xl drop-shadow-lg">{map.icon}</span>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 text-center mb-1">
                    {map.name_en}
                </h3>
                <p className="text-slate-500 text-center text-sm mb-4">{map.name_ko}</p>

                {/* Stats */}
                <div className="flex justify-around text-sm text-slate-600 mb-5">
                    <div className="text-center">
                        <div className="font-bold text-lg text-brand-600">{map.totalStages}</div>
                        <div className="text-xs">Stages</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-lg text-brand-600">{formatNumber(map.totalWords)}</div>
                        <div className="text-xs">Words</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-lg">
                            {'⭐'.repeat(map.difficulty)}{'☆'.repeat(3 - map.difficulty)}
                        </div>
                        <div className="text-xs">Difficulty</div>
                    </div>
                </div>

                {/* Progress Bar */}
                {isUnlocked && (
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Progress</span>
                            <span className="font-semibold text-brand-600">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-brand-400 to-brand-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* CTA Button */}
                <button
                    className={cn(
                        'w-full py-3 rounded-xl font-semibold transition-all duration-300',
                        'flex items-center justify-center gap-2',
                        isUnlocked
                            ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    )}
                >
                    {isUnlocked ? (
                        <>
                            <span>Continue</span>
                            <span className="text-lg">→</span>
                        </>
                    ) : (
                        <>
                            <span>🔑</span>
                            <span>Unlock</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
