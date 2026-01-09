"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles, Scissors, Trash2, Loader2, Edit2, UserPlus, Check, X, AlertTriangle, AlertCircle, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { createService, fetchServices, deleteService, updateService, toggleServiceActive } from "@/lib/api/services"
import type { Service } from "@/types/service"
import type { StaffMember } from "@/types/staff"
import { fetchShopStaff } from "@/lib/api/staff"
import { assignServices, removeService } from "@/lib/api/staff"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ServicesManagementPage() {
    const params = useParams()
    const shopId = params.shopId as string
    const { toast } = useToast()
    const { getToken } = useAuth()
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [nextPage, setNextPage] = useState<string | null>(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        duration: "",
        price: "",
        category: "",
        description: ""
    })

    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
    const [selectedServiceForStaff, setSelectedServiceForStaff] = useState<Service | null>(null)
    const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([])
    const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([])
    const [isLoadingStaff, setIsLoadingStaff] = useState(false)
    const [isAssigningStaff, setIsAssigningStaff] = useState(false)
    const [staffRemovalData, setStaffRemovalData] = useState<{ staffId: string, serviceId: string, staffName: string } | null>(null)

    const CATEGORIES = [
        "Haircut",
        "Color",
        "Styling",
        "Treatment",
        "Nails",
        "Facial",
        "Massage",
        "Waxing",
        "Other"
    ]

    useEffect(() => {
        loadServices()
    }, [shopId])

    const loadServices = async () => {
        try {
            setIsLoading(true)
            const token = await getToken()
            if (!token) return
            const data = await fetchServices(shopId, token)
            setNextPage(data.next)

            const safeData = data.results.map((s: any) => ({
                ...s,
                id: s.id || s._id || s.service_id
            }))
            setServices(safeData)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load services. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const loadMoreServices = async () => {
        if (!nextPage || isLoadingMore) return

        try {
            setIsLoadingMore(true)
            const token = await getToken()
            if (!token) return

            const url = new URL(nextPage)
            const pageParam = url.searchParams.get('page')
            const page = pageParam ? parseInt(pageParam) : 1

            const data = await fetchServices(shopId, token, page)

            setNextPage(data.next)

            const safeData = data.results.map((s: any) => ({
                ...s,
                id: s.id || s._id || s.service_id
            }))
            setServices(prev => [...prev, ...safeData])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load more services.",
                variant: "destructive"
            })
        } finally {
            setIsLoadingMore(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        if (isSubmitting) return

        if (!formData.name.trim()) {
            toast({
                title: "Error",
                description: "Please enter a service name.",
                variant: "destructive"
            })
            return
        }

        if (!formData.duration || parseInt(formData.duration) <= 0) {
            toast({
                title: "Error",
                description: "Please enter a valid duration.",
                variant: "destructive"
            })
            return
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast({
                title: "Error",
                description: "Please enter a valid price.",
                variant: "destructive"
            })
            return
        }

        try {
            setIsSubmitting(true)
            const token = await getToken()
            if (!token) {
                toast({
                    title: "Error",
                    description: "You must be logged in to manage services.",
                    variant: "destructive"
                })
                return
            }

            const payload = {
                shop_id: shopId,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                duration_minutes: parseInt(formData.duration),
                category: formData.category || "General",
                is_active: true
            }

            if (editingService) {
                const updatedService = await updateService(editingService.id, payload, token)
                const safeUpdatedService = {
                    ...updatedService,
                    id: updatedService.id || (updatedService as any)._id || (updatedService as any).service_id || editingService.id,
                    assigned_staff: updatedService.assigned_staff || editingService.assigned_staff
                }
                setServices(prev => prev.map(s => s.id === editingService.id ? safeUpdatedService : s))
                toast({
                    title: "Success",
                    description: "Service updated successfully.",
                })
                setIsEditModalOpen(false)
            } else {
                const newService = await createService(payload, token)
                const safeNewService = {
                    ...newService,
                    id: newService.id || (newService as any)._id || (newService as any).service_id
                }
                setServices(prev => [...prev, safeNewService])
                toast({
                    title: "Success",
                    description: `${newService.name} has been added to your services.`,
                })
                setFormData({
                    name: "",
                    duration: "",
                    price: "",
                    category: "",
                    description: ""
                })
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save service. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditClick = (service: Service) => {
        setEditingService(service)
        setFormData({
            name: service.name,
            duration: service.duration_minutes.toString(),
            price: service.price,
            category: "",
            description: service.description
        })
        setIsEditModalOpen(true)
    }

    const handleCreateClick = () => {
        setEditingService(null)
        setFormData({
            name: "",
            duration: "",
            price: "",
            category: "",
            description: ""
        })
    }

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const token = await getToken()
            if (!token) return

            setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s))

            await toggleServiceActive(id, token)

            toast({
                title: "Status updated",
                description: `Service is now ${!currentStatus ? 'active' : 'inactive'}.`,
            })
        } catch (error) {
            setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: currentStatus } : s))
            toast({
                title: "Error",
                description: "Failed to update status. Please try again.",
                variant: "destructive"
            })
        }
    }

    const handleDeleteService = async (id: string) => {
        try {
            const token = await getToken()
            if (!token) return

            await deleteService(id, token)
            setServices(prev => prev.filter(s => s.id !== id))

            toast({
                title: "Service removed",
                description: "The service has been removed successfully.",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete service. Please try again.",
                variant: "destructive"
            })
        }
    }

    const handleAssignStaffClick = async (service: Service) => {
        setSelectedServiceForStaff(service)
        setIsStaffModalOpen(true)
        setIsLoadingStaff(true)

        const assignedStaffIds = service.assigned_staff?.map(s => s.staff_id) || []
        setSelectedStaffIds(assignedStaffIds)

        try {
            const token = await getToken()
            if (!token) return

            const staff = await fetchShopStaff(shopId, token)
            const acceptedActiveStaff = staff.filter(s => !!s.invite_accepted_at && s.is_active)
            setAvailableStaff(acceptedActiveStaff)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load staff members.",
                variant: "destructive"
            })
        } finally {
            setIsLoadingStaff(false)
        }
    }

    const handleStaffToggle = (staffId: string) => {
        setSelectedStaffIds(prev => {
            if (prev.includes(staffId)) {
                return prev.filter(id => id !== staffId)
            } else {
                return [...prev, staffId]
            }
        })
    }

    const handleAssignStaff = async () => {
        if (!selectedServiceForStaff) return

        setIsAssigningStaff(true)

        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token")

            const serviceIds = [selectedServiceForStaff.id]

            const newAssignments = selectedStaffIds.filter(id =>
                !selectedServiceForStaff.assigned_staff?.some(as => as.staff_id === id)
            )

            for (const staffId of newAssignments) {
                await assignServices(staffId, { service_ids: serviceIds }, token)
            }

            await loadServices()

            toast({
                title: "Staff assigned",
                description: `${selectedStaffIds.length} staff member(s) assigned to ${selectedServiceForStaff.name}.`,
            })

            setIsStaffModalOpen(false)
            setSelectedServiceForStaff(null)
            setSelectedStaffIds([])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to assign staff. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsAssigningStaff(false)
        }
    }

    const initiateRemoveStaffFromService = (staffId: string, serviceId: string, staffName: string) => {
        setStaffRemovalData({ staffId, serviceId, staffName })
    }

    const executeRemoveStaffFromService = async () => {
        if (!staffRemovalData) return
        const { staffId, serviceId } = staffRemovalData

        try {
            const token = await getToken()
            if (!token) return

            await removeService(staffId, serviceId, token)

            toast({
                title: "Staff removed",
                description: "Staff member removed from this service.",
            })

            loadServices()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove staff from service.",
                variant: "destructive"
            })
        } finally {
            setStaffRemovalData(null)
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
                                Services
                            </h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage your service menu, pricing, and staff assignments.</p>
                    </div>
                </div>

                {/* Notifications */}
                {services.some(s => !s.assigned_staff || s.assigned_staff.length === 0) && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-6 flex items-start gap-4 shadow-sm">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-indigo-100">
                            <AlertCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Setup Required</h3>
                            <p className="text-sm text-slate-500 mt-1 font-medium leading-relaxed">Some services are not assigned to any staff members. These won't appear in the booking system until assigned.</p>
                        </div>
                    </div>
                )}
                <div className="grid xl:grid-cols-12 gap-8 items-start">
                    {/* Add Service Card (Left Column) */}
                    <div className="xl:col-span-4">
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden sticky top-24">
                            <CardHeader className="bg-slate-50/50 px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3">
                                        <Plus className="w-6 h-6 text-white -rotate-3" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">Add New Service</CardTitle>
                                        <CardDescription className="font-medium text-slate-500">Create a new service offering</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2.5">
                                    <Label htmlFor="serviceName" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="serviceName"
                                        placeholder="e.g. Haircut"
                                        className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <Label htmlFor="duration" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Minutes <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            min="0"
                                            placeholder="60"
                                            className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                            value={formData.duration}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (parseFloat(val) < 0) return;
                                                handleInputChange('duration', val);
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Price ($) <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="50.00"
                                            className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                            value={formData.price}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (parseFloat(val) < 0) return;
                                                handleInputChange('price', val);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Category</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                        <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-xl border-gray-100">
                                            {CATEGORIES.map((category) => (
                                                <SelectItem key={category} value={category} className="rounded-lg my-0.5">{category}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Short description..."
                                        className="h-28 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold resize-none p-4"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                    />
                                </div>
                                <Button
                                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !formData.name.trim() || !formData.duration || parseFloat(formData.duration) <= 0 || !formData.price || parseFloat(formData.price) <= 0}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Adding Service...
                                        </>
                                    ) : (
                                        "Add Service"
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Services List (Right Column) */}
                    <div className="xl:col-span-8 space-y-6">
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 -rotate-3">
                                        <Scissors className="w-6 h-6 text-white rotate-3" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">Service Menu</CardTitle>
                                        <CardDescription className="font-medium text-slate-500">Manage your existing services</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Updating Menu</p>
                                    </div>
                                ) : services.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                                            <Scissors className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Your menu is empty</h3>
                                        <p className="text-slate-500 font-medium max-w-sm mt-2">Add your first service using the form on the left to get started.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-none hover:bg-transparent">
                                                    <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 w-[30%]">Service</TableHead>
                                                    <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Details</TableHead>
                                                    <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 w-[30%]">Staff</TableHead>
                                                    <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {services.map((service) => (
                                                    <TableRow key={service.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                        <TableCell className="px-8 py-6 align-top">
                                                            <div>
                                                                <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                                                                    {service.name}
                                                                    {(!service.assigned_staff || service.assigned_staff.length === 0) && (
                                                                        <div className="w-5 h-5 bg-amber-50 rounded-full flex items-center justify-center">
                                                                            <AlertCircle className="w-3 h-3 text-amber-600 stroke-[3px]" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded-lg">
                                                                    {service.category || "General"}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-8 py-6 align-top whitespace-nowrap">
                                                            <div className="text-base font-black text-slate-900 tracking-tight">${parseFloat(service.price).toFixed(2)}</div>
                                                            <div className="text-xs font-medium text-slate-500 mt-0.5">{service.duration_minutes} min duration</div>
                                                        </TableCell>
                                                        <TableCell className="px-8 py-6 align-top">
                                                            {(!service.assigned_staff || service.assigned_staff.length === 0) ? (
                                                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider px-2 py-1 border-none bg-amber-50 text-amber-600">
                                                                    Unassigned
                                                                </Badge>
                                                            ) : (
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {service.assigned_staff.map((staff) => (
                                                                        <Badge
                                                                            key={staff.staff_id}
                                                                            className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white text-slate-700 border border-slate-100 shadow-sm gap-1 pr-1 pl-2"
                                                                        >
                                                                            {staff.staff_name}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    initiateRemoveStaffFromService(staff.staff_id, service.id, staff.staff_name)
                                                                                }}
                                                                                className="ml-0.5 rounded-md p-1 hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-colors"
                                                                            >
                                                                                <X className="w-2.5 h-2.5 stroke-[4px]" />
                                                                            </button>
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-8 py-6 align-top text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "h-9 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 transition-all",
                                                                        (!service.assigned_staff || service.assigned_staff.length === 0)
                                                                            ? "bg-slate-900 hover:bg-slate-800 text-white border-none shadow-md"
                                                                            : "border-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-white"
                                                                    )}
                                                                    onClick={() => handleAssignStaffClick(service)}
                                                                >
                                                                    <UserPlus className="w-3.5 h-3.5 mr-2" />
                                                                    Assign
                                                                </Button>

                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl"
                                                                        onClick={() => handleEditClick(service)}
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                                                        onClick={() => handleDeleteService(service.id)}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                            {nextPage && (
                                <div className="p-4 border-t flex justify-center">
                                    <Button variant="outline" size="sm" onClick={loadMoreServices} disabled={isLoadingMore}>
                                        {isLoadingMore ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Load More
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div >

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3">
                                <Edit2 className="w-5 h-5 text-white -rotate-3" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold">Edit Service</DialogTitle>
                                <DialogDescription className="font-medium text-slate-500">
                                    Make changes to your service here. Click save when you're done.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="edit-name" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Service Name</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="edit-duration" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Duration (min)</Label>
                                <Input
                                    id="edit-duration"
                                    type="number"
                                    min="0"
                                    value={formData.duration}
                                    className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (parseFloat(val) < 0) return;
                                        handleInputChange('duration', val);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="edit-price" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Price ($)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (parseFloat(val) < 0) return;
                                        handleInputChange('price', val);
                                    }}
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="edit-category" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                    <SelectTrigger id="edit-category" className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl shadow-xl border-gray-100">
                                        {CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category} className="rounded-lg my-0.5">
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <Label htmlFor="edit-description" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                className="h-28 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold resize-none p-4"
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="bg-slate-50/80 px-8 py-6 gap-3 sm:gap-0">
                        <Button variant="ghost" className="rounded-xl font-bold uppercase tracking-wider text-xs text-slate-500 hover:text-slate-900" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-6 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >

            {/* Staff Assignment Modal */}
            <Dialog open={isStaffModalOpen} onOpenChange={setIsStaffModalOpen}>
                <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden text-left">
                    <DialogHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3">
                                <UserPlus className="w-5 h-5 text-white -rotate-3" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold">Assign Staff to {selectedServiceForStaff?.name}</DialogTitle>
                                <DialogDescription className="font-medium text-slate-500 text-left">
                                    Select staff members who can perform this service.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="p-8">
                        {isLoadingStaff ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Team</p>
                            </div>
                        ) : availableStaff.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500 font-medium mb-6">No staff members available.</p>
                                <Link href={`/portal/${shopId}/staff`}>
                                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold uppercase tracking-wider text-xs">
                                        Add Staff Members
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {availableStaff.map((staff) => {
                                    const isAlreadyAssigned = selectedServiceForStaff?.assigned_staff?.some(s => s.staff_id === staff.id)

                                    return (
                                        <div
                                            key={staff.id}
                                            className={cn(
                                                "flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer group",
                                                selectedStaffIds.includes(staff.id)
                                                    ? "bg-indigo-50/50 border-indigo-200 shadow-sm"
                                                    : "bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50/30",
                                                isAlreadyAssigned && "opacity-60 cursor-not-allowed"
                                            )}
                                            onClick={() => !isAlreadyAssigned && handleStaffToggle(staff.id)}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                                                selectedStaffIds.includes(staff.id)
                                                    ? "bg-indigo-600 border-indigo-600"
                                                    : "border-slate-200 group-hover:border-indigo-300"
                                            )}>
                                                {selectedStaffIds.includes(staff.id) && (
                                                    <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "font-bold text-sm truncate",
                                                    selectedStaffIds.includes(staff.id) ? "text-indigo-900" : "text-slate-900"
                                                )}>
                                                    {staff.name}
                                                </p>
                                                {isAlreadyAssigned && (
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Fixed Assigned</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="bg-slate-50/80 px-8 py-6 gap-3 sm:gap-0">
                        <Button variant="ghost" className="rounded-xl font-bold uppercase tracking-wider text-xs text-slate-500 hover:text-slate-900" onClick={() => setIsStaffModalOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleAssignStaff}
                            disabled={isAssigningStaff}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-6 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                        >
                            {isAssigningStaff ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Update Assignments"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog */}
            <AlertDialog open={!!staffRemovalData} onOpenChange={() => setStaffRemovalData(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Staff from Service?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove {staffRemovalData?.staffName} from this service?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={executeRemoveStaffFromService} className="bg-red-600 hover:bg-red-700">
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >
        </>
    )
}
