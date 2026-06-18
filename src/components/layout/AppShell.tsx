import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { BrandMark } from '@/components/brand/BrandMark'
import { ScrollToHash } from '@/components/layout/ScrollToHash'
import { ServerSettings } from '@/components/layout/ServerSettings'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/learn', label: 'Learn' },
  { to: '/concepts', label: 'Concepts' },
]

export function NavBar() {
  const onLearnPage = useLocation().pathname.startsWith('/learn')

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <NavLink
          to="/"
          aria-label="Quereek home"
          className="min-w-0 transition-transform hover:scale-[1.02]"
        >
          <BrandMark
            iconClassName="size-9 sm:size-10"
            showWordmark
            wordmarkClassName="hidden text-2xl sm:inline sm:text-[1.6rem]"
          />
        </NavLink>
        <nav className="flex items-center gap-0.5 rounded-full border border-border/60 bg-card/60 p-1 shadow-sm sm:gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              data-tour={link.to === '/concepts' ? 'concepts-link' : undefined}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="ml-0.5 flex items-center gap-0.5 border-l border-border/60 pl-0.5 sm:ml-1 sm:gap-1 sm:pl-1">
            {onLearnPage && <ServerSettings />}
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
