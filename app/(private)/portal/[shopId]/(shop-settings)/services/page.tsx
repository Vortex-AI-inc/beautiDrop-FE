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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 underline decoration-blue-500/30 underline-offset-8">Services</h1>
                        <p className="text-muted-foreground mt-4">Manage your service menu and assign staff.</p>
                    </div>
                </div>

                {/* Notifications */}
                {services.some(s => !s.assigned_staff || s.assigned_staff.length === 0) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-yellow-900">Setup Required</h3>
                            <p className="text-sm text-yellow-700 mt-1">Some services are not assigned to any staff members. These won't appear in the booking system until assigned.</p>
                        </div>
                    </div>
                )}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Add Service Card (Left Column) */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-primary" />
                                    Add New Service
                                </CardTitle>
                                <CardDescription>Create a new service offering.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="serviceName">Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="serviceName"
                                        placeholder="e.g. Haircut"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Minutes <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            min="0"
                                            placeholder="60"
                                            value={formData.duration}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (parseFloat(val) < 0) return;
                                                handleInputChange('duration', val);
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="50.00"
                                            value={formData.price}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (parseFloat(val) < 0) return;
                                                handleInputChange('price', val);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((category) => (
                                                <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Short description..."
                                        className="h-20 resize-none"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !formData.name.trim() || !formData.duration || parseFloat(formData.duration) <= 0 || !formData.price || parseFloat(formData.price) <= 0}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-gray-100">
                                <div>
                                    <CardTitle>Service Menu</CardTitle>
                                    <CardDescription>Manage your existing services.</CardDescription>
                                </div>
                                {/* Could add Search/Filter here later */}
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                                        <p className="text-muted-foreground">Loading service menu...</p>
                                    </div>
                                ) : services.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Scissors className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Your menu is empty</h3>
                                        <p className="text-gray-500 max-w-sm mt-1">Add your first service using the form on the left to get started.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50/50">
                                                    <TableHead className="w-[30%]">Service</TableHead>
                                                    <TableHead>Details</TableHead>
                                                    <TableHead className="w-[30%]">Staff</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {services.map((service) => (
                                                    <TableRow key={service.id} className="hover:bg-gray-50/50">
                                                        <TableCell className="align-top">
                                                            <div>
                                                                <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                                    {service.name}
                                                                    {(!service.assigned_staff || service.assigned_staff.length === 0) && (
                                                                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                                                                    )}
                                                                </div>
                                                                <div className="mt-2 text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-md">
                                                                    {service.category || "General"}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="align-top whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">${parseFloat(service.price).toFixed(2)}</div>
                                                            <div className="text-xs text-gray-500">{service.duration_minutes} min</div>
                                                        </TableCell>
                                                        <TableCell className="align-top">
                                                            {(!service.assigned_staff || service.assigned_staff.length === 0) ? (
                                                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                                                                    Unassigned
                                                                </Badge>
                                                            ) : (
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {service.assigned_staff.map((staff) => (
                                                                        <Badge
                                                                            key={staff.staff_id}
                                                                            variant="secondary"
                                                                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 gap-1 pr-1 pl-2 font-normal"
                                                                        >
                                                                            {staff.staff_name}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    initiateRemoveStaffFromService(staff.staff_id, service.id, staff.staff_name)
                                                                                }}
                                                                                className="ml-0.5 rounded-full p-0.5 hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                                                                            >
                                                                                <X className="w-3 h-3" />
                                                                            </button>
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="align-top text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    size="sm"
                                                                    variant={(!service.assigned_staff || service.assigned_staff.length === 0) ? "default" : "outline"}
                                                                    className={(!service.assigned_staff || service.assigned_staff.length === 0)
                                                                        ? "h-8 bg-black hover:bg-gray-800 text-white shadow-sm"
                                                                        : "h-8 border-dashed text-gray-500 hover:text-primary"}
                                                                    onClick={() => handleAssignStaffClick(service)}
                                                                >
                                                                    <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                                                                    Assign
                                                                </Button>
                                                                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 text-gray-400 hover:text-blue-600"
                                                                    onClick={() => handleEditClick(service)}
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleDeleteService(service.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
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
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                        <DialogDescription>
                            Make changes to your service here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Service Name</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-duration">Duration (min)</Label>
                                <Input
                                    id="edit-duration"
                                    type="number"
                                    min="0"
                                    value={formData.duration}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (parseFloat(val) < 0) return;
                                        handleInputChange('duration', val);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price ($)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (parseFloat(val) < 0) return;
                                        handleInputChange('price', val);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                    <SelectTrigger id="edit-category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white">
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >

            {/* Staff Assignment Modal */}
            <Dialog open={isStaffModalOpen} onOpenChange={setIsStaffModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Assign Staff to {selectedServiceForStaff?.name}</DialogTitle>
                        <DialogDescription>
                            Select staff members who can perform this service.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {isLoadingStaff ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                            </div>
                        ) : availableStaff.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No staff members available.</p>
                                <Link href={`/portal/${shopId}/staff`}>
                                    <Button variant="outline" size="sm">
                                        Add Staff Members
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                {availableStaff.map((staff) => {
                                    const isAlreadyAssigned = selectedServiceForStaff?.assigned_staff?.some(s => s.staff_id === staff.id)

                                    return (
                                        <div
                                            key={staff.id}
                                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors border border-transparent ${isAlreadyAssigned
                                                ? 'bg-gray-50 opacity-60 cursor-not-allowed'
                                                : 'hover:bg-gray-50 hover:border-gray-100 cursor-pointer'
                                                }`}
                                            onClick={() => !isAlreadyAssigned && handleStaffToggle(staff.id)}
                                        >
                                            <Checkbox
                                                checked={selectedStaffIds.includes(staff.id)}
                                                className="pointer-events-none"
                                                disabled={isAlreadyAssigned}
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{staff.name}</p>
                                                {staff.email && (
                                                    <p className="text-sm text-gray-500">{staff.email}</p>
                                                )}
                                            </div>
                                            {staff.is_active ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Inactive</Badge>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStaffModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignStaff}
                            disabled={isAssigningStaff || selectedStaffIds.length === 0}
                            className="bg-blue-600 text-white"
                        >
                            {isAssigningStaff ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Assigning...
                                </>
                            ) : (
                                `Assign ${selectedStaffIds.length} Staff`
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >

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
