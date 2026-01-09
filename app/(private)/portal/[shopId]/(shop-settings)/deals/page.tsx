"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Tag, Plus, Loader2, Trash2, Edit2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { fetchShopDeals, deleteDeal, toggleDealActive } from "@/lib/api/deals"
import type { Deal } from "@/types/deal"
import { CreateDealModal } from "@/components/portal/create-deal-modal"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function DealsPage() {
    const params = useParams()
    const shopId = params.shopId as string
    const { toast } = useToast()
    const { getToken } = useAuth()
    const [deals, setDeals] = useState<Deal[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)

    const handleEdit = (deal: Deal) => {
        setSelectedDeal(deal)
        setIsCreateModalOpen(true)
    }

    const loadDeals = async () => {
        try {
            setIsLoading(true)
            const token = await getToken()
            if (!token) return

            const data = await fetchShopDeals(shopId, token)
            setDeals(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load deals.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (shopId) {
            loadDeals()
        }
    }, [shopId])

    const handleDelete = async (dealId: string) => {
        if (!confirm("Are you sure you want to delete this deal?")) return

        try {
            setIsDeleting(dealId)
            const token = await getToken()
            if (!token) return

            await deleteDeal(dealId, token)
            setDeals(prev => prev.filter(d => d.id !== dealId))
            toast({
                title: "Deal deleted",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete deal.",
                variant: "destructive"
            })
        } finally {
            setIsDeleting(null)
        }
    }

    const handleToggleActive = async (deal: Deal) => {
        try {
            const token = await getToken()
            if (!token) return

            const updatedDeals = deals.map(d => d.id === deal.id ? { ...d, is_active: !d.is_active } : d)
            setDeals(updatedDeals)

            await toggleDealActive(deal.id, token)
        } catch (error) {
            setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, is_active: deal.is_active } : d))
            toast({
                title: "Error",
                description: "Failed to update status.",
                variant: "destructive"
            })
        }
    }

    return (
        <>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100/80">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                                Deals & Offers
                            </h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage your special promotions and service packages.</p>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Deal
                    </Button>
                </div>

                <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3">
                                <Tag className="w-6 h-6 text-white -rotate-3" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">Promotion Board</CardTitle>
                                <CardDescription className="font-medium text-slate-500">View and manage your current offers</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Updating Board</p>
                            </div>
                        ) : deals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                                    <Tag className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">No active deals</h3>
                                <p className="text-slate-500 font-medium max-w-sm mt-2">Create your first package or special offer to attract more customers.</p>
                                <Button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 transition-all active:scale-95"
                                >
                                    Create First Deal
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 w-[350px]">Deal Details</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Services Included</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Price</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Duration</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Visibility</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {deals.map((deal) => (
                                            <TableRow key={deal.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="px-8 py-6 align-top">
                                                    <div>
                                                        <div className="text-base font-bold text-slate-900 mb-1">{deal.name}</div>
                                                        {deal.description && (
                                                            <div className="text-[11px] font-medium text-slate-400 line-clamp-2 max-w-[280px] leading-relaxed uppercase tracking-wider">{deal.description}</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6 align-top">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {deal.included_items.slice(0, 3).map((item, idx) => (
                                                            <Badge key={idx} className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-indigo-50 text-indigo-600 border-none shadow-sm">
                                                                {item}
                                                            </Badge>
                                                        ))}
                                                        {deal.included_items.length > 3 && (
                                                            <Badge className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white text-slate-400 border border-slate-100 shadow-sm">
                                                                +{deal.included_items.length - 3} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6 align-top">
                                                    <div className="text-base font-black text-slate-900 tracking-tighter">${deal.price}</div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6 align-top">
                                                    {deal.duration_minutes ? (
                                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {deal.duration_minutes} min duration
                                                        </div>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell className="px-8 py-6 align-top">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={deal.is_active}
                                                            onCheckedChange={() => handleToggleActive(deal)}
                                                            className="data-[state=checked]:bg-teal-500"
                                                        />
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest",
                                                            deal.is_active ? 'text-teal-600' : 'text-slate-300'
                                                        )}>
                                                            {deal.is_active ? 'Public' : 'Hidden'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6 align-top text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl"
                                                            onClick={() => handleEdit(deal)}
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                                            onClick={() => handleDelete(deal.id)}
                                                            disabled={isDeleting === deal.id}
                                                        >
                                                            {isDeleting === deal.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <CreateDealModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false)
                    setSelectedDeal(null)
                }}
                onDealCreated={loadDeals}
                shopId={shopId}
                dealToEdit={selectedDeal}
            />
        </>
    )
}
