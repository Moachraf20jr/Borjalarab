import { useState, useEffect } from 'react'
import { teamAPI, resolveImageUrl } from '../../services/api'
import { useLanguage } from '../../i18n/LanguageContext'
import { Plus, Search, Edit, Trash2, Loader2, ChevronLeft, ChevronRight, X, Users } from 'lucide-react'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { useToast } from '../../hooks/useToast'

const emptyForm = {
  name: '',
  nameEn: '',
  role: '',
  roleEn: '',
  bio: '',
  bioEn: '',
  sortOrder: 0,
  isActive: true,
  isPublished: true,
  image: null,
  imagePreview: ''
}

export default function AdminTeam() {
  const { t } = useLanguage()
  const { success, error: toastError } = useToast()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [filters, setFilters] = useState({ search: '', isActive: '', isPublished: '' })
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const activeOptions = [
    { value: '', label: t('admin.all') },
    { value: 'true', label: t('admin.active') },
    { value: 'false', label: t('admin.inactive') }
  ]

  const publishedOptions = [
    { value: '', label: t('admin.all') },
    { value: 'true', label: t('admin.published') },
    { value: 'false', label: t('admin.unpublished') }
  ]

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const params = { page: pagination.page, limit: pagination.limit, ...filters }
      const response = await teamAPI.getAll(params)
      setMembers(response.data.data || [])
      setPagination(prev => ({ ...prev, ...response.data.pagination }))
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || t('admin.team.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
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
    setFormData(emptyForm)
    setEditingMember(null)
  }

  const openForm = (member = null) => {
    if (member) {
      setEditingMember(member)
      setFormData({
        name: member.name,
        nameEn: member.nameEn || '',
        role: member.role,
        roleEn: member.roleEn || '',
        bio: member.bio || '',
        bioEn: member.bioEn || '',
        sortOrder: member.sortOrder ?? 0,
        isActive: member.isActive !== false,
        isPublished: member.isPublished !== false,
        image: null,
        imagePreview: member.image || ''
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
    if (!formData.name.trim()) {
      toastError(t('admin.toast.nameRequired'))
      return
    }
    setSubmitting(true)
    try {
      const data = {
        name: formData.name,
        nameEn: formData.nameEn,
        role: formData.role,
        roleEn: formData.roleEn,
        bio: formData.bio,
        bioEn: formData.bioEn,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
        isPublished: formData.isPublished
      }

      if (editingMember) {
        await teamAPI.update(editingMember._id, { ...data, teamImage: formData.image })
        success(t('admin.team.updated'))
      } else {
        await teamAPI.create({ ...data, teamImage: formData.image })
        success(t('admin.team.created'))
      }
      setShowForm(false)
      resetForm()
      fetchMembers()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.team.saveFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm.member'))) return
    try {
      await teamAPI.delete(id)
      success(t('admin.team.deleted'))
      fetchMembers()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.team.deleteFailed'))
    }
  }

  const handleActiveToggle = async (id, currentStatus) => {
    try {
      await teamAPI.toggleActive(id)
      success(currentStatus ? t('admin.team.activeOff') : t('admin.team.activeOn'))
      fetchMembers()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.team.toggleFailed'))
    }
  }

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      await teamAPI.togglePublish(id)
      success(currentStatus ? t('admin.team.publishOff') : t('admin.team.publishOn'))
      fetchMembers()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.team.toggleFailed'))
    }
  }

  if (loading && members.length === 0) {
    return <Loading message={t('admin.loading.team')} />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchMembers} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">{t('admin.team.title')}</h1>
          <p className="text-text-muted mt-1">{t('admin.team.subtitle')}</p>
        </div>
        <button onClick={() => openForm()} className="btn btn-primary">
          <Plus size={18} aria-hidden="true" />
          {t('admin.add.member')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} aria-hidden="true" />
            <input
              type="text"
              placeholder={t('admin.search.team')}
              value={filters.search}
              onChange={handleSearch}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            >
              {activeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select
              value={filters.isPublished}
              onChange={(e) => handleFilterChange('isPublished', e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            >
              {publishedOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.image')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.name')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted hidden md:table-cell">{t('admin.col.role')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted hidden lg:table-cell">{t('admin.col.sort')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.status')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.featured')}</th>
                <th className="px-4 py-3 text-left font-semibold text-text-muted">{t('admin.col.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-text-muted">
                    {t('admin.empty.team')}
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      {member.image ? (
                        <img src={resolveImageUrl(member.image)} alt="" className="w-12 h-12 object-cover rounded-full" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-gray-400" aria-hidden="true" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-navy truncate max-w-xs">{member.name}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-text-muted">{member.sortOrder}</td>
                    <td className="px-4 py-4">
                      <select
                        value={(member.isActive !== false).toString()}
                        onChange={(e) => handleActiveToggle(member._id, e.target.value === 'true')}
                        className="px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-gold/50 outline-none cursor-pointer"
                      >
                        <option value="true">{t('admin.active')}</option>
                        <option value="false">{t('admin.inactive')}</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={(member.isPublished !== false).toString()}
                        onChange={(e) => handlePublishToggle(member._id, e.target.value === 'true')}
                        className="px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-gold/50 outline-none cursor-pointer"
                      >
                        <option value="true">{t('admin.published')}</option>
                        <option value="false">{t('admin.unpublished')}</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openForm(member)}
                          className="p-2 text-text-muted hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                          aria-label={t('admin.aria.edit')}
                        >
                          <Edit size={18} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
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
              <h2 className="text-xl font-bold text-navy">{editingMember ? t('admin.modal.editMember') : t('admin.modal.addMember')}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-text-muted hover:text-navy rounded-lg hover:bg-gray-100" aria-label={t('admin.aria.close')}>
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.memberName')} <span className="text-gold">*</span></label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    required
                    placeholder={t('admin.placeholder.memberName')}
                  />
                </div>

                <div>
                  <label htmlFor="nameEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.memberName')} (English)</label>
                  <input
                    type="text"
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    placeholder="e.g. Eng. Ahmed Mohammed"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.jobRole')} <span className="text-gold">*</span></label>
                  <input
                    type="text"
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    required
                    placeholder={t('admin.placeholder.jobRole')}
                  />
                </div>

                <div>
                  <label htmlFor="roleEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.jobRole')} (English)</label>
                  <input
                    type="text"
                    id="roleEn"
                    value={formData.roleEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, roleEn: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    placeholder="e.g. Senior Consultant Engineer"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.bio')}</label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder={t('admin.placeholder.bio')}
                />
              </div>

              <div>
                <label htmlFor="bioEn" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.bio')} (English)</label>
                <textarea
                  id="bioEn"
                  value={formData.bioEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, bioEn: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="A short note about the member..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-2">{t('admin.field.memberImage')}</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="teamImage"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  />
                  {formData.imagePreview && (
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <img src={formData.imagePreview} alt={t('admin.preview')} className="w-full h-full object-cover rounded-full" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <label htmlFor="sortOrder" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.sortOrder')}</label>
                  <input
                    type="number"
                    id="sortOrder"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  />
                </div>
                <div className="md:pt-7">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-navy">{t('admin.field.activeVisible')}</span>
                  </label>
                </div>
              </div>

              <div>
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
                    editingMember ? t('admin.button.updateMember') : t('admin.button.addMember')
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