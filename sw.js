const CACHE_NAME = 'nova-planner-v1';
const urlsToCache = [
  '/Nova-AI-Planer/',
  '/Nova-AI-Planer/assets/index.css',
  '/Nova-AI-Planer/assets/index.js',
  '/Nova-AI-Planer/nova-192.png',
  '/Nova-AI-Planer/nova-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 푸시 알림 수신 (Firebase FCM 메시지 포함)
self.addEventListener('push', function(event) {
  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  try {
    const data = event.data.json();
    console.log('FCM 푸시 메시지 수신:', data);
    
    // Firebase FCM 메시지 형식 처리
    const title = data.notification?.title || data.title || 'Nova 목표 알림';
    const body = data.notification?.body || data.body || '목표 마감일이 다가오고 있습니다.';
    
    const options = {
      body: body,
      icon: '/Nova-AI-Planer/nova-192.svg',
      badge: '/Nova-AI-Planer/nova-192.svg',
      tag: data.data?.type || data.tag || 'nova-deadline-notification',
      requireInteraction: true, // 마감일 알림은 사용자 확인 필요
      data: data.data || {}, // 클릭 시 사용할 데이터
      actions: [
        { action: 'view', title: '목표 보기' },
        { action: 'close', title: '닫기' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (e) {
    console.error('Error handling push notification:', e);
    
    // 파싱 실패 시 기본 알림 표시
    event.waitUntil(
      self.registration.showNotification('Nova 알림', {
        body: 'Nova 앱에서 알림이 도착했습니다.',
        icon: '/Nova-AI-Planer/nova-192.svg',
        badge: '/Nova-AI-Planer/nova-192.svg'
      })
    );
  }
});

// 알림 클릭 이벤트 (마감일 알림 클릭 시 해당 목표로 이동)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    // 마감일 알림의 경우 특정 목표로 이동
    const todoId = event.notification.data?.todoId;
    let targetUrl = '/Nova-AI-Planer/';
    
    if (todoId) {
      targetUrl += `?highlight=${todoId}`;
    }
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        // 이미 열려있는 윈도우가 있으면 포커스하고 목표 하이라이트
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].url.includes('/Nova-AI-Planer/') && 'focus' in clientList[i]) {
            // 목표 하이라이트 메시지 전송
            if (todoId) {
              clientList[i].postMessage({
                type: 'HIGHLIGHT_TODO',
                todoId: todoId
              });
            }
            return clientList[i].focus();
          }
        }
        // 없으면 새 윈도우 열기
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
    );
  }
});

// 알림 닫기 이벤트
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event.notification.tag);
});

// 클라이언트에서 보낸 메시지 처리 (테스트 알림용)
self.addEventListener('message', function(event) {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    console.log('Showing notification:', title, options);
    
    self.registration.showNotification(title, {
      icon: '/Nova-AI-Planer/favicon.svg',
      badge: '/Nova-AI-Planer/favicon.svg',
      ...options
    }).catch(err => {
      console.error('Failed to show notification:', err);
    });
  }
});