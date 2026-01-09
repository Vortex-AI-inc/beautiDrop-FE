"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@clerk/nextjs"
import { Calendar, RefreshCw, CheckCircle, XCircle, Loader2, Link as LinkIcon, Unlink, MoreVertical } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    fetchCalendarStatus,
    syncCalendar
} from "@/lib/api/calendar"
import { CalendarStatus } from "@/types/calendar"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export function GoogleCalendarConnect() {
    const { getToken, userId } = useAuth()
    const { toast } = useToast()
    const [status, setStatus] = useState<CalendarStatus | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)

    const loadStatus = async () => {
        try {
            const token = await getToken()
            if (!token) return
            const data = await fetchCalendarStatus(token)
            setStatus(data)
        } catch (error) {
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            loadStatus()
        }
    }, [userId, getToken])

    const handleConnect = async () => {
        setIsConnecting(true)
        try {
            const token = await getToken()
            if (!token) return
            const data = await connectGoogleCalendar(token)
            setStatus(data)
            toast({
                title: "Connected",
                description: "Your Google Calendar has been connected successfully.",
            })
        } catch (error) {
            toast({
                title: "Connection Failed",
                description: "Failed to connect Google Calendar. Please make sure you have granted permissions.",
                variant: "destructive",
            })
        } finally {
            setIsConnecting(false)
        }
    }

    const handleDisconnect = async () => {
        if (!confirm("Are you sure you want to disconnect? This will stop syncing your bookings.")) return

        setIsConnecting(true)
        try {
            const token = await getToken()
            if (!token) return
            await disconnectGoogleCalendar(token)
            setStatus(prev => prev ? { ...prev, is_connected: false, is_sync_enabled: false } : null)
            toast({
                title: "Disconnected",
                description: "Your Google Calendar has been disconnected.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to disconnect.",
                variant: "destructive",
            })
        } finally {
            setIsConnecting(false)
        }
    }

    const handleSync = async () => {
        setIsSyncing(true)
        try {
            const token = await getToken()
            if (!token) return
            await syncCalendar(token)
            toast({
                title: "Sync Started",
                description: "Your bookings are syncing in the background.",
            })
            setTimeout(loadStatus, 2000)
        } catch (error) {
            toast({
                title: "Sync Failed",
                description: "Failed to start sync.",
                variant: "destructive",
            })
        } finally {
            setIsSyncing(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        )
    }

    const isConnected = status?.is_connected

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="w-8 h-8" />
                    <div>
                        <CardTitle className="text-lg">Google Calendar</CardTitle>
                        <CardDescription>
                            Sync your bookings automatically
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isConnected ? "bg-green-100" : "bg-gray-200")}>
                            {isConnected ? <CheckCircle className="w-6 h-6 text-green-600" /> : <Calendar className="w-6 h-6 text-gray-400" />}
                        </div>
                        <div>
                            <p className="font-medium text-sm text-gray-900">
                                {isConnected ? "Connected" : "Not Connected"}
                            </p>
                            {isConnected && status?.last_sync_at && (
                                <p className="text-xs text-gray-500">
                                    Last synced {formatDistanceToNow(new Date(status.last_sync_at), { addSuffix: true })}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        {isConnected && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleSync} disabled={isSyncing}>
                                        <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
                                        Sync Now
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDisconnect} className="text-red-600 focus:text-red-600">
                                        <Unlink className="w-4 h-4 mr-2" />
                                        Disconnect
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </CardContent>
            {!isConnected && (
                <CardFooter className="flex justify-end bg-gray-50/50 p-4 rounded-b-lg">
                    <Button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    >
                        {isConnecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LinkIcon className="w-4 h-4 mr-2" />}
                        Connect Google Calendar
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}
