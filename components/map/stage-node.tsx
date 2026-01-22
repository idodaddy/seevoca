'use client';

import { useState } from 'react';
import { Stage } from '@/types';
import { cn } from '@/lib/utils';
import { StageStatus } from '@/lib/hooks/use-progress';

interface StageNodeProps {
    stage: Stage;
    config: { x: number; y: number; scale: number };
    status: StageStatus;
    stars: number;
    onClick: (stage: Stage) => void;
    index: number;
}

const ISO_ROTATE_X = 55;
const ISO_ROTATE_Z = -35;

export function StageNode({ stage, config, status, stars, onClick, index }: StageNodeProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Base height logic from WorldMap
    const zHeight = stage.isBoss ? 20 : (index * 2);

    return (
        <div
            className="absolute transform-style-3d cursor-pointer"
            style={{
                left: `${config.x}%`,
                top: `${config.y}%`,
                zIndex: 300 + index
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick(stage)}
        >
            {/* 1. The Pedestal (Circular Base) */}
            <div
                className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 shadow-lg transition-transform",
                    status === 'locked' ? "bg-slate-300/50 border-slate-400/50" : "bg-white border-white",
                    isHovered && "scale-110",
                    // Pulse ring for unlocked stages (Current Stage Emphasis)
                    status === 'unlocked' && !stage.isBoss && "animate-pulse border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.6)]"
                )}
                style={{ transform: `rotateZ(${-ISO_ROTATE_Z}deg) rotateX(${-ISO_ROTATE_X}deg) scaleY(0.5)` }} // Flattened circle on ground
            />

            {/* 2. Floating Object (Crystal/Flag) */}
            <div
                className={cn(
                    "transform-style-3d transition-all duration-500",
                    status === 'unlocked' && "animate-float-vertical"
                )}
                style={{ transform: `translateZ(${zHeight + 10}px)` }}
            >
                {/* Billboarding Item */}
                <div
                    className={cn(
                        "relative flex items-center justify-center transform transition-transform",
                        "rotate-z-[35deg] rotate-x-[-55deg]", // Face Camera
                    )}
                    style={{
                        transform: `rotateZ(${-ISO_ROTATE_Z}deg) rotateX(${-ISO_ROTATE_X}deg) scale(${config.scale}) translateY(-20px)`,
                    }}
                >

                    {/* LOCKED: Solid Grey Diamond (NO TRANSPARENCY) */}
                    {status === 'locked' && (
                        <div className={cn(
                            "w-16 h-16 rounded-2xl rotate-45 border-2 border-white flex items-center justify-center shadow-lg",
                            "bg-[#9CA3AF]" // Tailwind bg-gray-400 equivalent, SOLID COLOR
                        )}>
                            <span className="text-2xl text-white -rotate-45 drop-shadow-md">🔒</span>
                        </div>
                    )}

                    {/* UNLOCKED: Floating Gem/Portal */}
                    {status === 'unlocked' && (
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-50 animate-pulse" />

                            {/* The Gem */}
                            <div className={cn(
                                "w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-600 rounded-2xl rotate-45 border-4 border-white shadow-2xl flex items-center justify-center",
                                isHovered && "scale-110 rotate-12 transition-transform"
                            )}>
                                <span className="text-2xl font-black text-white -rotate-45 drop-shadow-md">{stage.stageNumber}</span>
                            </div>

                            {/* 'PLAY' Badge */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg animate-bounce">
                                PLAY
                            </div>
                        </div>
                    )}

                    {/* COMPLETED: Flag Pole */}
                    {status === 'completed' && (
                        <div className="relative flex flex-col items-center">
                            {/* Flag */}
                            <div className="text-5xl filter drop-shadow-lg animate-pulse-subtle origin-bottom-left">🚩</div>
                            {/* Base */}
                            <div className="w-8 h-2 bg-slate-600 rounded-full mt-[-5px]" />

                            {/* Stars */}
                            {stars > 0 && (
                                <div className="absolute -top-4 flex gap-0.5 filter drop-shadow-md">
                                    {Array(stars).fill('⭐').map((s, i) => <span key={i} className="text-xs animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>{s}</span>)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* BOSS: Big Castle */}
                    {stage.isBoss && status !== 'locked' && (
                        <div className="text-6xl filter drop-shadow-2xl hover:scale-110 transition-transform">🏰</div>
                    )}

                </div>
            </div>
        </div>
    );
}
