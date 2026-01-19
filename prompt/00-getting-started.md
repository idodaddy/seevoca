---
module: 00
title: 개발 환경 셋업
estimated_time: 1-2 hours
dependencies: []
antigravity_ready: true
---

# Module 00: 개발 환경 셋업

## 🎯 이 모듈의 목표

SeeVoca 개발을 위한 모든 필수 도구와 계정을 설정합니다.

## ✅ 완료 기준

- [ ] Node.js v18+ 설치 완료
- [ ] Git 설정 완료
- [ ] GCP 계정 및 프로젝트 생성
- [ ] Firebase 프로젝트 생성
- [ ] Paddle 계정 생성 (Sandbox 모드)
- [ ] 모든 API 키 확보
- [ ] 에디터 설정 완료

## 📦 사전 준비

없음 (첫 번째 모듈)

---

## 🛠️ 구현

### Step 1: Node.js 설치 (예상: 10분)

**macOS (Homebrew)**:
```bash
# Homebrew 설치 (없으면)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 설치
brew install node@18

# 확인
node --version  # v18.0.0 이상
npm --version   # v9.0.0 이상
```

**Windows**:
```
1. https://nodejs.org 방문
2. LTS 버전 (v18.x) 다운로드
3. 설치 진행
4. CMD에서 확인: node --version
```

**Linux (Ubuntu/Debian)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 확인
node --version
npm --version
```

---

### Step 2: Git 설정 (예상: 5분)

```bash
# Git 설치 확인
git --version

# 없으면 설치
# macOS: brew install git
# Windows: https://git-scm.com/download/win
# Linux: sudo apt-get install git

# Git 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 확인
git config --list
```

---

### Step 3: Google Cloud Platform 설정 (예상: 15분)

#### 3-1. GCP 계정 생성

1. https://console.cloud.google.com 방문
2. Google 계정으로 로그인
3. 약관 동의
4. 청구 계정 설정 (프리티어 $300 크레딧)

#### 3-2. 프로젝트 생성

**Web Console**:
```
1. 상단 "프로젝트 선택" 클릭
2. "새 프로젝트"
3. 프로젝트 이름: seevoca-dev
4. 프로젝트 ID: seevoca-dev-xxxxx (자동 생성)
5. "만들기"
```

**CLI (선택)**:
```bash
# gcloud CLI 설치 (macOS)
brew install google-cloud-sdk

# 인증
gcloud auth login

# 프로젝트 생성
gcloud projects create seevoca-dev --name="SeeVoca Development"

# 기본 프로젝트 설정
gcloud config set project seevoca-dev
```

#### 3-3. API 활성화

**Web Console**:
```
1. 좌측 메뉴 > "API 및 서비스" > "라이브러리"
2. 다음 API 검색 및 활성화:
   - Cloud Run API
   - Cloud Build API
   - Firestore API
   - Cloud Storage API
   - Cloud Functions API
   - Artifact Registry API
```

**CLI**:
```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  cloudfunctions.googleapis.com \
  artifactregistry.googleapis.com
```

#### 3-4. 서비스 계정 생성

```bash
# 서비스 계정 생성
gcloud iam service-accounts create seevoca-dev \
  --description="SeeVoca Development Service Account" \
  --display-name="SeeVoca Dev"

# 권한 부여
gcloud projects add-iam-policy-binding seevoca-dev \
  --member="serviceAccount:seevoca-dev@seevoca-dev.iam.gserviceaccount.com" \
  --role="roles/owner"

# 키 생성 (JSON)
gcloud iam service-accounts keys create ./gcp-key.json \
  --iam-account=seevoca-dev@seevoca-dev.iam.gserviceaccount.com

# ⚠️ 중요: gcp-key.json을 안전하게 보관 (Git에 절대 커밋하지 않기!)
```

---

### Step 4: Firebase 설정 (예상: 10분)

#### 4-1. Firebase 프로젝트 생성

1. https://console.firebase.google.com 방문
2. "프로젝트 추가"
3. "기존 Google Cloud 프로젝트 선택"
4. seevoca-dev 선택
5. Firebase 추가
6. Google Analytics 활성화 (권장)

#### 4-2. Firebase 앱 등록

```
1. 프로젝트 설정 (톱니바퀴 아이콘)
2. "앱 추가" > "웹 앱"
3. 앱 닉네임: SeeVoca Web
4. Firebase Hosting 설정: 체크 안 함 (Cloud Run 사용)
5. "앱 등록"
```

#### 4-3. Firebase 설정 정보 저장

```javascript
// Firebase Console에서 표시되는 설정 복사
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "seevoca-dev.firebaseapp.com",
  projectId: "seevoca-dev",
  storageBucket: "seevoca-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// 이 정보를 메모장에 임시 저장 (Module 01에서 사용)
```

#### 4-4. Authentication 활성화

```
1. 좌측 메뉴 > "Authentication"
2. "시작하기"
3. "Sign-in method" 탭
4. "Google" 활성화
5. 프로젝트 지원 이메일 설정
6. "저장"
```

#### 4-5. Firestore 데이터베이스 생성

```
1. 좌측 메뉴 > "Firestore Database"
2. "데이터베이스 만들기"
3. 모드: "프로덕션 모드에서 시작" 선택
4. 위치: asia-northeast3 (Seoul)
5. "사용 설정"
```

---

### Step 5: Paddle 설정 (예상: 10분)

#### 5-1. Paddle 계정 생성
   
1. https://sandbox-dashboard.paddle.com/signup 방문 (Sandbox)
2. 이메일/비밀번호로 가입
3. 계정 인증

#### 5-2. API 키 확보

```
1. Dashboard > "Developer Tools" > "Authentication"
2. API Key 생성
3. Client Side Token 확인
4. Vendor ID 확인
5. 키 복사:
   - Vendor ID: 12345
   - Client Side Token: test_...
   - API Key: ...
6. 메모장에 임시 저장
```

#### 5-3. Webhook 설정 (나중에)

```
참고: Module 06에서 설정
지금은 API 키만 확보
```

---

### Step 6: AI API 키 확보 (예상: 15분)

#### 6-1. Anthropic (Claude)

```
1. https://console.anthropic.com 방문
2. 계정 생성
3. Settings > API Keys
4. "Create Key"
5. 키 복사: sk-ant-...
6. 메모장에 저장
```

**크레딧**:
- 신규 가입 시 $5 무료 크레딧
- 테스트에 충분함

#### 6-2. Veo 3.1 (비디오 생성)

```
1. https://cloud.google.com/vertex-ai 방문
2. Vertex AI API 활성화
3. Veo 3.1 액세스 신청
   - 프로젝트 설명 제출
   - 승인 대기 (1-3일)
4. API 키 발급
5. 키 복사 및 저장
```

**참고**: 
- Veo 3.1은 Google Vertex AI의 일부
- Early Access 기간 중 (2025 Q1)
- 비용: ~$0.40/초 (~$12/3분 비디오)
- GCP 프로젝트 필요 (이미 생성됨)

#### 6-3. ElevenLabs (음성 합성)

```
1. https://elevenlabs.io 방문
2. 계정 생성
3. Profile > API Key
4. 키 복사 및 저장
```

**무료 티어**: 월 10,000 characters

---

### Step 7: 환경 변수 파일 생성 (예상: 5분)

프로젝트 루트에 `.env.local.example` 파일 생성:

```bash
# .env.local.example
# 이 파일을 .env.local로 복사하여 사용

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# GCP
GCP_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=./gcp-key.json


# Paddle
NEXT_PUBLIC_PADDLE_VENDOR_ID=
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=

# AI APIs (선택)
ANTHROPIC_API_KEY=
VEO_API_KEY=
ELEVENLABS_API_KEY=
```

**실제 .env.local 파일 생성**:
```bash
# 위에서 확보한 모든 키 값 입력
cp .env.local.example .env.local

# 에디터로 열어서 키 값 채우기
# ⚠️ .env.local은 절대 Git에 커밋하지 않기!
```

---

### Step 8: 에디터 설정 (예상: 10분)

#### Antigravity 설정

```
1. Antigravity 열기
2. 프로젝트 폴더 열기 (나중에 생성)
3. Extensions 설치 (권장):
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
```

#### VS Code 설정 (대안)

```bash
# Extensions 설치
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

**settings.json**:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## 🧪 테스트

### 확인 체크리스트

```bash
# Node.js
node --version
# Output: v18.x.x 이상

# npm
npm --version
# Output: v9.x.x 이상

# Git
git --version
# Output: git version 2.x.x

# gcloud
gcloud --version
# Output: Google Cloud SDK xxx

# gcloud 로그인 확인
gcloud auth list
# Output: 활성화된 계정 표시

# 프로젝트 확인
gcloud config get-value project
# Output: seevoca-dev
```

### GCP 권한 확인

```bash
# API 활성화 확인
gcloud services list --enabled

# 출력 예상:
# - run.googleapis.com
# - cloudbuild.googleapis.com
# - firestore.googleapis.com
# ...
```

### Firebase 확인

1. https://console.firebase.google.com
2. seevoca-dev 프로젝트 열기
3. Authentication > Sign-in method
4. Google 활성화 확인 ✅
5. Firestore Database 생성 확인 ✅

### Paddle 확인

1. https://sandbox-dashboard.paddle.com
2. Sandbox 모드 로그인 확인
3. Developer Tools에서 키 확인

---

## 🐛 트러블슈팅

### 문제: Node.js 버전 낮음
```bash
# nvm으로 버전 관리
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 문제: gcloud 명령어 안됨
```bash
# PATH 추가 (macOS/Linux)
echo 'export PATH=$PATH:~/google-cloud-sdk/bin' >> ~/.zshrc
source ~/.zshrc

# Windows: 환경 변수에 추가
```

### 문제: Firebase 프로젝트 연결 안됨
```
해결:
1. Firebase Console에서 프로젝트 삭제
2. GCP Console에서 Firebase 재연결
3. "Add Firebase" 버튼 클릭
```

### 문제: API 키 복사 오류
```
확인:
- 앞뒤 공백 제거
- 키 전체 복사 확인
- 따옴표 포함 안 함
```

---

## 📚 참고

### 공식 문서
- [GCP 시작하기](https://cloud.google.com/getting-started)
- [Firebase 문서](https://firebase.google.com/docs)
- [Paddle 문서](https://developer.paddle.com)
- [Next.js 환경 변수](https://nextjs.org/docs/basic-features/environment-variables)

### 유용한 링크
- [GCP 프리티어](https://cloud.google.com/free)
- [Firebase 가격](https://firebase.google.com/pricing)
- [Paddle 테스팅](https://developer.paddle.com/concepts/testing)

---

## 💾 Commit

이 단계에서는 아직 코드가 없으므로 커밋 없음.

단, 키 파일들을 `.gitignore`에 추가할 준비:
```
# .gitignore (Module 01에서 생성)
.env.local
gcp-key.json
node_modules/
.next/
```

---

## 다음 단계

**Module 01**: [프로젝트 초기화](01-project-init.md)로 이동 →

---

## 📋 환경 설정 요약

완료 시 다음이 준비되어야 함:

```
✅ Node.js v18+
✅ Git 설정
✅ GCP 프로젝트: seevoca-dev
✅ GCP API 활성화 (6개)
✅ GCP 서비스 계정 + JSON 키
✅ Firebase 프로젝트 연결
✅ Firebase Auth (Google) 활성화
✅ Firestore 데이터베이스 생성
✅ Paddle 계정 + Sandbox API 키
✅ Anthropic API 키 (선택)
✅ Veo 3.1 API 키 (선택)
✅ ElevenLabs API 키 (선택)
✅ .env.local.example 파일
✅ 에디터 설정 완료
```

**모두 완료했으면 Module 01로!** 🚀

*Last updated: 2025-01-19*
