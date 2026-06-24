/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { FiSend, FiAlertCircle, FiX, FiEdit2, FiPackage } from 'react-icons/fi'

const PREDEFINED_CATEGORIES = [
  'Sistemas Web', 'Landing Page', 'E-commerce', 'App Móvil', 'Dashboard', 'Portafolio', 'Blog', 'Saas', 'Otros'
]

const PREDEFINED_RUBROS = [
  'Tecnología', 'Salud', 'Educación', 'Inmobiliaria', 'Finanzas', 'Retail', 'Restaurante', 'Agencia', 'Logística', 'Legal', 'Otros'
]

const PREDEFINED_TECH = [
  'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Express', 'Supabase', 'Firebase', 'MongoDB', 'PostgreSQL', 'TypeScript', 'JavaScript', 'Python', 'PHP', 'WordPress', 'Figma'
]

export function ProjectForm({ project = null, onSave, onCancel, existingCategories = [], existingRubros = [], existingTechnologies = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Otros',
    rubro: '',
    technologies: [],
    link_url: '',
    github_url: '',
    image_url: '',
    sort_order: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [techInput, setTechInput] = useState('')
  const [showCategories, setShowCategories] = useState(false)
  const [showRubros, setShowRubros] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || 'Otros',
        rubro: project.rubro || '',
        technologies: Array.isArray(project.technologies) ? project.technologies : (project.technologies ? project.technologies.split(',').map(t=>t.trim()) : []),
        link_url: project.link_url || '',
        github_url: project.github_url || '',
        image_url: project.image_url || '',
        sort_order: project.sort_order || 0
      })
    }
  }, [project])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleTech = (tech) => {
    setFormData(prev => {
      const currentTechs = Array.isArray(prev.technologies) ? prev.technologies : [];
      if (currentTechs.includes(tech)) {
        return { ...prev, technologies: currentTechs.filter(t => t !== tech) }
      } else {
        return { ...prev, technologies: [...currentTechs, tech] }
      }
    })
  }

  const handleTechInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = techInput.trim();
      if (val && !formData.technologies.includes(val)) {
        setFormData(prev => ({
          ...prev,
          technologies: [...(Array.isArray(prev.technologies) ? prev.technologies : []), val]
        }));
      }
      setTechInput('');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('adminToken')
      const payload = {
        ...formData,
        technologies: Array.isArray(formData.technologies) ? formData.technologies.filter(Boolean) : []
      }
      
      const method = project ? 'PUT' : 'POST'
      if (project) payload.id = project.id

      const response = await fetch('/api/admin/db/projects', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error guardando proyecto')
      }

      onSave(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const token = localStorage.getItem('adminToken')
    
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('bucket', 'portfolio') // Supabase bucket

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setFormData(prev => ({ ...prev, image_url: data.url }))
      } else {
        if (data.error?.includes('Bucket not found')) {
          formDataUpload.set('bucket', 'documents')
          const res2 = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formDataUpload
          })
          const data2 = await res2.json()
          if (res2.ok && data2.success) {
            setFormData(prev => ({ ...prev, image_url: data2.url }))
            return
          }
        }
        throw new Error(data.error || 'Error subiendo imagen')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const categoriesList = [...new Set([...PREDEFINED_CATEGORIES, ...existingCategories])]
  const rubrosList = [...new Set([...PREDEFINED_RUBROS, ...existingRubros])]
  const techList = [...new Set([...PREDEFINED_TECH, ...existingTechnologies])]

  return (
    <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-dark-900 dark:text-white flex items-center gap-2">
          {project ? <><FiEdit2 /> Editar Proyecto</> : <><FiPackage /> Nuevo Proyecto</>}
        </h2>
        {onCancel && (
          <button onClick={onCancel} className="text-dark-500 hover:text-dark-900 dark:hover:text-white">
            <FiX size={24} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Título *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Descripción *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Categoría</label>
            <input 
              type="text" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              onFocus={() => setShowCategories(true)}
              onBlur={() => setTimeout(() => setShowCategories(false), 200)}
              placeholder="Sistemas Web, Landing Page..." 
              className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" 
              autoComplete="off"
            />
            {showCategories && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {categoriesList
                  .filter(cat => cat.toLowerCase().includes((formData.category || '').toLowerCase()))
                  .map(cat => (
                  <div 
                    key={cat} 
                    onClick={() => {
                      setFormData(prev => ({...prev, category: cat}))
                      setShowCategories(false)
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-dark-50 dark:hover:bg-dark-800 text-sm text-dark-900 dark:text-white"
                  >
                    {cat}
                  </div>
                ))}
                {categoriesList.filter(cat => cat.toLowerCase().includes((formData.category || '').toLowerCase())).length === 0 && (
                  <div className="px-4 py-2 text-sm text-dark-500">Presiona enter o guarda para crear nueva</div>
                )}
              </div>
            )}
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Rubro</label>
            <input 
              type="text" 
              name="rubro" 
              value={formData.rubro} 
              onChange={handleChange} 
              onFocus={() => setShowRubros(true)}
              onBlur={() => setTimeout(() => setShowRubros(false), 200)}
              placeholder="Inmobiliaria, Salud..." 
              className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" 
              autoComplete="off"
            />
            {showRubros && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {rubrosList
                  .filter(rubro => rubro.toLowerCase().includes((formData.rubro || '').toLowerCase()))
                  .map(rubro => (
                  <div 
                    key={rubro} 
                    onClick={() => {
                      setFormData(prev => ({...prev, rubro: rubro}))
                      setShowRubros(false)
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-dark-50 dark:hover:bg-dark-800 text-sm text-dark-900 dark:text-white"
                  >
                    {rubro}
                  </div>
                ))}
                {rubrosList.filter(rubro => rubro.toLowerCase().includes((formData.rubro || '').toLowerCase())).length === 0 && (
                  <div className="px-4 py-2 text-sm text-dark-500">Presiona enter o guarda para crear nuevo</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Tecnologías / Etiquetas</label>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {techList.map(tech => {
              const isSelected = formData.technologies?.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-dark-100 dark:bg-dark-800 border-dark-300 dark:border-dark-700 text-dark-700 dark:text-dark-300 hover:border-blue-500'}`}
                >
                  {tech}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2 items-center p-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700">
            {formData.technologies?.map(tech => {
              // Si no está en las predefinidas, la mostramos aquí como chip removible,
              // o podemos mostrarlas TODAS aquí. Mejor mostramos solo las personalizadas o todas?
              // Si la mostramos todas aquí es más claro qué hay seleccionado.
              return (
                <span key={tech} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {tech}
                  <button type="button" onClick={() => toggleTech(tech)} className="hover:text-red-500 ml-1"><FiX size={14}/></button>
                </span>
              )
            })}
            <input 
              type="text" 
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={handleTechInputKeyDown}
              placeholder="Escribe una etiqueta y presiona Enter..." 
              className="flex-1 min-w-[200px] bg-transparent outline-none text-sm dark:text-white px-2 py-1" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Link del Proyecto</label>
            <input type="url" name="link_url" value={formData.link_url} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">GitHub URL</label>
            <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Imagen del Proyecto</label>
          <div className="flex gap-4 items-center">
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="URL de la imagen o subir archivo..." className="flex-1 px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700" />
            <span className="text-sm text-dark-500">o</span>
            <label className={`bg-dark-200 dark:bg-dark-800 hover:bg-dark-300 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {uploadingImage ? 'Subiendo...' : 'Subir Imagen'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
          {formData.image_url && (
            <div className="mt-2">
              <img src={formData.image_url} alt="Vista previa" className="h-20 rounded-lg object-cover" />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition mt-6">
          <FiSend /> {loading ? 'Guardando...' : 'Guardar Proyecto'}
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
