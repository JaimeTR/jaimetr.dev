'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi'

export function ManageHeader() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/db/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const json = await res.json()
    if (json.success && json.data.length > 0) {
      let data = json.data[0]
      // Ensure header_links is an array
      if (!data.header_links || !Array.isArray(data.header_links)) {
        data.header_links = [
          {"id": "link1", "label_es": "Proyectos", "label_en": "Projects", "url_es": "/{lang}/#projects", "url_en": "/{lang}/#projects", "visible": true},
          {"id": "link2", "label_es": "Experiencia", "label_en": "Experience", "url_es": "/{lang}/#experience", "url_en": "/{lang}/#experience", "visible": true},
          {"id": "link3", "label_es": "Blog", "label_en": "Blog", "url_es": "/{lang}/articulos", "url_en": "/{lang}/posts", "visible": true},
          {"id": "link4", "label_es": "Servicios", "label_en": "Services", "url_es": "https://www.devmarkpe.com/", "url_en": "https://www.devmarkpe.com/", "visible": true}
        ]
      }
      
      // Ensure footer_links is an array
      if (!data.footer_links || !Array.isArray(data.footer_links)) {
        data.footer_links = [
          {"id": "flink1", "label_es": "Inicio", "label_en": "Home", "url_es": "/", "url_en": "/", "visible": true},
          {"id": "flink2", "label_es": "Experiencia", "label_en": "Experience", "url_es": "/#experience", "url_en": "/#experience", "visible": true},
          {"id": "flink3", "label_es": "Proyectos", "label_en": "Projects", "url_es": "/projects", "url_en": "/projects", "visible": true}
        ]
      }
      setProfile(data)
    }
    setLoading(false)
  }

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...profile.header_links]
    newLinks[index][field] = value
    setProfile(prev => ({ ...prev, header_links: newLinks }))
  }

  const moveHeaderLink = (index, direction) => {
    const newLinks = [...profile.header_links]
    if (direction === 'up' && index > 0) {
      const temp = newLinks[index - 1]
      newLinks[index - 1] = newLinks[index]
      newLinks[index] = temp
    } else if (direction === 'down' && index < newLinks.length - 1) {
      const temp = newLinks[index + 1]
      newLinks[index + 1] = newLinks[index]
      newLinks[index] = temp
    }
    setProfile(prev => ({ ...prev, header_links: newLinks }))
  }

  const moveFooterLink = (index, direction) => {
    const newLinks = [...profile.footer_links]
    if (direction === 'up' && index > 0) {
      const temp = newLinks[index - 1]
      newLinks[index - 1] = newLinks[index]
      newLinks[index] = temp
    } else if (direction === 'down' && index < newLinks.length - 1) {
      const temp = newLinks[index + 1]
      newLinks[index + 1] = newLinks[index]
      newLinks[index] = temp
    }
    setProfile(prev => ({ ...prev, footer_links: newLinks }))
  }

  const addHeaderLink = () => {
    const newLinks = [...(profile.header_links || [])]
    newLinks.push({
      id: `link_${Date.now()}`,
      label_es: 'Nuevo Enlace',
      label_en: 'New Link',
      url_es: '/',
      url_en: '/',
      visible: true
    })
    setProfile(prev => ({ ...prev, header_links: newLinks }))
  }

  const removeHeaderLink = (index) => {
    const newLinks = [...profile.header_links]
    newLinks.splice(index, 1)
    setProfile(prev => ({ ...prev, header_links: newLinks }))
  }

  const addFooterLink = () => {
    const newLinks = [...(profile.footer_links || [])]
    newLinks.push({
      id: `flink_${Date.now()}`,
      label_es: 'Nuevo Enlace',
      label_en: 'New Link',
      url_es: '/',
      url_en: '/',
      visible: true
    })
    setProfile(prev => ({ ...prev, footer_links: newLinks }))
  }

  const removeFooterLink = (index) => {
    const newLinks = [...profile.footer_links]
    newLinks.splice(index, 1)
    setProfile(prev => ({ ...prev, footer_links: newLinks }))
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setProfile(prev => ({ ...prev, [name]: checked }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('adminToken')
    
    const res = await fetch('/api/admin/db/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    })
    
    if (res.ok) {
      toast.success('Encabezado guardado exitosamente')
      fetchProfile()
    } else {
      toast.error('Error al guardar el encabezado')
    }
    setSaving(false)
  }

  if (loading) return <div className="text-center py-10">Cargando encabezado...</div>

  return (
    <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Encabezado (Navegación)</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <form className="space-y-8" onSubmit={handleSave}>
        
        {/* Logo */}
        <section>
          <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-4 pb-2 border-b border-dark-200 dark:border-dark-800">1. Logo</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">URL del Logo (Opcional - Si está vacío, mostrará texto &quot;Portafolio&quot;)</label>
              <div className="flex gap-2">
                <input type="url" value={profile?.header_logo_url || ''} onChange={(e) => setProfile(prev => ({...prev, header_logo_url: e.target.value}))} className="flex-1 p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: https://..." />
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  id="logo-upload"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    toast.loading('Subiendo logo...', { id: 'logo-upload' });
                    const token = localStorage.getItem('adminToken');
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await fetch('/api/admin/upload', {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData
                      });
                      const data = await res.json();
                      if (res.ok && data.success) {
                        setProfile(prev => ({...prev, header_logo_url: data.url}));
                        toast.success('Logo subido correctamente', { id: 'logo-upload' });
                      } else {
                        throw new Error(data.error);
                      }
                    } catch (error) {
                      toast.error('Error al subir: ' + error.message, { id: 'logo-upload' });
                    }
                  }}
                />
                <label htmlFor="logo-upload" className="cursor-pointer bg-dark-200 hover:bg-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-800 dark:text-dark-200 px-4 py-2 rounded-lg flex items-center gap-2 border border-dark-300 dark:border-dark-700">
                  Subir Imagen
                </label>
              </div>
            </div>
            {profile?.header_logo_url && (
              <div className="w-16 h-16 bg-dark-100 dark:bg-dark-950 rounded-lg border border-dark-200 dark:border-dark-800 flex items-center justify-center p-2 relative group">
                <img src={profile.header_logo_url} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                <button 
                  type="button"
                  onClick={() => setProfile(prev => ({...prev, header_logo_url: null}))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Switches */}
        <section>
          <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-4 pb-2 border-b border-dark-200 dark:border-dark-800">2. Opciones de Visualización</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer bg-dark-50 dark:bg-dark-950 p-4 rounded-lg border border-dark-200 dark:border-dark-800">
              <input type="checkbox" name="is_theme_switch_visible" checked={profile?.is_theme_switch_visible !== false} onChange={handleCheckboxChange} className="w-5 h-5 text-blue-600 rounded" />
              <span className="font-medium text-dark-800 dark:text-dark-200">Mostrar botón de Modo Oscuro/Claro</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer bg-dark-50 dark:bg-dark-950 p-4 rounded-lg border border-dark-200 dark:border-dark-800">
              <input type="checkbox" name="is_language_switch_visible" checked={profile?.is_language_switch_visible !== false} onChange={handleCheckboxChange} className="w-5 h-5 text-blue-600 rounded" />
              <span className="font-medium text-dark-800 dark:text-dark-200">Mostrar botón de Cambio de Idioma</span>
            </label>
          </div>
        </section>

        {/* Redes Sociales en Header */}
        <section>
          <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-4 pb-2 border-b border-dark-200 dark:border-dark-800">3. Redes Sociales en Encabezado</h3>
          <p className="text-sm text-dark-500 mb-4">Selecciona cuáles de tus redes sociales (configuradas en tu Perfil) quieres que aparezcan como íconos en la esquina del menú de navegación.</p>
          <div className="flex flex-wrap gap-4">
            {['linkedin', 'github', 'facebook', 'instagram', 'tiktok'].map(network => (
              <label key={network} className="flex items-center gap-2 cursor-pointer bg-dark-50 dark:bg-dark-950 px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-800">
                <input 
                  type="checkbox" 
                  name={`header_show_${network}`} 
                  checked={profile?.[`header_show_${network}`] === true || (profile?.[`header_show_${network}`] !== false && (network === 'linkedin' || network === 'github'))} 
                  onChange={handleCheckboxChange} 
                />
                <span className="font-medium text-dark-800 dark:text-dark-200 capitalize">{network}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Enlaces de Navegación */}
        <section>
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-dark-200 dark:border-dark-800">
            <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200">4. Enlaces de Menú</h3>
            <button type="button" onClick={addHeaderLink} className="text-sm bg-dark-200 hover:bg-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-800 dark:text-dark-200 px-4 py-2 rounded-lg">
              + Añadir Enlace
            </button>
          </div>
          <p className="text-sm text-dark-500 mb-4">Puedes usar {'{lang}'} en la URL si quieres que cambie dinámicamente según el idioma (Ej: /es/#projects o /en/#projects se vuelve /{"{lang}"}/#projects).</p>
          
          <div className="space-y-4">
            {profile?.header_links?.map((link, index) => (
              <div key={link.id || index} className="p-4 border border-dark-200 dark:border-dark-800 rounded-lg bg-dark-50 dark:bg-dark-950 relative group">
                <button type="button" onClick={() => removeHeaderLink(index)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">
                  <FiTrash2 size={16} />
                </button>
                <div className="flex justify-between items-center mb-4 pr-12">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <button type="button" onClick={() => moveHeaderLink(index, 'up')} disabled={index === 0} className="text-dark-400 hover:text-blue-600 disabled:opacity-30 p-1"><FiArrowUp size={16} /></button>
                      <button type="button" onClick={() => moveHeaderLink(index, 'down')} disabled={index === profile.header_links.length - 1} className="text-dark-400 hover:text-blue-600 disabled:opacity-30 p-1"><FiArrowDown size={16} /></button>
                    </div>
                    <h5 className="font-medium text-dark-900 dark:text-white">Enlace {index + 1}</h5>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300 bg-white dark:bg-dark-900 px-3 py-1 rounded border border-dark-200 dark:border-dark-800">
                    <input 
                      type="checkbox" 
                      checked={link.visible !== false} 
                      onChange={(e) => handleLinkChange(index, 'visible', e.target.checked)} 
                    />
                    Mostrar en menú
                  </label>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto (ES)</label>
                    <input type="text" value={link.label_es || ''} onChange={(e) => handleLinkChange(index, 'label_es', e.target.value)} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 bg-white dark:bg-dark-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto (EN)</label>
                    <input type="text" value={link.label_en || ''} onChange={(e) => handleLinkChange(index, 'label_en', e.target.value)} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 bg-white dark:bg-dark-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-dark-300">URL / Destino (ES)</label>
                    <input type="text" value={link.url_es || ''} onChange={(e) => handleLinkChange(index, 'url_es', e.target.value)} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 bg-white dark:bg-dark-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-dark-300">URL / Destino (EN)</label>
                    <input type="text" value={link.url_en || ''} onChange={(e) => handleLinkChange(index, 'url_en', e.target.value)} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 bg-white dark:bg-dark-900" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Pie de Página */}
        <section>
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-dark-200 dark:border-dark-800">
            <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200">5. Pie de Página (Footer)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto Copyright (ES)</label>
                <input type="text" value={profile?.footer_text_es || ''} onChange={(e) => setProfile(prev => ({...prev, footer_text_es: e.target.value}))} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 bg-white dark:bg-dark-900" placeholder="Portafolio" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto Copyright (EN)</label>
                <input type="text" value={profile?.footer_text_en || ''} onChange={(e) => setProfile(prev => ({...prev, footer_text_en: e.target.value}))} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 bg-white dark:bg-dark-900" placeholder="Portfolio" />
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 mb-2">
              <p className="text-sm text-dark-500">Enlaces del Pie de Página:</p>
              <button type="button" onClick={addFooterLink} className="text-sm bg-dark-200 hover:bg-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-800 dark:text-dark-200 px-4 py-2 rounded-lg">
                + Añadir Enlace
              </button>
            </div>
            
            {profile?.footer_links?.map((link, index) => (
              <div key={link.id || index} className="p-4 border border-dark-200 dark:border-dark-800 rounded-lg bg-dark-50 dark:bg-dark-950 relative group">
                <button type="button" onClick={() => removeFooterLink(index)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">
                  <FiTrash2 size={16} />
                </button>
                <div className="flex justify-between items-center mb-4 pr-12">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <button type="button" onClick={() => moveFooterLink(index, 'up')} disabled={index === 0} className="text-dark-400 hover:text-blue-600 disabled:opacity-30 p-1"><FiArrowUp size={16} /></button>
                      <button type="button" onClick={() => moveFooterLink(index, 'down')} disabled={index === profile.footer_links.length - 1} className="text-dark-400 hover:text-blue-600 disabled:opacity-30 p-1"><FiArrowDown size={16} /></button>
                    </div>
                    <h5 className="font-medium text-dark-900 dark:text-white">Enlace {index + 1}</h5>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300 bg-white dark:bg-dark-900 px-3 py-1 rounded border border-dark-200 dark:border-dark-800">
                    <input 
                      type="checkbox" 
                      checked={link.visible !== false} 
                      onChange={(e) => {
                        const newLinks = [...profile.footer_links]
                        newLinks[index].visible = e.target.checked
                        setProfile(prev => ({ ...prev, footer_links: newLinks }))
                      }} 
                    />
                    Mostrar en footer
                  </label>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto (ES)</label>
                    <input type="text" value={link.label_es || ''} onChange={(e) => {
                      const newLinks = [...profile.footer_links]
                      newLinks[index].label_es = e.target.value
                      setProfile(prev => ({ ...prev, footer_links: newLinks }))
                    }} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 bg-white dark:bg-dark-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto (EN)</label>
                    <input type="text" value={link.label_en || ''} onChange={(e) => {
                      const newLinks = [...profile.footer_links]
                      newLinks[index].label_en = e.target.value
                      setProfile(prev => ({ ...prev, footer_links: newLinks }))
                    }} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 bg-white dark:bg-dark-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-dark-300">URL (ES)</label>
                    <input type="text" value={link.url_es || ''} onChange={(e) => {
                      const newLinks = [...profile.footer_links]
                      newLinks[index].url_es = e.target.value
                      setProfile(prev => ({ ...prev, footer_links: newLinks }))
                    }} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 bg-white dark:bg-dark-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-dark-300">URL (EN)</label>
                    <input type="text" value={link.url_en || ''} onChange={(e) => {
                      const newLinks = [...profile.footer_links]
                      newLinks[index].url_en = e.target.value
                      setProfile(prev => ({ ...prev, footer_links: newLinks }))
                    }} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 bg-white dark:bg-dark-900" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </form>
    </div>
  )
}
