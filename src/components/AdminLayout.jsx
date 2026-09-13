import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronLeft
} from 'lucide-react'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { path: '/admin/dashboard', label: t('admin.nav.dashboard'), icon: LayoutDashboard },
    { path: '/admin/consultations', label: t('admin.nav.consultations'), icon: Inbox },
    { path: '/admin/projects', label: t('admin.nav.projects'), icon: FolderKanban },
    { path: '/admin/articles', label: t('admin.nav.articles'), icon: FileText },
    { path: '/admin/team', label: t('admin.nav.team'), icon: Users },
    { path: '/admin/users', label: t('admin.nav.users'), icon: Users }
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const isAr = lang === 'ar'

  return (
    <div className="admin-layout min-h-screen bg-gray-50">
      <aside
        className={`fixed top-0 z-40 h-full bg-navy text-white transition-transform duration-300 ease-in-out ${
          isAr ? 'right-0' : 'left-0'
        } ${
          sidebarOpen
            ? 'translate-x-0'
            : isAr
              ? 'translate-x-full lg:translate-x-0'
              : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: '260px' }}
        aria-label={t('admin.aria.sidebar')}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Building2 size={32} className="text-gold" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="font-bold text-lg">{t('admin.brandName')}</span>
                <span className="text-xs text-gray-400">{t('admin.brandSub')}</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto" aria-label={t('admin.aria.mainNav')}>
            <ul className="space-y-1" role="list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gold/20 text-gold'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={20} aria-hidden="true" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut size={20} aria-hidden="true" />
              <span className="font-medium">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`${isAr ? 'lg:mr-64' : 'lg:ml-64'} min-h-screen`}>
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              className="lg:hidden p-2 rounded-lg text-navy hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label={t('admin.aria.openMenu')}
              aria-expanded={sidebarOpen}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
            <div className="flex-1 lg:hidden" />
            <div className="flex items-center gap-4">
              <div className={`hidden sm:block ${isAr ? 'text-right' : 'text-left'}`}>
                <p className="text-sm font-medium text-navy">{user?.name}</p>
                <p className="text-xs text-text-muted capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6" id="main-content" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}