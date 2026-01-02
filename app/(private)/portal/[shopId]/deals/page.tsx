"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Tag, Plus, Loader2, Trash2, Edit2 } from "lucide-react"
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
        <main className="min-h-screen bg-slate-50">
            <Header />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Deals & Offers</h1>
                            <p className="text-gray-600">Manage your packages and special offers</p>
                        </div>
                        <Link href={`/portal/${shopId}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
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
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead className="w-[300px]">Deal Name</TableHead>
                                            <TableHead>Included Items</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {deals.map((deal) => (
                                            <TableRow key={deal.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        {deal.image_url && (
                                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                                <Image
                                                                    src={deal.image_url}
                                                                    alt={deal.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-gray-900">{deal.name}</div>
                                                            {deal.description && (
                                                                <div className="text-xs text-gray-500 truncate max-w-[250px]">{deal.description}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {deal.included_items.slice(0, 3).map((item, idx) => (
                                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                {item}
                                                            </span>
                                                        ))}
                                                        {deal.included_items.length > 3 && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                                                                +{deal.included_items.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-gray-900">
                                                    ${deal.price}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={deal.is_active}
                                                            onCheckedChange={() => handleToggleActive(deal)}
                                                            className="data-[state=checked]:bg-green-500"
                                                        />
                                                        <span className={`text-xs ${deal.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                                                            {deal.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-400 hover:text-blue-600 mr-2"
                                                        onClick={() => handleEdit(deal)}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-400 hover:text-red-600"
                                                        onClick={() => handleDelete(deal.id)}
                                                        disabled={isDeleting === deal.id}
                                                    >
                                                        {isDeleting === deal.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
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
        </main>
    )
}
