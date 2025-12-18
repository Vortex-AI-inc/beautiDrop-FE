import { create } from 'zustand'
import type { Notification } from '@/types/notification'

interface NotificationState {
    notifications: Notification[]
    unreadCount: number
    setNotifications: (notifications: Notification[]) => void
    addNotification: (notification: Notification) => void
    setUnreadCount: (count: number) => void
    decrementUnreadCount: () => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    setNotifications: (notifications) => set({ notifications }),
    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1
    })),
    setUnreadCount: (count) => set({ unreadCount: count }),
    decrementUnreadCount: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, is_read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
    })),
    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, is_read: true })),
        unreadCount: 0
    })),
}))
