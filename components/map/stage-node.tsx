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
    scaleFactor?: number; // Responsive scale factor (0.5-1.0)
}

const ISO_ROTATE_X = 55;
const ISO_ROTATE_Z = -35;

export function StageNode({ stage, config, status, stars, onClick, index, scaleFactor = 1 }: StageNodeProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Responsive size calculations
    const nodeSize = Math.max(40, 64 * scaleFactor); // 64px at full, 40px minimum
    const isMobile = scaleFactor < 0.7;

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
            {/* 1. The Pedestal (Circular Base) - Responsive */}
            <div
                className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 shadow-lg transition-transform",
                    status === 'locked' ? "bg-slate-300/50 border-slate-400/50" : "bg-white border-white",
                    isHovered && "scale-110",
                    // Pulse ring for unlocked stages (Current Stage Emphasis)
                    status === 'unlocked' && !stage.isBoss && "animate-pulse border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.6)]"
                )}
                style={{
                    width: `${nodeSize}px`,
                    height: `${nodeSize}px`,
                    transform: `rotateZ(${-ISO_ROTATE_Z}deg) rotateX(${-ISO_ROTATE_X}deg) scaleY(0.5)`
                }}
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
                        transform: `rotateZ(${-ISO_ROTATE_Z}deg) rotateX(${-ISO_ROTATE_X}deg) scale(${config.scale * scaleFactor}) translateY(-20px)`,
                    }}
                >

                    {/* LOCKED: Solid Grey Diamond (NO TRANSPARENCY) - Responsive */}
                    {status === 'locked' && (
                        <div
                            className={cn(
                                "rounded-2xl rotate-45 border-2 border-white flex items-center justify-center shadow-lg",
                                "bg-[#9CA3AF]" // Tailwind bg-gray-400 equivalent, SOLID COLOR
                            )}
                            style={{
                                width: `${nodeSize}px`,
                                height: `${nodeSize}px`,
                            }}
                        >
                            <span className={cn(
                                "text-white -rotate-45 drop-shadow-md",
                                isMobile ? "text-lg" : "text-2xl"
                            )}>🔒</span>
                        </div>
                    )}

                    {/* UNLOCKED: Floating Gem/Portal - Responsive */}
                    {status === 'unlocked' && (
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-50 animate-pulse" />

                            {/* The Gem */}
                            <div
                                className={cn(
                                    "bg-gradient-to-br from-blue-300 to-blue-600 rounded-2xl rotate-45 border-4 border-white shadow-2xl flex items-center justify-center",
                                    isHovered && "scale-110 rotate-12 transition-transform"
                                )}
                                style={{
                                    width: `${nodeSize}px`,
                                    height: `${nodeSize}px`,
                                }}
                            >
                                <span className={cn(
                                    "font-black text-white -rotate-45 drop-shadow-md",
                                    isMobile ? "text-lg" : "text-2xl"
                                )}>{stage.stageNumber}</span>
                            </div>

                            {/* 'PLAY' Badge - Responsive */}
                            <div className={cn(
                                "absolute left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-black rounded-full uppercase tracking-tighter shadow-lg animate-bounce",
                                isMobile
                                    ? "-bottom-3 text-[8px] px-1.5 py-0.5"
                                    : "-bottom-4 text-[10px] px-2 py-0.5"
                            )}>
                                PLAY
                            </div>
                        </div>
                    )}

                    {/* COMPLETED: Flag Pole - Responsive */}
                    {status === 'completed' && (
                        <div className="relative flex flex-col items-center">
                            {/* Flag */}
                            <div className={cn(
                                "filter drop-shadow-lg animate-pulse-subtle origin-bottom-left",
                                isMobile ? "text-3xl" : "text-5xl"
                            )}>🚩</div>
                            {/* Base */}
                            <div className={cn(
                                "bg-slate-600 rounded-full mt-[-5px]",
                                isMobile ? "w-5 h-1.5" : "w-8 h-2"
                            )} />

                            {/* Stars */}
                            {stars > 0 && (
                                <div className="absolute -top-4 flex gap-0.5 filter drop-shadow-md">
                                    {Array(stars).fill('⭐').map((s, i) => (
                                        <span
                                            key={i}
                                            className={cn(
                                                "animate-bounce",
                                                isMobile ? "text-[10px]" : "text-xs"
                                            )}
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        >{s}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* BOSS: Big Castle - Responsive */}
                    {stage.isBoss && status !== 'locked' && (
                        <div className={cn(
                            "filter drop-shadow-2xl hover:scale-110 transition-transform",
                            isMobile ? "text-4xl" : "text-6xl"
                        )}>🏰</div>
                    )}

                </div>
            </div>
        </div>
    );
}
