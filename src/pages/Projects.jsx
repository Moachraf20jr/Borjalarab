import { useState, useEffect } from 'react'
import { projectAPI } from '../services/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { CATEGORY_KEY } from '../i18n/translations'
import PageHero from '../components/PageHero'
import ProjectCard from '../components/ProjectCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

const categories = ['', 'سكني', 'تجاري', 'سكني/تجاري', 'إداري', 'عمراني']

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 0 })
  const [category, setCategory] = useState('')
  const { lang, t } = useLanguage()

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectAPI.getPublic({ page: pagination.page, limit: pagination.limit, category })
      setProjects(response.data.data || [])
      setPagination(prev => ({ ...prev, ...response.data.pagination }))
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || t('projects.error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [pagination.page, category])

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const hero = (
    <PageHero
      label={t('projects.hero.label')}
      title={t('projects.hero.title')}
      description={t('projects.hero.desc')}
    />
  )

  const displayCategory = (cat) => {
    if (!cat) return t('projects.all')
    if (lang === 'ar') return cat
    return CATEGORY_KEY[cat] ? t(CATEGORY_KEY[cat]) : cat
  }

  if (loading && projects.length === 0) {
    return (
      <>
        {hero}
        <section className="section projects-section" aria-labelledby="projects-title">
          <div className="container">
            <Loading message={t('projects.loading')} />
          </div>
        </section>
      </>
    )
  }

  if (error) {
    return (
      <>
        {hero}
        <section className="section projects-section" aria-labelledby="projects-title">
          <div className="container">
            <ErrorMessage message={error} onRetry={fetchProjects} />
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {hero}
      <section className="section projects-section" aria-labelledby="projects-title">
        <div className="container">
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label={t('projects.filter')}>
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

          {projects.length === 0 ? (
            <EmptyState type="projects" message={t('projects.empty.title')} />
          ) : (
            <>
              <div className="projects-grid">
                {projects.map((project, index) => (
                  <ProjectCard key={project._id || index} {...project} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <nav className="pagination" aria-label={t('misc.pagination')}>
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