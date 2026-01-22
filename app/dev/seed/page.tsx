'use client';

import { useState } from 'react';
import { seedMapsAndStages, clearData } from '@/lib/firebase/seed-data';
import Link from 'next/link';

export default function SeedPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [result, setResult] = useState<{ mapsCount: number; stagesCount: number } | null>(null);

    const handleSeed = async () => {
        setStatus('loading');
        setMessage('데이터를 생성 중입니다...');

        try {
            const data = await seedMapsAndStages();
            setResult(data);
            setStatus('success');
            setMessage('샘플 데이터가 성공적으로 생성되었습니다!');
        } catch (error) {
            console.error('Seed error:', error);
            setStatus('error');
            setMessage(`오류: ${(error as Error).message}`);
        }
    };

    const handleClear = async () => {
        if (!confirm('정말로 모든 맵과 스테이지 데이터를 삭제하시겠습니까?')) return;

        setStatus('loading');
        setMessage('데이터를 삭제 중입니다...');

        try {
            await clearData();
            setResult(null);
            setStatus('success');
            setMessage('모든 데이터가 삭제되었습니다.');
        } catch (error) {
            console.error('Clear error:', error);
            setStatus('error');
            setMessage(`오류: ${(error as Error).message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <span className="text-5xl mb-4 block">🌱</span>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Database Seed</h1>
                    <p className="text-slate-500 text-sm">
                        Firestore에 샘플 맵/스테이지 데이터를 추가합니다
                    </p>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`p-4 rounded-xl mb-6 text-center ${status === 'success' ? 'bg-green-50 text-green-700' :
                            status === 'error' ? 'bg-red-50 text-red-700' :
                                'bg-blue-50 text-blue-700'
                        }`}>
                        {status === 'loading' && (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <span>{message}</span>
                            </div>
                        )}
                        {status !== 'loading' && message}
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-brand-600">{result.mapsCount}</div>
                                <div className="text-sm text-slate-500">Maps</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-brand-600">{result.stagesCount}</div>
                                <div className="text-sm text-slate-500">Stages</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleSeed}
                        disabled={status === 'loading'}
                        className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:from-brand-600 hover:to-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25"
                    >
                        🌱 샘플 데이터 생성
                    </button>

                    <button
                        onClick={handleClear}
                        disabled={status === 'loading'}
                        className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        🗑️ 데이터 초기화
                    </button>
                </div>

                {/* Navigation */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <Link
                        href="/learn"
                        className="text-brand-600 hover:text-brand-700 font-medium"
                    >
                        ← Learn 페이지로 이동
                    </Link>
                </div>

                {/* Warning */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-xl text-sm text-yellow-700">
                    <p className="font-semibold mb-1">⚠️ 개발 환경 전용</p>
                    <p>이 페이지는 개발/테스트 목적으로만 사용하세요. 프로덕션에서는 사용하지 마세요.</p>
                </div>
            </div>
        </div>
    );
}
