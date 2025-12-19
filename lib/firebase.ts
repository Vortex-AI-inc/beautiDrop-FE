import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDYnNO44rDyBT5XbciO5-SblCtAajJRw5A",
    authDomain: "beautydrop-dev.firebaseapp.com",
    projectId: "beautydrop-dev",
    storageBucket: "beautydrop-dev.firebasestorage.app",
    messagingSenderId: "497422674710",
    appId: "1:497422674710:web:9466014c287ab03399be37",
    measurementId: "G-MLSH0ZFFS8"
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
