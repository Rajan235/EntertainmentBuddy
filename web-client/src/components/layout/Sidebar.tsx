'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  List, 
  Sparkles, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Film,
  Gamepad2,
  BookOpen,
  Tv
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/hooks/useAuth'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  const navItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/lists', icon: List, label: 'My Lists' },
    { href: '/recommendations', icon: Sparkles, label: 'Recommendations' },
  ]

  const categoryItems = [
    { href: '/lists?category=movie', icon: Film, label: 'Movies' },
    { href: '/lists?category=series', icon: Tv, label: 'Series' },
    { href: '/lists?category=game', icon: Gamepad2, label: 'Games' },
    { href: '/lists?category=book', icon: BookOpen, label: 'Books' },
  ]

  return (
    <motion.aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold">
            W
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-gradient">WatchBuddy</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-card-hover text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        {!collapsed && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider px-3">
                Categories
              </p>
            </div>
            {categoryItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-card-hover text-muted-foreground hover:text-foreground"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-card-hover text-muted-foreground hover:text-foreground w-full"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full px-3 py-2 rounded-lg hover:bg-card-hover transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.aside>
  )
}