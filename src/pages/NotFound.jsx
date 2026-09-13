import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <section className="not-found" role="main">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-code" aria-hidden="true">404</div>
          <h1 className="not-found-title">{t('misc.notFound')}</h1>
          <p className="not-found-desc">
            {t('misc.notFoundDesc')}
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              <Home size={20} aria-hidden="true" />
              {t('misc.backHome')}
            </Link>
            <button className="btn btn-outline">
              <Search size={20} aria-hidden="true" />
              {t('misc.search')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}