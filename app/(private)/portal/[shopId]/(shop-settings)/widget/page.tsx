"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowLeft,
    Loader2,
    Monitor,
    Layout,
    Smartphone,
    AppWindow,
    Link as LinkIcon,
    Check,
    Copy,
    Save
} from "lucide-react"
import Link from "next/link"
import { fetchShop } from "@/lib/api/shop"
import type { Shop } from "@/types/shop"
import { useToast } from "@/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const FONTS = [
    { name: "Montserrat", value: "font-sans" },
    { name: "Inter", value: "font-sans" },
    { name: "Serif", value: "font-serif" },
]

const LAYOUTS = [
    { id: 'card', name: 'Card', icon: AppWindow },
    { id: 'landscape', name: 'Landscape', icon: Layout },
    { id: 'minimal', name: 'Minimal', icon: Smartphone },
]

export default function WidgetPage() {
    const params = useParams()
    const shopId = params.shopId as string
    const router = useRouter()
    const { toast } = useToast()
    const { getToken } = useAuth()

    const [isLoading, setIsLoading] = useState(true)
    const [shop, setShop] = useState<Shop | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [copied, setCopied] = useState(false)
    const [layout, setLayout] = useState('card')
    const [primaryColor, setPrimaryColor] = useState('#2563EB')
    const [showLogo, setShowLogo] = useState(true)
    const [selectedFont, setSelectedFont] = useState("Montserrat")
    const [textAlign, setTextAlign] = useState("center")
    const [bannerImage, setBannerImage] = useState<string>("")
    const [logoUrl, setLogoUrl] = useState<string>("")
    const [buttonText, setButtonText] = useState("Book Now")
    const [widgetWidth, setWidgetWidth] = useState(380)
    const [borderRadius, setBorderRadius] = useState(12)
    const [customTitle, setCustomTitle] = useState("My shop")
    const [customDescription, setCustomDescription] = useState("Your premium beauty destination.")
    const [embedCode, setEmbedCode] = useState("")
    const [uniqueId] = useState(`bd-widget-${Math.random().toString(36).substr(2, 9)}`)

    useEffect(() => {
        const loadShop = async () => {
            try {
                const token = await getToken()
                if (!token) return
                const data = await fetchShop(shopId, token)
                setShop(data)
                if (data) {
                    setCustomTitle(data.name)
                    setCustomDescription(data.description || "Your premium beauty destination.")
                    if (data.cover_image_url) setBannerImage(data.cover_image_url)
                    if (data.logo_url) setLogoUrl(data.logo_url)
                }
            } catch (error) {
                toast({ title: "Error", description: "Failed to load shop", variant: "destructive" })
            } finally {
                setIsLoading(false)
            }
        }
        loadShop()
    }, [shopId, getToken, toast])

    useEffect(() => {
        if (!shop) return

        const origin = window.location.origin
        const widgetUrl = `${origin}/browse-salons/${shopId}`
        const fontFamily = selectedFont === 'Serif' ? 'serif' : 'sans-serif'

        let layoutCss = ""
        let htmlStructure = ""

        const getLogoHtml = (size: string, customClass: string = '') => {
            const style = `width: ${size}; height: ${size}; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; font-weight: bold; font-size: ${parseInt(size) / 2.5}px; color: white; background: ${primaryColor};`

            if (logoUrl) {
                return `<img src="${logoUrl}" alt="${shop.name}" style="${style} object-fit: cover; background: none;" class="${customClass}" />`
            }
            return `<div style="${style}" class="${customClass}">${shop.name?.charAt(0) || 'S'}</div>`
        }

        const logoWrapperBase = `position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); padding: 4px; background: #ffffff; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);`

        if (layout === 'card') {
            layoutCss = `
                .bd-container { display: flex; flex-direction: column; }
                .bd-image-container { height: 200px; width: 100%; position: relative; background-color: #f3f4f6; }
                .bd-image { height: 100%; width: 100%; object-fit: cover; display: block; }
                .bd-placeholder { height: 100%; width: 100%; background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); display: flex; align-items: center; justify-content: center; }
                .bd-logo-wrapper { ${logoWrapperBase} width: 64px; height: 64px; }
                .bd-content { padding: 32px 32px 24px; }
            `
            htmlStructure = `
                <div class="bd-header bd-image-container">
                    ${bannerImage ? `<img src="${bannerImage}" class="bd-image" alt="Banner" />` : `<div class="bd-placeholder"><span style="font-size: 32px;">✨</span></div>`}
                    ${showLogo ? `<div class="bd-logo-wrapper">${getLogoHtml('100%')}</div>` : ''}
                </div>
                <div class="bd-content">
                    <h2 style="margin: 0 0 8px; color: #111827; font-size: 24px; font-weight: bold;">${customTitle}</h2>
                    <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${customDescription}</p>
                    <a href="${widgetUrl}" target="_blank" class="bd-btn">${buttonText}</a>
                    <div style="margin-top: 16px; font-size: 10px; color: #d1d5db; text-align: center;">Powered by BeautyDrop</div>
                </div>
            `
        } else if (layout === 'landscape') {
            layoutCss = `
                .bd-container { display: flex; flex-direction: row; align-items: stretch; min-height: 200px; }
                .bd-header { width: 40%; min-width: 150px; position: relative; background-color: #f3f4f6; }
                .bd-image { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
                .bd-placeholder { height: 100%; width: 100%; background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); display: flex; align-items: center; justify-content: center; }
                .bd-content { flex: 1; padding: 24px; display: flex; flex-direction: column; justify-content: center; }
                
                @media (max-width: 500px) {
                    .bd-container { flex-direction: column; }
                    .bd-header { width: 100%; height: 180px; }
                    .bd-content { text-align: center !important; }
                }
            `
            const logoAlignStyle = textAlign === 'center' ? 'align-self: center;' : textAlign === 'right' ? 'align-self: flex-end;' : 'align-self: flex-start;'

            htmlStructure = `
                <div class="bd-header">
                     ${bannerImage ? `<img src="${bannerImage}" class="bd-image" alt="Banner">` : `<div class="bd-placeholder"><span style="font-size: 32px;">✨</span></div>`}
                </div>
                <div class="bd-content">
                    ${showLogo ? `<div style="margin-bottom: 12px; ${logoAlignStyle}">${getLogoHtml('40px')}</div>` : ''}
                    <h2 style="margin: 0 0 8px; color: #111827; font-size: 20px; font-weight: bold;">${customTitle}</h2>
                    <p style="margin: 0 0 20px; color: #6b7280; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${customDescription}</p>
                    <a href="${widgetUrl}" target="_blank" class="bd-btn">${buttonText}</a>
                </div>
            `
        } else if (layout === 'minimal') {
            layoutCss = `
                .bd-container { display: flex; flex-direction: column; }
                .bd-content { padding: 24px; }
                .bd-header-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
            `
            const headerJustify = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';

            htmlStructure = `
                <div class="bd-content">
                    <div class="bd-header-row" style="justify-content: ${headerJustify};">
                        ${showLogo ? getLogoHtml('48px') : ''}
                        <h2 style="margin: 0; color: #111827; font-size: 20px; font-weight: bold;">${customTitle}</h2>
                    </div>
                    <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${customDescription}</p>
                    <a href="${widgetUrl}" target="_blank" class="bd-btn">${buttonText}</a>
                    <div style="margin-top: 16px; font-size: 10px; color: #d1d5db; text-align: center;">Powered by BeautyDrop</div>
                </div>
            `
        }

        const code = `
<div id="${uniqueId}">
    <style>
        #${uniqueId} {
            width: 100%;
            max-width: ${widgetWidth}px;
            font-family: ${fontFamily};
            background: #ffffff;
            border-radius: ${borderRadius}px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            box-sizing: border-box;
            margin: 0 auto;
        }
        #${uniqueId} * { box-sizing: border-box; }
        #${uniqueId} .bd-btn {
            display: inline-block;
            width: 100%;
            background-color: ${primaryColor};
            color: white;
            padding: 12px 20px;
            border-radius: ${Math.max(4, borderRadius - 8)}px;
            text-decoration: none;
            font-weight: 600;
            text-align: center;
            border: none;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        #${uniqueId} .bd-btn:hover { opacity: 0.9; }
        #${uniqueId} .bd-content { text-align: ${textAlign}; }
        ${layoutCss}
    </style>
    <div class="bd-container">
        ${htmlStructure}
    </div>
</div>
`.trim()

        setEmbedCode(code)
    }, [shop, shopId, primaryColor, layout, selectedFont, textAlign, bannerImage, logoUrl, buttonText, widgetWidth, borderRadius, showLogo, customTitle, customDescription, uniqueId])

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast({ title: "Saved", description: "Widget settings saved successfully." })
        }, 1000)
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(embedCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
    if (!shop) return null

    return (
        <>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100/80">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                                Widget Branding
                            </h1>
                        </div>
                        <p className="text-slate-500 font-medium">Customize the appearance and behavior of your booking widget.</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 transition-all active:scale-95"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* CONFIGURATION */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Design & Layout */}
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 px-8 py-6">
                                <CardTitle className="text-lg font-bold">Design & Layout</CardTitle>
                                <CardDescription className="font-medium text-slate-500">Choose your widget style</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">

                                <div className="grid grid-cols-3 gap-3">
                                    {LAYOUTS.map((l) => (
                                        <button
                                            key={l.id}
                                            onClick={() => setLayout(l.id)}
                                            className={cn(
                                                "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all",
                                                layout === l.id
                                                    ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100'
                                                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                            )}
                                        >
                                            <l.icon className={cn(
                                                "w-7 h-7 mb-2",
                                                layout === l.id ? 'text-indigo-600' : 'text-slate-400'
                                            )} />
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                layout === l.id ? 'text-indigo-600' : 'text-slate-500'
                                            )}>{l.name}</span>
                                            {layout === l.id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Primary Color</Label>
                                        <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-2xl bg-white shadow-sm">
                                            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-xl border-2 border-slate-100 cursor-pointer" />
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{primaryColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Widget Width</Label>
                                        <div className="h-[52px] border border-slate-100 rounded-2xl flex items-center px-4 bg-slate-50 shadow-sm">
                                            <span className="text-sm font-black text-slate-900">{widgetWidth}px</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Width Slider</Label>
                                    </div>
                                    <Slider value={[widgetWidth]} min={280} max={800} step={10} onValueChange={(val) => setWidgetWidth(val[0])} className="py-2" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Corner Radius</Label>
                                        <span className="text-xs font-bold text-slate-600">{borderRadius}px</span>
                                    </div>
                                    <Slider value={[borderRadius]} min={0} max={32} step={4} onValueChange={(val) => setBorderRadius(val[0])} className="py-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content */}
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 px-8 py-6">
                                <CardTitle className="text-lg font-bold">Content</CardTitle>
                                <CardDescription className="font-medium text-slate-500">Customize widget text and images</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Banner Image URL</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <LinkIcon className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                                            <Input
                                                value={bannerImage}
                                                onChange={(e) => setBannerImage(e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                                className="pl-11 h-12 rounded-2xl border-slate-100 bg-white shadow-sm"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setBannerImage("")}
                                            disabled={!bannerImage}
                                            className="h-12 rounded-2xl border-slate-100 hover:bg-slate-50"
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Paste a direct link to a JPG or PNG image.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Title Text</Label>
                                    <Input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="h-12 rounded-2xl border-slate-100 bg-white shadow-sm" />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</Label>
                                    <Textarea value={customDescription} onChange={(e) => setCustomDescription(e.target.value)} rows={3} placeholder="Describe your services..." className="rounded-2xl border-slate-100 bg-white shadow-sm resize-none" />
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">New lines will be respected.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Button Text</Label>
                                    <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="h-12 rounded-2xl border-slate-100 bg-white shadow-sm" />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Logo URL (Optional)</Label>
                                    <Input
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        placeholder="https://example.com/logo.png"
                                        className="h-12 rounded-2xl border-slate-100 bg-white shadow-sm"
                                    />
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Leave empty to use shop initial.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Appearance */}
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 px-8 py-6">
                                <CardTitle className="text-lg font-bold">Appearance</CardTitle>
                                <CardDescription className="font-medium text-slate-500">Fine-tune visual settings</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Display Company Logo</Label>
                                    <Switch checked={showLogo} onCheckedChange={setShowLogo} className="data-[state=checked]:bg-indigo-600" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Text Alignment</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['left', 'center', 'right'].map((align) => (
                                            <button
                                                key={align}
                                                onClick={() => setTextAlign(align)}
                                                className={cn(
                                                    "flex items-center justify-center p-3 rounded-2xl border-2 transition-all",
                                                    textAlign === align
                                                        ? 'bg-indigo-50 border-indigo-600 shadow-lg shadow-indigo-100'
                                                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                                )}
                                            >
                                                <span className={cn(
                                                    "capitalize text-[10px] font-black uppercase tracking-widest",
                                                    textAlign === align ? 'text-indigo-600' : 'text-slate-400'
                                                )}>{align}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Embed Code */}
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-bold">Embed Code</CardTitle>
                                        <CardDescription className="font-medium text-slate-500">Copy and paste into your website</CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopyCode}
                                        className="h-10 gap-2 rounded-xl border-slate-200 hover:bg-white"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{copied ? "Copied" : "Copy Code"}</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="bg-slate-900 rounded-2xl p-6 relative shadow-inner">
                                    <code className="text-[10px] text-blue-300 font-mono block overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                                        {embedCode}
                                    </code>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* PREVIEW */}
                    <div className="lg:col-span-7">
                        <Card className="sticky top-24 shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden min-h-[600px] flex flex-col">
                            <CardHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-rose-400 shadow-sm" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                                        <div className="w-3 h-3 rounded-full bg-teal-400 shadow-sm" />
                                    </div>
                                    <div className="flex-1 bg-white rounded-xl px-4 py-2 text-[10px] font-bold text-slate-400 text-center mx-4 shadow-sm uppercase tracking-wider">your-salon-website.com</div>
                                    <Monitor className="w-5 h-5 text-slate-300" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative flex-1 p-8 lg:p-12 overflow-y-auto">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
                                <div className="relative flex items-center justify-center min-h-full">
                                    <div className="w-full flex justify-center" dangerouslySetInnerHTML={{ __html: embedCode }} />
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Live Preview</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
