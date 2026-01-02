"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2, X, Sparkles, Heart, TrendingUp } from "lucide-react"
import { usePricingPlans } from "@/hooks/use-pricing-plans"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { createCheckoutSession } from "@/lib/api/subscriptions"
import { useState } from "react"

interface PricingModalProps {
    isOpen: boolean
    onClose: () => void
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const { plans, isLoading, getPlanByName } = usePricingPlans()
    const { getToken } = useAuth()
    const { toast } = useToast()
    const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

    const starterPlan = getPlanByName('Starter Monthly') || getPlanByName('Starter')
    const professionalPlan = getPlanByName('Professional Monthly') || getPlanByName('Professional')
    const enterprisePlan = getPlanByName('Enterprise Monthly') || getPlanByName('Enterprise')

    const handleCheckout = async (stripePriceId: string) => {
        setCheckoutLoading(stripePriceId)

        try {
            const checkoutUrl = await createCheckoutSession(stripePriceId, getToken)
            window.location.href = checkoutUrl
        } catch (error) {
            toast({
                title: "Checkout Failed",
                description: error instanceof Error ? error.message : "Failed to create checkout session. Please try again.",
                variant: "destructive",
            })
            setCheckoutLoading(null)
        }
    }

    const planConfigs = {
        starter: {
            icon: Sparkles,
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-600",
            description: "Perfect for small salons",
            features: [
                "Up to 100 calls/month",
                "Basic appointment booking",
                "Email support",
                "1 staff member",
                "Basic analytics"
            ]
        },
        professional: {
            icon: Heart,
            iconBg: "bg-white/20",
            iconColor: "text-white",
            description: "For growing salons",
            features: [
                "Up to 500 calls/month",
                "Advanced booking features",
                "Priority support",
                "Up to 5 staff members",
                "Advanced analytics",
                "Payment processing",
                "Custom greetings"
            ],
            isPopular: true
        },
        enterprise: {
            icon: TrendingUp,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            description: "For large salon chains",
            features: [
                "Unlimited calls",
                "All Professional features",
                "24/7 dedicated support",
                "Unlimited staff members",
                "Custom integrations",
                "API access",
                "White-label option"
            ]
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="max-w-4xl w-[95vw] bg-white border-0 p-0 gap-0 overflow-hidden shadow-2xl rounded-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-white">
                            Choose Your Plan
                        </h2>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-white/20 transition-colors focus:outline-none"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Pricing Cards - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600">Loading pricing plans...</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            {/* Starter Plan */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 ${planConfigs.starter.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <planConfigs.starter.icon className={`w-6 h-6 ${planConfigs.starter.iconColor}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                                {starterPlan?.name || 'Starter'}
                                            </h3>
                                            <p className="text-gray-600 text-sm">{planConfigs.starter.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-900">
                                            ${starterPlan?.amount ? parseFloat(starterPlan.amount).toFixed(0) : '99'}
                                        </div>
                                        <div className="text-sm text-gray-600">/month</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                                    {planConfigs.starter.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                                    onClick={() => handleCheckout(starterPlan?.stripe_price_id || '')}
                                    disabled={!!checkoutLoading}
                                >
                                    {checkoutLoading === starterPlan?.stripe_price_id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Get Started'
                                    )}
                                </Button>
                            </div>

                            {/* Professional Plan - Popular */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 border-2 border-blue-500 relative shadow-xl">
                                <div className="absolute -top-3 right-6 bg-amber-400 text-gray-900 px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                                    Most Popular
                                </div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 ${planConfigs.professional.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <planConfigs.professional.icon className={`w-6 h-6 ${planConfigs.professional.iconColor}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">
                                                {professionalPlan?.name || 'Professional'}
                                            </h3>
                                            <p className="text-blue-100 text-sm">{planConfigs.professional.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white">
                                            ${professionalPlan?.amount ? parseFloat(professionalPlan.amount).toFixed(0) : '199'}
                                        </div>
                                        <div className="text-sm text-blue-100">/month</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                                    {planConfigs.professional.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-white">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    className="w-full h-12 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-xl shadow-lg"
                                    onClick={() => handleCheckout(professionalPlan?.stripe_price_id || '')}
                                    disabled={!!checkoutLoading}
                                >
                                    {checkoutLoading === professionalPlan?.stripe_price_id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Get Started'
                                    )}
                                </Button>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 ${planConfigs.enterprise.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <planConfigs.enterprise.icon className={`w-6 h-6 ${planConfigs.enterprise.iconColor}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                                {enterprisePlan?.name || 'Enterprise'}
                                            </h3>
                                            <p className="text-gray-600 text-sm">{planConfigs.enterprise.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-900">
                                            ${enterprisePlan?.amount ? parseFloat(enterprisePlan.amount).toFixed(0) : '399'}
                                        </div>
                                        <div className="text-sm text-gray-600">/month</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                                    {planConfigs.enterprise.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg"
                                    onClick={() => handleCheckout(enterprisePlan?.stripe_price_id || '')}
                                    disabled={!!checkoutLoading}
                                >
                                    {checkoutLoading === enterprisePlan?.stripe_price_id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Get Started'
                                    )}
                                </Button>
                            </div>

                            {/* Features Badge */}
                            <div className="flex flex-wrap justify-center gap-3 pt-4">
                                <div className="flex items-center gap-2 bg-green-50 rounded-full px-4 py-2 border border-green-200">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">14-Day Free Trial</span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-200">
                                    <Check className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">No Credit Card Required</span>
                                </div>
                                <div className="flex items-center gap-2 bg-purple-50 rounded-full px-4 py-2 border border-purple-200">
                                    <Check className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-700">Cancel Anytime</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
