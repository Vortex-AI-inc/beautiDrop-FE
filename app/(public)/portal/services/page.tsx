"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles, Scissors, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
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

interface Service {
    id: string
    name: string
    duration: number
    price: number
    category: string
    description: string
    staff: string[]
}

export default function ServicesManagementPage() {
    const { toast } = useToast()
    const [services, setServices] = useState<Service[]>([])
    const [formData, setFormData] = useState({
        name: "",
        duration: "",
        price: "",
        category: "",
        description: ""
    })

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

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleAddService = () => {
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

        if (!formData.category) {
            toast({
                title: "Error",
                description: "Please select a category.",
                variant: "destructive"
            })
            return
        }

        const newService: Service = {
            id: Date.now().toString(),
            name: formData.name,
            duration: parseInt(formData.duration),
            price: parseFloat(formData.price),
            category: formData.category,
            description: formData.description,
            staff: []
        }

        setServices(prev => [...prev, newService])

        // Reset form
        setFormData({
            name: "",
            duration: "",
            price: "",
            category: "",
            description: ""
        })

        toast({
            title: "Success",
            description: `${formData.name} has been added to your services.`,
        })
    }

    const handleDeleteService = (id: string) => {
        const service = services.find(s => s.id === id)
        setServices(prev => prev.filter(s => s.id !== id))

        toast({
            title: "Service removed",
            description: `${service?.name} has been removed from your services.`,
        })
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
                            <p className="text-gray-600">Manage your services and assign staff members</p>
                        </div>
                        <Link href="/portal" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
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
                                <p className="text-sm text-gray-600">Save time by having our AI scan your website and automatically import your services, pricing, and durations.</p>
                            </div>
                        </div>
                        <Button className="bg-teal-400 hover:bg-teal-500 text-black/50 hover:text-black border-0">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Have AI Fill This In
                            <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Beta</span>
                        </Button>
                    </div>

                    {/* Add New Service Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Scissors className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-900">Add New Service</h2>
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
                                onClick={handleAddService}
                            >
                                <Scissors className="w-4 h-4 mr-2" />
                                Add Service
                            </Button>
                        </div>
                    </div>

                    {/* Your Services Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Scissors className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Your Services</h2>
                        </div>

                        {services.length === 0 ? (
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
                                            <TableHead>Service</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Staff</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {services.map((service) => (
                                            <TableRow key={service.id}>
                                                <TableCell className="font-medium">{service.name}</TableCell>
                                                <TableCell>{service.duration} min</TableCell>
                                                <TableCell>${service.price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {service.category}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {service.description || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {service.staff.length > 0 ? service.staff.join(", ") : "-"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteService(service.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
        </main>
    )
}
