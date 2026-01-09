"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Users, Sparkles, UserPlus, Trash2, Loader2, Mail, Phone as PhoneIcon, Check, Settings2, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { fetchShopStaff, createStaff, deleteStaff, toggleAvailability, resendInvite, assignServices, removeService } from "@/lib/api/staff"
import { fetchServices } from "@/lib/api/services"
import type { StaffMember } from "@/types/staff"
import type { Service } from "@/types/service"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
        <>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100/80">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                                Staff Management
                            </h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage your team members, permissions, and service assignments.</p>
                    </div>
                </div>

                <div className="grid xl:grid-cols-12 gap-8 items-start">
                    {/* Add Staff Form (Left Column) */}
                    <div className="xl:col-span-4">
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden sticky top-24">
                            <CardHeader className="bg-slate-50/50 px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3">
                                        <UserPlus className="w-6 h-6 text-white -rotate-3" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">Add Team Member</CardTitle>
                                        <CardDescription className="font-medium text-slate-500">Register a new staff member</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2.5">
                                    <Label htmlFor="staffName" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="staffName"
                                        placeholder="e.g. Sarah Smith"
                                        className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                        value={newStaffName}
                                        onChange={(e) => setNewStaffName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="staffEmail" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="staffEmail"
                                        type="email"
                                        placeholder="sarah@example.com"
                                        className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                        value={newStaffEmail}
                                        onChange={(e) => setNewStaffEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="staffPhone" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</Label>
                                    <Input
                                        id="staffPhone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                        value={newStaffPhone}
                                        onChange={(e) => setNewStaffPhone(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Languages Spoken</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-100 bg-slate-50/30 font-semibold justify-between px-4">
                                                <span className="truncate">
                                                    {selectedLanguages.length === 0 ? "Select languages" :
                                                        selectedLanguages.length === 1 ? selectedLanguages[0] :
                                                            `${selectedLanguages.length} selected`}
                                                </span>
                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 rounded-xl shadow-xl border-gray-100" align="start">
                                            {AVAILABLE_LANGUAGES.map((language) => (
                                                <DropdownMenuCheckboxItem
                                                    key={language}
                                                    checked={selectedLanguages.includes(language)}
                                                    onCheckedChange={() => toggleLanguage(language)}
                                                    className="rounded-lg my-0.5"
                                                >
                                                    {language}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {selectedLanguages.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                                            {selectedLanguages.map(lang => (
                                                <Badge key={lang} variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-600 border-none">
                                                    {lang}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="canBook" className="text-sm font-bold text-slate-900">Online Booking</Label>
                                        <p className="text-[11px] text-slate-500 font-medium">Allow online appointments?</p>
                                    </div>
                                    <Switch
                                        id="canBook"
                                        checked={canBookAppointments}
                                        onCheckedChange={setCanBookAppointments}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                </div>

                                <Button
                                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95"
                                    onClick={handleAddStaffMember}
                                    disabled={isSubmitting || !newStaffName.trim()}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
                    <div className="xl:col-span-8 space-y-6">
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 -rotate-3">
                                        <Users className="w-6 h-6 text-white rotate-3" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">Team Directory</CardTitle>
                                        <CardDescription className="font-medium text-slate-500">View and manage all staff members</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Team</p>
                                    </div>
                                ) : staffMembers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                                            <Users className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">No team members yet</h3>
                                        <p className="text-slate-500 font-medium max-w-sm mt-2">Add your first staff member using the form on the left to start taking bookings.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-none hover:bg-transparent">
                                                    <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Member</TableHead>
                                                    <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Services</TableHead>
                                                    <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {staffMembers.map((member) => (
                                                    <TableRow key={member.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                        <TableCell className="px-8 py-6 align-top">
                                                            <div>
                                                                <div className="flex items-center gap-3">
                                                                    <p className="text-base font-bold text-slate-900">{member.name}</p>
                                                                    {!member.invite_accepted_at ? (
                                                                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border-none bg-amber-50 text-amber-600">Pending</Badge>
                                                                    ) : (
                                                                        <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center">
                                                                            <Check className="w-3 h-3 text-emerald-600 stroke-[3px]" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="mt-2 space-y-1">
                                                                    {member.email ? (
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                                            <Mail className="w-3.5 h-3.5 text-slate-300" />
                                                                            <span className="truncate max-w-[200px]" title={member.email}>{member.email}</span>
                                                                        </div>
                                                                    ) : <span className="text-slate-400 italic text-xs">No email address</span>}
                                                                    {member.phone && (
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                                            <PhoneIcon className="w-3.5 h-3.5 text-slate-300" />
                                                                            <span>{member.phone}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-8 py-6 align-top">
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {(!member.assigned_services || member.assigned_services.length === 0) ? (
                                                                    <span className="text-xs font-bold text-slate-300 italic">No services assigned</span>
                                                                ) : (
                                                                    member.assigned_services.map((service) => (
                                                                        <Badge key={service.service_id} className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white text-indigo-600 border border-indigo-100 shadow-sm">
                                                                            {service.service_name}
                                                                        </Badge>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-8 py-6 align-top text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <div className="flex items-center p-1 bg-slate-50 rounded-xl border border-slate-100 mr-2">
                                                                    <Switch
                                                                        checked={member.is_active}
                                                                        onCheckedChange={() => handleToggleAvailability(member.id, member.is_active, member.name)}
                                                                        className="scale-75 data-[state=checked]:bg-indigo-600"
                                                                    />
                                                                </div>

                                                                <TooltipProvider>
                                                                    {!member.invite_accepted_at && (
                                                                        <Tooltip delayDuration={300}>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-9 w-9 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                                                                                    onClick={() => handleResendInvite(member.id, member.name, member.email)}
                                                                                >
                                                                                    <Mail className="w-4 h-4" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="bg-slate-900 text-white border-none text-[10px] font-bold uppercase tracking-widest">Resend Invite</TooltipContent>
                                                                        </Tooltip>
                                                                    )}

                                                                    <Tooltip delayDuration={300}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                                                                                onClick={() => handleAssignServicesClick(member)}
                                                                            >
                                                                                <Settings2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="bg-slate-900 text-white border-none text-[10px] font-bold uppercase tracking-widest">Services</TooltipContent>
                                                                    </Tooltip>

                                                                    <Tooltip delayDuration={300}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                                                                onClick={() => initiateDelete(member.id, member.name)}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="bg-slate-900 text-white border-none text-[10px] font-bold uppercase tracking-widest">Remove</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
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
                <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3">
                                <Settings2 className="w-5 h-5 text-white -rotate-3" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold">Services for {selectedStaffForService?.name}</DialogTitle>
                                <DialogDescription className="font-medium text-slate-500">
                                    Select which services this team member can perform.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="p-8">
                        {isLoadingServices ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Services</p>
                            </div>
                        ) : availableServices.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500 font-medium mb-6">No services assigned to the shop yet.</p>
                                <Link href={`/portal/${shopId}/services`} onClick={() => setIsServiceModalOpen(false)}>
                                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold uppercase tracking-wider text-xs">
                                        Go to Services
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {availableServices.map((service) => (
                                    <div
                                        key={service.id}
                                        className={cn(
                                            "flex items-start space-x-4 p-4 rounded-2xl border transition-all cursor-pointer group",
                                            selectedServiceIds.includes(service.id)
                                                ? "bg-indigo-50/50 border-indigo-200 shadow-sm"
                                                : "bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50/30"
                                        )}
                                        onClick={() => handleServiceToggle(service.id)}
                                    >
                                        <div className={cn(
                                            "mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                            selectedServiceIds.includes(service.id)
                                                ? "bg-indigo-600 border-indigo-600"
                                                : "border-slate-200 group-hover:border-indigo-300"
                                        )}>
                                            {selectedServiceIds.includes(service.id) && (
                                                <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className={cn(
                                                "font-bold text-sm",
                                                selectedServiceIds.includes(service.id) ? "text-indigo-900" : "text-slate-900"
                                            )}>
                                                {service.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">${service.price}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">{service.duration_minutes} min</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="bg-slate-50/80 px-8 py-6 gap-3 sm:gap-0">
                        <Button variant="ghost" className="rounded-xl font-bold uppercase tracking-wider text-xs text-slate-500 hover:text-slate-900" onClick={() => setIsServiceModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignServices}
                            disabled={isAssigningServices}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-6 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
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
        </>
    )
}
