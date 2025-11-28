"use client"

import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import Link from "next/link"
import {
    FileText,
    Settings,
    Activity,
    Shield,
    CheckCircle,
    BarChart3,
    Megaphone,
    Globe,
    Facebook,
    CreditCard,
    LifeBuoy,
    Video,
    Chrome,
    ToggleLeft,
    Clock,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    Info,
    MousePointerClick,
    Layers,
    Lock
} from "lucide-react"

export default function CookiePolicyPage() {
    const effectiveDate = "January 31, 2025"
    const lastUpdated = "January 31, 2025"

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-4 bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Cookie Policy
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
                        Learn how we use cookies and similar technologies to enhance your experience on our website.
                    </p>
                    <div className="text-sm text-gray-500">
                        Effective Date: {effectiveDate} | Last Updated: {lastUpdated}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* About This Policy */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">About This Policy</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    This Cookie Policy explains how Vortex AI, Inc. doing business as Beauty Drop AI ("we," "us," or "our") uses cookies and similar tracking technologies on our website. This policy should be read together with our Privacy Policy and Terms of Service.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What Are Cookies? */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">What Are Cookies?</h2>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">
                            Cookies are small text files that are placed on your device (computer, smartphone, tablet) when you visit a website. They help websites remember information about your visit, which can make it easier to visit the site again and make the site more useful to you.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">Text Files</h3>
                                    <p className="text-xs text-gray-600">Small data files stored locally on your device</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <Settings className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">Remember Preferences</h3>
                                    <p className="text-xs text-gray-600">Store your settings and preferences for future visits</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <Activity className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">Analytics</h3>
                                    <p className="text-xs text-gray-600">Help us understand how you use our website</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">Security</h3>
                                    <p className="text-xs text-gray-600">Protect against fraud and maintain account security</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Types of Cookies We Use */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Types of Cookies We Use</h2>
                        </div>

                        {/* Essential Cookies */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Essential Cookies</h3>
                                    <p className="text-xs text-gray-500">Required for basic website functionality</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                            </p>
                            <div className="grid md:grid-cols-2 gap-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Session management and user authentication</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Load balancing and site performance</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Security features and fraud prevention</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Remember cookie consent preferences</span>
                                </div>
                            </div>
                            <div className="bg-green-50 text-green-800 text-xs p-3 rounded-lg border border-green-100 flex items-center gap-2">
                                <Lock className="w-3 h-3" />
                                <strong>Cannot be disabled:</strong> These cookies cannot be turned off as they are essential for the website to work.
                            </div>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Analytics Cookies</h3>
                                    <p className="text-xs text-gray-500">Help us understand website usage</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                These cookies collect information about how visitors use our website, such as which pages are visited most often and if users get error messages from web pages.
                            </p>
                            <div className="grid md:grid-cols-2 gap-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-orange-500" />
                                    <span>Google Analytics for website traffic analysis</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-orange-500" />
                                    <span>Page view counts and user behavior tracking</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-orange-500" />
                                    <span>Error reporting and performance monitoring</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-orange-500" />
                                    <span>A/B testing and feature optimization</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg border border-blue-100 flex items-center gap-2">
                                <Info className="w-3 h-3" />
                                <strong>Anonymous data:</strong> All information collected is anonymous and cannot be used to identify individual users.
                            </div>
                        </div>

                        {/* Functional Cookies */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Functional Cookies</h3>
                                    <p className="text-xs text-gray-500">Enhance your user experience</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                            </p>
                            <div className="grid md:grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-purple-500" />
                                    <span>Remember your language and region preferences</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-purple-500" />
                                    <span>Store form data to prevent re-entry</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-purple-500" />
                                    <span>Remember accessibility settings</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-purple-500" />
                                    <span>Provide personalized content recommendations</span>
                                </div>
                            </div>
                        </div>

                        {/* Marketing Cookies */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                                    <Megaphone className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Marketing Cookies</h3>
                                    <p className="text-xs text-gray-500">Deliver relevant advertisements</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.
                            </p>
                            <div className="grid md:grid-cols-2 gap-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-yellow-500" />
                                    <span>Google Ads and Facebook Pixel tracking</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-yellow-500" />
                                    <span>Retargeting and remarketing campaigns</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-yellow-500" />
                                    <span>Conversion tracking and attribution</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-yellow-500" />
                                    <span>Personalized advertising based on interests</span>
                                </div>
                            </div>
                            <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-lg border border-orange-100 flex items-center gap-2">
                                <MousePointerClick className="w-3 h-3" />
                                <strong>Your choice:</strong> You can opt out of marketing cookies while still using our website.
                            </div>
                        </div>
                    </div>

                    {/* Third-Party Cookies */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Third-Party Cookies</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Some cookies on our website are set by third-party services that appear on our pages. We use several trusted partners to enhance your experience:
                        </p>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                                <div className="w-10 h-10 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                    <Chrome className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">Google Services</h3>
                                <p className="text-xs text-gray-500 mb-2">Analytics, Ads, reCAPTCHA, Maps</p>
                                <a href="#" className="text-xs text-blue-600 hover:underline">Privacy Policy</a>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                                <div className="w-10 h-10 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                    <Facebook className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">Facebook</h3>
                                <p className="text-xs text-gray-500 mb-2">Pixel tracking, Social plugins</p>
                                <a href="#" className="text-xs text-blue-600 hover:underline">Privacy Policy</a>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                                <div className="w-10 h-10 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-3">
                                    <BarChart3 className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">Analytics Tools</h3>
                                <p className="text-xs text-gray-500 mb-2">Hotjar, Mixpanel, Others</p>
                                <span className="text-xs text-gray-400">Various privacy policies</span>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                                <div className="w-10 h-10 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-3">
                                    <CreditCard className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">Payment Processors</h3>
                                <p className="text-xs text-gray-500 mb-2">Stripe, PayPal</p>
                                <span className="text-xs text-gray-400">Secure payment handling</span>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                                <div className="w-10 h-10 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-3">
                                    <LifeBuoy className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">Support Tools</h3>
                                <p className="text-xs text-gray-500 mb-2">Intercom, Zendesk</p>
                                <span className="text-xs text-gray-400">Customer support chat</span>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                                <div className="w-10 h-10 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-3">
                                    <Video className="w-5 h-5 text-red-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">Media Content</h3>
                                <p className="text-xs text-gray-500 mb-2">YouTube, Vimeo</p>
                                <span className="text-xs text-gray-400">Embedded video content</span>
                            </div>
                        </div>
                    </div>

                    {/* Managing Your Cookie Preferences */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <ToggleLeft className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Managing Your Cookie Preferences</h2>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Settings className="w-4 h-4 text-gray-500" />
                                Browser Settings
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                You can control and manage cookies through your web browser settings. Most browsers allow you to:
                            </p>
                            <ul className="grid md:grid-cols-2 gap-2 text-xs text-gray-600 mb-6">
                                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Block all cookies</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Block third-party cookies only</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Delete cookies when you close your browser</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Delete existing cookies</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Allow cookies from specific sites only</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Get notifications when cookies are set</li>
                            </ul>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="font-bold text-gray-900 text-xs mb-1">Chrome</div>
                                    <div className="text-[10px] text-gray-500">Settings → Privacy and security → Cookies</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="font-bold text-gray-900 text-xs mb-1">Firefox</div>
                                    <div className="text-[10px] text-gray-500">Options → Privacy & Security → Cookies</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="font-bold text-gray-900 text-xs mb-1">Safari</div>
                                    <div className="text-[10px] text-gray-500">Preferences → Privacy → Cookies</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="font-bold text-gray-900 text-xs mb-1">Edge</div>
                                    <div className="text-[10px] text-gray-500">Settings → Cookies and site permissions</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-yellow-800 text-sm">Important Note</h3>
                                    <p className="text-yellow-700 text-xs mt-1">
                                        Disabling cookies may affect the functionality of our website. Some features may not work properly, and your user experience may be reduced. Essential cookies cannot be disabled as they are necessary for the website to function.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Your Consent */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Your Consent</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            By continuing to use our website, you consent to our use of cookies as described in this policy. When you first visit our website, you'll see a cookie banner that allows you to:
                        </p>

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                                <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm">Accept All</h3>
                                <p className="text-xs text-gray-500">Allow all cookie types</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                                <div className="w-8 h-8 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                                    <Settings className="w-4 h-4 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm">Customize</h3>
                                <p className="text-xs text-gray-500">Choose specific cookie types</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                                <div className="w-8 h-8 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                    <Shield className="w-4 h-4 text-orange-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm">Essential Only</h3>
                                <p className="text-xs text-gray-500">Use only necessary cookies</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                            <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
                            <p className="text-xs text-blue-800">
                                <strong>Change your mind?</strong> You can update your cookie preferences at any time by clicking the "Cookie Settings" link in our website footer or by clearing your browser cookies and revisiting our site.
                            </p>
                        </div>
                    </div>

                    {/* Cookie Duration */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Cookie Duration</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Different cookies have different lifespans depending on their purpose:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-orange-500">
                                    <Clock className="w-4 h-4" />
                                    <h3 className="font-bold text-gray-900 text-sm">Session Cookies</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-3">Temporary cookies that are deleted when you close your browser</p>
                                <ul className="space-y-1 text-xs text-gray-500">
                                    <li>• Authentication and security</li>
                                    <li>• Shopping cart contents</li>
                                    <li>• Form data temporarily stored</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-orange-500">
                                    <Clock className="w-4 h-4" />
                                    <h3 className="font-bold text-gray-900 text-sm">Persistent Cookies</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-3">Remain on your device for a set period or until manually deleted</p>
                                <ul className="space-y-1 text-xs text-gray-500">
                                    <li>• Preferences: 1 year</li>
                                    <li>• Analytics: 2 years</li>
                                    <li>• Marketing: 30-365 days</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Updates to This Policy */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <RefreshCw className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Updates to This Policy</h2>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make changes, we will:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Update the "Last Updated" date at the top of this policy</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Notify you through email or website notification for significant changes</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Encourage you to review the updated policy</li>
                            </ul>
                        </div>
                    </div>

                    {/* Questions About Cookies */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Questions About Cookies</h2>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
                            <p className="text-gray-600 text-sm mb-6">
                                If you have questions about our use of cookies or this Cookie Policy, please contact us:
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="font-bold text-blue-600 mb-1 text-sm">Email</div>
                                    <a href="mailto:privacy@beautydropai.com" className="text-gray-900 font-medium hover:underline text-sm">privacy@beautydropai.com</a>
                                </div>
                                <div>
                                    <div className="font-bold text-blue-600 mb-1 text-sm">Phone</div>
                                    <a href="tel:9152681877" className="text-gray-900 font-medium hover:underline text-sm">915-268-1877</a>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="font-bold text-blue-600 mb-1 text-sm">Mail</div>
                                    <p className="text-gray-900 font-medium text-sm">
                                        Vortex AI, Inc. d/b/a Beauty Drop AI<br />
                                        Privacy Officer<br />
                                        4276 Spring Mountain Rd, Suite 200<br />
                                        Las Vegas, NV 89102
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Legal Documents */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white shadow-lg text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <LinkIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="font-bold text-xl mb-2">Related Legal Documents</h3>
                        <p className="text-purple-100 text-sm max-w-2xl mx-auto mb-6">
                            For complete information about how we handle your data and the terms of using our service, please also review:
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/privacy-policy" className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-of-service" className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    )
}

function LinkIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    )
}
