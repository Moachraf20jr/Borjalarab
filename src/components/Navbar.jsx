import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import logo from '../assets/images/logo.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { t } = useLanguage()

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/about', label: t('nav.about') },
    { path: '/articles', label: t('nav.articles') },
  ]

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="navbar" role="banner">
      <div className="container navbar-inner">
        <NavLink to="/" className="logo" aria-label={t('nav.home')}>
          <img src={logo} alt={t('site.name')} className="logo-img" />
          <div className="logo-text">
            <span className="logo-line">{t('nav.home') === 'Home' ? 'Burj Al Arab' : 'برج العرب'}</span>
            <span className="logo-sublime">{t('site.tagline')}</span>
          </div>
        </NavLink>

        <nav className={`nav-menu ${isOpen ? 'open' : ''}`} role="navigation" aria-label={t('nav.home') === 'Home' ? 'Main menu' : 'القائمة الرئيسية'}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <LanguageSwitcher />
          <button
            className="hamburger"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="nav-menu"
            aria-label={isOpen ? t('nav.close') : t('nav.open')}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  )
}