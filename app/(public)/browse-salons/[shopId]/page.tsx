"use client"

import { useEffect, useState } from "react"
import { fetchPublicShop } from "@/lib/api/shop"
import { fetchPublicServices } from "@/lib/api/services"
import { fetchPublicShopSchedules, fetchPublicHolidays } from "@/lib/api/schedules"
import type { Shop } from "@/types/shop"
import type { Service } from "@/types/service"
import type { Schedule, Holiday } from "@/types/schedule"
import type { Deal } from "@/types/deal"
import { fetchPublicShopDeals } from "@/lib/api/deals"
import { format, addDays, getDay, parseISO, startOfToday, nextDay, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Phone, Globe, Calendar, ChevronRight, Check, Sparkles, Users, Tag, Mail, ArrowLeft, Loader2 } from "lucide-react"
import { DealCard } from "@/components/shop/deal-card"
import { ServiceCard } from "@/components/shop/service-card"
import { useParams, useRouter } from "next/navigation"
import BookingModal from "@/components/BookingModal"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"
import { useShopStore } from "@/lib/store/shop-store"
import { useVoiceStore } from "@/lib/store/voice-store"

export default function SalonDetailPage() {
    const params = useParams()
    const router = useRouter()
    const shopId = params.shopId as string
    const [shop, setShop] = useState<Shop | null>(null)
    const [services, setServices] = useState<Service[]>([])
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [holidays, setHolidays] = useState<Holiday[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [deals, setDeals] = useState<Deal[]>([])
    const [activeTab, setActiveTab] = useState<'services' | 'deals'>('services')
    const [nextPage, setNextPage] = useState<string | null>(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [totalServicesCount, setTotalServicesCount] = useState(0)
    const { setSelectedShop, setShopData } = useShopStore()
    const { openWithShop } = useVoiceStore()

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
                const [servicesData, schedulesData, holidaysData, dealsData] = await Promise.all([
                    fetchPublicServices(shopId),
                    fetchPublicShopSchedules(shopId),
                    fetchPublicHolidays(shopId),
                    fetchPublicShopDeals(shopId)
                ])
                setServices(servicesData.results)
                setNextPage(servicesData.next)
                setTotalServicesCount(servicesData.count)
                setSchedules(schedulesData)
                setHolidays(holidaysData)
                setDeals(dealsData)
                setSelectedShop(shopData)
                setShopData(servicesData.results, schedulesData, holidaysData)
            }
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const loadMoreServices = async () => {
        if (!nextPage || isLoadingMore) return

        try {
            setIsLoadingMore(true)

            const url = new URL(nextPage)
            const pageParam = url.searchParams.get('page')
            const page = pageParam ? parseInt(pageParam) : 1

            const data = await fetchPublicServices(shopId, page)

            setServices(prev => [...prev, ...data.results])
            setNextPage(data.next)
        } catch (error) {
        } finally {
            setIsLoadingMore(false)
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Loading salon details...</p>
                    </div>
                </div>
            </main>
        )
    }

    if (!shop) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 max-w-md text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">😔</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Salon Not Found</h1>
                        <p className="text-gray-600 mb-8">The salon you are looking for does not exist or has been removed.</p>
                        <Button onClick={() => router.push('/browse-salons')} className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Browse Salons
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex flex-col">
            <Header />

            {/* Hero Section with Cover Image */}
            <section className="relative h-[450px] md:h-[550px] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-hidden">
                <Image
                    src={shop.cover_image_url || "/saloon-bg.jpg"}
                    alt={shop.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />


                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <div className="flex items-center bg-gradient-to-r from-yellow-400 to-amber-400 px-4 py-2 rounded-full shadow-lg">
                                <Star className="w-5 h-5 text-white mr-2 fill-white" />
                                <span className="font-bold text-white text-lg">5.0</span>
                            </div>
                            <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                                <Users className="w-4 h-4 text-white mr-2" />
                                <span className="text-white font-medium text-sm">1000+ Happy Clients</span>
                            </div>
                            <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                                <Sparkles className="w-4 h-4 text-white mr-2" />
                                <span className="text-white font-medium text-sm">Premium Services</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                            {shop.name}
                        </h1>

                        {shop.description && (
                            <p className="text-lg md:text-xl text-white/95 mb-6 max-w-3xl leading-relaxed drop-shadow">
                                {shop.description}
                            </p>
                        )}

                        {/* Contact Info Pills */}
                        <div className="flex flex-wrap gap-3">
                            {shop.address && (
                                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full text-white border border-white/30 shadow-lg hover:bg-white/25 transition-all">
                                    <MapPin className="w-5 h-5" />
                                    <span className="font-medium">{shop.address}, {shop.city}, {shop.state}</span>
                                </div>
                            )}
                            {shop.phone && (
                                <a href={`tel:${shop.phone}`} className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full text-white border border-white/30 shadow-lg hover:bg-white/25 transition-all">
                                    <Phone className="w-5 h-5" />
                                    <span className="font-medium">{shop.phone}</span>
                                </a>
                            )}
                            {shop.email && (
                                <a href={`mailto:${shop.email}`} className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full text-white border border-white/30 shadow-lg hover:bg-white/25 transition-all">
                                    <Mail className="w-5 h-5" />
                                    <span className="font-medium">{shop.email}</span>
                                </a>
                            )}
                            {shop.website && (
                                <a href={shop.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full text-white border border-white/30 shadow-lg hover:bg-white/25 transition-all">
                                    <Globe className="w-5 h-5" />
                                    <span className="font-medium">Visit Website</span>
                                </a>
                            )}
                            <button
                                onClick={() => openWithShop(shop.id, shop.name)}
                                className="flex items-center gap-2 bg-blue-600/90 backdrop-blur-md px-5 py-3 rounded-full text-white border border-blue-400/30 shadow-lg hover:bg-blue-600 transition-all font-bold animate-pulse"
                            >
                                <Phone className="w-5 h-5" />
                                <span>Speak with AI</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Services */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Services Section */}
                            <section id="services">
                                {/* Tabs */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                            {activeTab === 'services' ? 'Our Services' : 'Deals & Offers'}
                                        </h2>
                                        <p className="text-gray-600">
                                            {activeTab === 'services'
                                                ? 'Choose from our premium selection of beauty services'
                                                : 'Exclusive packages and special offers just for you'}
                                        </p>
                                    </div>

                                    <div className="flex p-1 bg-gray-100 rounded-xl">
                                        <button
                                            onClick={() => setActiveTab('services')}
                                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'services'
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                        >
                                            Services ({totalServicesCount})
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('deals')}
                                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'deals'
                                                ? 'bg-white text-purple-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                        >
                                            Deals ({deals.length})
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                {activeTab === 'services' ? (
                                    services.length === 0 ? (
                                        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-lg">
                                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Calendar className="w-12 h-12 text-blue-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Services Coming Soon</h3>
                                            <p className="text-gray-600 text-lg mb-6">We're currently updating our services. Please check back soon!</p>
                                            {shop.phone && (
                                                <p className="text-gray-500">
                                                    For inquiries, call us at <a href={`tel:${shop.phone}`} className="text-blue-600 font-semibold hover:underline">{shop.phone}</a>
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 gap-6">
                                                {services.map((service, index) => (
                                                    <ServiceCard
                                                        key={service.id}
                                                        service={service}
                                                        index={index}
                                                        onBook={(s) => {
                                                            setSelectedService(s)
                                                            setIsBookingModalOpen(true)
                                                        }}
                                                    />
                                                ))}
                                            </div>

                                            {nextPage && (
                                                <div className="flex justify-center pt-4">
                                                    <Button
                                                        onClick={() => loadMoreServices()}
                                                        disabled={isLoadingMore}
                                                        variant="outline"
                                                        className="min-w-[200px] border-blue-200 text-blue-600 hover:bg-blue-50"
                                                    >
                                                        {isLoadingMore ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Loading more...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Load More Services
                                                                <ChevronRight className="w-4 h-4 ml-2" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    deals.length === 0 ? (
                                        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-lg">
                                            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Sparkles className="w-12 h-12 text-purple-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Deals Available</h3>
                                            <p className="text-gray-600 text-lg mb-6">Check back later for exclusive packages and offers!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {deals.map((deal, index) => (
                                                <DealCard key={deal.id} deal={deal} index={index} />
                                            ))}
                                        </div>
                                    )
                                )}
                            </section>

                            {/* Additional Info Section */}
                            {(shop.description || shop.address) && (
                                <section className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl p-8 border border-gray-100 shadow-md">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                            <Check className="w-6 h-6 text-white" />
                                        </div>
                                        Why Choose Us
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            "Expert Professionals",
                                            "Premium Products",
                                            "Flexible Scheduling",
                                            "Satisfaction Guaranteed"
                                        ].map((benefit, index) => (
                                            <div key={index} className="flex items-center gap-3 text-gray-700">
                                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                                    <Check className="w-4 h-4 text-green-600" />
                                                </div>
                                                <span className="font-medium">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Business Hours Card */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    Business Hours
                                </h3>

                                {schedules.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Clock className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-2">Hours Not Available</p>
                                        {shop.phone && (
                                            <p className="text-sm text-gray-400">
                                                Call us at <a href={`tel:${shop.phone}`} className="text-blue-600 hover:underline">{shop.phone}</a>
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                                            const schedule = schedules.find(s => s.day_of_week.toLowerCase() === day.toLowerCase())
                                            const isActive = schedule?.is_active
                                            const today = startOfToday()


                                            const currentDayIndex = getDay(today)
                                            const targetDayIndex = index + 1 > 6 ? 0 : index + 1


                                            let targetDate = today
                                            for (let i = 0; i < 7; i++) {
                                                const d = addDays(today, i)
                                                if (format(d, 'EEEE') === day) {
                                                    targetDate = d
                                                    break
                                                }
                                            }

                                            const isHoliday = holidays.some(h => isSameDay(parseISO(h.date), targetDate))
                                            const isToday = isSameDay(targetDate, today)

                                            const formatTime = (time: string) => {
                                                const [hours, minutes] = time.split(':').map(Number)
                                                const period = hours >= 12 ? 'PM' : 'AM'
                                                const displayHours = hours % 12 || 12
                                                return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
                                            }

                                            return (
                                                <div
                                                    key={day}
                                                    className={`flex justify-between items-center py-3 px-4 rounded-xl transition-all ${isToday
                                                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                                                        : 'border-b border-gray-100 last:border-0'
                                                        }`}
                                                >
                                                    <span className={`font-semibold ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
                                                        {day}
                                                        {isToday && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Today</span>}
                                                        {isHoliday && <span className="ml-2 text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">Holiday</span>}
                                                    </span>
                                                    <span className={`text-sm font-medium ${isActive && !isHoliday ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {isHoliday ? (
                                                            <span className="text-red-500 font-medium">Closed</span>
                                                        ) : (
                                                            isActive && schedule ? (
                                                                `${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`
                                                            ) : (
                                                                'Closed'
                                                            )
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Contact Card */}
                            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
                                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                                <div className="space-y-4">
                                    {shop.phone && (
                                        <a href={`tel:${shop.phone}`} className="flex items-center gap-4 text-white hover:bg-white/10 transition-all p-3 rounded-xl group">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all">
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/70 mb-1">Phone</p>
                                                <p className="font-semibold text-lg">{shop.phone}</p>
                                            </div>
                                        </a>
                                    )}
                                    {shop.email && (
                                        <a href={`mailto:${shop.email}`} className="flex items-center gap-4 text-white hover:bg-white/10 transition-all p-3 rounded-xl group">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-white/70 mb-1">Email</p>
                                                <p className="font-semibold truncate">{shop.email}</p>
                                            </div>
                                        </a>
                                    )}
                                    {shop.website && (
                                        <a href={shop.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white hover:bg-white/10 transition-all p-3 rounded-xl group">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all">
                                                <Globe className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/70 mb-1">Website</p>
                                                <p className="font-semibold">Visit Our Site</p>
                                            </div>
                                        </a>
                                    )}
                                    {shop.address && (
                                        <div className="flex items-start gap-4 text-white p-3 rounded-xl bg-white/10">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/70 mb-1">Address</p>
                                                <p className="font-semibold leading-relaxed">
                                                    {shop.address}<br />
                                                    {shop.city}, {shop.state} {shop.postal_code}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-white shadow-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Sparkles className="w-8 h-8" />
                                    <h3 className="text-2xl font-bold">Ready to Book?</h3>
                                </div>
                                <p className="text-white/95 mb-6 leading-relaxed">
                                    Experience premium beauty services with our expert team. Book your appointment today!
                                </p>
                                <Button
                                    onClick={() => {
                                        const servicesSection = document.getElementById('services')
                                        if (servicesSection) {
                                            servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                        }
                                    }}
                                    className="w-full bg-white hover:bg-gray-100 text-orange-600 font-bold shadow-lg text-lg py-6 rounded-xl"
                                >
                                    View All Services
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                service={selectedService}
                shopId={shopId}
            />
        </main>
    )
}
