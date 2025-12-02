"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { fetchPublicShops } from "@/lib/api/shop"
import type { Shop } from "@/types/shop"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function BrowseSalonsPage() {
    const [shops, setShops] = useState<Shop[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { toast } = useToast()

    useEffect(() => {
        loadShops()
    }, [])

    const loadShops = async () => {
        try {
            setIsLoading(true)
            const data = await fetchPublicShops()
            setShops(data)
        } catch (error) {
            console.error("Failed to load shops", error)
            toast({
                title: "Error",
                description: "Failed to load salons. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col pt-20">
            <Header />

            <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Find Your Perfect Salon
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Discover top-rated beauty professionals near you
                        </p>

                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search by name or service..."
                                className="pl-12 h-12 text-lg rounded-full shadow-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                        </div>
                    ) : filteredShops.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No salons found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredShops.map((shop) => (
                                <Card key={shop.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden border-gray-100">
                                    <div className="h-48 bg-gray-200 relative">
                                        {/* Placeholder for shop image - using a gradient for now */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-4xl font-bold opacity-80">
                                            {shop.name.charAt(0)}
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl mb-1">{shop.name}</CardTitle>
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {shop.address || "Location not available"}
                                                </div>
                                            </div>
                                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                                                <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                                                <span className="font-medium text-yellow-700">5.0</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="line-clamp-2 mb-4">
                                            {shop.description || "No description available."}
                                        </CardDescription>
                                        <Link href={`/browse-salons/${shop.id}`}>
                                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                                View Services
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}
