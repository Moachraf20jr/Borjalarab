import { Link } from 'react-router-dom'
import { resolveImageUrl } from '../services/api'
import { useLanguage, localized, localizedCategory, formatLocalizedDate } from '../i18n/LanguageContext'

export default function ArticleCard(props) {
  const { image, slug, date, publishedAt } = props
  const { lang, t } = useLanguage()
  const displayDate = date || publishedAt || ''
  const title = localized(props, 'title', lang)
  const description = localized(props, 'description', lang)
  const category = localizedCategory(props, lang, t)

  return (
    <article className="article-card">
      <div className="article-image">
        {image ? (
          <img src={resolveImageUrl(image)} alt="" loading="lazy" />
        ) : (
          <div className="article-image-placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="article-content">
        <div className="article-meta">
          {displayDate && <time className="article-date">{formatLocalizedDate(displayDate, lang)}</time>}
          <span className="article-category">{category}</span>
        </div>
        <h3 className="article-title">{title}</h3>
        <p className="article-desc">{description}</p>
        <Link to={slug ? `/articles/${slug}` : '/articles'} className="article-link text-link">
          {t('articles.readMore')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}