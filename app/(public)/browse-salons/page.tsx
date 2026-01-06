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
import Image from "next/image"
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
            toast({
                title: "Error",
                description: "Failed to load salons. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const filteredShops = shops?.filter(shop =>
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
                    ) : filteredShops?.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No salons found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredShops?.map((shop) => (
                                <Link href={`/browse-salons/${shop?.id}`} key={shop?.id} className="block h-full">
                                    <Card className="group h-full flex flex-col overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white hover:-translate-y-1 p-0 gap-0">
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                                            <Image
                                                src={shop?.cover_image_url || "/saloon-bg.jpg"}
                                                alt={shop?.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-white/20">
                                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs font-bold text-gray-900">5.0</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col flex-1 p-5">
                                            <div className="mb-1">
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
                                                    {shop?.name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{shop?.address || "Address available upon booking"}</span>
                                            </div>

                                            <div className="flex-1 mb-4">
                                                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                                    {shop?.description || "Experience top-tier beauty services tailored to your needs."}
                                                </p>
                                            </div>

                                            <Button className="w-full bg-gray-900 hover:bg-black text-white font-medium h-11 rounded-xl shadow-none hover:shadow-lg transition-all duration-300">
                                                View Salon
                                            </Button>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}
