'use client'

import { useEffect, useState } from 'react'
import { messaging } from '@/lib/firebase'
import { getToken, onMessage } from 'firebase/messaging'
import { useAuth } from '@clerk/nextjs'
import { registerFCMToken } from '@/lib/api/notifications'
import { useToast } from '@/hooks/use-toast'

export const useFCM = () => {
    const { getToken: getAuthToken, isSignedIn } = useAuth()
    const { toast } = useToast()
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        if (!isSignedIn) return

        const setupFCM = async () => {
            try {
                const messagingInstance = await messaging()
                if (!messagingInstance) return

                const permission = await Notification.requestPermission()
                if (permission !== 'granted') return

                const fcmToken = await getToken(messagingInstance, {
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
                })

                if (fcmToken) {
                    setToken(fcmToken)
                    const authToken = await getAuthToken()
                    if (authToken) {
                        try {
                            await registerFCMToken(fcmToken, authToken)
                        } catch (error) {
                        }
                    }
                }

                const unsubscribe = onMessage(messagingInstance, (payload: any) => {
                    toast({
                        title: payload.notification?.title || 'New Notification',
                        description: payload.notification?.body || '',
                    })
                })

                return unsubscribe
            } catch (error) {
                return undefined
            }
        }

        const unsubscribePromise = setupFCM()

        return () => {
            unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe())
        }
    }, [isSignedIn, getAuthToken, toast])

    return { token }
}
