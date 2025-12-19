importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");


firebase.initializeApp({
    apiKey: "AIzaSyDYnNO44rDyBT5XbciO5-SblCtAajJRw5A",
    authDomain: "beautydrop-dev.firebaseapp.com",
    projectId: "beautydrop-dev",
    storageBucket: "beautydrop-dev.firebasestorage.app",
    messagingSenderId: "497422674710",
    appId: "1:497422674710:web:9466014c287ab03399be37",
    measurementId: "G-MLSH0ZFFS8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/icon.svg",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
