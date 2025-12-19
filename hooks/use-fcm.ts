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
        console.log('🔍 FCM Hook Check - isSignedIn:', isSignedIn)
        if (!isSignedIn || typeof window === 'undefined') return

        const setupFCM = async () => {
            console.log('🏁 Starting FCM Setup')
            try {
                if (!('serviceWorker' in navigator)) {
                    console.log('❌ Service Worker not supported in navigator. isSecureContext:', window.isSecureContext)
                    return
                }

                console.log('⏳ Registering Service Worker...')
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                    scope: '/'
                })

                console.log('⏳ Waiting for Service Worker ready...')
                await navigator.serviceWorker.ready
                console.log('✅ Service Worker ready')

                const messagingInstance = await messaging()
                if (!messagingInstance) {
                    console.log('❌ Messaging instance null')
                    return
                }
                console.log('✅ App connected with FCM')

                console.log('⏳ Requesting notification permission...')
                const permission = await Notification.requestPermission()
                console.log('🔹 Permission status:', permission)
                if (permission !== 'granted') return

                console.log('⏳ Getting FCM Token...')
                const fcmToken = await getToken(messagingInstance, {
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                    serviceWorkerRegistration: registration
                })

                if (fcmToken) {
                    console.log('🔥 FCM Token:', fcmToken)
                    setToken(fcmToken)
                    console.log('⏳ Registering token with backend...')
                    const authToken = await getAuthToken()
                    if (authToken) {
                        try {
                            await registerFCMToken(fcmToken, authToken)
                            console.log('✅ Token registered with backend')
                        } catch (error) {
                            console.log('❌ Backend registration failed:', error)
                        }
                    } else {
                        console.log('❌ No Auth Token found for backend registration')
                    }
                } else {
                    console.log('❌ FCM Token is null/empty')
                }

                const unsubscribe = onMessage(messagingInstance, (payload: any) => {
                    console.log('📩 Message received:', payload)

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

                console.log('📡 FCM Message Channel Subscribed')
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
