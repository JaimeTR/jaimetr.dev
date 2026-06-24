/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { FiSave, FiArrowLeft, FiAlertCircle, FiCheckCircle, FiImage, FiX, FiLoader, FiZap } from 'react-icons/fi'

export function BlogEditor({ slug, onBack }) {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [newImage, setNewImage] = useState(null)
  const [generatingCover, setGeneratingCover] = useState(false)
  const [coverVariants, setCoverVariants] = useState([])
  const [showVariants, setShowVariants] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    excerpt: '',
    description: '',
    tags: '',
    content: '',
    is_featured: false
  })

  useEffect(() => {
    fetchBlog()
  }, [slug])

  const fetchBlog = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/blog/${slug}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123'}`
        }
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setBlog(data.data)
      setFormData({
        title: data.data.title || '',
        date: data.data.date || '',
        excerpt: data.data.excerpt || '',
        description: data.data.description || '',
        tags: data.data.tags ? data.data.tags.join(', ') : '',
        content: data.data.content || '',
        is_featured: data.data.is_featured || false
      })
      if (data.data.hasCoverImage) {
        setPreviewImage(data.data.coverImage)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('El archivo debe ser una imagen')
        return
      }
      setNewImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setNewImage(null)
    setPreviewImage(null)
  }

  const handleGenerateCover = async () => {
    setGeneratingCover(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/blog/generate-cover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123'}`
        },
        body: JSON.stringify({
          slug: slug,
          title: formData.title,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // Guardar las variantes y mostrarlas
      setCoverVariants(data.variants)
      setShowVariants(true)
      setSuccess('3 opciones de portada generadas. Selecciona tu favorita.')
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setGeneratingCover(false)
    }
  }

  const handleSelectVariant = async (variant) => {
    setGeneratingCover(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/blog/select-cover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123'}`
        },
        body: JSON.stringify({
          slug: slug,
          variantFilename: variant.filename
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // Actualizar la vista previa con la imagen seleccionada
      const newCoverUrl = `${data.coverUrl}?t=${Date.now()}`
      setPreviewImage(newCoverUrl)
      setShowVariants(false)
      setCoverVariants([])
      setSuccess('Portada seleccionada correctamente')
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setGeneratingCover(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const apiData = new FormData()
      apiData.append('title', formData.title)
      apiData.append('date', formData.date)
      apiData.append('excerpt', formData.excerpt)
      apiData.append('description', formData.description)
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t)
      apiData.append('tags', JSON.stringify(tagsArray))
      apiData.append('content', formData.content)
      apiData.append('is_featured', formData.is_featured)
      
      if (newImage) {
        apiData.append('coverImage', newImage)
      }

      const response = await fetch(`/api/admin/blog/${slug}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123'}`
        },
        body: formDataToSend
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setSuccess('Blog actualizado correctamente')
      setNewImage(null)
      setTimeout(() => {
        onBack?.()
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-8 border border-dark-200 dark:border-dark-800">
        <div className="flex items-center justify-center gap-2 text-dark-600 dark:text-dark-400">
          <FiLoader className="animate-spin" size={20} />
          Cargando blog...
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-2 text-red-700 dark:text-red-400">
        <FiAlertCircle className="flex-shrink-0 mt-0.5" />
        Blog no encontrado
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-dark-200 dark:hover:bg-dark-800 rounded-lg transition"
        >
          <FiArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-semibold text-dark-900 dark:text-white">Editar Blog</h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2 text-red-700 dark:text-red-400">
          <FiAlertCircle className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex gap-2 text-green-700 dark:text-green-400">
          <FiCheckCircle className="flex-shrink-0 mt-0.5" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={saving}
              className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Fecha
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={saving}
              className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          <div className="col-span-1 md:col-span-2 flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
              disabled={saving}
              className="w-5 h-5 text-blue-600 bg-white border-dark-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-dark-700 dark:text-dark-300">
              Destacar en la página principal (Home)
            </label>
          </div>
        </div>

        {/* Excerpt y Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Extracto (breve resumen)
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              disabled={saving}
              rows={3}
              className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Descripción (SEO)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={saving}
              rows={3}
              className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            Tags (separados por comas)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            disabled={saving}
            placeholder="javascript, react, web"
            className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        {/* Imagen */}
        <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            Imagen de Portada
          </label>
          <p className="text-xs text-dark-600 dark:text-dark-400 mb-3">
            Máximo 5MB. Opcional: deja vacío para mantener la imagen actual.
          </p>

          {previewImage ? (
            <div className="relative mb-3">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-dark-300 dark:border-dark-700"
              />
              {newImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={saving}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition disabled:opacity-50"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          ) : null}

          {!previewImage ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-300 dark:border-dark-700 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiImage className="text-dark-400 dark:text-dark-500 mb-2" size={24} />
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  Haz clic para cambiar imagen
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={saving}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={saving || generatingCover}
                className="hidden"
                id="image-input"
              />
              <button
                type="button"
                onClick={() => document.getElementById('image-input')?.click()}
                disabled={saving || generatingCover}
                className="flex-1 px-4 py-2 bg-dark-200 dark:bg-dark-800 hover:bg-dark-300 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-300 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiImage size={18} />
                Cambiar imagen
              </button>
              <button
                type="button"
                onClick={handleGenerateCover}
                disabled={saving || generatingCover}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generatingCover ? (
                  <>
                    <FiLoader className="animate-spin" size={18} />
                    Generando...
                  </>
                ) : (
                  <>
                    <FiZap size={18} />
                    Generar nueva
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={saving || generatingCover}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiX size={18} />
                Quitar
              </button>
            </div>
          )}
        </div>

        {/* Mostrar variantes de portada */}
        {showVariants && coverVariants.length > 0 && (
          <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Selecciona tu portada favorita
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coverVariants.map((variant, index) => (
                <div key={index} className="relative group">
                  <img
                    src={`${variant.url}?t=${Date.now()}`}
                    alt={variant.name}
                    className="w-full h-auto rounded-lg border-2 border-dark-300 dark:border-dark-700 cursor-pointer hover:border-blue-500 transition"
                    onClick={() => handleSelectVariant(variant)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => handleSelectVariant(variant)}
                      disabled={generatingCover}
                      className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                    >
                      Seleccionar
                    </button>
                  </div>
                  <p className="text-center mt-2 text-sm font-medium text-dark-700 dark:text-dark-300">
                    {variant.name}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setShowVariants(false)
                setCoverVariants([])
              }}
              className="mt-4 w-full px-4 py-2 bg-dark-200 dark:bg-dark-800 hover:bg-dark-300 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-300 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Contenido */}
        <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            Contenido (MDX)
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            disabled={saving}
            rows={12}
            className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none font-mono text-sm"
          />
        </div>

        {/* Botón de guardar */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
        >
          {saving ? (
            <>
              <FiLoader className="animate-spin" /> Guardando...
            </>
          ) : (
            <>
              <FiSave /> Guardar cambios
            </>
          )}
        </button>
      </form>
    </div>
  )
}
