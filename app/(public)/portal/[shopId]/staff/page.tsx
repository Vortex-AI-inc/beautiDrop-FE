"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Users, Sparkles, UserPlus, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { fetchShopStaff, createStaff, deleteStaff, toggleAvailability } from "@/lib/api/staff"
import type { StaffMember } from "@/types/staff"
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

export default function StaffManagementPage() {
    const params = useParams()
    const shopId = params.shopId as string
    const { toast } = useToast()
    const { getToken } = useAuth()
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [newStaffName, setNewStaffName] = useState("")
    const [canBookAppointments, setCanBookAppointments] = useState(true)
    // Note: Languages are not currently supported by the backend API, keeping UI for future use
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"])

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
            console.error("Failed to fetch staff:", error)
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
                // Don't allow removing all languages
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
                is_active: canBookAppointments,
                // languages: selectedLanguages // API doesn't support this yet
            }, token)

            toast({
                title: "Success",
                description: `${newStaffName} has been added to your team.`,
            })

            // Reset form and refresh list
            setNewStaffName("")
            setCanBookAppointments(true)
            setSelectedLanguages(["English"])
            fetchStaff()

        } catch (error) {
            console.error("Failed to add staff:", error)
            toast({
                title: "Error",
                description: "Failed to add staff member. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteStaffMember = async (id: string, name: string) => {
        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token")

            await deleteStaff(id, token)

            setStaffMembers(prev => prev.filter(m => m.id !== id))

            toast({
                title: "Staff member removed",
                description: `${name} has been removed from your team.`,
            })
        } catch (error) {
            console.error("Failed to delete staff:", error)
            toast({
                title: "Error",
                description: "Failed to remove staff member.",
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
            console.error("Failed to toggle availability:", error)
            toast({
                title: "Error",
                description: "Failed to update availability.",
                variant: "destructive"
            })
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                            <p className="text-gray-600">Manage your team members and their booking permissions</p>
                        </div>
                        <Link href={`/portal/${shopId}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                    </div>

                    {/* AI Auto-Fill Banner */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Let AI Fill This In</h3>
                                <p className="text-sm text-gray-600">Save time by having our AI scan your website and automatically import your team members and their information.</p>
                            </div>
                        </div>
                        <Button className="bg-teal-400 hover:bg-teal-500 text-black/50 hover:text-black border-0">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Have AI Fill This In
                            <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Beta</span>
                        </Button>
                    </div>

                    {/* Add New Staff Member Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <UserPlus className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-900">Add New Staff Member</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <Label htmlFor="staffName">Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="staffName"
                                    placeholder="Enter staff member name"
                                    className="placeholder:text-gray-400"
                                    value={newStaffName}
                                    onChange={(e) => setNewStaffName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="languages">Languages</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue>
                                            <span className="text-sm">
                                                {selectedLanguages.length === 1
                                                    ? selectedLanguages[0]
                                                    : `${selectedLanguages.length} languages selected`
                                                }
                                            </span>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AVAILABLE_LANGUAGES.map((language) => (
                                            <div
                                                key={language}
                                                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    toggleLanguage(language)
                                                }}
                                            >
                                                <Checkbox
                                                    checked={selectedLanguages.includes(language)}
                                                    onCheckedChange={() => toggleLanguage(language)}
                                                />
                                                <span className="text-sm">{language}</span>
                                            </div>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedLanguages.length > 1 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {selectedLanguages.join(", ")}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="canBook"
                                    checked={canBookAppointments}
                                    onCheckedChange={(checked) => setCanBookAppointments(checked as boolean)}
                                />
                                <Label htmlFor="canBook" className="font-normal cursor-pointer">
                                    Can book appointments
                                </Label>
                            </div>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-teal-400 hover:from-blue-700 hover:to-teal-500 text-white"
                                onClick={handleAddStaffMember}
                                disabled={isSubmitting || !newStaffName.trim()}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Staff Member
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Team Members Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Users className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : staffMembers.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Staff Members</h3>
                                <p className="text-gray-600">Get started by adding your first team member</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Can Book</TableHead>
                                        <TableHead>Languages</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {staffMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">{member.name}</TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={member.is_active}
                                                    onCheckedChange={() => handleToggleAvailability(member.id, member.is_active, member.name)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {/* Placeholder for languages as API doesn't return them yet */}
                                                <span className="text-gray-400 text-sm">English</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteStaffMember(member.id, member.name)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
