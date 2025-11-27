"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import { Mail, Lock, ArrowRight, Check, UserPlus, LogIn, Send } from "lucide-react"

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<"signin" | "create" | "magic">("signin")

    return (
        <main className=" bg-slate-50 flex flex-col">
            <Header />

            <div className="flex-grow min-h-[95vh] pt-40 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-1">
                                <span className="text-2xl font-bold tracking-tight text-slate-900">BEAUTY</span>
                                <span className="text-2xl font-bold tracking-tight text-slate-900">DROP</span>
                                <span className="text-2xl font-bold text-yellow-400">AI</span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                        <p className="text-gray-500">Sign in to your Beauty Drop AI account</p>
                    </div>

                    <div className="space-y-6">
                        <Button
                            variant="outline"
                            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium flex items-center justify-center gap-3 text-base shadow-sm transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or choose another option</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab("create")}
                                className={`flex-1 pb-4 text-sm font-medium transition-colors relative ${activeTab === "create" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Create Account
                                {activeTab === "create" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("signin")}
                                className={`flex-1 pb-4 text-sm font-medium transition-colors relative ${activeTab === "signin" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Sign in
                                {activeTab === "signin" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("magic")}
                                className={`flex-1 pb-4 text-sm font-medium transition-colors relative ${activeTab === "magic" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Email Link
                                {activeTab === "magic" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-900 font-semibold text-sm">Email Address</Label>
                                <div className="flex gap-3 items-center border border-gray-300 rounded-md px-3 h-12 bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                    <Mail className="h-5 w-5 text-gray-500 pointer-events-none flex-shrink-0" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="border-0 h-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-base"
                                    />
                                </div>
                            </div>

                            {activeTab !== "magic" && (
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-900 font-semibold text-sm">Password</Label>
                                    <div className="flex gap-3 items-center border border-gray-300 rounded-md px-3 h-12 bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                        <Lock className="h-5 w-5 text-gray-500 pointer-events-none flex-shrink-0" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder={activeTab === "create" ? "Choose a secure password" : "Enter your password"}
                                            className="border-0 h-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-base"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === "signin" && (
                                <div className="flex justify-end">
                                    <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            )}

                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg shadow-lg shadow-blue-600/20 transition-all">
                                {activeTab === "create" && (
                                    <span className="flex items-center gap-2">
                                        Create account
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                                {activeTab === "signin" && (
                                    <span className="flex items-center gap-2">
                                        Sign in
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                                {activeTab === "magic" && (
                                    <span className="flex items-center gap-2">
                                        Email me a sign-in link
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
