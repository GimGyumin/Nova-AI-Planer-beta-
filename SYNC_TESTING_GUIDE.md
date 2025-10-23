# 🔄 폴더 동기화 테스트 가이드

## 최근 개선 사항 (2024년 최신)

### ✅ Async/Await 패턴 적용
- **모든 목표 작업**(추가/수정/삭제/완료/이동)이 이제 **Firestore 저장을 기다린 후 UI 업데이트**
- 이전: 비동기 백그라운드 저장 → **레이스 컨디션 발생** ❌
- 현재: `await setDoc()` → 그 후 `setTodos()` ✅

### ✅ 협업자 자동 추가 개선
- 공유 폴더 링크 클릭 시 협업자 자동 추가 → **Firestore 저장 완료 대기** ✅
- 저장 완료 후 `setCurrentFolderId` 설정 → useEffect가 자동으로 목표 로드

### ✅ 실시간 리스너 의존성 최적화
- `folders` 의존성 제거 → **무한 루프 방지** ✅
- `currentFolderId`, `googleUser`만 감시

---

## 🧪 테스트 전 준비

### 1. 로컬 환경에서 실행
```bash
npm run dev
```
- 기본 포트: `http://localhost:5173`

### 2. 2개 브라우저 탭 열기
- **탭 A**: 소유자 계정 (이메일1)
- **탭 B**: 협업자 계정 (이메일2)

### 3. 개발자 도구 열기
```
F12 또는 우클릭 → 검사 → Console 탭
```

---

## 📝 테스트 시나리오

### **시나리오 1️⃣: 공유 폴더 생성 및 협업자 추가**

#### 탭 A (소유자):
1. ✍️ 폴더 이름 입력 → "Test Folder"
2. 📁 "+ 폴더 추가" 클릭
3. 📤 폴더 공유 버튼 (우측 상단)
4. 🔐 비밀번호 입력 → "test123"
5. 📋 공유 링크 복사

**Console 예상 로그:**
```
✅ 목표 Firestore 저장: 
  targetOwnerUid: "firebase-uid-of-owner"
  newTodo: {...}
```

#### 탭 B (협업자):
1. 📋 공유 링크 붙여넣기 → 브라우저 주소창
2. 🔓 비밀번호 입력 → "test123"
3. ✓ 확인

**Console 예상 로그 (순서대로):**
```
🔍 협업자 추가 시작: 
  ownerUserId: "firebase-uid-of-owner"
  googleUserUid: "firebase-uid-of-collaborator"

📄 폴더 조회 결과: 
  exists: true

👥 현재 협업자 목록: 
  [{ userId: "owner-uid", role: "owner", ... }]

📝 새로운협업자목록: 
  [
    { userId: "owner-uid", role: "owner", ... },
    { userId: "collaborator-uid", role: "editor", ... }
  ]

✅ 협업자 Firestore 저장 완료: 
  { userId: "...", email: "...", role: "editor" }

📊 Syncing todos from owner: 
  ownerUid: "..."
  currentFolderId: "..."

🎯 Owner todos received: 
  count: 0
  ownerTodos: []
```

**✅ 기대 결과:**
- 탭 B에 "Test Folder" 나타남
- Console에 위의 모든 로그 표시됨

---

### **시나리오 2️⃣: 목표 추가 및 동기화**

#### 탭 A (소유자):
1. 📁 "Test Folder" 선택
2. ➕ 새 목표 추가
3. ✍️ 목표 입력 → "Learn React"
4. ✓ 추가

**Console 예상 로그:**
```
✅ 목표 Firestore 저장: 
  targetOwnerUid: "firebase-uid-of-owner"
  newTodo: {
    id: 1702123456789
    wish: "Learn React"
    folderId: "Test Folder"
    ...
  }
```

#### 탭 B (협업자) - 자동 동기화:
**Console 자동 업데이트 (2-3초 내):**
```
🎯 Owner todos received: 
  count: 1
  ownerTodos: [
    {
      id: 1702123456789
      wish: "Learn React"
      folderId: "Test Folder"
      ...
    }
  ]
```

**✅ 기대 결과:**
- 탭 B의 목표 목록에 "Learn React" 자동 나타남
- 지연 없이 실시간 업데이트

---

### **시나리오 3️⃣: 목표 완료 토글**

#### 탭 A (소유자):
1. "Learn React" 목표 옆 체크박스 ☑️ 클릭

**Console 예상 로그:**
```
✅ 목표 완료 상태 Firestore 저장: 
  targetOwnerUid: "firebase-uid-of-owner"
  id: 1702123456789
  completed: true
```

#### 탭 B (협업자) - 자동 동기화:
**Console 자동 업데이트:**
```
🎯 Owner todos received: 
  count: 1
  ownerTodos: [
    {
      id: 1702123456789
      wish: "Learn React"
      completed: true  ← 변경됨
      ...
    }
  ]
```

**✅ 기대 결과:**
- 탭 B에서 해당 목표가 회색 처리됨 (완료 표시)
- 2-3초 내에 자동 업데이트

---

### **시나리오 4️⃣: 협업자가 목표 수정**

#### 탭 B (협업자):
1. "Learn React" 목표 클릭 → 편집 모드
2. 제목 변경 → "Learn React Hooks"
3. ✓ 저장

**Console 예상 로그:**
```
✅ 목표 업데이트 Firestore 저장: 
  targetOwnerUid: "firebase-uid-of-owner"
  updatedTodo: {
    id: 1702123456789
    wish: "Learn React Hooks"  ← 변경됨
    ...
  }
```

#### 탭 A (소유자) - 자동 동기화:
**Console 자동 업데이트:**
```
🎯 Owner todos received: 
  count: 1
  ownerTodos: [
    {
      id: 1702123456789
      wish: "Learn React Hooks"  ← 변경됨
      ...
    }
  ]
```

**✅ 기대 결과:**
- 탭 A에서 목표 제목이 "Learn React Hooks"로 자동 변경됨
- 2-3초 내에 자동 업데이트

---

## 🐛 문제 진단

### Console 로그 체크리스트

| 로그 | 의미 | 해결 방법 |
|------|------|---------|
| 🔍협업자추가시작 | 공유 링크 처리 시작 | ✓ 정상 진행 |
| 📄폴더조회결과: exists: false | **폴더가 Firestore에 없음** | 소유자가 먼저 폴더를 Firestore에 저장해야 함 |
| ⚠️ Invalid owner UID | **폴더 소유자 정보 오류** | URL의 ownerId 확인 필요 |
| 📊 Syncing todos from owner | 리스너 시작 | ✓ 정상 진행 |
| 🎯 Owner todos received: count: 0 | 목표 없음 | ✓ 첫 번째는 정상 (아직 목표 없음) |
| ❌ Firestore 저장 실패 | **권한 문제** | Firebase 규칙 확인: `allow read, write: if request.auth != null;` |
| 소유자 목표 동기화 실패 | **읽기 권한 문제** | 협업자가 소유자 경로 접근 가능한지 확인 |

---

## 🔧 Firebase 규칙 확인

현재 적용된 규칙 (`firestore.rules`):
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**현재 상태:** ✅ 모든 인증된 사용자가 모든 경로 읽기/쓰기 가능

**배포 확인:**
```bash
firebase deploy --only firestore:rules
```

---

## 📊 로그 필터링

### 동기화 관련 로그만 보기
```javascript
// Console 필터 입력
"Syncing" OR "Owner todos" OR "폴더 조회" OR "협업자"
```

### 에러만 보기
```javascript
// Console에서 Level: Error 선택
```

---

## ⚡ 성능 팁

- **Console 로그 많음 경우:** 페이지 새로고침 (Cmd+R / Ctrl+R) → 초기 상태부터 추적
- **네트워크 느린 경우:** 의도적으로 5초 대기 후 확인
- **Firestore 쿼리 이슈 시:** 원본 클릭 (예: "Learn React") → 상세 객체 확인

---

## ✅ 최종 검증 체크리스트

- [ ] 협업자 자동 추가됨 (Console 로그 확인)
- [ ] 소유자의 목표가 협업자에게 보임 (2-3초 내)
- [ ] 소유자가 목표 추가 → 협업자가 자동 받음
- [ ] 소유자가 목표 수정 → 협업자가 자동 받음
- [ ] 협업자가 목표 수정 → 소유자가 자동 받음
- [ ] 목표 완료 토글 → 양쪽 모두 동기화됨
- [ ] 목표 삭제 → 양쪽 모두 동기화됨

---

## 📞 문제 보고

테스트 중 문제 발생 시:
1. **Console 로그 전체 복사** (Cmd+A → Cmd+C)
2. **Issue 생성** 시 로그 포함
3. **재현 단계** 상세히 작성

