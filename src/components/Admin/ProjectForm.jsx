'use client'

import { useState } from 'react'
import { FiSend, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

export function ProjectForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technologies: '',
    link: '',
    github: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123'}`
        },
        body: JSON.stringify({
          type: 'project',
          data: {
            ...formData,
            technologies: formData.technologies.split(',').map(t => t.trim())
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error agregando proyecto')
      }

      setResult(data)
      setFormData({
        name: '',
        description: '',
        technologies: '',
        link: '',
        github: '',
        image: ''
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
      <h2 className="text-xl font-semibold mb-4 text-dark-900 dark:text-white flex items-center gap-2">
        🚀 Agregar Proyecto
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            Nombre del Proyecto *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Mi Proyecto Awesome"
            disabled={loading}
            className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe tu proyecto..."
            rows={3}
            disabled={loading}
            className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Tecnologías (separadas por comas)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Next.js, Tailwind"
              disabled={loading}
              className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Link del Proyecto
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
              disabled={loading}
              className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              GitHub
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/..."
              disabled={loading}
              className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Imagen (URL)
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              disabled={loading}
              className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <FiSend /> {loading ? 'Guardando...' : 'Agregar Proyecto'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2 text-sm text-red-700 dark:text-red-400">
          <FiAlertCircle className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex gap-2 text-sm text-green-700 dark:text-green-400">
          <FiCheckCircle className="flex-shrink-0 mt-0.5" />
          {result.message}
        </div>
      )}
    </div>
  )
}
