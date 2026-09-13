import { useState, useEffect } from 'react'
import { consultationAPI } from '../../services/api'
import { useLanguage, formatLocalizedDate } from '../../i18n/LanguageContext'
import { projectTypeValue } from '../../i18n/translations'
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { useToast } from '../../hooks/useToast'

const statusConfig = {
  new: { key: 'admin.status.new', color: 'bg-blue-100 text-blue-700' },
  contacted: { key: 'admin.status.contacted', color: 'bg-yellow-100 text-yellow-700' },
  in_progress: { key: 'admin.status.inProgress', color: 'bg-purple-100 text-purple-700' },
  completed: { key: 'admin.status.completed', color: 'bg-green-100 text-green-700' },
  cancelled: { key: 'admin.status.cancelled', color: 'bg-red-100 text-red-700' }
}

export default function AdminConsultations() {
  const { t, lang } = useLanguage()
  const { success, error: toastError } = useToast()
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [filters, setFilters] = useState({ search: '', status: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const statusOptions = [
    { value: '', label: t('admin.filter.allStatuses') },
    ...Object.entries(statusConfig).map(([value, cfg]) => ({ value, label: t(cfg.key) }))
  ]

  const getProjectTypeLabel = (type) => {
    const key = projectTypeValue[type]
    return key ? t(key) : type
  }

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      const params = { page: pagination.page, limit: pagination.limit, ...filters }
      const response = await consultationAPI.getAll(params)
      setConsultations(response.data.data || [])
      setPagination(prev => ({ ...prev, ...response.data.pagination }))
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || t('admin.consultations.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConsultations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filters])

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await consultationAPI.updateStatus(id, newStatus)
      success(t('admin.consultations.statusUpdated'))
      fetchConsultations()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.consultations.statusUpdateFailed'))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleNotesUpdate = async (id, adminNotes) => {
    setUpdatingId(id)
    try {
      await consultationAPI.updateNotes(id, adminNotes)
      success(t('admin.consultations.notesSaved'))
      fetchConsultations()
      setShowModal(false)
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.consultations.notesFailed'))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm.consultation'))) return
    try {
      await consultationAPI.delete(id)
      success(t('admin.consultations.deleted'))
      fetchConsultations()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.consultations.deleteFailed'))
    }
  }

  const openDetails = (consultation) => {
    setSelectedConsultation(consultation)
    setShowModal(true)
  }

  if (loading && consultations.length === 0) {
    return <Loading message={t('admin.loading.consultations')} />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchConsultations} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">{t('admin.consultations.title')}</h1>
          <p className="text-text-muted mt-1">{t('admin.consultations.subtitle')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} aria-hidden="true" />
            <input
              type="text"
              placeholder={t('admin.search.consultations')}
              value={filters.search}
              onChange={handleSearch}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="status-filter" className="text-sm font-medium text-text-muted">{t('admin.filter.label')}</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={handleStatusChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            >
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline sm:hidden"
            >
              <Filter size={18} aria-hidden="true" />
              {t('admin.filter.button')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.client')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted hidden md:table-cell">{t('admin.col.mobile')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted hidden lg:table-cell">{t('admin.col.email')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.projectType')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.status')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.date')}</th>
                <th className="px-4 py-3 text-left font-semibold text-text-muted">{t('admin.col.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {consultations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-text-muted">
                    {t('admin.empty.consultations')}
                  </td>
                </tr>
              ) : (
                consultations.map((consultation) => {
                  const status = statusConfig[consultation.status] || statusConfig.new
                  return (
                    <tr key={consultation._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-navy">{consultation.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-text-muted">
                        {consultation.phone}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-text-muted">
                        {consultation.email}
                      </td>
                      <td className="px-4 py-4 text-text-muted">{getProjectTypeLabel(consultation.projectType)}</td>
                      <td className="px-4 py-4">
                        <select
                          value={consultation.status}
                          onChange={(e) => handleStatusUpdate(consultation._id, e.target.value)}
                          disabled={updatingId === consultation._id}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} border-0 focus:ring-2 focus:ring-gold/50 outline-none cursor-pointer`}
                        >
                          {Object.entries(statusConfig).map(([key, cfg]) => (
                            <option key={key} value={key}>{t(cfg.key)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-text-muted whitespace-nowrap">
                        {formatLocalizedDate(consultation.createdAt, lang)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetails(consultation)}
                            className="p-2 text-text-muted hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                            aria-label={t('admin.aria.view')}
                          >
                            <Eye size={18} aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleDelete(consultation._id)}
                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label={t('admin.aria.delete')}
                          >
                            <Trash2 size={18} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
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

      {showModal && selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">{t('admin.modal.details')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-text-muted hover:text-navy rounded-lg hover:bg-gray-100" aria-label={t('admin.aria.close')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">{t('admin.col.name')}</label>
                  <p className="text-navy">{selectedConsultation.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">{t('admin.col.mobile')}</label>
                  <p className="text-navy">{selectedConsultation.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">{t('admin.col.email')}</label>
                  <p className="text-navy">{selectedConsultation.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">{t('admin.col.projectType')}</label>
                  <p className="text-navy">{getProjectTypeLabel(selectedConsultation.projectType)}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-muted mb-1">{t('admin.col.status')}</label>
                  <select
                    value={selectedConsultation.status}
                    onChange={(e) => handleStatusUpdate(selectedConsultation._id, e.target.value)}
                    disabled={updatingId === selectedConsultation._id}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  >
                    {Object.entries(statusConfig).map(([key, cfg]) => (
                      <option key={key} value={key}>{t(cfg.key)}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-muted mb-1">{t('admin.col.date')}</label>
                  <p className="text-navy">{formatLocalizedDate(selectedConsultation.createdAt, lang)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">{t('admin.consultations.projectDetails')}</label>
                <p className="bg-gray-50 p-4 rounded-lg text-navy whitespace-pre-wrap">{selectedConsultation.details}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">{t('admin.consultations.adminNotes')}</label>
                <textarea
                  value={selectedConsultation.adminNotes || ''}
                  onChange={(e) => setSelectedConsultation(prev => prev ? { ...prev, adminNotes: e.target.value } : null)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder={t('admin.consultations.notesPlaceholder')}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleNotesUpdate(selectedConsultation._id, selectedConsultation.adminNotes)}
                  disabled={updatingId === selectedConsultation._id}
                  className="btn btn-primary"
                >
                  {updatingId === selectedConsultation._id ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      {t('admin.button.saving')}
                    </>
                  ) : (
                    t('admin.consultations.saveNotes')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}