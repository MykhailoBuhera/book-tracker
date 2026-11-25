import { useEffect } from 'react'
import { NavLink, Outlet, useNavigation } from 'react-router'
import { useThemeStore } from '../shared/store/theme-store'
import { Toaster } from '../shared/ui/Toaster'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
  }`

export function Layout() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const navigation = useNavigation() // pending while a lazy page chunk loads

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-2">
        Перейти до вмісту
      </a>
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <NavLink to="/books" className="text-lg font-bold">
            📚 Book Tracker
          </NavLink>
          <nav aria-label="Головна навігація" className="flex items-center gap-1">
            <NavLink to="/books" className={navClass}>
              Каталог
            </NavLink>
            <NavLink to="/library" className={navClass}>
              Моя бібліотека
            </NavLink>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
              className="ml-2 rounded-lg px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        {navigation.state === 'loading' && (
          <div className="fixed inset-x-0 top-0 h-1 animate-pulse bg-indigo-500" role="progressbar" aria-label="Завантаження сторінки" />
        )}
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
