import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { articleAPI, resolveImageUrl } from '../services/api'
import { Calendar, User, Tag, ChevronLeft } from 'lucide-react'
import { useLanguage, localized, localizedCategory, formatLocalizedDate } from '../i18n/LanguageContext'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

export default function ArticleDetails() {
  const { slug } = useParams()
  const { lang, t } = useLanguage()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const response = await articleAPI.getBySlug(slug)
        setArticle(response.data.data)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || t('articles.notfound'))
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [slug])

  if (loading) {
    return <Loading message={t('articles.loadingDetail')} />
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState type="articles" message={t('articles.notfound')} />
      </div>
    )
  }

  const title = localized(article, 'title', lang)
  const content = localized(article, 'content', lang)
  const author = localized(article, 'author', lang)
  const category = localizedCategory(article, lang, t)
  const date = article.publishedAt || article.createdAt

  return (
    <>
      <section className="page-hero" style={{ backgroundImage: article.image ? `url(${resolveImageUrl(article.image)})` : 'none' }} aria-labelledby="article-title">
        <div className="absolute inset-0 bg-navy/85" aria-hidden="true" />
        <div className="container relative page-hero-content">
          <span className="section-label">{category}</span>
          <h1 id="article-title" className="page-hero-title">{title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <Calendar size={16} aria-hidden="true" />
              {formatLocalizedDate(date, lang)}
            </span>
            <span className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <User size={16} aria-hidden="true" />
              {author || t('articles.by')}
            </span>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="content-title">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {article.image && (
              <div className="rounded-xl overflow-hidden shadow-lg mb-8">
                <img src={resolveImageUrl(article.image)} alt={title} className="w-full h-auto" loading="eager" />
              </div>
            )}

            <article className="prose prose-rtl max-w-none">
              <div className="text-text-muted leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
            </article>

            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Tag size={18} className="text-gold" aria-hidden="true" />
                <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">{category}</span>
              </div>
              <Link to="/articles" className="text-link inline-flex items-center gap-2">
                <ChevronLeft size={20} aria-hidden="true" />
                {t('articles.back')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}