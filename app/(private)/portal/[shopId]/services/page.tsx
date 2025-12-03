"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles, Scissors, Trash2, Loader2, Edit2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { createService, fetchServices, deleteService, updateService, toggleServiceActive } from "@/lib/api/services"
import type { Service } from "@/types/service"
import type { StaffMember } from "@/types/staff"
import { fetchShopStaff } from "@/lib/api/staff"
import { assignServices } from "@/lib/api/staff"
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

export default function ServicesManagementPage() {
    const params = useParams()
    const shopId = params.shopId as string
    const { toast } = useToast()
    const { getToken } = useAuth()
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
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
            setServices(data)
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
                setServices(prev => prev.map(s => s.id === editingService.id ? updatedService : s))
                toast({
                    title: "Success",
                    description: "Service updated successfully.",
                })
                setIsEditModalOpen(false)
            } else {
                const newService = await createService(payload, token)
                setServices(prev => [...prev, newService])
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

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
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

    const handleDeleteService = async (id: number) => {
        try {
            const token = await getToken()
            if (!token) return

            await deleteService(id, token)
            setServices(prev => prev.filter(s => s.id !== id))

            toast({
                title: "Service removed",
                description: "The service has been removed successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete service. Please try again.",
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
            setAvailableStaff(staff)
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

            for (const staffId of selectedStaffIds) {
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

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
                            <p className="text-gray-600">Manage your services and assign staff members</p>
                        </div>
                        <Link href={`/portal/${shopId}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Let AI Fill This In</h3>
                                <p className="text-sm text-gray-600">Save time by having our AI scan your website and automatically import your services, pricing, and durations.</p>
                            </div>
                        </div>
                        <Button className="bg-teal-400 hover:bg-teal-500 text-black/50 hover:text-black border-0">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Have AI Fill This In
                            <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Beta</span>
                        </Button>
                    </div>

                    {services.some(s => !s.assigned_staff || s.assigned_staff.length === 0) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <span className="text-yellow-600 font-bold">!</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Action Required: Unassigned Services</h3>
                                    <p className="text-sm text-gray-600">These services won't appear in your booking system until staff members are assigned.</p>
                                </div>
                            </div>
                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                                Go to Setup Wizard
                            </Button>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Scissors className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-bold text-gray-900">Add New Service</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="space-y-2">
                                <Label htmlFor="serviceName">Service Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="serviceName"
                                    placeholder="e.g. Haircut, Color, Massage"
                                    className="placeholder:text-gray-400"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (minutes) <span className="text-red-500">*</span></Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    placeholder="60"
                                    className="placeholder:text-gray-400"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="50.00"
                                    className="placeholder:text-gray-400"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                    <SelectTrigger>
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
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Brief description of the service..."
                                    className="placeholder:text-gray-400"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.name.trim() || !formData.duration || parseFloat(formData.duration) <= 0 || !formData.price || parseFloat(formData.price) <= 0}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Scissors className="w-4 h-4 mr-2" />
                                )}
                                {isSubmitting ? "Adding..." : "Add Service"}
                            </Button>
                        </div>
                    </div>

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
                                            value={formData.duration}
                                            onChange={(e) => handleInputChange('duration', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-price">Price ($)</Label>
                                        <Input
                                            id="edit-price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange('price', e.target.value)}
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
                    </Dialog>

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
                                        {availableStaff.map((staff) => (
                                            <div
                                                key={staff.id}
                                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleStaffToggle(staff.id)}
                                            >
                                                <Checkbox
                                                    checked={selectedStaffIds.includes(staff.id)}
                                                    onCheckedChange={() => handleStaffToggle(staff.id)}
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{staff.name}</p>
                                                    {staff.email && (
                                                        <p className="text-sm text-gray-500">{staff.email}</p>
                                                    )}
                                                </div>
                                                {staff.is_active ? (
                                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                        ))}
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
                    </Dialog>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-teal-500 px-6 py-4 flex items-center gap-2">
                            <Scissors className="w-5 h-5 text-white" />
                            <h2 className="text-lg font-bold text-white">Your Services</h2>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Loading services...</p>
                            </div>
                        ) : services.length === 0 ? (
                            <div className="text-center py-12">
                                <Scissors className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Yet</h3>
                                <p className="text-gray-600">Start by adding your first service offering</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-bold text-gray-900">Service</TableHead>
                                            <TableHead className="font-bold text-gray-900">Duration</TableHead>
                                            <TableHead className="font-bold text-gray-900">Price</TableHead>
                                            <TableHead className="font-bold text-gray-900">Description</TableHead>
                                            <TableHead className="font-bold text-gray-900"> Category</TableHead>
                                            <TableHead className="font-bold text-gray-900">Staff</TableHead>
                                            <TableHead className="text-right font-bold text-gray-900">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {services.map((service) => (
                                            <TableRow key={service.id} className={(!service.assigned_staff || service.assigned_staff.length === 0) ? "bg-yellow-50/50 hover:bg-yellow-50" : ""}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {(!service.assigned_staff || service.assigned_staff.length === 0) && (
                                                            <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold text-white">!</div>
                                                        )}
                                                        {service.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{service.duration_minutes} min</TableCell>
                                                <TableCell>${parseFloat(service.price).toFixed(2)}</TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {service.description || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {service.category || "General"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {(!service.assigned_staff || service.assigned_staff.length === 0) ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                                                            Not Assigned
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-1">
                                                            {service.assigned_staff.map((staff, index) => (
                                                                <span
                                                                    key={staff.staff_id}
                                                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                                                >
                                                                    {staff.staff_name}
                                                                    {staff.is_primary && (
                                                                        <span className="ml-1 text-[10px]">★</span>
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {(!service.assigned_staff || service.assigned_staff.length === 0) && (
                                                            <Button
                                                                size="sm"
                                                                className="bg-yellow-400 hover:bg-yellow-500 text-black border-0 text-xs font-semibold h-7"
                                                                onClick={() => handleAssignStaffClick(service)}
                                                            >
                                                                + Assign Now
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditClick(service)}
                                                            className="h-8 px-2 text-gray-500 hover:text-blue-600"
                                                        >
                                                            <Edit2 className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteService(service.id)}
                                                            className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 text-xs font-medium"
                                                        >
                                                            <Trash2 className="w-3 h-3  mr-1" />

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
            </div>
        </main>
    )
}
