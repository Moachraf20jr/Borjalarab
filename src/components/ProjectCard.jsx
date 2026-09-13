import { Link } from 'react-router-dom'
import { resolveImageUrl } from '../services/api'
import { useLanguage, localized, localizedCategory } from '../i18n/LanguageContext'

export default function ProjectCard(props) {
  const { image, slug } = props
  const { lang, t } = useLanguage()
  const title = localized(props, 'title', lang)
  const description = localized(props, 'description', lang)
  const category = localizedCategory(props, lang, t)

  return (
    <article className="project-card">
      <div className="project-image">
        {image ? (
          <img src={resolveImageUrl(image)} alt="" loading="lazy" />
        ) : (
          <div className="project-image-placeholder" aria-hidden="true" />
        )}
        <span className="project-category">{category}</span>
      </div>
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <Link to={slug ? `/projects/${slug}` : '/projects'} className="project-link text-link">
          {t('projects.details')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}