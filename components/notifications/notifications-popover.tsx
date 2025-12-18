"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Settings, Trash2, Mail, Info, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import {
    fetchNotifications,
    fetchNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    deleteNotification,
    fetchNotificationPreferences,
    updateNotificationPreferences,
} from "@/lib/api/notifications"
import { Notification, NotificationPreferences } from "@/types/notification"
import { formatDistanceToNow } from "date-fns"
import { useNotificationStore } from "@/lib/store/notification-store"

export function NotificationsPopover() {
    const { getToken, userId } = useAuth()
    const {
        notifications,
        unreadCount,
        setNotifications,
        setUnreadCount,
        markAsRead,
        markAllAsRead,
        decrementUnreadCount
    } = useNotificationStore()

    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [userInteracted, setUserInteracted] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
    const [isSavingPrefs, setIsSavingPrefs] = useState(false)

    const loadNotifications = async (isInitial = false) => {
        setIsLoading(true)
        try {
            const token = await getToken()
            if (!token) return

            const [data, countData] = await Promise.all([
                fetchNotifications(token),
                fetchNotificationCount(token)
            ])

            setNotifications(data.results || [])
            setNextUrl(data.next)
            setUnreadCount(countData.unread)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadMore = async () => {
        if (!nextUrl || isLoadingMore) return
        setIsLoadingMore(true)
        try {
            const token = await getToken()
            if (!token) return
            const data = await fetchNotifications(token, nextUrl)
            setNotifications([...notifications, ...(data.results || [])])
            setNextUrl(data.next)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoadingMore(false)
        }
    }

    const loadPreferences = async () => {
        try {
            const token = await getToken()
            if (!token) return
            const prefs = await fetchNotificationPreferences(token)
            setPreferences(prefs)
        } catch (error) {
            console.error(error)
        }
    }

    const savePreferences = async () => {
        if (!preferences) return
        setIsSavingPrefs(true)
        try {
            const token = await getToken()
            if (!token) return
            await updateNotificationPreferences(preferences, token)
            setIsSettingsOpen(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSavingPrefs(false)
        }
    }

    useEffect(() => {
        if (userId) {
            loadNotifications(true)
        }
    }, [userId, getToken])

    useEffect(() => {
        if (isSettingsOpen) {
            loadPreferences()
        }
    }, [isSettingsOpen])

    const handleMarkAllRead = async () => {
        try {
            const token = await getToken()
            if (!token) return
            await markAllNotificationsAsRead(token)
            markAllAsRead()
        } catch (error) {
            console.error(error)
        }
    }

    const handleMarkRead = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation()
        try {
            const token = await getToken()
            if (!token) return
            await markNotificationAsRead(id, token)
            markAsRead(id)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            const token = await getToken()
            if (!token) return
            await deleteNotification(id, token)

            const wasUnread = notifications.find(n => n.id === id && !n.is_read)
            if (wasUnread) decrementUnreadCount()
            setNotifications(notifications.filter(n => n.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />
            default: return <Info className="w-4 h-4 text-blue-500" />
        }
    }

    const togglePreference = (key: keyof NotificationPreferences) => {
        if (!preferences) return
        setPreferences({ ...preferences, [key]: !preferences[key] })
    }

    return (
        <>
            <Popover open={isOpen} onOpenChange={(open) => {
                setIsOpen(open)
                if (open) {
                    loadNotifications()
                    setUserInteracted(true)
                }
            }}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className={cn("w-5 h-5", unreadCount > 0 && !userInteracted ? "animate-pulse text-blue-600" : "text-gray-600")} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Notifications</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">Notifications</h4>
                            {unreadCount > 0 && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-medium">{unreadCount} New</span>}
                        </div>
                        <div className="flex items-center gap-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                            onClick={handleMarkAllRead}
                                            disabled={unreadCount === 0}
                                        >
                                            <Check className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Mark all as read</p></TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                                            onClick={() => setIsSettingsOpen(true)}
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Notification Settings</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <ScrollArea className="h-[300px]">
                        {!Array.isArray(notifications) || notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                                <Mail className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm">No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y relative">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group",
                                            !notification.is_read ? "bg-blue-50/50" : ""
                                        )}
                                        onClick={() => !notification.is_read && handleMarkRead(notification.id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 shrink-0">
                                                {getIcon(notification.notification_type)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className={cn("text-sm font-medium leading-none", !notification.is_read && "text-blue-700")}>
                                                        {notification.title || "Notification"}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex gap-1 bg-gradient-to-l from-white/90 pl-4">
                                            {!notification.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                                                    onClick={(e) => handleMarkRead(notification.id, e)}
                                                    title="Mark as read"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                onClick={(e) => handleDelete(notification.id, e)}
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {nextUrl && (
                                    <div className="p-2 text-center border-t">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={loadMore}
                                            disabled={isLoadingMore}
                                            className="w-full text-xs text-blue-600 h-8"
                                        >
                                            {isLoadingMore ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                                            {isLoadingMore ? "Loading..." : "Load More"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </PopoverContent>
            </Popover>

            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Notification Preferences</DialogTitle>
                        <DialogDescription>
                            Choose what you want to be notified about.
                        </DialogDescription>
                    </DialogHeader>
                    {preferences ? (
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="push_enabled" className="flex flex-col space-y-1">
                                    <span>Push Notifications</span>
                                    <span className="font-normal text-xs text-muted-foreground">Receive push notifications on your device.</span>
                                </Label>
                                <Switch id="push_enabled" checked={preferences.push_enabled} onCheckedChange={() => togglePreference('push_enabled')} />
                            </div>
                            <div className="border-t my-2" />
                            <h5 className="text-sm font-medium mb-2">Email Notifications</h5>
                            <div className="space-y-4">
                                {[
                                    { key: 'email_booking_confirmation', label: 'Booking Confirmation' },
                                    { key: 'email_booking_cancellation', label: 'Booking Cancellation' },
                                    { key: 'email_booking_reschedule', label: 'Booking Reschedule' },
                                    { key: 'email_booking_reminder', label: 'Booking Reminder' },
                                    { key: 'email_staff_assignment', label: 'Staff Assignment' },
                                    { key: 'email_shop_holiday', label: 'Shop Holiday' },
                                    { key: 'email_marketing', label: 'Marketing Updates' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between space-x-2">
                                        <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
                                        <Switch
                                            id={item.key}
                                            checked={!!preferences[item.key as keyof NotificationPreferences]}
                                            onCheckedChange={() => togglePreference(item.key as keyof NotificationPreferences)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="submit" onClick={savePreferences} disabled={isSavingPrefs || !preferences}>
                            {isSavingPrefs ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
