"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Users, Sparkles, UserPlus, Trash2, Loader2, Mail, Phone as PhoneIcon, Check, Settings2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { fetchShopStaff, createStaff, deleteStaff, toggleAvailability, resendInvite, assignServices, removeService } from "@/lib/api/staff"
import { fetchServices } from "@/lib/api/services"
import type { StaffMember } from "@/types/staff"
import type { Service } from "@/types/service"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StaffManagementPage() {
    const params = useParams()
    const shopId = params.shopId as string
    const { toast } = useToast()
    const { getToken } = useAuth()
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [newStaffName, setNewStaffName] = useState("")
    const [newStaffEmail, setNewStaffEmail] = useState("")
    const [newStaffPhone, setNewStaffPhone] = useState("")
    const [canBookAppointments, setCanBookAppointments] = useState(true)
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"])
    const [staffToDelete, setStaffToDelete] = useState<{ id: string; name: string } | null>(null)

    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
    const [selectedStaffForService, setSelectedStaffForService] = useState<StaffMember | null>(null)
    const [availableServices, setAvailableServices] = useState<Service[]>([])
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
    const [isLoadingServices, setIsLoadingServices] = useState(false)
    const [isAssigningServices, setIsAssigningServices] = useState(false)
    const [serviceRemovalData, setServiceRemovalData] = useState<{ staffId: string, serviceId: string, serviceName: string } | null>(null)

    const AVAILABLE_LANGUAGES = [
        "English",
        "Spanish",
        "French",
        "Portuguese",
        "Italian",
        "German",
    ]

    const fetchStaff = async () => {
        try {
            const token = await getToken()
            if (!token) return
            const data = await fetchShopStaff(shopId, token)
            setStaffMembers(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load staff members.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStaff()
    }, [shopId, getToken])

    const toggleLanguage = (language: string) => {
        setSelectedLanguages(prev => {
            if (prev.includes(language)) {
                if (prev.length === 1) return prev
                return prev.filter(l => l !== language)
            } else {
                return [...prev, language]
            }
        })
    }

    const handleAddStaffMember = async () => {
        if (!newStaffName.trim()) {
            toast({
                title: "Error",
                description: "Please enter a staff member name.",
                variant: "destructive"
            })
            return
        }

        setIsSubmitting(true)

        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token")

            await createStaff({
                shop_id: shopId,
                name: newStaffName,
                email: newStaffEmail,
                phone: newStaffPhone,
                is_active: canBookAppointments,
                send_invite: true,
            }, token)

            toast({
                title: "Success",
                description: `${newStaffName} has been added to your team.`,
            })

            setNewStaffName("")
            setNewStaffEmail("")
            setNewStaffPhone("")
            setCanBookAppointments(true)
            setSelectedLanguages(["English"])
            fetchStaff()

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add staff member. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const initiateDelete = (id: string, name: string) => {
        setStaffToDelete({ id, name })
    }

    const handleDeleteStaffMember = async () => {
        if (!staffToDelete) return
        const { id, name } = staffToDelete

        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token")

            await deleteStaff(id, token)

            setStaffMembers(prev => prev.filter(m => m.id !== id))

            toast({
                title: "Staff member removed",
                description: `${name} has been removed from your team.`,
            })
            setStaffToDelete(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to remove staff member.",
                variant: "destructive"
            })
        }
    }

    const handleToggleAvailability = async (id: string, currentStatus: boolean, name: string) => {
        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token")

            const updatedStaff = await toggleAvailability(id, token)

            setStaffMembers(prev => prev.map(m => m.id === id ? updatedStaff : m))

            toast({
                title: "Availability updated",
                description: `${name} is now ${updatedStaff.is_active ? 'available' : 'unavailable'} for bookings.`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update availability.",
                variant: "destructive"
            })
        }
    }

    const handleResendInvite = async (id: string, name: string, email?: string) => {
        if (!email) {
            toast({
                title: "Error",
                description: "This staff member has no email address.",
                variant: "destructive"
            })
            return
        }

        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token")

            await resendInvite(id, email, token)

            toast({
                title: "Invite Sent",
                description: `Invitation re-sent to ${name}.`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to resend invitation.",
                variant: "destructive"
            })
        }
    }

    const handleAssignServicesClick = async (staff: StaffMember) => {
        setSelectedStaffForService(staff)
        setIsServiceModalOpen(true)
        setIsLoadingServices(true)


        try {
            const token = await getToken()
            if (!token) return

            const servicesResponse = await fetchServices(shopId, token)
            const servicesData = servicesResponse.results
            setAvailableServices(servicesData)

            const preSelected = servicesData
                .filter(service => service.assigned_staff?.some(s => s.staff_id === staff.id))
                .map(service => service.id)

            setSelectedServiceIds(preSelected)

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load services.",
                variant: "destructive"
            })
        } finally {
            setIsLoadingServices(false)
        }
    }

    const handleServiceToggle = (serviceId: string) => {
        setSelectedServiceIds(prev => {
            if (prev.includes(serviceId)) {
                return prev.filter(id => id !== serviceId)
            } else {
                return [...prev, serviceId]
            }
        })
    }

    const handleAssignServices = async () => {
        if (!selectedStaffForService) return

        setIsAssigningServices(true)

        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token")
            await assignServices(selectedStaffForService.id, { service_ids: selectedServiceIds }, token)

            toast({
                title: "Services assigned",
                description: `Updated services for ${selectedStaffForService.name}.`,
            })

            setIsServiceModalOpen(false)
            setSelectedStaffForService(null)
            setSelectedServiceIds([])
            fetchStaff()

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to assign services. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsAssigningServices(false)
        }
    }

    const initiateRemoveService = (staffId: string, serviceId: string, serviceName: string) => {
        setServiceRemovalData({ staffId, serviceId, serviceName })
    }

    const handleRemoveService = async () => {
        if (!serviceRemovalData) return
        const { staffId, serviceId } = serviceRemovalData

        try {
            const token = await getToken()
            if (!token) return

            await removeService(staffId, serviceId, token)

            toast({
                title: "Service removed",
                description: "Service removed from this staff member.",
            })

            fetchStaff()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove service.",
                variant: "destructive"
            })
        } finally {
            setServiceRemovalData(null)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50/50">
            <Header />

            <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Link href={`/portal/${shopId}`} className="hover:text-foreground transition-colors">Dashboard</Link>
                            <span>/</span>
                            <span className="text-foreground font-medium">Staff</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Staff Management</h1>
                        <p className="text-muted-foreground">Manage your team members and permissions.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Add Staff Form (Left Column) */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-32">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-primary" />
                                    Add Team Member
                                </CardTitle>
                                <CardDescription>Register a new staff member.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="staffName">Full Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="staffName"
                                        placeholder="e.g. Sarah Smith"
                                        value={newStaffName}
                                        onChange={(e) => setNewStaffName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="staffEmail">Email Address <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="staffEmail"
                                        type="email"
                                        placeholder="sarah@example.com"
                                        value={newStaffEmail}
                                        onChange={(e) => setNewStaffEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="staffPhone">Phone Number</Label>
                                    <Input
                                        id="staffPhone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={newStaffPhone}
                                        onChange={(e) => setNewStaffPhone(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Languages Spoken</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue>
                                                <span className="text-sm truncate">
                                                    {selectedLanguages.length === 0 ? "Select languages" :
                                                        selectedLanguages.length === 1 ? selectedLanguages[0] :
                                                            `${selectedLanguages.length} selected`}
                                                </span>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AVAILABLE_LANGUAGES.map((language) => (
                                                <div
                                                    key={language}
                                                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        toggleLanguage(language)
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={selectedLanguages.includes(language)}
                                                        onCheckedChange={() => toggleLanguage(language)}
                                                        className="pointer-events-none"
                                                    />
                                                    <span className="text-sm">{language}</span>
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedLanguages.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {selectedLanguages.map(lang => (
                                                <Badge key={lang} variant="secondary" className="text-[10px] px-1.5 py-0">
                                                    {lang}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="canBook" className="text-sm font-medium">Online Booking</Label>
                                        <p className="text-xs text-muted-foreground">Allow online appointments?</p>
                                    </div>
                                    <Switch
                                        id="canBook"
                                        checked={canBookAppointments}
                                        onCheckedChange={setCanBookAppointments}
                                    />
                                </div>

                                <Button
                                    className="w-full mt-4"
                                    onClick={handleAddStaffMember}
                                    disabled={isSubmitting || !newStaffName.trim()}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Adding Member...
                                        </>
                                    ) : (
                                        "Add Staff Member"
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Staff List (Right Column) */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <CardTitle>Team Directory</CardTitle>
                                <CardDescription>View and manage all staff members.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                                        <p className="text-muted-foreground">Loading team...</p>
                                    </div>
                                ) : staffMembers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Users className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">No team members yet</h3>
                                        <p className="text-gray-500 max-w-sm mt-1">Add your first staff member using the form on the left.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50/50">
                                                    <TableHead className="w-[30%]">Member</TableHead>
                                                    <TableHead className="w-[45%]">Services</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {staffMembers.map((member) => (
                                                    <TableRow key={member.id} className="hover:bg-gray-50/50">
                                                        <TableCell className="align-top">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-semibold text-gray-900">{member.name}</p>
                                                                    {!member.invite_accepted_at ? (
                                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-yellow-200 bg-yellow-50 text-yellow-700 font-normal">Pending</Badge>
                                                                    ) : (
                                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-green-200 bg-green-50 text-green-700 font-normal gap-1">
                                                                            <Check className="w-2.5 h-2.5" />
                                                                        </Badge>
                                                                    )}
                                                                </div>

                                                                <div className="mt-1 space-y-0.5">
                                                                    {member.email ? (
                                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                                            <Mail className="w-3 h-3 text-gray-400" />
                                                                            <span className="truncate max-w-[180px]" title={member.email}>{member.email}</span>
                                                                        </div>
                                                                    ) : <span className="text-gray-400 italic text-xs">No email</span>}
                                                                    {member.phone && (
                                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                                            <PhoneIcon className="w-3 h-3 text-gray-400" />
                                                                            <span>{member.phone}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="align-top">
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {(!member.assigned_services || member.assigned_services.length === 0) ? (
                                                                    <Badge variant="outline" className="text-xs font-normal text-gray-400 border-dashed border-gray-300">
                                                                        No active services
                                                                    </Badge>
                                                                ) : (
                                                                    member.assigned_services.map((service) => (
                                                                        <Badge key={service.service_id} variant="secondary" className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 font-normal">
                                                                            {service.service_name}
                                                                        </Badge>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="align-top text-right">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <div className="flex items-center gap-2 mr-2">
                                                                    <Switch
                                                                        checked={member.is_active}
                                                                        onCheckedChange={() => handleToggleAvailability(member.id, member.is_active, member.name)}
                                                                        className="scale-75 origin-right"
                                                                    />
                                                                </div>

                                                                {!member.invite_accepted_at && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                                                        onClick={() => handleResendInvite(member.id, member.name, member.email)}
                                                                        title="Resend Invite"
                                                                    >
                                                                        <Mail className="w-4 h-4" />
                                                                    </Button>
                                                                )}

                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-gray-400 hover:text-blue-600"
                                                                    onClick={() => handleAssignServicesClick(member)}
                                                                    title="Manage Services"
                                                                >
                                                                    <Settings2 className="w-4 h-4" />
                                                                </Button>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => initiateDelete(member.id, member.name)}
                                                                    title="Remove Staff"
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
                        </Card>
                    </div>
                </div>
            </div>

            {/* Assign Services Modal - Cleaned Up */}
            <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Services for {selectedStaffForService?.name}</DialogTitle>
                        <DialogDescription>
                            Select which services this team member can perform.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {isLoadingServices ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            </div>
                        ) : availableServices.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No services assigned to the shop yet.</p>
                                <Link href={`/portal/${shopId}/services`} onClick={() => setIsServiceModalOpen(false)}>
                                    <Button variant="outline" size="sm">
                                        Go to Services
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                {availableServices.map((service) => (
                                    <div
                                        key={service.id}
                                        className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedServiceIds.includes(service.id)
                                            ? "bg-blue-50 border-blue-200 shadow-sm"
                                            : "bg-white border-transparent hover:bg-gray-50"
                                            }`}
                                        onClick={() => handleServiceToggle(service.id)}
                                    >
                                        <Checkbox
                                            checked={selectedServiceIds.includes(service.id)}
                                            className="mt-1 pointer-events-none data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <div className="flex-1">
                                            <p className={`font-medium text-sm ${selectedServiceIds.includes(service.id) ? "text-blue-900" : "text-gray-900"}`}>
                                                {service.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">${service.price} • {service.duration_minutes} min</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignServices}
                            disabled={isAssigningServices}
                            className="bg-blue-600 text-white"
                        >
                            {isAssigningServices ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!staffToDelete} onOpenChange={() => setStaffToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove {staffToDelete?.name}? This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteStaffMember} className="bg-red-600 hover:bg-red-700">
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    )
}
