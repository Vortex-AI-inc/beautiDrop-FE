importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDYnNO44rDyBT5XbciO5-SblCtAajJRw5A",
  authDomain: "beautydrop-dev.firebaseapp.com",
  projectId: "beautydrop-dev",
  storageBucket: "beautydrop-dev.firebasestorage.app",
  messagingSenderId: "497422674710",
  appId: "1:497422674710:web:9466014c287ab03399be37",
  measurementId: "G-MLSH0ZFFS8"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.svg'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
