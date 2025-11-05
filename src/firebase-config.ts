import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

// Firestore 에러 로그만 표시 (개발 중 로그 폭주 방지)
setLogLevel('error');

// Firebase 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase 앱 초기화 (중복 방지)
const app = initializeApp(firebaseConfig);

// Firebase 인증 초기화
export const auth = getAuth(app);

// 로컬 저장소 지속성 설정
setPersistence(auth, browserLocalPersistence).catch(err => console.error("Persistence error:", err));

// Google 인증 제공자
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// 브라우저 호환성을 위한 설정
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline'
});

// 사파리에서 팝업 문제 해결을 위한 추가 설정
if (typeof window !== 'undefined') {
  const userAgent = navigator.userAgent.toLowerCase();
  const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('firefox');
  
  if (isSafari) {
    googleProvider.setCustomParameters({
      prompt: 'consent'
    });
  }
}

// Firestore 초기화 (로컬 캐시 활성화)
export const db = getFirestore(app);

// Firestore 로컬 캐시 활성화 (오프라인 지원)
import { enableIndexedDbPersistence } from 'firebase/firestore';
enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore: Multiple tabs open, persistence disabled');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore: Browser does not support persistence');
  }
});

export default app;
