'use client'

import { useState, useEffect } from 'react'
import { FiSend, FiAlertCircle, FiX, FiEdit2, FiBriefcase } from 'react-icons/fi'

export function ExperienceForm({ experience = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    role: '',
    role_en: '',
    company: '',
    company_en: '',
    date_string: '',
    date_en_string: '',
    start_date: '',
    end_date: '',
    description: '',
    description_en: '',
    sort_order: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (experience) {
      setFormData({
        role: experience.role || '',
        role_en: experience.role_en || '',
        company: experience.company || '',
        company_en: experience.company_en || '',
        date_string: experience.date_string || '',
        date_en_string: experience.date_en_string || '',
        start_date: experience.start_date || '',
        end_date: experience.end_date || '',
        description: experience.description || '',
        description_en: experience.description_en || '',
        sort_order: experience.sort_order || 0
      })
    }
  }, [experience])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('adminToken')
      const payload = { ...formData }
      if (!payload.start_date) payload.start_date = null
      if (!payload.end_date) payload.end_date = null
      
      const method = experience ? 'PUT' : 'POST'
      if (experience) payload.id = experience.id

      const response = await fetch('/api/admin/db/experience', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error guardando experiencia')
      
      onSave(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-dark-900 dark:text-white flex items-center gap-2">
          {experience ? <><FiEdit2 /> Editar Experiencia</> : <><FiBriefcase /> Nueva Experiencia</>}
        </h2>
        {onCancel && (
          <button onClick={onCancel} className="text-dark-500 hover:text-dark-900 dark:hover:text-white">
            <FiX size={24} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-dark-300">Puesto (ES) *</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-dark-300">Puesto (EN)</label>
            <input type="text" name="role_en" value={formData.role_en} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-dark-300">Empresa (ES) *</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-dark-300">Empresa (EN)</label>
            <input type="text" name="company_en" value={formData.company_en} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-dark-300">Texto Fecha (ES) *</label>
            <input type="text" name="date_string" value={formData.date_string} onChange={handleChange} required placeholder="Ene 2023 - Actualidad" className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-dark-300">Texto Fecha (EN)</label>
            <input type="text" name="date_en_string" value={formData.date_en_string} onChange={handleChange} placeholder="Jan 2023 - Present" className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-dark-300">Fecha Inicio Real</label>
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-dark-300">Fecha Fin Real</label>
            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 dark:text-dark-300">Descripción (ES)</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-dark-300">Descripción (EN)</label>
          <textarea name="description_en" value={formData.description_en} onChange={handleChange} rows={3} className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700 resize-none" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition">
          <FiSend /> {loading ? 'Guardando...' : 'Guardar Experiencia'}
        </button>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2 text-sm mt-4">
            <FiAlertCircle /> {error}
          </div>
        )}
      </form>
    </div>
  )
}
