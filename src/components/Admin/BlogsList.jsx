/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiAlertCircle, FiLoader, FiEye, FiEyeOff, FiStar, FiMenu } from 'react-icons/fi'
import { Reorder, useDragControls } from 'framer-motion'

export function BlogsList({ onSelectEdit, onGenerateNew }) {
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
          'Authorization': "Bearer " + (localStorage.getItem('adminToken'))
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
          'Authorization': "Bearer " + (localStorage.getItem('adminToken'))
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

  const handleStatusChange = async (slug, changes) => {
    // Optimistic update
    setBlogs(blogs.map(b => b.slug === slug ? { ...b, ...changes } : b))
    
    try {
      await fetch('/api/admin/blog/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + (localStorage.getItem('adminToken'))
        },
        body: JSON.stringify({
          updates: [{ slug, ...changes }]
        })
      })
    } catch (err) {
      console.error(err)
      fetchBlogs()
    }
  }

  const handleDragEnd = async () => {
    // Cuando termina de arrastrar, guardamos el nuevo orden de todos
    const updates = blogs.map((b, index) => ({
      slug: b.slug,
      featured_order: index + 1
    }))
    
    try {
      await fetch('/api/admin/blog/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + (localStorage.getItem('adminToken'))
        },
        body: JSON.stringify({ updates })
      })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {blogs.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={onGenerateNew}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white transition font-medium shadow-md shadow-blue-500/20"
          >
            <FiEdit2 size={14} />
            Generar blog con IA
          </button>
        </div>
      )}

      {blogs.length === 0 ? (
        <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-12 border border-dark-200 dark:border-dark-800 text-center">
          <p className="text-dark-600 dark:text-dark-400 mb-4">No hay blogs creados aún</p>
          <button
            onClick={onGenerateNew}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition font-medium"
          >
            <FiEdit2 size={14} />
            Crear el primero con IA
          </button>
        </div>
      ) : (
        <Reorder.Group axis="y" values={blogs} onReorder={setBlogs} className="grid gap-3 list-none p-0 m-0">
          {blogs.map(blog => (
            <Reorder.Item
              key={blog.slug}
              value={blog}
              id={blog.slug}
              onDragEnd={handleDragEnd}
              whileDrag={{ 
                scale: 1.02,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
                zIndex: 50
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="bg-dark-100 dark:bg-dark-900 rounded-lg border border-dark-200 dark:border-dark-800 overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition cursor-grab relative"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-4 sm:items-center">
                {/* Drag Handle */}
                <div className="flex-shrink-0 p-2 text-dark-400">
                  <FiMenu size={20} />
                </div>

                {/* Preview de imagen */}
                <div className="flex-shrink-0 w-24 h-24 bg-dark-200 dark:bg-dark-800 rounded-lg overflow-hidden pointer-events-none">
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
                  <h3 className={"font-semibold text-dark-900 dark:text-white truncate " + (blog.is_hidden ? 'opacity-50 line-through' : '')}>
                    {blog.title}
                  </h3>
                  <p className={"text-sm text-dark-600 dark:text-dark-400 line-clamp-2 mt-1 " + (blog.is_hidden ? 'opacity-50' : '')}>
                    {blog.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2 pointer-events-none">
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
                  <p className="text-xs text-dark-500 dark:text-dark-500 mt-2 pointer-events-none">
                    {blog.date}
                  </p>
                </div>

                {/* Todas las Acciones Alineadas Horizontalmente */}
                <div className="flex items-center gap-3 sm:flex-shrink-0 border-t sm:border-t-0 sm:border-l border-dark-200 dark:border-dark-800 pt-3 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                  
                  {/* Estado (Ocultar/Destacar) */}
                  <div className="flex gap-2">
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(blog.slug, { is_hidden: !blog.is_hidden }) }}
                      className={`p-2 rounded-lg transition ${blog.is_hidden ? 'bg-dark-200 text-dark-500 dark:bg-dark-800 dark:text-dark-500' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}
                      title={blog.is_hidden ? "Oculto - Click para Publicar" : "Público - Click para Ocultar"}
                    >
                      {blog.is_hidden ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newStatus = !blog.is_featured;
                        handleStatusChange(blog.slug, { is_featured: newStatus });
                      }}
                      className={`p-2 rounded-lg transition ${blog.is_featured ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500' : 'bg-dark-100 text-dark-400 hover:bg-dark-200 dark:bg-dark-800 dark:hover:bg-dark-700'}`}
                      title={blog.is_featured ? "Destacado" : "Destacar en Landing Page"}
                    >
                      <FiStar size={18} className={blog.is_featured ? "fill-current" : ""} />
                    </button>
                  </div>

                  <div className="w-px h-8 bg-dark-200 dark:bg-dark-800 mx-1"></div>

                  {/* Editar/Eliminar */}
                  <div className="flex gap-2">
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); onSelectEdit(blog.slug) }}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      title="Editar"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); handleDelete(blog.slug) }}
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
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  )
}
