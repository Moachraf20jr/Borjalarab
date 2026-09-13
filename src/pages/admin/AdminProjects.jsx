import { useState, useEffect } from 'react'
import { projectAPI, resolveImageUrl } from '../../services/api'
import { useLanguage } from '../../i18n/LanguageContext'
import { CATEGORY_KEY } from '../../i18n/translations'
import { Plus, Search, Filter, Edit, Trash2, Eye, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { useToast } from '../../hooks/useToast'

const projectCategories = ['سكني', 'تجاري', 'سكني/تجاري', 'إداري', 'عمراني']
const projectCategoriesEn = [
  'Residential',
  'Commercial',
  'Residential / Commercial',
  'Administrative',
  'Urban'
]

export default function AdminProjects() {
  const { t, lang } = useLanguage()
  const { success, error: toastError } = useToast()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [filters, setFilters] = useState({ search: '', category: '', isPublished: '', featured: '' })
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    category: '',
    categoryEn: '',
    description: '',
    descriptionEn: '',
    fullDescription: '',
    fullDescriptionEn: '',
    location: '',
    locationEn: '',
    year: new Date().getFullYear(),
    services: '',
    servicesEn: '',
    featured: false,
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

  const featuredOptions = [
    { value: '', label: t('admin.all') },
    { value: 'true', label: t('admin.featured') },
    { value: 'false', label: t('admin.notFeatured') }
  ]

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = { page: pagination.page, limit: pagination.limit, ...filters }
      const response = await projectAPI.getAll(params)
      setProjects(response.data.data || [])
      setPagination(prev => ({ ...prev, ...response.data.pagination }))
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || t('admin.projects.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
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

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      category: '',
      categoryEn: '',
      description: '',
      descriptionEn: '',
      fullDescription: '',
      fullDescriptionEn: '',
      location: '',
      locationEn: '',
      year: new Date().getFullYear(),
      services: '',
      servicesEn: '',
      featured: false,
      isPublished: true,
      image: null,
      imagePreview: ''
    })
    setEditingProject(null)
  }

  const openForm = (project = null) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        titleEn: project.titleEn || '',
        category: project.category,
        categoryEn: project.categoryEn || '',
        description: project.description,
        descriptionEn: project.descriptionEn || '',
        fullDescription: project.fullDescription || '',
        fullDescriptionEn: project.fullDescriptionEn || '',
        location: project.location || '',
        locationEn: project.locationEn || '',
        year: project.year,
        services: Array.isArray(project.services) ? project.services.join(', ') : project.services,
        servicesEn: Array.isArray(project.servicesEn) ? project.servicesEn.join(', ') : (project.servicesEn || ''),
        featured: project.featured,
        isPublished: project.isPublished,
        image: null,
        imagePreview: project.image || ''
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
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        fullDescription: formData.fullDescription,
        fullDescriptionEn: formData.fullDescriptionEn,
        location: formData.location,
        locationEn: formData.locationEn,
        year: formData.year,
        services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
        servicesEn: formData.servicesEn.split(',').map(s => s.trim()).filter(Boolean),
        featured: formData.featured,
        isPublished: formData.isPublished
      }

      if (editingProject) {
        await projectAPI.update(editingProject._id, { ...data, projectImage: formData.image })
        success(t('admin.projects.updated'))
      } else {
        await projectAPI.create({ ...data, projectImage: formData.image })
        success(t('admin.projects.created'))
      }
      setShowForm(false)
      resetForm()
      fetchProjects()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.projects.saveFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm.project'))) return
    try {
      await projectAPI.delete(id)
      success(t('admin.projects.deleted'))
      fetchProjects()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.projects.deleteFailed'))
    }
  }

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      await projectAPI.togglePublish(id)
      success(currentStatus ? t('admin.projects.publishOff') : t('admin.projects.publishOn'))
      fetchProjects()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.projects.publishToggleFailed'))
    }
  }

  if (loading && projects.length === 0) {
    return <Loading message={t('admin.loading.projects')} />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProjects} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">{t('admin.projects.title')}</h1>
          <p className="text-text-muted mt-1">{t('admin.projects.subtitle')}</p>
        </div>
        <button onClick={() => openForm()} className="btn btn-primary">
          <Plus size={18} aria-hidden="true" />
          {t('admin.add.project')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} aria-hidden="true" />
            <input
              type="text"
              placeholder={t('admin.search.projects')}
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
              {projectCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={filters.isPublished}
              onChange={(e) => handleFilterChange('isPublished', e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            >
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select
              value={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            >
              {featuredOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
                <th className="px-4 py-3 text-right font-semibold text-text-muted hidden lg:table-cell">{t('admin.col.year')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.status')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.featured')}</th>
                <th className="px-4 py-3 text-left font-semibold text-text-muted">{t('admin.col.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-text-muted">
                    {t('admin.empty.projects')}
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      {project.image ? (
                        <img src={resolveImageUrl(project.image)} alt="" className="w-16 h-10 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-navy truncate max-w-xs">{project.title}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold">
                        {lang === 'en' && CATEGORY_KEY[project.category] ? t(CATEGORY_KEY[project.category]) : project.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-text-muted">{project.year}</td>
                    <td className="px-4 py-4">
                      <select
                        value={project.isPublished.toString()}
                        onChange={(e) => handlePublishToggle(project._id, e.target.value === 'true')}
                        className="px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-gold/50 outline-none cursor-pointer"
                      >
                        <option value="true">{t('admin.published')}</option>
                        <option value="false">{t('admin.unpublished')}</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={project.featured.toString()}
                        onChange={(e) => {
                          const newFeatured = e.target.value === 'true'
                          projectAPI.update(project._id, { featured: newFeatured }).then(() => {
                            success(newFeatured ? t('admin.projects.featuredOn') : t('admin.projects.featuredOff'))
                            fetchProjects()
                          }).catch(() => toastError(t('admin.projects.featuredFailed')))
                        }}
                        className="px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-gold/50 outline-none cursor-pointer"
                      >
                        <option value="true">{t('admin.yes')}</option>
                        <option value="false">{t('admin.no')}</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openForm(project)}
                          className="p-2 text-text-muted hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                          aria-label={t('admin.aria.edit')}
                        >
                          <Edit size={18} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
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
              <h2 className="text-xl font-bold text-navy">{editingProject ? t('admin.modal.editProject') : t('admin.modal.addProject')}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-text-muted hover:text-navy rounded-lg hover:bg-gray-100" aria-label={t('admin.aria.close')}>
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.projectTitle')} <span className="text-gold">*</span></label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    required
                    placeholder={t('admin.placeholder.projectTitle')}
                  />
                </div>

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
                    {projectCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.year')}</label>
                  <input
                    type="number"
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.location')}</label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    placeholder={t('admin.placeholder.location')}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 md:col-span-2 pt-2">
                <div className="h-px flex-1 bg-gray-200" aria-hidden="true" />
                <span className="text-sm font-semibold text-gold">{t('admin.section.englishFields')}</span>
                <div className="h-px flex-1 bg-gray-200" aria-hidden="true" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="titleEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.projectTitle')} (English)</label>
                <input
                  type="text"
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="e.g. Private residential villa - Al Rakah district"
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
                  {projectCategoriesEn.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="locationEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.location')} (English)</label>
                <input
                  type="text"
                  id="locationEn"
                  value={formData.locationEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationEn: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="e.g. Al Khobar - Al Rakah district"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.shortDesc')} <span className="text-gold">*</span></label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  required
                  placeholder={t('admin.placeholder.shortDesc')}
                />
              </div>

              <div>
                <label htmlFor="descriptionEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.shortDesc')} (English)</label>
                <textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="Brief description shown on the project card..."
                />
              </div>

              <div>
                <label htmlFor="fullDescription" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.fullDesc')}</label>
                <textarea
                  id="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder={t('admin.placeholder.fullDesc')}
                />
              </div>

              <div>
                <label htmlFor="fullDescriptionEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.fullDesc')} (English)</label>
                <textarea
                  id="fullDescriptionEn"
                  value={formData.fullDescriptionEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullDescriptionEn: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="Detailed description shown on the project details page..."
                />
              </div>

              <div>
                <label htmlFor="services" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.services')}</label>
                <textarea
                  id="services"
                  value={formData.services}
                  onChange={(e) => setFormData(prev => ({ ...prev, services: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder={t('admin.placeholder.services')}
                />
              </div>

              <div>
                <label htmlFor="servicesEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.services')} (English)</label>
                <textarea
                  id="servicesEn"
                  value={formData.servicesEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, servicesEn: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="e.g. Architectural design, Structural design, Full supervision"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-2">{t('admin.field.image')}</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="projectImage"
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
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                  />
                  <span className="text-sm font-medium text-navy">{t('admin.field.featuredProject')}</span>
                </label>
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
                    editingProject ? t('admin.button.updateProject') : t('admin.button.addProject')
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