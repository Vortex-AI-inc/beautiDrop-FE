import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAfzLslKqmQNHQMQTCcULPawzXoxqZYwFc",
    authDomain: "beautydropai.firebaseapp.com",
    projectId: "beautydropai",
    storageBucket: "beautydropai.firebasestorage.app",
    messagingSenderId: "208038531709",
    appId: "1:208038531709:web:f7b1e6cf982c8dc750d714",
    measurementId: "G-WK1DWQDYH7"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const messaging = async (): Promise<Messaging | null> => {
    try {
        const isSupportedBrowser = await import("firebase/messaging").then((m) =>
            m.isSupported()
        );
        if (!isSupportedBrowser) return null;
        return getMessaging(app);
    } catch (error) {
        return null;
    }
};

export default app;
