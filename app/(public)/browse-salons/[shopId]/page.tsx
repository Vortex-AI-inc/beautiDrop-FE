"use client"

import { useEffect, useState } from "react"
import { fetchPublicShop } from "@/lib/api/shop"
import { fetchPublicServices } from "@/lib/api/services"
import type { Shop } from "@/types/shop"
import type { Service } from "@/types/service"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Clock, Phone, Mail, Globe, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import DarkVeil from "@/components/DarkVeil"

export default function SalonLandingPage() {
    const params = useParams()
    const shopId = params.shopId as string
    const [shop, setShop] = useState<Shop | null>(null)
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (shopId) {
            loadShopDetails()
        }
    }, [shopId])

    const loadShopDetails = async () => {
        try {
            setIsLoading(true)
            const shopData = await fetchPublicShop(shopId)
            setShop(shopData)

            if (shopData) {
                const servicesData = await fetchPublicServices(shopId)
                setServices(servicesData)
            }
        } catch (error) {
            console.error("Failed to load shop details", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen relative overflow-hidden bg-black">
                <div className="fixed inset-0 z-0">
                    <DarkVeil
                        hueShift={33}
                        noiseIntensity={0}
                        scanlineIntensity={0}
                        speed={0.5}
                        scanlineFrequency={0}
                        warpAmount={0}
                    />
                </div>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
            </main>
        )
    }

    if (!shop) {
        return (
            <main className="min-h-screen relative overflow-hidden bg-black">
                <div className="fixed inset-0 z-0">
                    <DarkVeil
                        hueShift={33}
                        noiseIntensity={0}
                        scanlineIntensity={0}
                        speed={0.5}
                        scanlineFrequency={0}
                        warpAmount={0}
                    />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                    <h1 className="text-3xl font-bold text-white mb-4">Salon Not Found</h1>
                    <p className="text-white/70 mb-8">The salon you are looking for does not exist.</p>
                </div>
            </main>
        )
    }

    return (
        <div className="min-h-screen relative bg-black">
            {/* Fixed DarkVeil Background - Covers Entire Page */}
            <div className="fixed inset-0 z-0">
                <DarkVeil
                    hueShift={33}
                    noiseIntensity={0}
                    scanlineIntensity={0}
                    speed={0.5}
                    scanlineFrequency={0}
                    warpAmount={0}
                />
            </div>

            {/* Header Navigation */}
            <header className="relative z-20 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">

                            <span className="text-white font-semibold text-lg">{shop.name}</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#services" className="text-white/80 hover:text-white transition-colors text-sm">Services</a>
                            <a href="#contact" className="text-white/80 hover:text-white transition-colors text-sm">Contact</a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center max-w-5xl mx-auto">
                    <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8">
                        <span className="text-white/80 text-sm">✨ New Way of Styling</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-6xl font-bold text-white mb-8 leading-wider">
                        {shop.name}
                    </h1>
                    <p className="text-xl sm:text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                        {shop.description || "Experience luxury beauty services"}
                    </p>

                    {/* Contact Info Pills */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {shop.address && (
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full text-white/80 text-base border border-white/10">
                                <MapPin className="w-5 h-5" />
                                <span>{shop.city}, {shop.state}</span>
                            </div>
                        )}
                        {shop.phone && (
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full text-white/80 text-base border border-white/10">
                                <Phone className="w-5 h-5" />
                                <span>{shop.phone}</span>
                            </div>
                        )}
                    </div>

                    {/* CTA Buttons - Matching Preview Style */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-white hover:bg-white/90 text-black px-10 py-6 text-lg font-medium rounded-xl shadow-lg border-0"
                        >
                            Book Appointment
                        </Button>
                        {shop.website && (
                            <Button
                                size="lg"
                                variant="ghost"
                                asChild
                                className="bg-white/5 hover:bg-white/10 text-white px-10 py-6 text-lg rounded-xl backdrop-blur-sm border border-white/10"
                            >
                                <a
                                    href={shop.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3"
                                >
                                    <Globe className="w-5 h-5" />
                                    Visit Website
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-16">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Our Services</h2>
                    </div>

                    {services.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-16 text-center border border-white/10">
                            <p className="text-white/60 text-xl">Services coming soon...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="group bg-white/5 cursor-pointer backdrop-blur-xl hover:bg-white/10 rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-white text-2xl sm:text-3xl group-hover:text-purple-300 transition-colors">
                                            {service.name}
                                        </h3>
                                        <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            ${parseFloat(service.price).toFixed(0)}
                                        </div>
                                    </div>
                                    <p className="text-white/70 text-base sm:text-lg mb-6 leading-relaxed flex-grow">
                                        {service.description || "No description available yet"}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2 text-white/60">
                                            <Clock className="w-5 h-5" />
                                            <span className="text-base">{service.duration_minutes} mins</span>
                                        </div>
                                        <Button
                                            size="lg"
                                            className="bg-white hover:bg-white/90 text-black px-6 py-2 rounded-lg font-medium"
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer Section */}
            <footer id="contact" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-white/60">
                        <div className="flex items-center gap-3">
                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-semibold text-lg">5.0</span>
                            <span className="text-lg">• Trusted by 1000+ clients</span>
                        </div>
                        {shop.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5" />
                                <a href={`mailto:${shop.email}`} className="hover:text-white transition-colors text-lg">
                                    {shop.email}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    )
}
