'use client'

import { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiAlertCircle, FiLoader } from 'react-icons/fi'

export function BlogsList({ onSelectEdit }) {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/blog', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123'}`
        }
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setBlogs(data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este blog?')) return

    setDeleting(slug)
    try {
      const response = await fetch(`/api/admin/blog/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123'}`
        }
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setBlogs(blogs.filter(b => b.slug !== slug))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-8 border border-dark-200 dark:border-dark-800">
        <div className="flex items-center justify-center gap-2 text-dark-600 dark:text-dark-400">
          <FiLoader className="animate-spin" size={20} />
          Cargando blogs...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-2 text-red-700 dark:text-red-400">
        <FiAlertCircle className="flex-shrink-0 mt-0.5" />
        {error}
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-12 border border-dark-200 dark:border-dark-800 text-center">
        <p className="text-dark-600 dark:text-dark-400">No hay blogs creados aún</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white">
          📚 Tus Blogs ({blogs.length})
        </h2>
        <button
          onClick={fetchBlogs}
          className="text-sm px-3 py-1 bg-dark-200 dark:bg-dark-800 hover:bg-dark-300 dark:hover:bg-dark-700 rounded text-dark-700 dark:text-dark-300 transition"
        >
          Actualizar
        </button>
      </div>

      <div className="grid gap-3">
        {blogs.map(blog => (
          <div
            key={blog.slug}
            className="bg-dark-100 dark:bg-dark-900 rounded-lg border border-dark-200 dark:border-dark-800 overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition"
          >
            <div className="flex gap-4 p-4">
              {/* Preview de imagen */}
              <div className="flex-shrink-0 w-24 h-24 bg-dark-200 dark:bg-dark-800 rounded-lg overflow-hidden">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3C/svg%3E'
                  }}
                />
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-dark-900 dark:text-white truncate">
                  {blog.title}
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-400 line-clamp-2 mt-1">
                  {blog.excerpt}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {blog.tags?.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {blog.tags?.length > 3 && (
                    <span className="text-xs px-2 py-1 text-dark-600 dark:text-dark-400">
                      +{blog.tags.length - 3}
                    </span>
                  )}
                </div>
                <p className="text-xs text-dark-500 dark:text-dark-500 mt-2">
                  {blog.date}
                </p>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onSelectEdit(blog.slug)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  title="Editar"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(blog.slug)}
                  disabled={deleting === blog.slug}
                  className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition disabled:opacity-50"
                  title="Eliminar"
                >
                  {deleting === blog.slug ? (
                    <FiLoader className="animate-spin" size={18} />
                  ) : (
                    <FiTrash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
