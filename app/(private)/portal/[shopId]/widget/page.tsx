"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
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
        <main className="min-h-screen bg-slate-50">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/portal/${shopId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Widget Branding</h1>
                    </div>
                    <div className="flex items-center gap-3">

                        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CONFIGURATION */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Design & Layout */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Design & Layout</h3>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {LAYOUTS.map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => setLayout(l.id)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${layout === l.id
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                        }`}
                                >
                                    <l.icon className={`w-8 h-8 mb-3 ${layout === l.id ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className="text-sm font-medium">{l.name}</span>
                                    {layout === l.id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <Label>Primary Color</Label>
                                <div className="flex items-center gap-2 p-2 border rounded-lg">
                                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer p-0" />
                                    <span className="text-sm font-mono text-gray-500 uppercase">{primaryColor}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Widget Width</Label>
                                <div className="h-10 border rounded-lg flex items-center px-3 bg-gray-50">
                                    <span className="text-sm text-gray-600">{widgetWidth}px</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>Width Slider</Label>
                                </div>
                                <Slider value={[widgetWidth]} min={280} max={800} step={10} onValueChange={(val) => setWidgetWidth(val[0])} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>Corner Radius</Label>
                                    <span className="text-sm text-gray-500">{borderRadius}px</span>
                                </div>
                                <Slider value={[borderRadius]} min={0} max={32} step={4} onValueChange={(val) => setBorderRadius(val[0])} />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6">Content</h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Image URL (Optional)</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <Input
                                            value={bannerImage}
                                            onChange={(e) => setBannerImage(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="pl-9"
                                        />
                                    </div>
                                    <Button variant="outline" onClick={() => setBannerImage("")} disabled={!bannerImage}>Clear</Button>
                                </div>
                                <p className="text-xs text-gray-500">Paste a direct link to a JPG or PNG image.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Title Text</Label>
                                <Input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={customDescription} onChange={(e) => setCustomDescription(e.target.value)} rows={3} placeholder="Describe your services..." />
                                <p className="text-xs text-gray-400">New lines will be respected.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Button Text</Label>
                                <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Logo URL (Optional)</Label>
                                </div>
                                <Input
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    placeholder="https://example.com/logo.png"
                                />
                                <p className="text-xs text-gray-500">Leave empty to use shop initial.</p>
                            </div>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6">Appearance</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Switch checked={showLogo} onCheckedChange={setShowLogo} />
                                    <Label>Display Company Logo</Label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Text Align</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['left', 'center', 'right'].map((align) => (
                                        <button
                                            key={align}
                                            onClick={() => setTextAlign(align)}
                                            className={`flex items-center justify-center p-2 rounded-lg border ${textAlign === align ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            <span className="capitalize text-sm">{align}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Embed Code */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Embed Code</h3>
                            <Button variant="outline" size="sm" onClick={handleCopyCode} className="h-8 gap-2">
                                {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                {copied ? "Copied" : "Copy Code"}
                            </Button>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-4 relative">
                            <code className="text-[10px] text-blue-300 font-mono block overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                                {embedCode}
                            </code>
                        </div>
                    </div>
                </div>

                {/* PREVIEW */}
                <div className="lg:col-span-7">
                    <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[600px] flex flex-col relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-8 border-b border-gray-100 pb-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-md px-3 py-1.5 text-xs text-gray-400 text-center mx-4">your-salon-website.com</div>
                        </div>
                        <div className="absolute inset-0 top-24 -z-0 bg-[url('/grid-pattern.svg')] opacity-50" />

                        <div className="relative flex-1 flex items-center justify-center p-4 lg:p-12 overflow-y-auto">
                            {/* Render the Generated HTML string directly in the preview to ensure fidelity */}
                            <div className="w-full flex justify-center" dangerouslySetInnerHTML={{ __html: embedCode }} />
                        </div>
                        <div className="text-center mt-4 text-xs text-gray-400">
                            * Preview shows exact embed code output
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
