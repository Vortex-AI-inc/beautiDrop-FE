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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 underline decoration-blue-500/30 underline-offset-8">Deals & Offers</h1>
                        <p className="text-muted-foreground mt-4">Manage your packages and special offers.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-purple-600" />
                            <h2 className="text-lg font-bold text-gray-900">Your Deals</h2>
                        </div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Deal
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                        </div>
                    ) : deals.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Tag className="w-8 h-8 text-purple-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No deals yet</h3>
                            <p className="text-gray-500 mb-6">Create your first packing or special offer to attract more customers.</p>
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                variant="outline"
                                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                            >
                                Create First Deal
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-gray-100">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-100">
                                        <TableHead className="w-[350px] font-semibold text-gray-900 pl-6">DEAL NAME</TableHead>
                                        <TableHead className="font-semibold text-gray-900">INCLUDED ITEMS</TableHead>
                                        <TableHead className="font-semibold text-gray-900">PRICE</TableHead>
                                        <TableHead className="font-semibold text-gray-900">DURATION</TableHead>
                                        <TableHead className="font-semibold text-gray-900">STATUS</TableHead>
                                        <TableHead className="text-right font-semibold text-gray-900 pr-6">ACTIONS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deals.map((deal) => (
                                        <TableRow key={deal.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                                            <TableCell className="font-medium align-top py-5 pl-6">
                                                <div>
                                                    <div className="font-bold text-gray-900 text-base mb-1">{deal.name}</div>
                                                    {deal.description && (
                                                        <div className="text-sm text-gray-500 line-clamp-2 max-w-[280px] leading-relaxed">{deal.description}</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {deal.included_items.slice(0, 3).map((item, idx) => (
                                                        <Badge key={idx} variant="secondary" className="font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 rounded-lg px-2.5 py-1">
                                                            {item}
                                                        </Badge>
                                                    ))}
                                                    {deal.included_items.length > 3 && (
                                                        <Badge variant="outline" className="font-medium text-gray-500 border-dashed rounded-lg px-2.5 py-1">
                                                            +{deal.included_items.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-5">
                                                <div className="text-lg font-bold text-gray-900">${deal.price}</div>
                                            </TableCell>
                                            <TableCell className="align-top py-5">
                                                {deal.duration_minutes ? (
                                                    <Badge variant="outline" className="font-medium text-gray-600 bg-gray-50 rounded-lg">
                                                        {deal.duration_minutes} min
                                                    </Badge>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell className="align-top py-5">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={deal.is_active}
                                                        onCheckedChange={() => handleToggleActive(deal)}
                                                        className="data-[state=checked]:bg-green-500"
                                                    />
                                                    <span className={`text-sm font-medium ${deal.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {deal.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right align-top py-5 pr-6">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                                                        onClick={() => handleEdit(deal)}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
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
                </div>
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
