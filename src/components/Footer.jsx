import { NavLink } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { socialLinks, CONTACT_INFO } from '../config/social'
import logo from '../assets/images/logo.png'

export default function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    company: [
      { label: t('nav.home'), path: '/' },
      { label: t('nav.services'), path: '/services' },
      { label: t('nav.projects'), path: '/projects' },
      { label: t('nav.about'), path: '/about' },
      { label: t('nav.articles'), path: '/articles' },
    ],
    services: [
      { label: t('fsvc1'), path: '/services' },
      { label: t('svc9'), path: '/services' },
      { label: t('fsvc3'), path: '/services' },
      { label: t('svc3'), path: '/services' },
      { label: t('svc10'), path: '/services' },
    ],
    contact: [
      { icon: MapPin, label: CONTACT_INFO.location, href: '#' },
      { icon: Phone, label: CONTACT_INFO.phone, href: CONTACT_INFO.phoneHref },
      { icon: Mail, label: CONTACT_INFO.email, href: CONTACT_INFO.emailHref },
    ],
  }

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt={t('site.name')} className="footer-logo-img" />
            </div>
            <p className="footer-desc">{t('site.name')}</p>
            <div className="footer-social" role="list" aria-label={t('footer.socials')}>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="social-link"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={20} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav className="footer-nav" aria-label={t('footer.company')}>
            <h3 className="footer-title">{t('footer.company')}</h3>
            <ul>
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <NavLink to={link.path} className="footer-link">{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-nav" aria-label={t('footer.services')}>
            <h3 className="footer-title">{t('footer.services')}</h3>
            <ul>
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <NavLink to={link.path} className="footer-link">{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-contact" aria-label={t('footer.contact')}>
            <h3 className="footer-title">{t('footer.contact')}</h3>
            <ul>
              {footerLinks.contact.map(({ icon: Icon, label, href }, i) => (
                <li key={i} className="contact-item">
                  <Icon size={18} aria-hidden="true" />
                  <a href={href} className="footer-link">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  )
}