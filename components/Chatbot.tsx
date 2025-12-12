"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Send, Bot, Sparkles, Clock, Scissors, Calendar } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import type { Service } from "@/types/service"
import type { Schedule } from "@/types/schedule"

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface ChatbotProps {
    shopName?: string
    phone?: string
    services?: Service[]
    schedules?: Schedule[]
    address?: string
    email?: string
}

export default function Chatbot({ shopName = "Salon", phone, services = [], schedules = [], address, email }: ChatbotProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (messages.length === 0 && isOpen) {
            setMessages([
                {
                    id: '1',
                    role: 'assistant',
                    content: `Hi there! 👋 Welcome to ${shopName}. How can I make your day beautiful? ✨`,
                    timestamp: new Date()
                }
            ])
        }
    }, [shopName, isOpen, messages.length])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen, isTyping])

    const handleSend = (text: string = inputValue) => {
        if (!text.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsTyping(true)

        setTimeout(() => {
            let responseContent = ""
            const lowerInput = text.toLowerCase()

            if (lowerInput.includes('time') || lowerInput.includes('timing') || lowerInput.includes('open') || lowerInput.includes('hour') || lowerInput.includes('when')) {
                if (schedules.length > 0) {
                    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                    const todaySchedule = schedules.find(s => s.day_of_week.toLowerCase() === today.toLowerCase());

                    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    const sortedSchedules = [...schedules].sort((a, b) => daysOrder.indexOf(a.day_of_week) - daysOrder.indexOf(b.day_of_week));

                    const hours = sortedSchedules
                        .filter(s => s.is_active)
                        .map(s => `• ${s.day_of_week}: ${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`)
                        .join('\n');

                    if (todaySchedule?.is_active) {
                        responseContent = `We are open today (${today}) from ${todaySchedule.start_time.slice(0, 5)} to ${todaySchedule.end_time.slice(0, 5)}.\n\nHere are our weekly hours:\n${hours}`;
                    } else {
                        responseContent = `We are closed today (${today}).\n\nHere are our weekly hours:\n${hours}`;
                    }
                } else {
                    responseContent = `We are usually open Monday to Saturday from 9:00 AM to 8:00 PM. Please check the "Business Hours" section on this page for exact details!`;
                }
            }
            else if (lowerInput.includes('service') || lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('menu')) {
                if (services.length > 0) {
                    const topServices = services.slice(0, 3).map(s => `• ${s.name} ($${parseFloat(s.price).toFixed(0)})`).join('\n');
                    responseContent = `Here are some of our popular services:\n\n${topServices}\n\n...and much more! You can view our full menu on the page.`;
                } else {
                    responseContent = `We offer a wide range of services! You can view our full service menu and prices on this page.`;
                }
            }
            else if (lowerInput.includes('book') || lowerInput.includes('appointment') || lowerInput.includes('schedule')) {
                responseContent = `I'd love to help you with that! 😍 You can book an appointment directly by clicking the "Book Now" button next to any service in our list above.`;
            }
            else if (lowerInput.includes('contact') || lowerInput.includes('call') || lowerInput.includes('phone') || lowerInput.includes('location') || lowerInput.includes('address') || lowerInput.includes('email')) {
                const contactParts = [];
                if (address) contactParts.push(`📍 ${address}`);
                if (phone) contactParts.push(`📞 ${phone}`);
                if (email) contactParts.push(`✉️ ${email}`);

                if (contactParts.length > 0) {
                    responseContent = `Here is our contact information:\n\n${contactParts.join('\n')}\n\nYou can also find us on the map in the "Get in Touch" section!`;
                } else {
                    responseContent = `You can find our contact details below in the "Get in Touch" section. 📍`;
                }
            }
            else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
                responseContent = `Hello! 👋 How can I assist you today? Feel free to ask about our services or timings!`;
            }
            else {
                responseContent = `I'm just a demo assistant, but I think you're asking something interesting! 😊 For now, I can help you with timings, services, or booking info.`;
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botMsg])
            setIsTyping(false)
        }, 1500)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    const quickActions = [
        { label: "Book Appt", icon: Calendar, query: "How do I book an appointment?" },
        { label: "Services", icon: Scissors, query: "What services do you offer?" },
        { label: "Hours", icon: Clock, query: "What are your opening hours?" },
    ]

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 group">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping group-hover:hidden"></span>
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative h-16 w-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-blue-500/50 ${isOpen
                        ? 'bg-red-500 hover:bg-red-600 rotate-90'
                        : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600'
                        }`}
                >
                    {isOpen ? (
                        <X className="h-8 w-8 text-white transition-transform duration-300" />
                    ) : (
                        <MessageCircle className="h-8 w-8 text-white transition-transform duration-300" />
                    )}
                </Button>
            </div>

            {isOpen && (
                <div className="fixed bottom-28 right-6 w-[85vw] md:w-96 h-[600px] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 z-50 overflow-hidden border border-gray-100/50 font-sans">
                    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 pb-12 overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl translate-y-8 -translate-x-8"></div>

                        <div className="relative flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                                    <Bot className="h-7 w-7 text-white" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full animate-pulse"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-xl tracking-tight">{shopName}</h3>
                                <p className="text-blue-100 text-xs font-medium bg-white/10 px-2 py-0.5 rounded-full inline-block backdrop-blur-sm border border-white/10">
                                    AI Assistant
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-50/80 -mt-6 rounded-t-[2rem] overflow-hidden flex flex-col relative z-10 backdrop-blur-sm">
                        <ScrollArea className="flex-1 p-4 pt-8">
                            <div className="flex justify-center mb-6">
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full">
                                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </span>
                            </div>

                            <div className="space-y-6">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end gap-2'}`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm text-white">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[80%] p-4 shadow-sm relative group ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-100/50 rounded-2xl rounded-tl-none'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                            <span className={`text-[10px] absolute bottom-1 right-3 opacity-0 group-hover:opacity-60 transition-opacity ${msg.role === 'user' ? 'text-white' : 'text-gray-400'
                                                }`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start items-end gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm text-white">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100/50 shadow-sm flex gap-1 items-center h-11">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div ref={scrollRef} className="h-2" />
                        </ScrollArea>
                    </div>

                    {/* Quick Actions & Input */}
                    <div className="bg-white p-4 pt-2 border-t border-gray-100 z-20">
                        {messages.length < 3 && (
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-none">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(action.query)}
                                        className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-xs font-medium transition-colors border border-blue-100"
                                    >
                                        <action.icon className="w-3 h-3" />
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative flex items-center gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="bg-gray-100/50 border-gray-200 focus-visible:ring-indigo-500 rounded-full pl-5 pr-12 h-12 text-sm shadow-inner"
                            />
                            <Button
                                onClick={() => handleSend()}
                                size="icon"
                                className={`absolute right-1 w-10 h-10 rounded-full transition-all duration-300 ${inputValue.trim()
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg scale-100 opacity-100'
                                    : 'bg-gray-300 scale-90 opacity-0 pointer-events-none'
                                    }`}
                                disabled={!inputValue.trim()}
                            >
                                <Send className="h-4 w-4 text-white" />
                            </Button>
                        </div>
                        <div className="text-center mt-2 flex items-center justify-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <p className="text-[10px] text-gray-400 font-medium">Powered by BeautiDrop AI</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
