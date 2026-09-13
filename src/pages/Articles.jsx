import { useState, useEffect } from 'react'
import { articleAPI } from '../services/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { ARTICLE_CATEGORY_KEY } from '../i18n/translations'
import PageHero from '../components/PageHero'
import ArticleCard from '../components/ArticleCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

const categories = ['', 'إدارة المشاريع', 'الإشراف الهندسي', 'التصاميم التنفيذية', 'إدارة التكاليف', 'التصميم المعماري', 'مراحل المشروع']

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0, pages: 0 })
  const [category, setCategory] = useState('')
  const { lang, t } = useLanguage()

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await articleAPI.getPublic({ page: pagination.page, limit: pagination.limit, category })
      setArticles(response.data.data || [])
      setPagination(prev => ({ ...prev, ...response.data.pagination }))
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || t('articles.error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [pagination.page, category])

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const hero = (
    <PageHero
      label={t('articles.hero.label')}
      title={t('articles.hero.title')}
      description={t('articles.hero.desc')}
    />
  )

  const displayCategory = (cat) => {
    if (!cat) return t('projects.all')
    if (lang === 'ar') return cat
    return ARTICLE_CATEGORY_KEY[cat] || cat
  }

  if (loading && articles.length === 0) {
    return (
      <>
        {hero}
        <section className="section articles-section" aria-labelledby="articles-title">
          <div className="container">
            <Loading message={t('articles.loading')} />
          </div>
        </section>
      </>
    )
  }

  if (error) {
    return (
      <>
        {hero}
        <section className="section articles-section" aria-labelledby="articles-title">
          <div className="container">
            <ErrorMessage message={error} onRetry={fetchArticles} />
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {hero}
      <section className="section articles-section" aria-labelledby="articles-title">
        <div className="container">
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label={t('articles.filter')}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-gold text-white'
                    : 'bg-white border border-gray-200 text-text-muted hover:border-gold hover:text-gold'
                }`}
                aria-pressed={category === cat}
              >
                {displayCategory(cat)}
              </button>
            ))}
          </div>

          {articles.length === 0 ? (
            <EmptyState type="articles" message={t('articles.empty.title')} />
          ) : (
            <>
              <div className="articles-grid">
                {articles.map((article, index) => (
                  <ArticleCard key={article._id || index} {...article} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <nav className="pagination" aria-label={t('articles.pagination')}>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="page-btn"
                    aria-label={t('projects.prev')}
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setPagination(prev => ({ ...prev, page }))}
                      className={`page-btn ${pagination.page === page ? 'active' : ''}`}
                      aria-label={`${t('projects.page')} ${page}`}
                      aria-current={pagination.page === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="page-btn"
                    aria-label={t('projects.next')}
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}