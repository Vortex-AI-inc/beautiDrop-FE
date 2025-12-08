"use client"

import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import {
    FileText,
    CheckCircle,
    Shield,
    CreditCard,
    AlertTriangle,
    Gavel,
    Mail,
    Edit,
    User,
    Briefcase,
    Server,
    Ban,
    Clock,
    Zap,
    Copyright,
    AlertOctagon,
    XCircle
} from "lucide-react"

export default function TermsOfServicePage() {
    const lastUpdated = "January 31, 2025"

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            <section className="pt-32 pb-12 px-4 bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
                        Please read these terms carefully before using our AI receptionist services.
                    </p>
                    <div className="text-sm text-gray-500">
                        Last Updated: {lastUpdated}
                    </div>
                </div>
            </section>

            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Agreement Overview</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client" or "You") and Beauty Drop AI ("Company", "We", "Us", or "Our") regarding your access to and use of our AI receptionist services.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Acceptance of Terms</h2>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">
                            By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not use our Services.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <User className="w-4 h-4 text-green-500" />
                                    <h3 className="font-bold text-gray-900 text-sm">User Acceptance</h3>
                                </div>
                                <p className="text-xs text-gray-600">
                                    You represent that you are of legal age to form a binding contract and are not barred from receiving services under applicable laws.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Briefcase className="w-4 h-4 text-green-500" />
                                    <h3 className="font-bold text-gray-900 text-sm">Business Usage</h3>
                                </div>
                                <p className="text-xs text-gray-600">
                                    If you are using the Services on behalf of a business, you represent that you have the authority to bind that business to these Terms.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Server className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Service Description</h2>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">What We Provide</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Beauty Drop AI provides an AI-powered receptionist service designed to handle calls, schedule appointments, and manage client inquiries for beauty and wellness businesses.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    "AI-powered call answering",
                                    "Appointment booking and scheduling",
                                    "Customer inquiry management",
                                    "Message taking and forwarding",
                                    "Data analytics and reporting",
                                    "Automated SMS notifications"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Your Responsibilities</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-orange-500">
                                    <Shield className="w-4 h-4" />
                                    <h3 className="font-bold text-gray-900 text-sm">Account Security</h3>
                                </div>
                                <ul className="space-y-2 text-xs text-gray-600 list-disc pl-4">
                                    <li>Maintain confidentiality of account credentials</li>
                                    <li>Notify us immediately of unauthorized access</li>
                                    <li>You are responsible for all activities under your account</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-red-500">
                                    <Ban className="w-4 h-4" />
                                    <h3 className="font-bold text-gray-900 text-sm">Acceptable Use</h3>
                                </div>
                                <ul className="space-y-2 text-xs text-gray-600 list-disc pl-4">
                                    <li>Do not use services for illegal purposes</li>
                                    <li>Do not interfere with service performance</li>
                                    <li>Do not attempt to reverse engineer the AI</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-green-500">
                                    <CheckCircle className="w-4 h-4" />
                                    <h3 className="font-bold text-gray-900 text-sm">Data Accuracy</h3>
                                </div>
                                <ul className="space-y-2 text-xs text-gray-600 list-disc pl-4">
                                    <li>Provide accurate business information</li>
                                    <li>Keep services and pricing up to date</li>
                                    <li>Ensure staff schedules are current</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-purple-500">
                                    <AlertTriangle className="w-4 h-4" />
                                    <h3 className="font-bold text-gray-900 text-sm">Prohibited Activities</h3>
                                </div>
                                <ul className="space-y-2 text-xs text-gray-600 list-disc pl-4">
                                    <li>Harassing or abusive language with AI</li>
                                    <li>Using service to spam or solicit</li>
                                    <li>Reselling the service without authorization</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Payment Terms</h2>
                        </div>

                        <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl p-6 text-white shadow-lg mb-6">
                            <h3 className="font-bold text-lg mb-2">Subscription & Billing</h3>
                            <p className="text-orange-50 text-sm">
                                Transparent pricing with flexible payment options.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                            <h3 className="font-bold text-gray-900 mb-4">Subscription Plans</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                We offer various subscription plans with different features and pricing tiers. All prices are clearly displayed on our pricing page and subject to change with 30 days notice.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Monthly and annual billing options</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Automatic renewal unless cancelled</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Secure payment processing</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Refund Policy</h3>
                            <p className="text-sm text-gray-600">
                                We offer a 30-day money-back guarantee for new subscribers. Refunds will be processed within 5-7 business days after approval. Services used during the refund period may be subject to usage fees.
                            </p>
                        </div>
                    </div>

                    {/* Service Availability */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Service Availability</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            While we strive to maintain 99.9% uptime, we cannot guarantee uninterrupted service availability due to maintenance, updates, or unforeseen technical issues.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                                <div className="flex items-center gap-2 mb-3 text-yellow-700">
                                    <Zap className="w-4 h-4" />
                                    <h3 className="font-bold text-sm">Scheduled Maintenance</h3>
                                </div>
                                <ul className="space-y-2 text-xs text-gray-600">
                                    <li>• Advance notice provided when possible</li>
                                    <li>• Typically scheduled during low-usage periods</li>
                                    <li>• Service credits may apply for extended outages</li>
                                </ul>
                            </div>
                            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                <div className="flex items-center gap-2 mb-3 text-red-700">
                                    <AlertTriangle className="w-4 h-4" />
                                    <h3 className="font-bold text-sm">Emergency Issues</h3>
                                </div>
                                <ul className="space-y-2 text-xs text-gray-600">
                                    <li>• 24/7 monitoring and rapid response</li>
                                    <li>• Status updates provided on our website</li>
                                    <li>• Priority given to service restoration</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Intellectual Property */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Copyright className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Intellectual Property</h2>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 mb-2">Our Rights</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    All intellectual property rights in the Beauty Drop AI service, including software, algorithms, trademarks, and proprietary technology, remain the exclusive property of Vortex AI, Inc.
                                </p>
                                <p className="text-sm text-gray-600">
                                    You are granted a limited, non-exclusive, non-transferable license to use our services in accordance with these Terms.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Your Content</h3>
                                <p className="text-sm text-gray-600">
                                    You retain ownership of any content you provide to us (business information, customer data, etc.). By using our service, you grant us a license to use this content solely for providing our services to you.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Limitation of Liability */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertOctagon className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Limitation of Liability</h2>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-yellow-800 text-sm">Important Legal Notice</h3>
                                    <p className="text-yellow-700 text-xs mt-1">
                                        Please read this section carefully as it limits our liability and affects your legal rights.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            To the maximum extent permitted by law, Vortex AI, Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span>Loss of profits or revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span>Loss of business opportunities</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span>Data loss or corruption</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span>Service interruptions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span>Third-party claims</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span>Technology failures</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span>Unauthorized access to data</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span>Costs of substitute services</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-700 font-medium">
                                Maximum Liability: Our total liability for any claims shall not exceed the amount you paid for the service during the 12 months preceding the claim.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <XCircle className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Termination</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-orange-500">
                                    <User className="w-4 h-4" />
                                    <h3 className="font-bold text-gray-900 text-sm">By You</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">You may terminate your account at any time by:</p>
                                <ul className="space-y-2 text-xs text-gray-600">
                                    <li>• Cancelling through your account dashboard</li>
                                    <li>• Contacting our support team</li>
                                    <li>• Written notice to our address</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-purple-500">
                                    <Briefcase className="w-4 h-4" />
                                    <h3 className="font-bold text-gray-900 text-sm">By Us</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">We may terminate your account for:</p>
                                <ul className="space-y-2 text-xs text-gray-600">
                                    <li>• Violation of these Terms</li>
                                    <li>• Non-payment of fees</li>
                                    <li>• Illegal or fraudulent activity</li>
                                    <li>• Upon 30 days written notice</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <h3 className="font-bold text-gray-900 text-sm mb-2">Effect of Termination</h3>
                            <p className="text-xs text-gray-600">
                                Upon termination, your access to the service will cease immediately. We will retain your data for 90 days to allow for reactivation, after which it will be permanently deleted unless required by law.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Gavel className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Governing Law & Disputes</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm mb-2">Governing Law</h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    These Terms are governed by and construed in accordance with the laws of the State of Nevada, without regard to conflict of law principles.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm mb-2">Jurisdiction</h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Any disputes arising from these Terms shall be resolved exclusively in the state or federal courts located in Clark County, Nevada.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-4">
                            <h3 className="font-bold text-gray-900 text-xs mb-1">Alternative Dispute Resolution</h3>
                            <p className="text-xs text-gray-500">
                                We encourage resolving disputes through good faith negotiation. If unsuccessful, disputes may be resolved through binding arbitration under the rules of the American Arbitration Association.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Contact Us About These Terms</h2>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
                            <p className="text-gray-600 text-sm mb-6">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="font-bold text-blue-600 mb-1 text-sm">Email</div>
                                    <a href="mailto:legal@beautydrop.ai" className="text-gray-900 font-medium hover:underline text-sm">legal@beautydrop.ai</a>
                                </div>
                                <div>
                                    <div className="font-bold text-blue-600 mb-1 text-sm">Phone</div>
                                    <a href="tel:18002328892" className="text-gray-900 font-medium hover:underline text-sm">1-800-BEAUTY-AI</a>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="font-bold text-blue-600 mb-1 text-sm">Mailing Address</div>
                                    <p className="text-gray-900 font-medium text-sm">
                                        Beauty Drop AI, Inc.<br />
                                        Legal Department<br />
                                        123 Innovation Drive, Suite 400<br />
                                        San Francisco, CA 94105
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white shadow-lg text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <Edit className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="font-bold text-xl mb-2">Changes to These Terms</h3>
                        <p className="text-purple-100 text-sm max-w-2xl mx-auto">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                        </p>
                        <div className="mt-6 text-xs text-purple-200">
                            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    )
}
