'use client'
import { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiStar, FiEye, FiEyeOff, FiMenu } from 'react-icons/fi'
import { toast } from 'sonner'
import { Reorder } from 'framer-motion'

import { ProjectForm } from './ProjectForm'

export function ManageProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  // Stats Card Settings
  const [profileId, setProfileId] = useState(null)
  const [savingStats, setSavingStats] = useState(false)
  const [statsProjects, setStatsProjects] = useState(350)
  const [statsBgImage, setStatsBgImage] = useState('/developer.gif')
  const [statsTitleEs, setStatsTitleEs] = useState('PROYECTOS')
  const [statsTitleEn, setStatsTitleEn] = useState('PROJECTS')
  const [statsDescEs, setStatsDescEs] = useState('Experiencia continua y evolución técnica constante en cada línea de código.')
  const [statsDescEn, setStatsDescEn] = useState('Continuous experience and constant technical evolution in every line of code.')
  const [statsBtnTextEs, setStatsBtnTextEs] = useState('Ver todos los proyectos')
  const [statsBtnTextEn, setStatsBtnTextEn] = useState('View all projects')
  const [statsBtnLinkEs, setStatsBtnLinkEs] = useState('/proyectos')
  const [statsBtnLinkEn, setStatsBtnLinkEn] = useState('/projects')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/db/projects', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const json = await res.json()
    if (json.success) setProjects(json.data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))

    const profileRes = await fetch('/api/admin/db/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const profileJson = await profileRes.json()
    if (profileJson.success && profileJson.data.length > 0) {
      const p = profileJson.data[0];
      setProfileId(p.id)
      if (p.stats_projects_completed) setStatsProjects(p.stats_projects_completed)
      if (p.stats_card_bg_image) setStatsBgImage(p.stats_card_bg_image)
      if (p.stats_card_title_es) setStatsTitleEs(p.stats_card_title_es)
      if (p.stats_card_title_en) setStatsTitleEn(p.stats_card_title_en)
      if (p.stats_card_desc_es) setStatsDescEs(p.stats_card_desc_es)
      if (p.stats_card_desc_en) setStatsDescEn(p.stats_card_desc_en)
      if (p.stats_card_btn_text_es) setStatsBtnTextEs(p.stats_card_btn_text_es)
      if (p.stats_card_btn_text_en) setStatsBtnTextEn(p.stats_card_btn_text_en)
      if (p.stats_card_btn_link_es) setStatsBtnLinkEs(p.stats_card_btn_link_es)
      if (p.stats_card_btn_link_en) setStatsBtnLinkEn(p.stats_card_btn_link_en)
    }

    setLoading(false)
  }

  const handleSaveStats = async () => {
    if (!profileId) return
    setSavingStats(true)
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/db/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ 
        id: profileId, 
        stats_projects_completed: parseInt(statsProjects),
        stats_card_bg_image: statsBgImage,
        stats_card_title_es: statsTitleEs,
        stats_card_title_en: statsTitleEn,
        stats_card_desc_es: statsDescEs,
        stats_card_desc_en: statsDescEn,
        stats_card_btn_text_es: statsBtnTextEs,
        stats_card_btn_text_en: statsBtnTextEn,
        stats_card_btn_link_es: statsBtnLinkEs,
        stats_card_btn_link_en: statsBtnLinkEn
      })
    })
    if (res.ok) {
      toast.success('Configuración actualizada')
    } else {
      toast.error('Error al actualizar configuración')
    }
    setSavingStats(false)
  }

  const handleStatsImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSavingStats(true)
    const token = localStorage.getItem('adminToken')
    
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('bucket', 'portfolio')

    try {
      let res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      })
      let data = await res.json()
      
      if (!res.ok && data.error?.includes('Bucket not found')) {
        formDataUpload.set('bucket', 'documents')
        res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataUpload
        })
        data = await res.json()
      }

      if (res.ok && data.success) {
        setStatsBgImage(data.url)
        toast.success('Imagen subida correctamente')
      } else {
        throw new Error(data.error || 'Error al subir')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingStats(false)
    }
  }

  const handleSaveChanges = async () => {
    setIsReordering(true)
    const token = localStorage.getItem('adminToken')
    try {
      await Promise.all(projects.map((item, index) => {
        if (item.sort_order === index) return null
        return fetch('/api/admin/db/projects', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ id: item.id, sort_order: index })
        })
      }))
      toast.success('Cambios guardados correctamente')
      fetchProjects()
    } catch (error) {
      toast.error('Error al guardar los cambios')
    }
    setIsReordering(false)
  }

  const toggleFeatured = async (project) => {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/db/projects', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id: project.id, is_featured: !project.is_featured })
    })
    if (res.ok) fetchProjects()
  }

  const toggleVisibility = async (project) => {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/db/projects', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id: project.id, is_visible: !project.is_visible })
    })
    if (res.ok) fetchProjects()
  }

  const deleteProject = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este proyecto?')) return
    const token = localStorage.getItem('adminToken')
    const res = await fetch(`/api/admin/db/projects?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) fetchProjects()
  }

  if (loading) return <div className="text-center py-10">Cargando proyectos...</div>

  const existingCategories = [...new Set(projects.map(p => p.category).filter(Boolean))]
  const existingRubros = [...new Set(projects.map(p => p.rubro).filter(Boolean))]
  const existingTechnologies = [...new Set(projects.flatMap(p => p.technologies || []).filter(Boolean))]

  if (isCreating || editingProject) {
    return (
      <ProjectForm 
        project={editingProject} 
        existingCategories={existingCategories}
        existingRubros={existingRubros}
        existingTechnologies={existingTechnologies}
        onSave={(updatedProject) => {
          setIsCreating(false)
          setEditingProject(null)
          fetchProjects()
        }}
        onCancel={() => {
          setIsCreating(false)
          setEditingProject(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Gestión de Proyectos</h2>
          <p className="text-sm text-dark-500 mt-1">Arrastra los proyectos para cambiar su orden y haz clic en Guardar Orden.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSaveChanges}
            disabled={isReordering}
            className="bg-dark-200 dark:bg-dark-800 hover:bg-dark-300 dark:hover:bg-dark-700 text-dark-800 dark:text-dark-200 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {isReordering ? 'Guardando...' : 'Guardar Orden'}
          </button>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* Configuración de Tarjeta Flotante */}
      <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="font-bold text-lg text-dark-900 dark:text-white">Configuración de Tarjeta "Ver Proyectos"</h3>
            <p className="text-sm text-dark-500">Personaliza el texto e imagen de fondo de la tarjeta animada final.</p>
          </div>
          <button 
            onClick={handleSaveStats}
            disabled={savingStats}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition font-medium whitespace-nowrap"
          >
            {savingStats ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Proyectos Completados (+X)</label>
              <input 
                type="number" 
                value={statsProjects} 
                onChange={(e) => setStatsProjects(e.target.value)} 
                className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Título Principal (ES / EN)</label>
              <div className="flex gap-2">
                <input type="text" value={statsTitleEs} onChange={e => setStatsTitleEs(e.target.value)} placeholder="PROYECTOS" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
                <input type="text" value={statsTitleEn} onChange={e => setStatsTitleEn(e.target.value)} placeholder="PROJECTS" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Descripción (ES / EN)</label>
              <div className="flex flex-col gap-2">
                <input type="text" value={statsDescEs} onChange={e => setStatsDescEs(e.target.value)} placeholder="Experiencia continua..." className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
                <input type="text" value={statsDescEn} onChange={e => setStatsDescEn(e.target.value)} placeholder="Continuous experience..." className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Texto del Botón (ES / EN)</label>
              <div className="flex gap-2">
                <input type="text" value={statsBtnTextEs} onChange={e => setStatsBtnTextEs(e.target.value)} placeholder="Ver todos los proyectos" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" />
                <input type="text" value={statsBtnTextEn} onChange={e => setStatsBtnTextEn(e.target.value)} placeholder="View all projects" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">URL del Botón (ES / EN)</label>
              <div className="flex gap-2">
                <input type="text" value={statsBtnLinkEs} onChange={e => setStatsBtnLinkEs(e.target.value)} placeholder="/proyectos" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" />
                <input type="text" value={statsBtnLinkEn} onChange={e => setStatsBtnLinkEn(e.target.value)} placeholder="/projects" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" />
              </div>
              <p className="text-xs text-dark-500 mt-2">Puedes usar rutas internas o un enlace externo (ej. `https://mi-cv.com`).</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Imagen / GIF de fondo</label>
              <div className="flex gap-4 items-center">
                <input type="text" value={statsBgImage} onChange={e => setStatsBgImage(e.target.value)} placeholder="/developer.gif o URL..." className="flex-1 px-4 py-2 border rounded-lg dark:bg-dark-800 dark:border-dark-700 text-sm" />
                <label className={`bg-dark-200 dark:bg-dark-800 hover:bg-dark-300 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition whitespace-nowrap ${savingStats ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  Subir
                  <input type="file" accept="image/*" className="hidden" onChange={handleStatsImageUpload} disabled={savingStats} />
                </label>
              </div>
              {statsBgImage && (
                <div className="mt-3 relative w-full h-56 rounded-lg overflow-hidden border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-950">
                  <img src={statsBgImage} alt="Vista previa" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply dark:mix-blend-screen" />
                </div>
              )}
              <p className="text-xs text-dark-500 mt-2">Puedes subir una imagen, o dejar `/developer.gif` para usar la animación predeterminada.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda / Info de íconos */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 flex items-start gap-3">
        <div className="text-blue-500 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">¿Dónde se muestran mis proyectos?</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 mt-1 space-y-1">
            <li className="flex items-center gap-2">
              <FiStar className="text-yellow-500 fill-yellow-500" size={14} /> 
              <span><strong>Destacados (Estrella):</strong> Son los proyectos que se mostrarán en la página principal (Landing Page).</span>
            </li>
            <li className="flex items-center gap-2">
              <FiEyeOff className="text-red-500" size={14} /> 
              <span><strong>Ocultos (Ojo tachado):</strong> Estos proyectos NO se mostrarán en ningún lugar de tu portafolio.</span>
            </li>
          </ul>
        </div>
      </div>

      <Reorder.Group axis="y" values={projects} onReorder={setProjects} className="grid gap-3 list-none p-0 m-0">
        {projects.map((project) => (
          <Reorder.Item 
            key={project.id} 
            value={project}
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
            className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-4 flex items-center justify-between cursor-grab hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-sm relative"
          >
            <div className="flex items-center gap-4">
              <div className="text-dark-400 cursor-grab px-2">
                <FiMenu size={20} />
              </div>
              <img src={project.image_url} alt={project.title} className="w-16 h-16 rounded-lg object-cover bg-dark-100" />
              <div>
                <h3 className="font-bold text-dark-900 dark:text-white flex items-center gap-2">
                  {project.title}
                  {project.is_featured && <FiStar className="text-yellow-500 fill-yellow-500" size={14} />}
                  {!project.is_visible && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Oculto</span>}
                </h3>
                <p className="text-sm text-dark-500">{project.category} • {project.technologies?.join(', ')}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFeatured(project); }}
                className={`p-2 rounded-lg transition-colors ${project.is_featured ? 'bg-yellow-100 text-yellow-600' : 'bg-dark-100 text-dark-500 hover:bg-dark-200'}`}
                title={project.is_featured ? "Quitar del Home" : "Destacar en Home"}
              >
                <FiStar />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleVisibility(project); }}
                className={`p-2 rounded-lg transition-colors ${project.is_visible ? 'bg-dark-100 text-dark-500 hover:bg-dark-200' : 'bg-red-100 text-red-600'}`}
                title={project.is_visible ? "Ocultar" : "Mostrar"}
              >
                {project.is_visible ? <FiEye /> : <FiEyeOff />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setEditingProject(project); }}
                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                title="Editar Proyecto"
              >
                <FiEdit2 />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }} 
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
