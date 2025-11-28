"use client"

import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import {
    Accessibility,
    Eye,
    MousePointer,
    Ear,
    Keyboard,
    Monitor,
    Smartphone,
    Globe,
    CheckCircle,
    AlertTriangle,
    Mail,
    Phone,
    MapPin,
    Clock,
    Layers,
    Maximize,
    Mic,
    Type,
    Zap,
    ShieldCheck,
    RefreshCw,
    Search,
    MessageSquare,
    BookOpen,
    Flag,
    Award
} from "lucide-react"

export default function AccessibilityPage() {
    const lastUpdated = "January 31, 2025"

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-4 bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Accessibility Statement
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
                        Beauty Drop AI is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone.
                    </p>
                    <div className="text-sm text-gray-500">
                        Last Updated: {lastUpdated}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Our Commitment to Accessibility */}
                    <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl p-8 text-white shadow-lg">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-full hidden md:block">
                                <Accessibility className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Our Commitment to Accessibility</h2>
                                <p className="text-teal-50 mb-4 leading-relaxed">
                                    Vortex AI, Inc. doing business as Beauty Drop AI is committed to ensuring that our website is accessible to all users, including people with disabilities. We believe that everyone should have equal access to information and functionality.
                                </p>
                                <p className="text-teal-50 font-medium">
                                    We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards and continuously work to improve the accessibility of our digital platforms.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Accessibility Standards */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Award className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Accessibility Standards</h2>
                        </div>
                        <p className="text-gray-600 mb-8">
                            Our website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4 text-orange-500">
                                    <Eye className="w-5 h-5" />
                                    <h3 className="font-bold text-gray-900">Perceivable</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Alternative text for images</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Sufficient color contrast ratios</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Resizable text up to 200%</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Captions for video content</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4 text-red-500">
                                    <MousePointer className="w-5 h-5" />
                                    <h3 className="font-bold text-gray-900">Operable</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Full keyboard navigation support</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> No seizure-inducing content</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Sufficient time for interactions</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Clear navigation and page structure</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4 text-purple-500">
                                    <BookOpen className="w-5 h-5" />
                                    <h3 className="font-bold text-gray-900">Understandable</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Clear and simple language</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Predictable navigation and functionality</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Input assistance and error identification</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Consistent layout and design patterns</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4 text-blue-500">
                                    <ShieldCheck className="w-5 h-5" />
                                    <h3 className="font-bold text-gray-900">Robust</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Compatible with assistive technologies</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Valid HTML markup</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> ARIA labels and landmarks</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Cross-browser and device compatibility</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Accessibility Features */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Layers className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Accessibility Features</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-yellow-100 p-2 rounded-lg">
                                        <Keyboard className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Keyboard Navigation</h3>
                                        <p className="text-xs text-gray-500">Full site navigation using keyboard</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Tab key to navigate through interactive elements</li>
                                    <li>• Enter/Space to activate buttons and links</li>
                                    <li>• Arrow keys for menu navigation</li>
                                    <li>• Escape key to close modals and dropdowns</li>
                                </ul>
                            </div>

                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-orange-100 p-2 rounded-lg">
                                        <Ear className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Screen Reader Support</h3>
                                        <p className="text-xs text-gray-500">Compatible with assistive technologies</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• ARIA labels and descriptions</li>
                                    <li>• Semantic HTML structure</li>
                                    <li>• Alternative text for all images</li>
                                    <li>• Screen reader friendly forms</li>
                                </ul>
                            </div>

                            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <Eye className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Visual Accessibility</h3>
                                        <p className="text-xs text-gray-500">Optimized for visual impairments</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• High contrast color schemes</li>
                                    <li>• Scalable text up to 200%</li>
                                    <li>• Focus indicators on interactive elements</li>
                                    <li>• No reliance on color alone for information</li>
                                </ul>
                            </div>

                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <MousePointer className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Motor Accessibility</h3>
                                        <p className="text-xs text-gray-500">Designed for motor impairments</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Large clickable areas (minimum 44px)</li>
                                    <li>• Sufficient spacing between interactive elements</li>
                                    <li>• No time-sensitive interactions</li>
                                    <li>• Multiple ways to perform actions</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Supported Assistive Technologies */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Monitor className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Supported Assistive Technologies</h2>
                        </div>
                        <p className="text-gray-600 mb-8">
                            Our website is designed to work with a wide range of assistive technologies and devices:
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                                <div className="mx-auto bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Ear className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-2">Screen Readers</h3>
                                <ul className="text-xs text-gray-500 space-y-1">
                                    <li>JAWS</li>
                                    <li>NVDA</li>
                                    <li>VoiceOver</li>
                                    <li>TalkBack</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                                <div className="mx-auto bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Keyboard className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-2">Input Devices</h3>
                                <ul className="text-xs text-gray-500 space-y-1">
                                    <li>Keyboard</li>
                                    <li>Voice recognition</li>
                                    <li>Switch devices</li>
                                    <li>Eye tracking</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                                <div className="mx-auto bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-2">Magnification</h3>
                                <ul className="text-xs text-gray-500 space-y-1">
                                    <li>ZoomText</li>
                                    <li>MAGic</li>
                                    <li>Browser zoom</li>
                                    <li>OS magnifier</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                                <div className="mx-auto bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Smartphone className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-2">Mobile Accessibility</h3>
                                <ul className="text-xs text-gray-500 space-y-1">
                                    <li>VoiceOver (iOS)</li>
                                    <li>TalkBack (Android)</li>
                                    <li>Switch Control</li>
                                    <li>Voice Control</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Known Accessibility Issues */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <AlertTriangle className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Known Accessibility Issues</h2>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
                                <div>
                                    <h3 className="font-bold text-yellow-800 mb-2">Transparency in Progress</h3>
                                    <p className="text-yellow-700 text-sm leading-relaxed">
                                        We believe in transparency about our accessibility efforts. While we strive for full accessibility, we acknowledge that some areas may still need improvement.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-4">Areas We're Currently Improving:</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-1.5 bg-red-400 rounded-full flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Third-Party Integrations</h4>
                                    <p className="text-sm text-gray-600">Some embedded third-party content may not fully meet accessibility standards. We're working with vendors to improve this.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Complex Interactive Elements</h4>
                                    <p className="text-sm text-gray-600">Some advanced interactive features are being enhanced for better screen reader support.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">PDF Documents</h4>
                                    <p className="text-sm text-gray-600">We're working to ensure all PDF documents are properly tagged and accessible.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-gray-50 p-4 rounded-lg text-xs text-gray-500 italic">
                            Estimated completion: These improvements are targeted for completion by March 2025. We will update this page as progress is made.
                        </div>
                    </div>

                    {/* How to Navigate Our Website */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">How to Navigate Our Website</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100 flex items-center gap-2">
                                    <Keyboard className="w-5 h-5 text-yellow-600" />
                                    <h3 className="font-bold text-gray-900">Keyboard Shortcuts</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Navigate forward</span>
                                        <kbd className="bg-gray-100 px-2 py-1 rounded border border-gray-200 font-mono text-xs text-gray-700">Tab</kbd>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Navigate backward</span>
                                        <kbd className="bg-gray-100 px-2 py-1 rounded border border-gray-200 font-mono text-xs text-gray-700">Shift + Tab</kbd>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Activate element</span>
                                        <kbd className="bg-gray-100 px-2 py-1 rounded border border-gray-200 font-mono text-xs text-gray-700">Enter / Space</kbd>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Close modals</span>
                                        <kbd className="bg-gray-100 px-2 py-1 rounded border border-gray-200 font-mono text-xs text-gray-700">Escape</kbd>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Skip to main content</span>
                                        <kbd className="bg-gray-100 px-2 py-1 rounded border border-gray-200 font-mono text-xs text-gray-700">Tab (first focus)</kbd>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-red-600" />
                                    <h3 className="font-bold text-gray-900">Page Structure</h3>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> All pages have proper heading hierarchy (H1, H2, H3)</li>
                                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Landmarks identify main content areas</li>
                                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Skip links allow quick navigation to main content</li>
                                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Consistent navigation throughout the site</li>
                                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Breadcrumbs show current location</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accessibility Feedback & Support */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Accessibility Feedback & Support</h2>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 mb-8">
                            <p className="text-gray-600 mb-8">
                                We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-2 font-bold text-blue-600 mb-2">
                                        <Mail className="w-4 h-4" />
                                        <span>Accessibility Email</span>
                                    </div>
                                    <a href="mailto:accessibility@beautydropai.com" className="text-sm text-gray-900 hover:underline">accessibility@beautydropai.com</a>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 font-bold text-blue-600 mb-2">
                                        <Phone className="w-4 h-4" />
                                        <span>Phone Support</span>
                                    </div>
                                    <a href="tel:9152681877" className="text-sm text-gray-900 hover:underline block">915-268-1877</a>
                                    <span className="text-xs text-gray-500">Mon-Fri, 9AM-5PM PST</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 font-bold text-blue-600 mb-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>Mailing Address</span>
                                    </div>
                                    <address className="text-sm text-gray-900 not-italic">
                                        Vortex AI, Inc. d/b/a Beauty Drop AI<br />
                                        Accessibility Team<br />
                                        4276 Spring Mountain Rd, Suite 200<br />
                                        Las Vegas, NV 89102
                                    </address>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-blue-100">
                                <h3 className="font-bold text-gray-900 mb-4 text-sm">When Reporting Accessibility Issues:</h3>
                                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Describe the specific issue you encountered</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Include the URL of the page where you found the issue</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Tell us what browser and assistive technology you're using</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Suggest how you think the issue could be resolved</li>
                                </ul>
                                <p className="text-xs text-gray-500 italic">
                                    Response Time: We aim to respond to accessibility inquiries within 2 business days and resolve issues within 30 days when possible.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Legal Compliance */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Flag className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Legal Compliance</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Beauty Drop AI is committed to complying with applicable accessibility laws and standards:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4 text-yellow-600">
                                    <Flag className="w-5 h-5" />
                                    <h3 className="font-bold text-gray-900">United States</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Americans with Disabilities Act (ADA)</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Section 508 of the Rehabilitation Act</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> WCAG 2.1 Level AA compliance</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4 text-orange-600">
                                    <Globe className="w-5 h-5" />
                                    <h3 className="font-bold text-gray-900">International Standards</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> EN 301 549 (European Standard)</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> AODA (Accessibility for Ontarians with Disabilities Act)</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> DDA (Australian Disability Discrimination Act)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Our Ongoing Commitment */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-lg text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <RefreshCw className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Our Ongoing Commitment</h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                            Accessibility is not a one-time effort but an ongoing commitment. We regularly review and improve our website's accessibility through user testing, automated audits, and community feedback.
                        </p>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                <div className="flex justify-center mb-2">
                                    <Accessibility className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm font-medium">Regular user testing with people with disabilities</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                <div className="flex justify-center mb-2">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm font-medium">Automated accessibility audits and monitoring</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                <div className="flex justify-center mb-2">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm font-medium">Ongoing accessibility training for our team</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    )
}
