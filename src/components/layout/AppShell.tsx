import { NavLink, Outlet } from 'react-router-dom'

import { BrandMark } from '@/components/brand/BrandMark'
import { ScrollToHash } from '@/components/layout/ScrollToHash'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/learn', label: 'Learn' },
  { to: '/concepts', label: 'Concepts' },
]

export function NavBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink
          to="/"
          aria-label="Quereek home"
          className="transition-transform hover:scale-[1.02]"
        >
          <BrandMark iconSize={40} wordmarkClassName="text-2xl sm:text-[1.6rem]" />
        </NavLink>
        <nav className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 shadow-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              data-tour={link.to === '/concepts' ? 'concepts-link' : undefined}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors sm:px-4',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="ml-1 border-l border-border/60 pl-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}

export function AppShell() {
  return (
    <div className="min-h-dvh">
      <ScrollToHash />
      <NavBar />
      <main className="pt-[var(--header-h)]">
        <Outlet />
      </main>
    </div>
  )
}
