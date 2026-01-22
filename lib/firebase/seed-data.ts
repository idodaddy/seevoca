import { db } from '@/lib/firebase/config';
import { collection, doc, setDoc, Timestamp, getDocs, deleteDoc } from 'firebase/firestore';

/**
 * Firestore에 샘플 맵/스테이지 데이터 추가
 */
export async function seedMapsAndStages() {
    console.log('🌱 Starting seed process...');

    // Map 1: Beginner's Island
    const map1 = {
        id: 'map_1',
        order: 1,
        name_en: "Beginner's Island",
        name_ko: '초보자의 섬',
        icon: '🏝️',
        theme: 'daily_basics',
        difficulty: 1,
        totalStages: 8,
        totalWords: 160,
        unlockRequirement: {
            type: 'free',
        },
        createdAt: Timestamp.now(),
        isActive: true,
    };

    // Map 2: Adventure Forest (구매 필요)
    const map2 = {
        id: 'map_2',
        order: 2,
        name_en: 'Adventure Forest',
        name_ko: '모험의 숲',
        icon: '🌲',
        theme: 'nature_animals',
        difficulty: 2,
        totalStages: 10,
        totalWords: 200,
        unlockRequirement: {
            type: 'payment',
            value: 'map_2',
        },
        createdAt: Timestamp.now(),
        isActive: true,
    };

    // Map 3: Ocean Kingdom (구매 필요)
    const map3 = {
        id: 'map_3',
        order: 3,
        name_en: 'Ocean Kingdom',
        name_ko: '바다 왕국',
        icon: '🐠',
        theme: 'ocean_sea',
        difficulty: 3,
        totalStages: 12,
        totalWords: 240,
        unlockRequirement: {
            type: 'payment',
            value: 'map_3',
        },
        createdAt: Timestamp.now(),
        isActive: true,
    };

    // 맵 저장
    await setDoc(doc(db, 'maps', 'map_1'), map1);
    await setDoc(doc(db, 'maps', 'map_2'), map2);
    await setDoc(doc(db, 'maps', 'map_3'), map3);
    console.log('✅ Maps created');

    // Map 1 Stages (8개)
    const map1Stages = [
        {
            id: 'map_1_stage_1',
            mapId: 'map_1',
            stageNumber: 1,
            title_en: 'Max the Hungry Dog',
            title_ko: '배고픈 개 Max',
            description: 'Meet Max and learn about animals and food',
            category: 'animals',
            wordIds: Array(20).fill(null).map((_, i) => `word_${i + 1}`),
            wordCount: 20,
            videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_1.mp4',
            thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_1.jpg',
            isBoss: false,
            isFree: true,
            unlockRequirement: {
                type: 'free',
            },
        },
        {
            id: 'map_1_stage_2',
            mapId: 'map_1',
            stageNumber: 2,
            title_en: "Emma's Magic Garden",
            title_ko: 'Emma의 마법 정원',
            description: 'Explore the garden with Emma',
            category: 'nature',
            wordIds: Array(20).fill(null).map((_, i) => `word_${i + 21}`),
            wordCount: 20,
            videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_2.mp4',
            thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_2.jpg',
            isBoss: false,
            isFree: false,
            unlockRequirement: {
                type: 'previous_stage',
                value: 'map_1_stage_1',
            },
        },
        {
            id: 'map_1_stage_3',
            mapId: 'map_1',
            stageNumber: 3,
            title_en: 'Kitchen Adventure',
            title_ko: '주방 모험',
            description: 'Learn about food and cooking',
            category: 'food',
            wordIds: Array(20).fill(null).map((_, i) => `word_${i + 41}`),
            wordCount: 20,
            videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_3.mp4',
            thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_3.jpg',
            isBoss: false,
            isFree: false,
            unlockRequirement: {
                type: 'previous_stage',
                value: 'map_1_stage_2',
            },
        },
        {
            id: 'map_1_stage_4',
            mapId: 'map_1',
            stageNumber: 4,
            title_en: 'My Family',
            title_ko: '우리 가족',
            description: 'Meet the family members',
            category: 'family',
            wordIds: Array(20).fill(null).map((_, i) => `word_${i + 61}`),
            wordCount: 20,
            videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_4.mp4',
            thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_4.jpg',
            isBoss: false,
            isFree: false,
            unlockRequirement: {
                type: 'previous_stage',
                value: 'map_1_stage_3',
            },
        },
        {
            id: 'map_1_stage_5',
            mapId: 'map_1',
            stageNumber: 5,
            title_en: 'School Days',
            title_ko: '학교 생활',
            description: 'Learn about school and friends',
            category: 'school',
            wordIds: Array(20).fill(null).map((_, i) => `word_${i + 81}`),
            wordCount: 20,
            videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_5.mp4',
            thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_5.jpg',
            isBoss: false,
            isFree: false,
            unlockRequirement: {
                type: 'previous_stage',
                value: 'map_1_stage_4',
            },
        },
        {
            id: 'map_1_stage_6',
            mapId: 'map_1',
            stageNumber: 6,
            title_en: 'Playground Fun',
            title_ko: '놀이터에서',
            description: 'Play and learn action words',
            category: 'sports',
            wordIds: Array(20).fill(null).map((_, i) => `word_${i + 101}`),
            wordCount: 20,
            videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_6.mp4',
            thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_6.jpg',
            isBoss: false,
            isFree: false,
            unlockRequirement: {
                type: 'previous_stage',
                value: 'map_1_stage_5',
            },
        },
        {
            id: 'map_1_stage_7',
            mapId: 'map_1',
            stageNumber: 7,
            title_en: 'Weather Report',
            title_ko: '날씨 이야기',
            description: 'Learn about weather and seasons',
            category: 'weather',
            wordIds: Array(20).fill(null).map((_, i) => `word_${i + 121}`),
            wordCount: 20,
            videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_7.mp4',
            thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_7.jpg',
            isBoss: false,
            isFree: false,
            unlockRequirement: {
                type: 'previous_stage',
                value: 'map_1_stage_6',
            },
        },
        {
            id: 'map_1_stage_8',
            mapId: 'map_1',
            stageNumber: 8,
            title_en: 'Island Adventure',
            title_ko: '섬 모험',
            description: 'Boss stage! Review all 160 words',
            category: 'review',
            wordIds: Array(160).fill(null).map((_, i) => `word_${i + 1}`),
            wordCount: 160,
            videoUrl: 'https://storage.googleapis.com/seevoca/videos/map_1_stage_8.mp4',
            thumbnailUrl: 'https://storage.googleapis.com/seevoca/thumbnails/map_1_stage_8.jpg',
            isBoss: true,
            isFree: false,
            unlockRequirement: {
                type: 'previous_stage',
                value: 'map_1_stage_7',
            },
        },
    ];

    // 스테이지 저장
    for (const stage of map1Stages) {
        await setDoc(doc(db, 'stages', stage.id), stage);
    }
    console.log('✅ Stages created');

    console.log('🎉 Seed completed successfully!');
    return { mapsCount: 3, stagesCount: map1Stages.length };
}

/**
 * 기존 데이터 삭제 (초기화)
 */
export async function clearData() {
    console.log('🗑️ Clearing existing data...');

    // 맵 삭제
    const mapsSnapshot = await getDocs(collection(db, 'maps'));
    for (const doc of mapsSnapshot.docs) {
        await deleteDoc(doc.ref);
    }

    // 스테이지 삭제
    const stagesSnapshot = await getDocs(collection(db, 'stages'));
    for (const doc of stagesSnapshot.docs) {
        await deleteDoc(doc.ref);
    }

    console.log('✅ Data cleared');
}
