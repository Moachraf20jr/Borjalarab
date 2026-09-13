import { useState, useEffect } from 'react'
import { articleAPI, resolveImageUrl } from '../../services/api'
import { useLanguage } from '../../i18n/LanguageContext'
import { ARTICLE_CATEGORY_KEY } from '../../i18n/translations'
import { Plus, Search, Filter, Edit, Trash2, Eye, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { useToast } from '../../hooks/useToast'

const articleCategories = [
  { ar: 'إدارة المشاريع', en: 'Project Management' },
  { ar: 'الإشراف الهندسي', en: 'Engineering Supervision' },
  { ar: 'التصاميم التنفيذية', en: 'Shop Drawings' },
  { ar: 'إدارة التكاليف', en: 'Cost Management' },
  { ar: 'التصميم المعماري', en: 'Architectural Design' },
  { ar: 'مراحل المشروع', en: 'Project Stages' }
]

export default function AdminArticles() {
  const { t, lang } = useLanguage()
  const { success, error: toastError } = useToast()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [filters, setFilters] = useState({ search: '', category: '', isPublished: '' })
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    category: '',
    categoryEn: '',
    excerpt: '',
    excerptEn: '',
    content: '',
    contentEn: '',
    author: 'مكتب برج العرب للاستشارات الهندسية',
    authorEn: '',
    isPublished: true,
    image: null,
    imagePreview: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const statusOptions = [
    { value: '', label: t('admin.filter.allStatuses') },
    { value: 'true', label: t('admin.published') },
    { value: 'false', label: t('admin.unpublished') }
  ]

  const defaultAuthor = lang === 'en' ? 'Burj Al Arab Engineering Consultancy Office' : 'مكتب برج العرب للاستشارات الهندسية'

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = { page: pagination.page, limit: pagination.limit, ...filters }
      const response = await articleAPI.getAll(params)
      setArticles(response.data.data || [])
      setPagination(prev => ({ ...prev, ...response.data.pagination }))
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || t('admin.articles.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filters])

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const freshForm = () => ({
    title: '',
    titleEn: '',
    category: '',
    categoryEn: '',
    excerpt: '',
    excerptEn: '',
    content: '',
    contentEn: '',
    author: defaultAuthor,
    authorEn: '',
    isPublished: true,
    image: null,
    imagePreview: ''
  })

  const resetForm = () => {
    setFormData(freshForm())
    setEditingArticle(null)
  }

  const openForm = (article = null) => {
    if (article) {
      setEditingArticle(article)
      setFormData({
        title: article.title,
        titleEn: article.titleEn || '',
        category: article.category,
        categoryEn: article.categoryEn || '',
        excerpt: article.excerpt,
        excerptEn: article.excerptEn || '',
        content: article.content,
        contentEn: article.contentEn || '',
        author: article.author,
        authorEn: article.authorEn || '',
        isPublished: article.isPublished,
        image: null,
        imagePreview: article.image || ''
      })
    } else {
      resetForm()
    }
    setShowForm(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastError(t('admin.toast.fileTooLarge'))
        return
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toastError(t('admin.toast.fileTypeNotSupported'))
        return
      }
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const data = {
        title: formData.title,
        titleEn: formData.titleEn,
        category: formData.category,
        categoryEn: formData.categoryEn,
        excerpt: formData.excerpt,
        excerptEn: formData.excerptEn,
        content: formData.content,
        contentEn: formData.contentEn,
        author: formData.author,
        authorEn: formData.authorEn,
        isPublished: formData.isPublished
      }

      if (editingArticle) {
        await articleAPI.update(editingArticle._id, { ...data, articleImage: formData.image })
        success(t('admin.articles.updated'))
      } else {
        await articleAPI.create({ ...data, articleImage: formData.image })
        success(t('admin.articles.created'))
      }
      setShowForm(false)
      resetForm()
      fetchArticles()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.articles.saveFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm.article'))) return
    try {
      await articleAPI.delete(id)
      success(t('admin.articles.deleted'))
      fetchArticles()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.articles.deleteFailed'))
    }
  }

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      await articleAPI.togglePublish(id)
      success(currentStatus ? t('admin.articles.publishOff') : t('admin.articles.publishOn'))
      fetchArticles()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.articles.publishToggleFailed'))
    }
  }

  if (loading && articles.length === 0) {
    return <Loading message={t('admin.loading.articles')} />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchArticles} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">{t('admin.articles.title')}</h1>
          <p className="text-text-muted mt-1">{t('admin.articles.subtitle')}</p>
        </div>
        <button onClick={() => openForm()} className="btn btn-primary">
          <Plus size={18} aria-hidden="true" />
          {t('admin.add.article')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} aria-hidden="true" />
            <input
              type="text"
              placeholder={t('admin.search.articles')}
              value={filters.search}
              onChange={handleSearch}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none min-w-[150px]"
            >
              <option value="">{t('admin.filter.allCategories')}</option>
              {articleCategories.map(cat =>
                <option key={cat.ar} value={cat.ar}>{lang === 'en' ? cat.en : cat.ar}</option>
              )}
            </select>
            <select
              value={filters.isPublished}
              onChange={(e) => handleFilterChange('isPublished', e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            >
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.image')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.title')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted hidden md:table-cell">{t('admin.col.category')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted hidden lg:table-cell">{t('admin.col.author')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.status')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.date')}</th>
                <th className="px-4 py-3 text-left font-semibold text-text-muted">{t('admin.col.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-text-muted">
                    {t('admin.empty.articles')}
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      {article.image ? (
                        <img src={resolveImageUrl(article.image)} alt="" className="w-16 h-10 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400" aria-hidden="true">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-navy truncate max-w-xs">{article.title}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold">
                        {lang === 'en' ? ARTICLE_CATEGORY_KEY[article.category] || article.category : article.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-text-muted">{lang === 'en' ? (article.authorEn || article.author) : article.author}</td>
                    <td className="px-4 py-4">
                      <select
                        value={article.isPublished.toString()}
                        onChange={(e) => handlePublishToggle(article._id, e.target.value === 'true')}
                        className="px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-gold/50 outline-none cursor-pointer"
                      >
                        <option value="true">{t('admin.published')}</option>
                        <option value="false">{t('admin.unpublished')}</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-text-muted whitespace-nowrap">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB')
                        : new Date(article.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openForm(article)}
                          className="p-2 text-text-muted hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                          aria-label={t('admin.aria.edit')}
                        >
                          <Edit size={18} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={t('admin.aria.delete')}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {t('admin.pagination.showing', {
                from: ((pagination.page - 1) * pagination.limit) + 1,
                to: Math.min(pagination.page * pagination.limit, pagination.total),
                total: pagination.total
              })}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('admin.aria.prev')}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
              <span className="px-3 text-sm font-medium text-navy">
                {t('admin.pagination.pageOf', { page: pagination.page, pages: pagination.pages })}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('admin.aria.next')}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-navy">{editingArticle ? t('admin.modal.editArticle') : t('admin.modal.addArticle')}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-text-muted hover:text-navy rounded-lg hover:bg-gray-100" aria-label={t('admin.aria.close')}>
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.articleTitle')} <span className="text-gold">*</span></label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  required
                  placeholder={t('admin.placeholder.articleTitle')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.category')} <span className="text-gold">*</span></label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    required
                  >
                    <option value="">{t('admin.placeholder.selectCategory')}</option>
                    {articleCategories.map(cat => <option key={cat.ar} value={cat.ar}>{cat.ar}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.author')}</label>
                  <input
                    type="text"
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    placeholder={t('admin.placeholder.author')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.excerpt')} <span className="text-gold">*</span></label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  required
                  placeholder={t('admin.placeholder.excerpt')}
                />
              </div>

              <div>
                <label htmlFor="excerptEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.excerpt')} (English)</label>
                <textarea
                  id="excerptEn"
                  value={formData.excerptEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerptEn: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="Article excerpt shown on the article card..."
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.content')} <span className="text-gold">*</span></label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-mono text-sm"
                  required
                  placeholder={t('admin.placeholder.content')}
                />
              </div>

              <div>
                <label htmlFor="contentEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.content')} (English)</label>
                <textarea
                  id="contentEn"
                  value={formData.contentEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, contentEn: e.target.value }))}
                  rows={10}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-mono text-sm"
                  placeholder="Write the full article content in English here..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1 bg-gray-200" aria-hidden="true" />
                <span className="text-sm font-semibold text-gold">{t('admin.section.englishFields')}</span>
                <div className="h-px flex-1 bg-gray-200" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="titleEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.articleTitle')} (English)</label>
                  <input
                    type="text"
                    id="titleEn"
                    value={formData.titleEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    placeholder="e.g. How to start a successful engineering project?"
                  />
                </div>

                <div>
                  <label htmlFor="categoryEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.category')} (English)</label>
                  <select
                    id="categoryEn"
                    value={formData.categoryEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryEn: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  >
                    <option value="">-- Select category --</option>
                    {articleCategories.map(cat => <option key={cat.en} value={cat.en}>{cat.en}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="authorEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.author')} (English)</label>
                  <input
                    type="text"
                    id="authorEn"
                    value={formData.authorEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorEn: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    placeholder="Burj Al Arab Engineering Consultancy Office"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-2">{t('admin.field.articleImage')}</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="articleImage"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  />
                  {formData.imagePreview && (
                    <div className="relative w-20 h-14 flex-shrink-0">
                      <img src={formData.imagePreview} alt={t('admin.preview')} className="w-full h-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: '' }))}
                        className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        aria-label={t('admin.aria.removeImage')}
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-1">{t('admin.field.maxFileNote')}</p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                  />
                  <span className="text-sm font-medium text-navy">{t('admin.field.published')}</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">{t('admin.button.cancel')}</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      {t('admin.button.saving')}
                    </>
                  ) : (
                    editingArticle ? t('admin.button.updateArticle') : t('admin.button.addArticle')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}