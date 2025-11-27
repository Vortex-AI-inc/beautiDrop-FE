"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, Users, Zap, Phone, CreditCard, LogOut, Menu, X } from "lucide-react"

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/profile", label: "Company Profile", icon: Settings },
  { href: "/portal/services", label: "Services", icon: Zap },
  { href: "/portal/staff", label: "Staff", icon: Users },
  { href: "/portal/publish", label: "Publish Agent", icon: Phone },
  { href: "/portal/plans", label: "Plans & Billing", icon: CreditCard },
]

export function PortalSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:static left-0 top-0 h-screen w-64 bg-muted border-r border-border transition-transform duration-300 z-40`}
      >
        <div className="p-6 space-y-8">
          {/* Logo */}
          <Link href="/portal" className="flex items-center gap-2 font-heading font-bold">
            <div className="w-8 h-8 bg-primary rounded-lg" />
            <span className="text-primary">BeautyDrop</span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary text-white" : "text-foreground hover:bg-muted-foreground/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="pt-8 border-t border-border">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setMobileOpen(false)} />}
    </>
  )
}
