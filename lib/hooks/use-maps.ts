'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Map, Stage } from '@/types';

/**
 * 모든 활성 맵 가져오기
 */
export function useMaps() {
    const [maps, setMaps] = useState<Map[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchMaps() {
            try {
                // 인덱스 오류 방지를 위해 단순 쿼리로 변경 후 인메모리 정렬
                const q = collection(db, 'maps');

                const snapshot = await getDocs(q);
                const mapsData = snapshot.docs
                    .map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }) as Map)
                    .filter(m => m.isActive !== false) // isActive가 없거나 true인 것
                    .sort((a, b) => a.order - b.order);

                setMaps(mapsData);
            } catch (err) {
                console.error('Failed to fetch maps:', err);
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMaps();
    }, []);

    return { maps, isLoading, error };
}

/**
 * 단일 맵 정보 가져오기
 */
export function useMap(mapId: string) {
    const [map, setMap] = useState<Map | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchMap() {
            if (!mapId) {
                setIsLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'maps', mapId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setMap({ ...docSnap.data(), id: docSnap.id } as Map);
                } else {
                    setError(new Error('Map not found'));
                }
            } catch (err) {
                console.error('Failed to fetch map:', err);
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMap();
    }, [mapId]);

    return { map, isLoading, error };
}

/**
 * 특정 맵의 스테이지 목록 가져오기
 */
export function useStages(mapId: string) {
    const [stages, setStages] = useState<Stage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchStages() {
            if (!mapId) {
                setIsLoading(false);
                return;
            }

            try {
                // 인덱스 오류 방지를 위해 단순 쿼리로 변경 후 인메모리 필터링/정렬
                // 주의: 데이터가 많아지면 성능 이슈가 있을 수 있으나, 현재 규모에서는 안전함
                const q = collection(db, 'stages');

                const snapshot = await getDocs(q);
                const stagesData = snapshot.docs
                    .map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }) as Stage)
                    .filter(stage => stage.mapId === mapId)
                    .sort((a, b) => a.stageNumber - b.stageNumber);

                console.log(`useStages fetched for ${mapId}:`, stagesData.length);
                setStages(stagesData);
            } catch (err) {
                console.error('Failed to fetch stages:', err);
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStages();
    }, [mapId]);

    return { stages, isLoading, error };
}

/**
 * 단일 스테이지 정보 가져오기
 */
export function useStage(stageId: string) {
    const [stage, setStage] = useState<Stage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchStage() {
            if (!stageId) {
                setIsLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'stages', stageId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setStage({ ...docSnap.data(), id: docSnap.id } as Stage);
                } else {
                    setError(new Error('Stage not found'));
                }
            } catch (err) {
                console.error('Failed to fetch stage:', err);
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStage();
    }, [stageId]);

    return { stage, isLoading, error };
}
