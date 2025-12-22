'use client'

import { useEffect, useState } from 'react'
import { messaging } from '@/lib/firebase'
import { getToken, onMessage } from 'firebase/messaging'
import { useAuth } from '@clerk/nextjs'
import { registerFCMToken } from '@/lib/api/notifications'
import { useToast } from '@/hooks/use-toast'
import { useNotificationStore } from '@/lib/store/notification-store'

export const useFCM = () => {
    const { getToken: getAuthToken, isSignedIn } = useAuth()
    const { toast } = useToast()
    const { addNotification } = useNotificationStore()
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        if (!isSignedIn || typeof window === 'undefined') return

        const setupFCM = async () => {
            try {
                if (!('serviceWorker' in navigator)) {
                    return
                }

                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                    scope: '/'
                })
                await navigator.serviceWorker.ready

                const messagingInstance = await messaging()
                if (!messagingInstance) {
                    return
                }

                const permission = await Notification.requestPermission()
                if (permission !== 'granted') return

                const fcmToken = await getToken(messagingInstance, {
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                    serviceWorkerRegistration: registration
                })

                if (fcmToken) {
                    setToken(fcmToken)
                    const authToken = await getAuthToken()
                    if (authToken) {
                        await registerFCMToken(fcmToken, authToken)
                    }
                }

                const unsubscribe = onMessage(messagingInstance, (payload: any) => {

                    const newNotification = {
                        id: payload.messageId || Math.random().toString(36).substr(2, 9),
                        title: payload.notification?.title || payload.data?.title || 'New Notification',
                        message: payload.notification?.body || payload.data?.body || '',
                        notification_type: payload.data?.type || 'info',
                        is_read: false,
                        created_at: new Date().toISOString(),
                        data: payload.data
                    }

                    addNotification(newNotification)

                    toast({
                        title: newNotification.title,
                        description: newNotification.message,
                    })
                })

                return unsubscribe
            } catch (error) {
                return undefined
            }
        }

        const unsubscribePromise = setupFCM()

        return () => {
            unsubscribePromise.then(unsubscribe => {
                if (typeof unsubscribe === 'function') unsubscribe()
            })
        }
    }, [isSignedIn, getAuthToken, toast])

    return { token }
}
