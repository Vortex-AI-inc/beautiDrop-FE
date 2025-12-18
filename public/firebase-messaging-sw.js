importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// These values will be replaced by the client-side registration if needed,
// or should be hardcoded here for the background listener to work.
firebase.initializeApp({
    apiKey: "AIzaSyAfzLslKqmQNHQMQTCcULPawzXoxqZYwFc",
    authDomain: "beautydropai.firebaseapp.com",
    projectId: "beautydropai",
    storageBucket: "beautydropai.firebasestorage.app",
    messagingSenderId: "208038531709",
    appId: "1:208038531709:web:97e6c40f389ae3bf50d714",
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
