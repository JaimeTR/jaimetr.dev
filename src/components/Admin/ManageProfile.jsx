'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

export function ManageProfile() {
  const defaultButtonsOrder = ["cv", "linkedin", "github", "email", "facebook", "tiktok", "instagram", "button1", "button2"];
  const [profile, setProfile] = useState(null)
  const [buttonsOrder, setButtonsOrder] = useState(defaultButtonsOrder)
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
      setProfile(json.data[0])
      if (json.data[0].hero_buttons_order) {
        setButtonsOrder(json.data[0].hero_buttons_order)
      }
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const getVisibleButtons = () => {
    return buttonsOrder.filter(btn => {
      switch(btn) {
        case 'cv': return profile?.is_cv_visible !== false;
        case 'linkedin': return profile?.is_linkedin_visible !== false;
        case 'github': return profile?.is_github_visible !== false;
        case 'email': return profile?.is_email_visible !== false;
        case 'facebook': return profile?.is_facebook_visible === true;
        case 'tiktok': return profile?.is_tiktok_visible === true;
        case 'instagram': return profile?.is_instagram_visible === true;
        case 'button1': return profile?.is_button1_visible !== false;
        case 'button2': return profile?.is_button2_visible !== false;
        default: return false;
      }
    });
  }

  const moveButton = (visibleIndex, direction) => {
    const visibleBtns = getVisibleButtons();
    const btnId = visibleBtns[visibleIndex];
    let targetBtnId = null;

    if (direction === 'up' && visibleIndex > 0) {
      targetBtnId = visibleBtns[visibleIndex - 1];
    } else if (direction === 'down' && visibleIndex < visibleBtns.length - 1) {
      targetBtnId = visibleBtns[visibleIndex + 1];
    }

    if (btnId && targetBtnId) {
      const realIdx1 = buttonsOrder.indexOf(btnId);
      const realIdx2 = buttonsOrder.indexOf(targetBtnId);
      const newOrder = [...buttonsOrder];
      [newOrder[realIdx1], newOrder[realIdx2]] = [newOrder[realIdx2], newOrder[realIdx1]];
      setButtonsOrder(newOrder);
      setProfile(prev => ({ ...prev, hero_buttons_order: newOrder }));
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('adminToken')
    
    // Si no tiene id, hacemos un POST, sino un PUT
    const method = profile?.id ? 'PUT' : 'POST'
    const body = profile?.id ? profile : { ...profile, email: 'jaimetr1309@gmail.com' }

    const res = await fetch('/api/admin/db/profile', {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })
    
    if (res.ok) {
      toast.success('Perfil guardado exitosamente')
      fetchProfile()
    } else {
      toast.error('Error al guardar el perfil')
    }
    setSaving(false)
  }

  if (loading) return <div className="text-center py-10">Cargando perfil...</div>

  return (
    <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Perfil y Hero Banner</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <form className="space-y-8" onSubmit={handleSave}>
        {/* Sección: Hero Banner */}
        <section>
          <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-4 pb-2 border-b border-dark-200 dark:border-dark-800">1. Hero Banner (Inicio)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Foto de Perfil */}
            <div className="md:col-span-2">
              <h4 className="text-md font-semibold text-dark-800 dark:text-dark-200 mb-2">Foto de Perfil (Opcional - Reemplaza la imagen por defecto)</h4>
            </div>
            <div className="flex gap-2 md:col-span-2 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 dark:text-dark-300">URL de la Imagen</label>
                <div className="flex gap-2">
                  <input type="url" name="hero_image_url" value={profile?.hero_image_url || ''} onChange={handleChange} className="flex-1 p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: https://..." />
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    id="hero-image-upload"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      toast.loading('Subiendo imagen...', { id: 'hero-image-upload' });
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
                          setProfile(prev => ({...prev, hero_image_url: data.url}));
                          toast.success('Imagen subida correctamente', { id: 'hero-image-upload' });
                        } else {
                          throw new Error(data.error);
                        }
                      } catch (error) {
                        toast.error('Error al subir: ' + error.message, { id: 'hero-image-upload' });
                      }
                    }}
                  />
                  <label htmlFor="hero-image-upload" className="cursor-pointer bg-dark-200 hover:bg-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-800 dark:text-dark-200 px-4 py-2 rounded-lg flex items-center gap-2 border border-dark-300 dark:border-dark-700">
                    Subir Foto
                  </label>
                </div>
              </div>
            </div>

            {/* Efectos Visuales */}
            <div className="md:col-span-2 border-t border-dark-200 dark:border-dark-800 mt-2 pt-4">
              <h4 className="text-md font-semibold text-dark-800 dark:text-dark-200 mb-2">Efectos Visuales</h4>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300">
                  <input type="checkbox" checked={profile?.is_particles_visible !== false} onChange={(e) => setProfile(prev => ({...prev, is_particles_visible: e.target.checked}))} />
                  Mostrar Efecto de Partículas (Fondo)
                </label>
              </div>
            </div>

            {/* Saludo y Nombre */}
            <div className="md:col-span-2 border-t border-dark-200 dark:border-dark-800 mt-4 pt-4">
              <h4 className="text-md font-semibold text-dark-800 dark:text-dark-200 mb-2">1. Saludo Inicial</h4>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Saludo (ES) [Ej: Hola]</label>
              <input type="text" name="greeting_es" value={profile?.greeting_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Saludo (EN) [Ej: Hello]</label>
              <input type="text" name="greeting_en" value={profile?.greeting_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Nombre (ES) [Ej: soy Jaime T.R]</label>
              <input type="text" name="name_es" value={profile?.name_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Nombre (EN) [Ej: I am Jaime T.R]</label>
              <input type="text" name="name_en" value={profile?.name_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>

            <div className="md:col-span-2 mt-4">
              <h4 className="text-md font-semibold text-dark-800 dark:text-dark-200 mb-2">2. Profesiones (Texto con Brillo Animado)</h4>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Profesiones (ES)</label>
              <input type="text" name="hero_title_es" value={profile?.hero_title_es || ''} onChange={handleChange} placeholder="Ej: Ing de Sistemas | Fullstack | Web Developer" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Profesiones (EN)</label>
              <input type="text" name="hero_title_en" value={profile?.hero_title_en || ''} onChange={handleChange} placeholder="Ej: Sys Engineer | Fullstack | Web Developer" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>

            <div className="md:col-span-2 mt-4">
              <h4 className="text-md font-semibold text-dark-800 dark:text-dark-200 mb-2">Subtítulo (Dividido para colores y estilos)</h4>
              <p className="text-sm text-dark-500 mb-4">El subtítulo se divide en 4 partes para mantener el diseño original (Ej: [Parte 1] [Parte 2 (naranja)] [Parte 3 (azul)] [Parte 4])</p>
            </div>
            
            {/* Parte 1 */}
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Parte 1: Años de Exp (ES)</label>
              <input type="text" name="years_experience_es" value={profile?.years_experience_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Parte 1: Años de Exp (EN)</label>
              <input type="text" name="years_experience_en" value={profile?.years_experience_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>
            
            {/* Parte 2 (Naranja) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-crusta-600 dark:text-crusta-400">Parte 2: Roles [Naranja] (ES)</label>
              <input type="text" name="role_description_es" value={profile?.role_description_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-crusta-600 dark:text-crusta-400">Parte 2: Roles [Naranja] (EN)</label>
              <input type="text" name="role_description_en" value={profile?.role_description_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>

            {/* Parte 3 (Azul) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-daintree-600 dark:text-daintree-400">Parte 3: Especialidad [Azul] (ES)</label>
              <input type="text" name="specialization_es" value={profile?.specialization_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-daintree-600 dark:text-daintree-400">Parte 3: Especialidad [Azul] (EN)</label>
              <input type="text" name="specialization_en" value={profile?.specialization_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>

            {/* Parte 4 */}
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Parte 4: Cierre (ES)</label>
              <input type="text" name="availability_es" value={profile?.availability_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Parte 4: Cierre (EN)</label>
              <input type="text" name="availability_en" value={profile?.availability_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
            </div>

          </div>
        </section>

        {/* Sección: Redes Sociales */}
        <section>
          <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-4 pb-2 border-b border-dark-200 dark:border-dark-800">2. Redes y Contacto</h3>
          <div className="grid md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2 border-t border-dark-200 dark:border-dark-800 mt-4 pt-4">
              <h4 className="text-md font-semibold text-dark-800 dark:text-dark-200 mb-4">Redes Sociales y Enlaces Externos</h4>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 dark:text-dark-300">Email de Contacto</label>
                <input type="email" name="email" value={profile?.email || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300">
                  <input type="checkbox" checked={profile?.is_email_visible !== false} onChange={(e) => setProfile(prev => ({...prev, is_email_visible: e.target.checked}))} />
                  Mostrar
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 dark:text-dark-300">GitHub URL</label>
                <input type="url" name="github_url" value={profile?.github_url || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300">
                  <input type="checkbox" checked={profile?.is_github_visible !== false} onChange={(e) => setProfile(prev => ({...prev, is_github_visible: e.target.checked}))} />
                  Mostrar
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 dark:text-dark-300">LinkedIn URL</label>
                <input type="url" name="linkedin_url" value={profile?.linkedin_url || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300">
                  <input type="checkbox" checked={profile?.is_linkedin_visible !== false} onChange={(e) => setProfile(prev => ({...prev, is_linkedin_visible: e.target.checked}))} />
                  Mostrar
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 dark:text-dark-300">Facebook URL</label>
                <input type="url" name="facebook_url" value={profile?.facebook_url || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300">
                  <input type="checkbox" checked={profile?.is_facebook_visible === true} onChange={(e) => setProfile(prev => ({...prev, is_facebook_visible: e.target.checked}))} />
                  Mostrar
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 dark:text-dark-300">TikTok URL</label>
                <input type="url" name="tiktok_url" value={profile?.tiktok_url || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300">
                  <input type="checkbox" checked={profile?.is_tiktok_visible === true} onChange={(e) => setProfile(prev => ({...prev, is_tiktok_visible: e.target.checked}))} />
                  Mostrar
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 dark:text-dark-300">Instagram URL</label>
                <input type="url" name="instagram_url" value={profile?.instagram_url || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300">
                  <input type="checkbox" checked={profile?.is_instagram_visible === true} onChange={(e) => setProfile(prev => ({...prev, is_instagram_visible: e.target.checked}))} />
                  Mostrar
                </label>
              </div>
            </div>

            <div className="md:col-span-2 border-t border-dark-200 dark:border-dark-800 mt-4 pt-4">
              <h4 className="text-md font-semibold text-dark-800 dark:text-dark-200 mb-4">Currículum Vitae (CV)</h4>
            </div>

            <div className="flex gap-2 md:col-span-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 dark:text-dark-300">Enlace actual del CV</label>
                <div className="flex gap-2">
                  <input type="url" name="cv_url" value={profile?.cv_url || ''} onChange={handleChange} className="flex-1 p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: https://..." />
                  <input 
                    type="file" 
                    accept="application/pdf"
                    className="hidden" 
                    id="cv-upload"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      toast.loading('Subiendo CV...', { id: 'cv-upload' });
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
                          setProfile(prev => ({...prev, cv_url: data.url}));
                          toast.success('CV subido correctamente', { id: 'cv-upload' });
                        } else {
                          throw new Error(data.error);
                        }
                      } catch (error) {
                        toast.error('Error al subir: ' + error.message, { id: 'cv-upload' });
                      }
                    }}
                  />
                  <label htmlFor="cv-upload" className="cursor-pointer bg-dark-200 hover:bg-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-800 dark:text-dark-200 px-4 py-2 rounded-lg flex items-center gap-2 border border-dark-300 dark:border-dark-700">
                    Subir PDF
                  </label>
                </div>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300">
                  <input type="checkbox" checked={profile?.is_cv_visible !== false} onChange={(e) => setProfile(prev => ({...prev, is_cv_visible: e.target.checked}))} />
                  Mostrar
                </label>
              </div>
            </div>

            <div className="md:col-span-2 border-t border-dark-200 dark:border-dark-800 mt-4 pt-4">
              <h4 className="text-md font-semibold text-dark-800 dark:text-dark-200 mb-4">Botones Personalizados</h4>
              <p className="text-sm text-dark-500 mb-4">Usa estos botones para dirigir a secciones internas (ej. #projects, #articles) o enlaces externos que desees.</p>
            </div>

            <div className="p-4 border border-dark-200 dark:border-dark-800 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-medium text-dark-900 dark:text-white">Botón Personalizado 1</h5>
                <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300">
                  <input type="checkbox" checked={profile?.is_button1_visible !== false} onChange={(e) => setProfile(prev => ({...prev, is_button1_visible: e.target.checked}))} />
                  Mostrar
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-dark-300">Icono</label>
                  <select name="hero_button1_icon" value={profile?.hero_button1_icon || 'code'} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700">
                    <option value="code">Código (Proyectos)</option>
                    <option value="file-text">Documento (Artículos)</option>
                    <option value="briefcase">Maletín (Experiencia)</option>
                    <option value="user">Usuario (Sobre mí)</option>
                    <option value="layers">Capas (Servicios)</option>
                    <option value="link">Enlace (Genérico)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto (ES)</label>
                  <input type="text" name="hero_button1_text_es" value={profile?.hero_button1_text_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: Proyectos" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto (EN)</label>
                  <input type="text" name="hero_button1_text_en" value={profile?.hero_button1_text_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: Projects" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-1 dark:text-dark-300">Enlace (URL o #seccion)</label>
                  <input type="text" name="hero_button1_link" value={profile?.hero_button1_link || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: #projects" />
                </div>
              </div>
            </div>

            <div className="p-4 border border-dark-200 dark:border-dark-800 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-medium text-dark-900 dark:text-white">Botón Personalizado 2</h5>
                <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-dark-300">
                  <input type="checkbox" checked={profile?.is_button2_visible !== false} onChange={(e) => setProfile(prev => ({...prev, is_button2_visible: e.target.checked}))} />
                  Mostrar
                </label>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-dark-300">Icono</label>
                  <select name="hero_button2_icon" value={profile?.hero_button2_icon || 'file-text'} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700">
                    <option value="code">Código (Proyectos)</option>
                    <option value="file-text">Documento (Artículos)</option>
                    <option value="briefcase">Maletín (Experiencia)</option>
                    <option value="user">Usuario (Sobre mí)</option>
                    <option value="layers">Capas (Servicios)</option>
                    <option value="link">Enlace (Genérico)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto (ES)</label>
                  <input type="text" name="hero_button2_text_es" value={profile?.hero_button2_text_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: Artículos" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto (EN)</label>
                  <input type="text" name="hero_button2_text_en" value={profile?.hero_button2_text_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: Articles" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-1 dark:text-dark-300">Enlace (URL o #seccion)</label>
                  <input type="text" name="hero_button2_link" value={profile?.hero_button2_link || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: #articles" />
                </div>
              </div>
            </div>

            {/* Orden de Botones */}
            <div className="md:col-span-2 border-t border-dark-200 dark:border-dark-800 mt-4 pt-4">
              <h4 className="text-md font-semibold text-dark-800 dark:text-dark-200 mb-4">Orden de Botones</h4>
              <p className="text-sm text-dark-500 mb-4">Usa las flechas para reordenar cómo aparecerán los botones en la página principal.</p>
              
              <div className="space-y-2 bg-dark-50 dark:bg-dark-950 p-4 rounded-lg border border-dark-200 dark:border-dark-800">
                {getVisibleButtons().map((btn, idx, arr) => (
                  <div key={btn} className="flex justify-between items-center bg-white dark:bg-dark-900 p-2 rounded border border-dark-200 dark:border-dark-800">
                    <span className="text-sm font-medium dark:text-dark-200 capitalize">
                      {btn === 'button1' ? 'Botón Personalizado 1' : btn === 'button2' ? 'Botón Personalizado 2' : btn}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => moveButton(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 disabled:opacity-30 bg-dark-100 hover:bg-dark-200 dark:bg-dark-800 dark:hover:bg-dark-700 rounded transition"
                      >
                        <FiArrowUp className="dark:text-white" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => moveButton(idx, 'down')}
                        disabled={idx === arr.length - 1}
                        className="p-1 disabled:opacity-30 bg-dark-100 hover:bg-dark-200 dark:bg-dark-800 dark:hover:bg-dark-700 rounded transition"
                      >
                        <FiArrowDown className="dark:text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </form>
    </div>
  )
}
