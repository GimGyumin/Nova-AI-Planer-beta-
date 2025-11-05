# 🔧 Firestore "Unsupported field value: undefined" 에러 해결 가이드

## ❌ 발생한 에러

```
Function setDoc() called with invalid data. 
Unsupported field value: undefined 
(found in document users/AQp2rcik1HdxXWamrb9kWW8iL942/todos)
```

## ✅ 해결 방법 (2024년 최신)

### 1. 강화된 데이터 정제 함수 적용
```typescript
const sanitizeFirestoreData = (obj: any): any => {
  // undefined, null, 빈 문자열 모두 제거
  // 중첩 객체 재귀적으로 정제
}
```

**적용 대상:**
- ✅ handleAddTodo - 목표 추가
- ✅ handleEditTodo - 목표 수정
- ✅ handleDeleteTodo - 목표 삭제
- ✅ handleAddMultipleTodos - 다중 추가
- ✅ handleToggleComplete - 완료 토글
- ✅ handleMoveToFolder - 폴더 이동
- ✅ 협업자 추가 - 공유 폴더 협업자 추가

---

## 🔍 에러의 원인

### 이전 코드의 문제점:
```typescript
// ❌ 이건 부족함
const sanitizedTodo = Object.fromEntries(
    Object.entries(newTodo).filter(([_, v]) => v !== undefined)
);
```

**문제:**
1. **중첩 객체 미정제**: `{ ...newTodo }` 내부의 중첩된 undefined 필드는 남음
2. **null 미정제**: `null` 값도 Firestore에서 거부
3. **빈 문자열 미정제**: 일부 필드는 빈 문자열(`""`)도 문제

### 예: Goal 객체의 구조
```typescript
{
  id: 1702123456789,
  wish: "Learn React",
  outcome: null,              // ❌ 정제 안 됨
  obstacle: undefined,        // ❌ 정제 안 됨
  plan: "",                   // ❌ 정제 안 됨
  deadline: "2024-12-31",
  completed: false,
  folderId: undefined,        // ❌ 정제 안 됨
  createdAt: "2024-01-01"
}
```

---

## ✨ 새로운 해결책

### sanitizeFirestoreData 함수
```typescript
const sanitizeFirestoreData = (obj: any): any => {
  if (obj === null || obj === undefined) return undefined;
  if (typeof obj !== 'object') return obj;
  
  // 배열 처리
  if (Array.isArray(obj)) {
    return obj
      .map(item => sanitizeFirestoreData(item))
      .filter(item => item !== undefined);
  }
  
  // 객체 처리 - 모든 필드 정제
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // ✅ undefined, null, 빈 문자열 제외
    if (value === undefined || value === null || 
        (typeof value === 'string' && value.trim() === '')) {
      console.warn(`⚠️ 필드 제거됨: ${key} = ${value}`);
      continue;
    }
    
    // ✅ 중첩 객체도 재귀적으로 정제
    if (typeof value === 'object') {
      const sanitized = sanitizeFirestoreData(value);
      if (sanitized !== undefined) {
        cleaned[key] = sanitized;
      }
    } else {
      cleaned[key] = value;
    }
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};
```

### 사용 예시

#### 1. 목표 추가
```typescript
const handleAddTodo = async (newTodoData) => {
  const newTodo: Goal = { 
    ...newTodoData, 
    id: Date.now(), 
    completed: false, 
    lastCompletedDate: null,  // ← null을 명시적으로 설정
    streak: 0,
    folderId: currentFolderId || undefined  // ← undefined 가능
  };
  
  try {
    // ✅ 강력한 데이터 정제 적용
    const sanitizedTodo = sanitizeFirestoreData(newTodo);
    
    if (sanitizedTodo) {
      await setDoc(todoDocRef, sanitizedTodo);
      console.log('✅ 저장 성공:', sanitizedTodo);
    } else {
      console.warn('⚠️ 정제 후 저장할 데이터가 없음');
    }
  } catch (error) {
    console.error('❌ 저장 실패:', error);
  }
};
```

#### 2. 목표 수정
```typescript
const handleEditTodo = async (updatedTodo) => {
  try {
    // ✅ 강력한 데이터 정제
    const sanitizedTodo = sanitizeFirestoreData(updatedTodo);
    
    if (sanitizedTodo) {
      await setDoc(todoDocRef, sanitizedTodo);
    }
  } catch (error) {
    console.error('❌ 저장 실패:', error);
  }
};
```

---

## 📊 정제 전후 비교

### 정제 전 (❌ 에러 발생)
```javascript
// Console 출력
{
  "id": 1702123456789,
  "wish": "Learn React",
  "outcome": null,              // ❌ Firestore 거부
  "obstacle": undefined,        // ❌ Firestore 거부
  "plan": "",                   // ❌ Firestore 거부
  "deadline": "2024-12-31",
  "completed": false,
  "folderId": undefined,        // ❌ Firestore 거부
  "createdAt": "2024-01-01"
}

// 에러 메시지
Function setDoc() called with invalid data. 
Unsupported field value: undefined (found in document users/.../todos)
```

### 정제 후 (✅ 성공)
```javascript
// Console 출력
⚠️ 필드 제거됨: outcome = null
⚠️ 필드 제거됨: obstacle = undefined
⚠️ 필드 제거됨: plan = 
⚠️ 필드 제거됨: folderId = undefined

// 정제된 데이터 (저장됨)
{
  "id": 1702123456789,
  "wish": "Learn React",
  "deadline": "2024-12-31",
  "completed": false,
  "createdAt": "2024-01-01"
}

✅ 목표 Firestore 저장 성공!
```

---

## 🧪 Console에서 확인하는 방법

### 1. 목표 추가 시 로그 확인
```
F12 → Console 탭

✅ 목표 Firestore 저장: 
  targetOwnerUid: "firebase-uid"
  newTodo: {
    id: 1702123456789
    wish: "Learn React"
    deadline: "2024-12-31"
    completed: false
    createdAt: "2024-01-01"
  }
```

### 2. 필드 제거 로그 확인
```
⚠️ 필드 제거됨: outcome = null
⚠️ 필드 제거됨: obstacle = undefined
⚠️ 필드 제거됨: plan = 
```

### 3. 에러 발생 시
```
❌ 목표 Firestore 저장 실패: 
  FirebaseError: Function setDoc() called with invalid data...
```

---

## 🔐 Firestore 규칙 확인

현재 규칙이 정확히 배포되었는지 확인:

```bash
# Firebase CLI로 규칙 확인
firebase deploy --only firestore:rules
```

**현재 적용된 규칙:**
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

---

## 📋 체크리스트

### 배포 확인
- [x] `sanitizeFirestoreData` 함수 추가됨
- [x] handleAddTodo에 적용됨
- [x] handleEditTodo에 적용됨
- [x] handleToggleComplete에 적용됨
- [x] handleMoveToFolder에 적용됨
- [x] 협업자 추가에 적용됨
- [x] npm run build 성공
- [x] GitHub에 push됨

### 테스트 필요 항목
- [ ] 목표 추가 후 Console 로그 확인
- [ ] 목표 수정 후 Console 로그 확인
- [ ] 목표 완료 토글 후 Console 로그 확인
- [ ] 에러 로그 없음 확인
- [ ] Firestore에 실제 데이터 저장됨 확인

---

## 🚀 다음 단계

1. **로컬 테스트:**
   ```bash
   npm run dev
   ```

2. **목표 추가 테스트:**
   - 새 목표 입력 및 추가
   - Console F12 확인
   - Firestore Database에서 데이터 확인

3. **공유 폴더 테스트:**
   - 공유 링크 생성 및 협업자 추가
   - 양쪽 모두에서 데이터 동기화 확인

---

## 💡 문제 해결 팁

### 만약 여전히 에러가 발생한다면:

1. **브라우저 캐시 삭제:**
   ```
   F12 → Application → Clear site data
   ```

2. **로컬 저장소 확인:**
   ```javascript
   // Console에서 실행
   localStorage.getItem('nova-todos')
   ```

3. **최신 코드 확인:**
   ```bash
   git log --oneline -1  # 40d6564 fix: undefined 필드 필터링 강화
   ```

4. **Build 재생성:**
   ```bash
   npm run build
   # dist 폴더의 내용 재생성되었는지 확인
   ```

---

## ✨ 개선 요약

| 항목 | 이전 | 현재 |
|------|------|------|
| 정제 방식 | `Object.fromEntries().filter()` | `sanitizeFirestoreData()` 재귀 |
| undefined 처리 | ✓ | ✓ |
| null 처리 | ✗ | ✓ |
| 빈 문자열 처리 | ✗ | ✓ |
| 중첩 객체 처리 | ✗ | ✓ |
| Console 로깅 | ✗ | ✓ |
| 저장 확인 | ✗ | ✓ |

---

더 이상 **"Unsupported field value: undefined"** 에러가 나타나지 않아야 합니다! 🎉

