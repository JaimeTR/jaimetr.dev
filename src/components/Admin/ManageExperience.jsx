'use client'
import { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiStar, FiEye, FiEyeOff, FiMenu } from 'react-icons/fi'
import { ExperienceForm } from './ExperienceForm'
import { toast } from 'sonner'
import { Reorder } from 'framer-motion'

export function ManageExperience() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingExperience, setEditingExperience] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/db/experience', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const json = await res.json()
    if (json.success) {
      setExperiences(json.data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
    }
    setLoading(false)
  }

  const handleSaveChanges = async () => {
    setIsReordering(true)
    const token = localStorage.getItem('adminToken')
    try {
      await Promise.all(experiences.map((item, index) => {
        if (item.sort_order === index) return null
        return fetch('/api/admin/db/experience', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ id: item.id, sort_order: index })
        })
      }))
      toast.success('Cambios guardados correctamente')
      fetchExperiences()
    } catch (error) {
      toast.error('Error al guardar los cambios')
    }
    setIsReordering(false)
  }

  const toggleFeatured = async (exp) => {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/db/experience', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id: exp.id, is_featured: !exp.is_featured })
    })
    if (res.ok) fetchExperiences()
  }

  const toggleVisibility = async (exp) => {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/db/experience', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id: exp.id, is_active: !exp.is_active })
    })
    if (res.ok) fetchExperiences()
  }

  const deleteExperience = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta experiencia?')) return
    const token = localStorage.getItem('adminToken')
    const res = await fetch(`/api/admin/db/experience?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) fetchExperiences()
  }

  if (loading) return <div className="text-center py-10">Cargando experiencias...</div>

  if (isCreating || editingExperience) {
    return (
      <ExperienceForm 
        experience={editingExperience} 
        onSave={() => {
          setIsCreating(false)
          setEditingExperience(null)
          fetchExperiences()
        }}
        onCancel={() => {
          setIsCreating(false)
          setEditingExperience(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Gestion de Experiencia</h2>
          <p className="text-sm text-dark-500 mt-1">Arrastra las experiencias para cambiar su orden y haz clic en Guardar Orden.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button 
            onClick={handleSaveChanges}
            disabled={isReordering}
            className="bg-dark-200 dark:bg-dark-800 hover:bg-dark-300 dark:hover:bg-dark-700 text-dark-800 dark:text-dark-200 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 whitespace-nowrap"
          >
            {isReordering ? 'Guardando...' : 'Guardar Orden'}
          </button>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
          >
            <FiPlus /> Nueva Experiencia
          </button>
        </div>
      </div>

      {/* Leyenda / Info de íconos */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 flex items-start gap-3">
        <div className="text-blue-500 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">¿Dónde se muestra mi experiencia?</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 mt-1 space-y-1">
            <li className="flex items-center gap-2">
              <FiStar className="text-yellow-500 fill-yellow-500" size={14} /> 
              <span><strong>Destacados (Estrella):</strong> Son los items que se mostrarán en la página principal (Landing Page).</span>
            </li>
            <li className="flex items-center gap-2">
              <FiEyeOff className="text-red-500" size={14} /> 
              <span><strong>Ocultos (Ojo tachado):</strong> Esta experiencia NO se mostrará en ningún lugar de tu portafolio.</span>
            </li>
          </ul>
        </div>
      </div>

      <Reorder.Group axis="y" values={experiences} onReorder={setExperiences} className="grid gap-3 list-none p-0 m-0">
        {experiences.map((exp) => (
          <Reorder.Item 
            key={exp.id} 
            value={exp}
            whileDrag={{ 
              scale: 1.03,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
              zIndex: 50
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between cursor-grab hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-sm relative"
          >
            <div className="flex items-center gap-4">
              <div className="text-dark-400 cursor-grab px-2">
                <FiMenu size={20} />
              </div>
              <div>
                <h3 className="font-bold text-dark-900 dark:text-white flex items-center gap-2">
                  {exp.role} en {exp.company}
                  {exp.is_featured && <FiStar className="text-yellow-500 fill-yellow-500" size={14} />}
                  {!exp.is_active && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Oculta</span>}
                </h3>
                <p className="text-sm text-dark-500">{exp.date_string}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFeatured(exp); }}
                className={`p-2 rounded-lg transition-colors ${exp.is_featured ? 'bg-yellow-100 text-yellow-600' : 'bg-dark-100 text-dark-500 hover:bg-dark-200'}`}
                title={exp.is_featured ? "Quitar de Inicio" : "Destacar en Inicio"}
              >
                <FiStar />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleVisibility(exp); }}
                className={`p-2 rounded-lg transition-colors ${exp.is_active ? 'bg-dark-100 text-dark-500 hover:bg-dark-200' : 'bg-red-100 text-red-600'}`}
                title={exp.is_active ? "Ocultar" : "Mostrar"}
              >
                {exp.is_active ? <FiEye /> : <FiEyeOff />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setEditingExperience(exp); }}
                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                title="Editar"
              >
                <FiEdit2 />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteExperience(exp.id); }} 
                className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
              >
                <FiTrash2 />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
}
