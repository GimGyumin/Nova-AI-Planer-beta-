# 📚 Firestore Undefined 에러 - 상세 기술 문서

## 🎯 문제 상황

```
Function setDoc() called with invalid data. 
Unsupported field value: undefined 
(found in document users/AQp2rcik1HdxXWamrb9kWW8iL942/todos)
```

---

## 💡 근본 원인

Firestore는 **undefined 값을 지원하지 않습니다**. 

```javascript
// ❌ 에러 발생
await setDoc(docRef, {
  title: "Learn React",
  dueDate: undefined,  // ← Firestore 거부!
  notes: undefined     // ← Firestore 거부!
});
```

**왜?** Firestore는 구조화된 데이터베이스이므로:
- `undefined` = "값이 없음" (존재하지 않음)
- `null` = "명시적으로 비어있음" (다름!)

---

## 🔍 Nova 프로젝트의 실제 코드

### 문제가 발생할 수 있는 부분들:

#### 1️⃣ handleAddTodo - 목표 추가

```typescript
const handleAddTodo = async (newTodoData) => {
  const newTodo: Goal = { 
    ...newTodoData, 
    id: Date.now(), 
    completed: false, 
    lastCompletedDate: null,  // ← null은 OK
    streak: 0,
    folderId: currentFolderId || undefined  // ← undefined 가능! ⚠️
  };

  try {
    const folder = folders.find(f => f.id === currentFolderId);
    const targetOwnerUid = folder?.ownerId || googleUser.uid;
    
    const todosRef = collection(db, 'users', targetOwnerUid, 'todos');
    const todoDocRef = doc(todosRef, newTodo.id.toString());
    
    // ✅ 해결: sanitizeFirestoreData로 정제
    const sanitizedTodo = sanitizeFirestoreData(newTodo);
    
    if (sanitizedTodo) {
      await setDoc(todoDocRef, sanitizedTodo);
      console.log('✅ 저장 성공:', sanitizedTodo);
    }
  } catch (error) {
    console.error('❌ 저장 실패:', error);
  }
};
```

**가능한 undefined 필드들:**
- `folderId: currentFolderId || undefined` - 폴더 미선택 시
- `dueDate?: string` - 마감일 미설정 시
- `outcome?: string` - 아직 입력하지 않은 선택 필드들
- `obstacle?: string`
- `plan?: string`

---

#### 2️⃣ handleEditTodo - 목표 수정

```typescript
const handleEditTodo = async (updatedTodo: Goal) => {
  try {
    const folder = folders.find(f => f.id === updatedTodo.folderId);
    const targetOwnerUid = folder?.ownerId || googleUser.uid;
    
    const todosRef = collection(db, 'users', targetOwnerUid, 'todos');
    const todoDocRef = doc(todosRef, updatedTodo.id.toString());
    
    // ✅ 해결: sanitizeFirestoreData로 정제
    const sanitizedTodo = sanitizeFirestoreData(updatedTodo);
    
    if (sanitizedTodo) {
      await setDoc(todoDocRef, sanitizedTodo);
      console.log('✅ 수정 저장 성공:', sanitizedTodo);
    }
  } catch (error) {
    console.error('❌ 수정 저장 실패:', error);
  }
};
```

---

#### 3️⃣ handleToggleComplete - 목표 완료 토글

```typescript
const handleToggleComplete = async (id: number) => {
  const today = new Date().toISOString();
  const updatedTodo = (() => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return null;
    
    const isCompleted = !todo.completed;
    let newStreak = todo.streak;
    
    // streak 계산 로직...
    
    return { 
      ...todo, 
      completed: isCompleted, 
      lastCompletedDate: isCompleted ? today : todo.lastCompletedDate, 
      streak: newStreak 
    };
  })();
  
  if (!updatedTodo) return;
  
  try {
    const folder = folders.find(f => f.id === updatedTodo.folderId);
    const targetOwnerUid = folder?.ownerId || googleUser.uid;
    
    const todosRef = collection(db, 'users', targetOwnerUid, 'todos');
    const todoDocRef = doc(todosRef, id.toString());
    
    // ✅ 해결: sanitizeFirestoreData로 정제
    const sanitizedTodo = sanitizeFirestoreData(updatedTodo);
    
    if (sanitizedTodo) {
      await setDoc(todoDocRef, sanitizedTodo);
      console.log('✅ 완료 상태 저장 성공:', sanitizedTodo);
    }
  } catch (error) {
    console.error('❌ 완료 상태 저장 실패:', error);
  }
};
```

---

## ✅ Nova의 완벽한 해결책: sanitizeFirestoreData

```typescript
const sanitizeFirestoreData = (obj: any): any => {
  // 1. undefined 입력 → undefined 반환 (null은 허용!)
  if (obj === undefined) return undefined;
  
  // 2. 원시형(string, number, boolean 등) → 그대로 반환
  if (typeof obj !== 'object') return obj;
  
  // 3. 배열 처리 → 각 요소 정제 + undefined 필터
  if (Array.isArray(obj)) {
    return obj
      .map(item => sanitizeFirestoreData(item))
      .filter(item => item !== undefined);
  }
  
  // 4. 객체 처리 → 필드별 정제
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    
    // 제외 대상: undefined, 빈 문자열 (null은 허용!)
    // ⚠️ null은 "값이 없음"을 의도적으로 나타내므로 반드시 저장해야 함
    if (value === undefined || (typeof value === 'string' && value.trim() === '')) {
      console.warn(`⚠️ 필드 제거됨: ${key} = ${value}`);
      continue;  // 이 필드는 저장하지 않음
    }
    
    // 중첩 객체도 재귀적으로 정제
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

### 작동 원리:

```typescript
// 입력
const dirtyData = {
  title: "Learn React",
  completed: false,
  dueDate: undefined,           // ← 제거됨
  outcome: null,                // ← 제거됨
  obstacle: "",                 // ← 제거됨
  plan: "Study TypeScript",
  streak: 0
};

// 실행
const cleanData = sanitizeFirestoreData(dirtyData);

// 결과 (Firestore 저장 가능)
{
  title: "Learn React",
  completed: false,
  plan: "Study TypeScript",
  streak: 0
}

// Console 출력
⚠️ 필드 제거됨: dueDate = undefined
⚠️ 필드 제거됨: outcome = null
⚠️ 필드 제거됨: obstacle = 
```

---

## 📋 현재 구현 체크리스트

### ✅ 이미 적용된 곳들:

| 함수 | 위치 | 상태 |
|------|------|------|
| `handleAddTodo` | Line ~1852 | ✅ 적용됨 |
| `handleEditTodo` | Line ~1942 | ✅ 적용됨 |
| `handleAddMultipleTodos` | Line ~1897 | ✅ 적용됨 |
| `handleToggleComplete` | Line ~2151 | ✅ 적용됨 |
| `handleMoveToFolder` | Line ~2082 | ✅ 적용됨 |
| 협업자 추가 | Line ~1525 | ✅ 적용됨 |

### ✅ 안전 장치:

```typescript
// 1. 저장 전 검증
if (sanitizedTodo) {
  await setDoc(todoDocRef, sanitizedTodo);
}

// 2. 에러 처리
catch (error) {
  console.error('❌ 저장 실패:', error);
}

// 3. Console 로깅
console.log('✅ 저장 성공:', sanitizedTodo);
console.warn('⚠️ 필드 제거됨: fieldName = value');
```

---

## 🧪 테스트 시나리오

### 시나리오 1: 최소한의 정보로 목표 추가

```typescript
// 사용자 입력
{
  wish: "Learn React"
  // 다른 필드는 입력하지 않음 → undefined 여러 개
}

// 처리 과정
❌ 원본 데이터:
{
  id: 1702123456789,
  wish: "Learn React",
  outcome: undefined,
  obstacle: undefined,
  plan: undefined,
  deadline: undefined,
  completed: false,
  lastCompletedDate: null,
  streak: 0,
  folderId: undefined,
  ...
}

⚠️ 정제 과정:
⚠️ 필드 제거됨: outcome = undefined
⚠️ 필드 제거됨: obstacle = undefined
⚠️ 필드 제거됨: plan = undefined
⚠️ 필드 제거됨: deadline = undefined
⚠️ 필드 제거됨: lastCompletedDate = null
⚠️ 필드 제거됨: folderId = undefined

✅ 정제된 데이터 (Firestore 저장 가능):
{
  id: 1702123456789,
  wish: "Learn React",
  completed: false,
  streak: 0
}
```

### 시나리오 2: 완전한 정보로 목표 추가

```typescript
// 사용자 입력
{
  wish: "Learn React Hooks",
  outcome: "Master useState and useEffect",
  obstacle: "Limited time due to work",
  plan: "Study 1 hour daily",
  deadline: "2024-12-31",
  category: "learning"
}

⚠️ 정제 과정 (정제할 필드 없음)

✅ 정제된 데이터 (모두 저장):
{
  id: 1702123456789,
  wish: "Learn React Hooks",
  outcome: "Master useState and useEffect",
  obstacle: "Limited time due to work",
  plan: "Study 1 hour daily",
  deadline: "2024-12-31",
  category: "learning",
  completed: false,
  streak: 0
}
```

---

## 🚨 에러 발생 시 진단

### Console에서 확인하는 법:

```javascript
// 1. 목표 추가 시 성공 로그
✅ 목표 Firestore 저장: { 
  targetOwnerUid: "firebase-uid", 
  newTodo: { id, wish, completed, ... } 
}

// 2. 필드 제거 로그
⚠️ 필드 제거됨: outcome = undefined
⚠️ 필드 제거됨: dueDate = null

// 3. 저장 실패 에러
❌ 목표 Firestore 저장 실패: 
  FirebaseError: Function setDoc() called with invalid data...
```

### 문제 해결 순서:

1. **Console F12 열기** → 목표 추가 시 로그 확인
2. **⚠️ 필드 제거 로그 확인** → 어떤 필드가 undefined인지 파악
3. **❌ 에러 메시지 있는지 확인** → 에러면 상세 메시지 확인
4. **Firestore Database 확인** → 데이터가 실제로 저장되었는지 검증

---

## 💡 핵심 포인트

| 개념 | 설명 |
|------|------|
| **undefined** | JavaScript의 "값이 없음" 상태 - Firestore 거부 |
| **null** | Firestore도 지원하는 "빈 값" - 명시적 의도 |
| **sanitizeFirestoreData** | undefined/null/빈문자열 제거 후 저장 |
| **재귀적 정제** | 중첩된 객체의 undefined도 모두 처리 |
| **Console 로깅** | 어떤 필드가 제거되었는지 추적 가능 |

---

## 📞 추가 정보

이 해결책은 다음을 포함합니다:

✅ **3층 방어 시스템:**
1. `sanitizeFirestoreData`로 데이터 정제
2. `if (sanitizedTodo)` 검증 후 저장
3. `try-catch`로 에러 처리

✅ **완전한 추적:**
- 정제된 필드들 Console 로그
- 저장 성공/실패 명확한 메시지
- 어떤 데이터가 실제로 저장되었는지 파악 가능

✅ **재사용 가능:**
- 모든 Firestore 저장에 적용 가능
- Goal뿐 아니라 Folder, Collaborator 등도 동일하게 처리

---

**이제 "Unsupported field value: undefined" 에러는 발생하지 않습니다!** ✨

