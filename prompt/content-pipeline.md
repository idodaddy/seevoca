# AI 콘텐츠 자동화 파이프라인

> 단어 리스트에서 완성된 스테이지까지 자동 생성

---

## 📖 목차

1. [파이프라인 개요](#파이프라인-개요)
2. [단계별 프로세스](#단계별-프로세스)
3. [캐릭터 일관성 유지](#캐릭터-일관성-유지)
4. [품질 관리](#품질-관리)
5. [비용 및 시간](#비용-및-시간)

---

## 🎯 파이프라인 개요

### 전체 플로우

```
단어 20개 입력
   ↓
Claude: 스토리 생성 (5분)
   ↓
장면 분해 (자동)
   ↓
Veo 3.1: 비디오 생성 (20분)
   ↓
Vision AI: 단어 타임스탬프 (2분)
   ↓
FFmpeg: 애니메이션 추출 (5분)
   ↓
ElevenLabs: 음성 생성 (2분)
   ↓
GCS 업로드 + Firestore (1분)
   ↓
완료! (~35분/stage)
```

---

## 📝 단계별 프로세스

### Step 1: 스토리 생성 (Claude API)

**입력**:
```json
{
  "stageId": "map_1_stage_1",
  "words": [
    {"word": "dog", "pos": "noun"},
    {"word": "hungry", "pos": "adjective"},
    // ... 18개 더
  ],
  "theme": "daily_life",
  "character": "Max"
}
```

**프롬프트**:
```typescript
const prompt = `
Create a 3-minute children's story using these 20 English words.

Words: ${words.map(w => w.word).join(', ')}

Requirements:
- Main character: Max the Dog (3D clay style)
- Natural narrative (beginning, middle, end)
- Each word appears in clear context
- Suitable for 5-8 year olds
- Visual descriptions for each scene
- ~9 seconds per word

Output format:
{
  "title": "...",
  "scenes": [
    {
      "timestamp": [0, 10],
      "narration": "...",
      "visualDescription": "...",
      "words": ["dog", "hungry"]
    }
  ]
}
`;
```

**출력 예시**:
```json
{
  "title": "Max the Hungry Dog",
  "totalDuration": 180,
  "scenes": [
    {
      "sceneNumber": 1,
      "timestamp": [0, 10],
      "narration": "Meet Max! He's a very hungry dog today.",
      "visualDescription": "3D clay dog with big googly eyes, bumpy texture, standing in front of colorful house, stomach rumbling",
      "cameraAngle": "front view",
      "words": [
        {"word": "dog", "timestamp": 3},
        {"word": "hungry", "timestamp": 7}
      ]
    },
    // ... 19 more scenes
  ]
}
```

---

### Step 2: 비디오 생성 (Google Veo 3.1)

#### 🎨 캐릭터 일관성 유지 전략 (핵심!)

**문제점**:
```
AI 비디오 생성 시 캐릭터 외형이 매번 달라짐
→ Max가 장면마다 다른 개로 보임
→ 몰입도 ↓, 브랜드 인지도 ↓
```

**해결책 1: 클레이 스타일 활용** ⭐⭐⭐⭐⭐
```
장점:
✅ 약간의 차이가 자연스러움
✅ 손으로 만든 느낌
✅ 아이들이 차이를 덜 느낌
✅ 추가 비용 없음

단점:
- 완벽한 일관성은 불가
```

**해결책 2: 프롬프트 템플릿 고정** ⭐⭐⭐⭐⭐
```typescript
// 캐릭터 정의 (한 번만 작성)
const MAX_CHARACTER_PROMPT = `
3D clay dog character:
- Name: Max
- Color: golden brown
- Eyes: large googly eyes (black pupils)
- Nose: small black button nose
- Ears: floppy, medium length
- Tail: curved upward
- Size: medium (child-height)
- Texture: bumpy clay surface
- Expression: friendly, curious
- Style: handcrafted clay animation
`;

// 모든 장면에 이 프롬프트 prefix로 추가
const scenePrompt = `
${MAX_CHARACTER_PROMPT}

${scene.visualDescription}

Camera: ${scene.cameraAngle}
Lighting: soft, studio lighting
Background: ${scene.background}
Style: consistent with previous scenes
`;
```

**해결책 3: Reference 이미지 사용** ⭐⭐⭐⭐⭐
```typescript
// Veo 3.1의 Image-to-Video 기능
const generateWithReference = async (scene) => {
  // Max의 마스터 이미지 (Midjourney/Imagen으로 생성)
  const referenceImage = 'https://storage.../max_reference.png';
  
  const response = await veo.generateVideo({
    mode: 'image-to-video',
    referenceImage,  // 일관성 기준
    prompt: scene.visualDescription,
    duration: scene.duration,
    style: 'clay_animation',
    resolution: '1080p'
  });
  
  return response.videoUrl;
};
```

**해결책 4: LoRA Fine-tuning** ⭐⭐⭐ (Phase 2)
```
개념:
- Max 이미지 50-100장 수집
- Imagen LoRA 학습
- Veo 3.1에 커스텀 모델 연동

장점:
✅ 90%+ 일관성
✅ 완벽한 통제

단점:
❌ 비용: $500-1000 (1회)
❌ 시간: 2-3주
❌ 기술적 난이도 높음

추천 시기:
→ MVP 성공 후
→ 시리즈화 확정 시
```

**해결책 5: 수작업 필터링** ⭐⭐⭐⭐
```typescript
// 생성된 비디오 품질 체크
const qualityCheck = {
  characterConsistency: (video) => {
    // Claude Vision API로 일관성 체크
    const analysis = await analyzeCharacter(video);
    
    return {
      score: 0-100,
      issues: [
        'Color mismatch in scene 3',
        'Eye size different in scene 5'
      ],
      recommendation: 'regenerate' | 'accept' | 'manual_edit'
    };
  }
};

// 일관성 < 80% → 재생성
if (qualityCheck.score < 80) {
  await regenerateScene(sceneId);
}
```

**최종 전략 (MVP)**:
```
1. 클레이 스타일 ✅ (무료)
2. 프롬프트 고정 ✅ (무료)
3. Reference 이미지 ✅ (무료)
4. 수작업 필터링 ✅ (시간만)

→ 70-80% 일관성 달성
→ 클레이 특성상 자연스러움
→ 비용 추가 없음

Veo 3.1 장점:
✅ Runway보다 빠름 (20분 vs 30분)
✅ 높은 화질 (네이티브 1080p)
✅ 캐릭터 일관성 우수
✅ Google 생태계 통합

Phase 2:
5. LoRA 학습 (투자 후)
→ 90%+ 일관성
```

#### 비디오 생성 코드

```typescript
// 장면 하나씩 생성
const generateScene = async (scene: Scene) => {
  const prompt = createConsistentPrompt(scene);
  
  const video = await veo.generate({
    prompt,
    duration: scene.duration,
    resolution: '1080p',
    fps: 30,
    style: 'clay_animation',
    seed: CONSISTENT_SEED,  // 일관성 향상
  });
  
  return video;
};

// 전체 장면 생성 (병렬)
const videos = await Promise.all(
  scenes.map(scene => generateScene(scene))
);

// FFmpeg로 합치기
const fullVideo = await stitchVideos(videos, {
  transitions: 'crossfade',
  duration: 0.5  // 0.5초 크로스페이드
});
```

---

### Step 3: 단어 타임스탬프 감지

**Google Cloud Vision API**:
```typescript
const detectWordTimestamps = async (videoUrl: string, words: string[]) => {
  // 1. 음성 인식
  const speech = await videoIntelligence.annotateVideo({
    inputUri: videoUrl,
    features: ['SPEECH_TRANSCRIPTION'],
    config: {
      languageCode: 'en-US',
      enableWordTimeOffsets: true
    }
  });
  
  // 2. 단어 매칭
  const timestamps = {};
  words.forEach(word => {
    const found = speech.results.find(r => 
      r.word.toLowerCase() === word.toLowerCase()
    );
    
    if (found) {
      timestamps[word] = {
        start: found.startTime.seconds,
        end: found.endTime.seconds
      };
    }
  });
  
  return timestamps;
};
```

---

### Step 4: 애니메이션 추출 (100×100)

```typescript
const extractAnimations = async (
  videoPath: string,
  timestamps: WordTimestamps
) => {
  const animations = {};
  
  for (const [word, time] of Object.entries(timestamps)) {
    // 2초 클립 추출 (앞뒤 0.5초)
    const clip = await ffmpeg.extract({
      input: videoPath,
      start: time.start - 0.5,
      duration: 2.0
    });
    
    // 주요 객체 감지 (YOLO)
    const bbox = await detectMainObject(clip);
    
    // 크롭 & 리사이즈
    const animation = await ffmpeg.process({
      input: clip,
      crop: bbox,
      resize: '100x100',
      format: 'webp',
      loop: true,
      optimize: true
    });
    
    animations[word] = animation;
  }
  
  return animations;
};
```

---

### Step 5: 음성 생성

**ElevenLabs API**:
```typescript
const generateAudio = async (words: Word[]) => {
  const audioFiles = {};
  
  for (const word of words) {
    const audio = await elevenlabs.generate({
      text: word.word,
      voice: 'Rachel',  // 아이들용 밝은 목소리
      model: 'eleven_monolingual_v1',
      stability: 0.5,
      similarity: 0.75
    });
    
    // MP3 저장
    audioFiles[word.word] = audio;
  }
  
  return audioFiles;
};
```

---

### Step 6: 업로드 & 등록

```typescript
const uploadAndRegister = async (stage: Stage, assets: Assets) => {
  // 1. Cloud Storage 업로드
  const urls = await uploadToGCS({
    video: assets.fullVideo,
    animations: assets.animations,
    audio: assets.audioFiles
  });
  
  // 2. Firestore 업데이트
  await db.collection('stages').doc(stage.id).update({
    videoUrl: urls.video,
    animations: urls.animations,
    audioFiles: urls.audio,
    status: 'ready',
    updatedAt: FieldValue.serverTimestamp()
  });
  
  // 3. CDN Cache Invalidate
  await cdn.invalidate([urls.video]);
  
  console.log(`✅ Stage ${stage.id} ready!`);
};
```

---

## ✅ 품질 관리

### 자동 품질 체크

```typescript
const qualityChecks = {
  // 1. 비디오 품질
  video: {
    duration: (video) => 170 <= video.duration <= 190,
    resolution: (video) => video.width === 1920 && video.height === 1080,
    fps: (video) => video.fps >= 24,
    corruption: (video) => !isCorrupted(video),
    characterConsistency: (video) => checkCharacterConsistency(video) > 0.7
  },
  
  // 2. 애니메이션 품질
  animations: {
    size: (anim) => anim.width === 100 && anim.height === 100,
    fileSize: (anim) => anim.size < 100 * 1024,  // < 100KB
    animated: (anim) => anim.isAnimated
  },
  
  // 3. 오디오 품질
  audio: {
    clarity: (audio) => checkClarity(audio) > 0.8,
    volume: (audio) => checkVolume(audio) > -20  // dB
  }
};
```

### 수동 검수 대시보드

```
┌─────────────────────────────────────┐
│  Content Review Dashboard           │
│                                     │
│  Stage: map_1_stage_1              │
│  Status: 🟡 Pending Review         │
│                                     │
│  ✅ Video (3:02)                    │
│  ✅ 20 Animations                   │
│  ✅ 20 Audio files                  │
│                                     │
│  Character Consistency: 78% 🟡      │
│  → Scene 3, 7 needs check          │
│                                     │
│  [▶ Preview All]                   │
│  [✓ Approve] [✗ Reject]            │
│  [🔄 Regenerate Scene 3, 7]        │
└─────────────────────────────────────┘
```

---

## 💰 비용 및 시간

### Stage당 비용

```
Claude API (스토리):      $0.50
Veo 3.1 (비디오):         $12.00
Vision API (분석):        $0.10
FFmpeg (무료):            $0.00
ElevenLabs (음성):        $0.10
─────────────────────────────
Total:                    $12.70/stage
```

### 전체 맵 비용

```
Map 1 (8 stages):
8 × $12.70 = $101.60

전체 10 맵:
10 × 8 × $12.70 = $1,016
```

### 소요 시간

```
자동 생성: ~35분/stage (Veo가 Runway보다 빠름)
수동 검수: ~15분/stage
─────────────────────
Total:     ~50분/stage

Map 1 전체: ~6.5시간
전체 10맵: ~65시간
```

---

## 🔄 전체 파이프라인 코드

```typescript
// main_pipeline.ts
export async function generateStageContent(
  stageId: string,
  words: Word[]
): Promise<StageAssets> {
  
  console.log(`🚀 Generating content for ${stageId}`);
  
  // Step 1: 스토리 생성
  console.log('📝 Creating story...');
  const story = await generateStory(words);
  
  // Step 2: 비디오 생성 (일관성 유지)
  console.log('🎬 Generating videos...');
  const videos = await generateVideosWithConsistency(story.scenes);
  const fullVideo = await stitchVideos(videos);
  
  // Step 3: 타임스탬프 감지
  console.log('🔍 Detecting timestamps...');
  const timestamps = await detectWordTimestamps(fullVideo, words);
  
  // Step 4: 애니메이션 추출
  console.log('✂️ Extracting animations...');
  const animations = await extractAnimations(fullVideo, timestamps);
  
  // Step 5: 음성 생성
  console.log('🔊 Generating audio...');
  const audioFiles = await generateAudio(words);
  
  // Step 6: 품질 체크
  console.log('✅ Quality check...');
  const qc = await qualityCheck({
    video: fullVideo,
    animations,
    audio: audioFiles
  });
  
  if (!qc.passed) {
    throw new Error(`Quality check failed: ${qc.issues}`);
  }
  
  // Step 7: 업로드
  console.log('☁️ Uploading...');
  const urls = await uploadAndRegister(stageId, {
    fullVideo,
    animations,
    audioFiles
  });
  
  console.log(`✅ Stage ${stageId} completed!`);
  
  return {
    videoUrl: urls.video,
    animations: urls.animations,
    audioFiles: urls.audio,
    metadata: {
      story,
      timestamps,
      qualityScore: qc.score
    }
  };
}
```

---

## 📚 관련 문서

- [Architecture](architecture.md) - GCS 업로드
- [Map System](../02_PRODUCT/map-system.md) - 스테이지 구조
- [Module 07](../04_DEVELOPMENT/07-admin-pipeline.md) - 구현 가이드

---

**자동화로 콘텐츠 대량 생산!** 🤖✨

*Last updated: 2025-01-19*
