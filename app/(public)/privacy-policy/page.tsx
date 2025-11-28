"use client"

import { useState } from "react"
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Shield,
    Lock,
    Eye,
    FileText,
    Building,
    Activity,
    Zap,
    Share2,
    CheckCircle,
    Mail,
    Phone,
    Server,
    UserCheck,
    Cookie,
    Clock,
    Baby,
    RefreshCw,
    AlertCircle,
    Bell,
    User
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PrivacyPolicyPage() {
    const { toast } = useToast()
    const lastUpdated = "November 28, 2025"

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        requestType: "",
        message: "",
        confirmation: false
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, confirmation: checked }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast({
            title: "Request Submitted",
            description: "We have received your opt-out request and will process it shortly.",
        })
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            requestType: "",
            message: "",
            confirmation: false
        })
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-4 bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
                        Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
                    </p>
                    <div className="text-sm text-gray-500">
                        Last Updated: {lastUpdated}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* About This Policy */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">About This Policy</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    This Privacy Policy applies to our website, services, and products. By using our services, you agree to the collection and use of information in accordance with this policy. We are committed to ensuring that your privacy is protected.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Information We Collect */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">INFORMATION WE COLLECT</h2>
                        </div>
                        <hr className="border-gray-200" />

                        <div className="grid gap-6">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Personal Information</h3>
                                <p className="text-gray-600 text-sm mb-3">We may collect the following personal information:</p>
                                <ul className="space-y-2">
                                    {[
                                        "Name and contact details (email, phone number)",
                                        "Payment information (processed securely by third-party providers)",
                                        "Account credentials (username, password)",
                                        "Any other information you voluntarily provide to us"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Business Data</h3>
                                <p className="text-gray-600 text-sm mb-3">Information related to your business operations:</p>
                                <ul className="space-y-2">
                                    {[
                                        "Salon service menu and pricing",
                                        "Staff schedules and availability",
                                        "Client booking history and preferences",
                                        "Operational policies and procedures"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Technical Information</h3>
                                <p className="text-gray-600 text-sm mb-3">Automatically collected when you visit our site:</p>
                                <ul className="space-y-2">
                                    {[
                                        "IP address and browser type",
                                        "Device information and operating system",
                                        "Pages visited and time spent on site",
                                        "Referral source and navigation paths"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* How We Use Your Information */}
                    <div className="space-y-6 pt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">HOW WE USE YOUR INFORMATION</h2>
                        </div>
                        <hr className="border-gray-200" />

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                    <h3 className="font-bold text-gray-900">Service Delivery</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• To provide and maintain our Service</li>
                                    <li>• To notify you about changes to our Service</li>
                                    <li>• To allow you to participate in interactive features</li>
                                    <li>• To provide customer support</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <h3 className="font-bold text-gray-900">Improvement & Communication</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• To gather analysis or valuable information</li>
                                    <li>• To monitor the usage of our Service</li>
                                    <li>• To detect, prevent and address technical issues</li>
                                    <li>• To provide you with news and general information</li>
                                </ul>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    <h3 className="font-bold text-gray-900">Customer Support</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    We use your information to respond to your inquiries, solve problems, and provide excellent customer service.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                    <h3 className="font-bold text-gray-900">Legal & Security</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    To comply with legal obligations, enforce our terms, and protect the rights and safety of our company and users.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Information Sharing and Disclosure */}
                    <div className="space-y-6 pt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Share2 className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">INFORMATION SHARING AND DISCLOSURE</h2>
                        </div>
                        <hr className="border-gray-200" />

                        <p className="text-gray-600 text-sm mb-6">
                            We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users.
                        </p>

                        <div className="space-y-4">
                            {[
                                { title: "Service Providers", desc: "We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.", icon: UserCheck, color: "text-orange-500" },
                                { title: "Legal Requirements", desc: "We may disclose your Personal Data in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend the rights or property of Beauty Drop AI, or protect against legal liability.", icon: ScaleIcon, color: "text-red-500" },
                                { title: "Business Transfers", desc: "If Beauty Drop AI is involved in a merger, acquisition or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.", icon: Building, color: "text-green-500" },
                                { title: "With Your Consent", desc: "We may disclose your personal information for any other purpose with your consent.", icon: CheckCircle, color: "text-purple-500" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <item.icon className={`w-5 h-5 ${item.color} mt-1 flex-shrink-0`} />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                        <p className="text-xs text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data Security */}
                    <div className="space-y-6 pt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Lock className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">DATA SECURITY</h2>
                        </div>

                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-6 h-6 text-white" />
                                <h3 className="text-lg font-bold">Information Grade Security</h3>
                            </div>
                            <p className="text-blue-100 text-sm">
                                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>SSL Encryption for all data transmission</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Regular security audits and updates</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Secure data storage with access controls</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Employee training on data privacy</span>
                            </div>
                        </div>
                    </div>

                    {/* Your Privacy Rights */}
                    <div className="space-y-6 pt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <UserCheck className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">YOUR PRIVACY RIGHTS</h2>
                        </div>
                        <hr className="border-gray-200" />

                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <p className="text-sm text-gray-600 mb-4">
                                You have certain rights regarding your personal information. These may include the right to:
                            </p>
                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    { title: "Access", desc: "Request a copy of your data", color: "bg-blue-500" },
                                    { title: "Correction", desc: "Update inaccurate information", color: "bg-amber-500" },
                                    { title: "Deletion", desc: "Request removal of your data", color: "bg-red-500" },
                                    { title: "Portability", desc: "Transfer your data elsewhere", color: "bg-green-500" },
                                    { title: "Withdrawal", desc: "Withdraw consent at any time", color: "bg-purple-500" },
                                    { title: "Opt-out", desc: "Unsubscribe from marketing", color: "bg-pink-500" }
                                ].map((right, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${right.color}`}></div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">{right.title}</div>
                                            <div className="text-xs text-gray-500">{right.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Opt-Out Form */}
                    <div className="space-y-6 pt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">OPT-OUT OF COMMUNICATIONS</h2>
                        </div>
                        <hr className="border-gray-200" />

                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                            <p className="text-gray-600 text-sm mb-6">
                                If you wish to opt out of marketing communications, please fill out the form below. We will process your request within 5 business days.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name *</Label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="requestType">Opt-Out Request Type *</Label>
                                    <select
                                        id="requestType"
                                        name="requestType"
                                        value={formData.requestType}
                                        onChange={handleChange}
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        required
                                    >
                                        <option value="">Select an option</option>
                                        <option value="marketing">Unsubscribe from marketing communications</option>
                                        <option value="all">Opt out of all communications</option>
                                        <option value="deletion">Request deletion of my personal data</option>
                                        <option value="restrict">Restrict processing of my data</option>
                                        <option value="other">Other (please specify in message)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message (Optional)</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Any specific details about your request..."
                                        rows={4}
                                    />
                                </div>

                                <div className="flex items-start gap-2">
                                    <Checkbox
                                        id="confirmation"
                                        checked={formData.confirmation}
                                        onCheckedChange={handleCheckboxChange}
                                        required
                                    />
                                    <Label htmlFor="confirmation" className="text-sm text-gray-600 font-normal leading-tight">
                                        I confirm that I want to opt out as specified above and understand that this action may affect my ability to receive important service-related communications. *
                                    </Label>
                                </div>

                                <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 h-12">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Submit Opt-Out Request
                                </Button>

                                <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                                    <Shield className="w-3 h-3 text-green-500" />
                                    Your information is secure and will only be used to process your opt-out request.
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Cookies and Tracking */}
                    <div className="space-y-6 pt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Cookie className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">COOKIES AND TRACKING TECHNOLOGIES</h2>
                        </div>
                        <hr className="border-gray-200" />

                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <p className="text-gray-600 text-sm mb-4">
                                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                    <span>Session Cookies: We use these to operate our Service.</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                    <span>Preference Cookies: We use these to remember your preferences and various settings.</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                    <span>Security Cookies: We use these for security purposes.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Retention */}
                    <div className="space-y-6 pt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">DATA RETENTION</h2>
                        </div>
                        <hr className="border-gray-200" />

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Active Accounts</h3>
                                <p className="text-sm text-gray-600">
                                    We retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Inactive Data</h3>
                                <p className="text-sm text-gray-600">
                                    We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our Service.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Us About Privacy */}
                    <div className="space-y-6 pt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">CONTACT US ABOUT PRIVACY</h2>
                        </div>
                        <hr className="border-gray-200" />

                        <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
                            <p className="text-gray-600 text-sm mb-6">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="font-bold text-blue-600 mb-1">Email</div>
                                    <a href="mailto:privacy@beautydrop.ai" className="text-gray-900 font-medium hover:underline">privacy@beautydrop.ai</a>
                                </div>
                                <div>
                                    <div className="font-bold text-blue-600 mb-1">Phone</div>
                                    <a href="tel:18002328892" className="text-gray-900 font-medium hover:underline">1-800-BEAUTY-AI</a>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="font-bold text-blue-600 mb-1">Mailing Address</div>
                                    <p className="text-gray-900 font-medium">
                                        Beauty Drop AI, Inc.<br />
                                        123 Innovation Drive, Suite 400<br />
                                        San Francisco, CA 94105
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Policy Updates Banner */}
                    <div className="bg-orange-500 rounded-xl p-6 text-white shadow-lg flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Policy Updates</h3>
                            <p className="text-orange-100 text-sm">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    )
}

function ScaleIcon(props: any) {
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
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
    )
}
