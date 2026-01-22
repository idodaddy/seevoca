'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Stage } from '@/types';
import { cn } from '@/lib/utils';
import { StageStatus } from '@/lib/hooks/use-progress';

// --- Configuration Constants ---
const ISO_ROTATE_X = 55;
const ISO_ROTATE_Z = -35;

// Stage Coordinates (Balanced)
const STAGE_CONFIG = [
    { id: 1, x: 20, y: 85, scale: 1.0 },   // Start
    { id: 2, x: 45, y: 75, scale: 1.0 },
    { id: 3, x: 65, y: 65, scale: 1.0 },
    { id: 4, x: 45, y: 55, scale: 1.0 },
    { id: 5, x: 65, y: 45, scale: 1.0 },
    { id: 6, x: 80, y: 35, scale: 1.1 },
    { id: 7, x: 60, y: 25, scale: 1.2 },
    { id: 8, x: 50, y: 10, scale: 1.3 },   // BOSS
];

// Helper to generate dense decorations with targeted filling
const generateDecorations = () => {
    const decos = [];

    // 1. Fill the Empty Left-Bottom Zone (Critical Fix)
    for (let i = 0; i < 12; i++) {
        decos.push({
            type: Math.random() > 0.4 ? 'tree' : 'bush',
            x: 5 + Math.random() * 35, // Left side 0-40%
            y: 50 + Math.random() * 40, // Bottom side 50-90%
            scale: 0.8 + Math.random() * 0.5,
            z: 0
        });
    }

    // 2. Fill the Empty Right Zone (NEW)
    for (let i = 0; i < 15; i++) {
        decos.push({
            type: Math.random() > 0.6 ? 'tree' : (Math.random() > 0.5 ? 'flower' : 'rock'),
            x: 60 + Math.random() * 30, // Right side 60-90%
            y: 20 + Math.random() * 60, // Vertical spread 20-80%
            scale: 0.8 + Math.random() * 0.5,
            z: 0
        });
    }

    // 3. Global Clusters
    const clusters = [[85, 75], [90, 20], [10, 20]];
    clusters.forEach(([cx, cy]) => {
        for (let i = 0; i < 6; i++) {
            decos.push({
                type: Math.random() > 0.3 ? 'tree' : 'rock',
                x: cx + (Math.random() * 15 - 7.5),
                y: cy + (Math.random() * 15 - 7.5),
                scale: 0.7 + Math.random() * 0.6,
                z: 0
            });
        }
    });

    // 4. Sky Elements (Richness)
    const clouds = [
        { type: 'cloud', x: 5, y: 10, scale: 1.8, z: 80, speed: 60, opacity: 0.9 },
        { type: 'cloud', x: 25, y: 5, scale: 1.2, z: 60, speed: 45, opacity: 0.7 },
        { type: 'cloud', x: 55, y: 15, scale: 1.5, z: 70, speed: 55, opacity: 0.8 },
        { type: 'cloud', x: 80, y: 8, scale: 1.0, z: 50, speed: 40, opacity: 0.6 },
        { type: 'cloud', x: 40, y: 30, scale: 0.8, z: 90, speed: 70, opacity: 0.5 },
        // New Clouds
        { type: 'cloud', x: 10, y: 25, scale: 1.1, z: 75, speed: 50, opacity: 0.6 },
        { type: 'cloud', x: 90, y: 20, scale: 1.4, z: 65, speed: 48, opacity: 0.75 },

        // V-Formation Birds
        { type: 'bird', x: 75, y: 15, scale: 0.5, z: 120, speed: 20, opacity: 0.9 },
        { type: 'bird', x: 72, y: 18, scale: 0.4, z: 110, speed: 20, opacity: 0.9, delay: 0.2 },
        { type: 'bird', x: 78, y: 18, scale: 0.4, z: 110, speed: 20, opacity: 0.9, delay: 0.2 },
        { type: 'bird', x: 69, y: 21, scale: 0.3, z: 100, speed: 20, opacity: 0.8, delay: 0.4 },
        { type: 'bird', x: 81, y: 21, scale: 0.3, z: 100, speed: 20, opacity: 0.8, delay: 0.4 },
    ];

    return { ground: decos, sky: clouds };
};

const DECORATIONS = generateDecorations();

interface WorldMapProps {
    stages: Stage[];
    getStageStatus: (stage: Stage) => StageStatus;
    getStageStars: (stageId: string) => number;
    mapName: string;
    mapIcon: string;
}

import { StageNode } from './stage-node';

export function WorldMap({ stages, getStageStatus, getStageStars, mapName, mapIcon }: WorldMapProps) {
    const router = useRouter();
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (window.innerWidth < 768) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 5;
            const y = (e.clientY / window.innerHeight - 0.5) * 5;
            setTilt({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleStageClick = (stage: Stage, status: StageStatus) => {
        if (status === 'locked') return;
        router.push(`/learn/${stage.mapId}/${stage.id}`);
    };

    return (
        <div
            className="relative w-full overflow-hidden bg-[#60a5fa]"
            style={{
                height: '700px',
                borderRadius: '40px',
                perspective: '1200px',
            }}
        >
            {/* --- 0. Rich Sky System --- */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-sky-200" />

                {/* Sun & Bloom */}
                <div className="absolute top-[-25%] right-[-15%] w-[70%] h-[70%] bg-yellow-100/40 blur-[100px] rounded-full" />
                <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-2xl animate-pulse-subtle" />

                {/* Parallax Clouds */}
                {DECORATIONS.sky.map((cloud, i) => (
                    <div
                        key={`cloud-${i}`}
                        className="absolute text-white animate-float-horizontal"
                        style={{
                            left: `${cloud.x}%`,
                            top: `${cloud.y}%`,
                            fontSize: `${cloud.scale * 4}rem`,
                            animationDuration: `${cloud.speed}s`,
                            animationDelay: cloud.delay ? `${cloud.delay}s` : '0s',
                            zIndex: 0,
                            opacity: cloud.opacity
                        }}
                    >
                        {cloud.type === 'cloud' ? '☁️' : '🕊️'}
                    </div>
                ))}
            </div>

            {/* --- 3D World Container --- */}
            <div
                className="relative w-full h-full transform-style-3d transition-transform duration-100 ease-out"
                style={{
                    transform: `
                        rotateX(${ISO_ROTATE_X + tilt.y}deg) 
                        rotateZ(${ISO_ROTATE_Z + tilt.x}deg) 
                        translateZ(-60px) scale(0.9)
                    `
                }}
            >
                {/* --- 1. Island Terrain --- */}
                <div className="absolute inset-x-0 inset-y-[10%] transform-style-3d" style={{ transform: 'translateZ(-40px)' }}>

                    {/* Ocean Foam */}
                    <div className="absolute -inset-8 bg-sky-100/60 rounded-[65px] transform translate-z-[-20px] animate-pulse" />

                    {/* Ground Thickness layers */}
                    <div className="absolute -inset-2 bg-[#fcd34d] rounded-[55px] transform translate-z-[-10px]" /> {/* Sand Beach */}
                    <div className="absolute inset-0 bg-[#713f12] rounded-[50px] transform translate-z-[-15px] shadow-2xl" /> {/* Dirt Base */}

                    {/* Grass Surface */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80] to-[#22c55e] rounded-[50px] overflow-hidden border-4 border-[#bbf7d0]">
                        {/* Noise Texture */}
                        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
                    </div>

                    {/* --- 2. Warm Earth Path --- */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none transform translate-z-[2px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Path Bevel/Shadow */}
                        <path d={generateSmoothPath(STAGE_CONFIG)} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="14" strokeLinecap="round" transform="translate(1, 1)" />
                        {/* Base Earth Path */}
                        <path d={generateSmoothPath(STAGE_CONFIG)} fill="none" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
                        {/* Cobblestone Pattern */}
                        <path d={generateSmoothPath(STAGE_CONFIG)} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeDasharray="3, 5" />
                    </svg>

                    {/* --- 3. Dense Objects layer --- */}
                    <div className="absolute inset-0 transform-style-3d">
                        {DECORATIONS.ground.map((deco, i) => (
                            <div
                                key={`ground-${i}`}
                                className="absolute transform-style-3d origin-bottom"
                                style={{
                                    left: `${deco.x}%`,
                                    top: `${deco.y}%`,
                                    transform: `translateZ(0px)`
                                }}
                            >
                                <div className="absolute w-4 h-4 bg-black/20 rounded-full blur-sm transform -translate-x-1/2 -translate-y-1/2 scale-x-150" />
                                <div
                                    className="relative select-none transform transition-transform hover:scale-110 hover:-translate-y-2 duration-300"
                                    style={{
                                        transform: `rotateZ(${-ISO_ROTATE_Z}deg) rotateX(${-ISO_ROTATE_X}deg) translateY(-90%)`, // Billboard
                                        fontSize: `${deco.scale * 2.5}rem`,
                                        filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.15))'
                                    }}
                                >
                                    {deco.type === 'tree' && '🌳'}
                                    {deco.type === 'bush' && '🌿'}
                                    {deco.type === 'rock' && '🪨'}
                                    {deco.type === 'flower' && '🌻'}
                                </div>
                            </div>
                        ))}

                        {/* STAGE NODES (NO TOMBSTONES) */}
                        {stages.map((stage, i) => {
                            const config = STAGE_CONFIG[i] || { x: 50, y: 50, scale: 1.0 };
                            const status = getStageStatus(stage);
                            const stars = getStageStars(stage.id);

                            return (
                                <StageNode
                                    key={stage.id}
                                    stage={stage}
                                    config={config}
                                    status={status}
                                    stars={stars}
                                    onClick={(s) => handleStageClick(s, status)}
                                    index={i}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* UI Overlay */}
            <div className="absolute top-6 left-6 z-50 animate-fade-in-up">
                <div className="bg-white/90 backdrop-blur-xl pl-2 pr-6 py-2 rounded-2xl border-2 border-white/50 shadow-xl flex items-center gap-4 hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-xl flex items-center justify-center text-4xl shadow-inner rotate-3 hover:rotate-12 transition-transform">
                        {mapIcon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">World 1</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 leading-none tracking-tight">{mapName}</div>

                        {/* Progress Bar & Stage Count */}
                        <div className="mt-2 flex items-center gap-3 w-full">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '12.5%' }}></div>
                            </div>
                            <span className="text-xs font-bold text-slate-500 shrink-0">1/8 Stages</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Currency UI */}
            <div className="absolute top-6 right-6 z-50 flex gap-3">
                <div className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 text-white font-bold border border-white/20 shadow-lg">
                    <span className="animate-spin-slow">🪙</span> 1,250
                </div>
                <div className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 text-white font-bold border border-white/20 shadow-lg">
                    <span className="animate-pulse">💎</span> 5
                </div>
            </div>
        </div>
    );
}

function generateSmoothPath(points: { x: number; y: number }[]) {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const curr = points[i];
        const prev = points[i - 1];
        const cp1x = prev.x + (curr.x - prev.x) * 0.5;
        const cp2x = prev.x + (curr.x - prev.x) * 0.5;
        d += ` C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
}
