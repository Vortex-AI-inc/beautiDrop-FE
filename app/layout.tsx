import type React from "react"
import type { Metadata } from "next"
import { ClerkProvider } from '@clerk/nextjs'
import RoleSync from '@/components/RoleSync'
import FCMHandler from '@/components/FCMHandler'
import { Toaster } from '@/components/ui/toaster'

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Poppins, Inter, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'


const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] })

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "BeautyDrop AI - AI for Beauty Salons",
  description: "Transform your salon with AI-powered voice agents, appointment booking, and customer engagement.",
  generator: "v0.app",
  metadataBase: new URL("https://beautydrop-ai.com"),
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "BeautyDrop AI",
    description: "AI-powered solutions for beauty salon management",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeautyDrop AI",
    description: "AI-powered solutions for beauty salon management",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.variable} ${inter.variable} font-sans antialiased`}>
          <RoleSync />
          <FCMHandler />
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
