/* eslint-disable @next/next/no-img-element */
'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { FiTrash2, FiArrowUp, FiArrowDown, FiPlus, FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify, FiLink, FiBold } from 'react-icons/fi'
import { BiColorFill } from 'react-icons/bi'

export function ManageAboutMe() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [linkModal, setLinkModal] = useState({ isOpen: false, index: null, lang: '', url: 'https://' })

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
      const data = json.data[0]
      if (!data.about_me_paragraphs) {
        data.about_me_paragraphs = []
      }
      if (!data.about_me_alignment) {
        data.about_me_alignment = 'left'
      }
      setProfile(data)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleParagraphChange = (index, lang, value) => {
    setProfile(prev => {
      const newParagraphs = [...(prev.about_me_paragraphs || [])]
      newParagraphs[index] = {
        ...newParagraphs[index],
        [lang]: value
      }
      return { ...prev, about_me_paragraphs: newParagraphs }
    })
  }

  const addParagraph = () => {
    setProfile(prev => ({
      ...prev,
      about_me_paragraphs: [...(prev.about_me_paragraphs || []), { es: '', en: '' }]
    }))
  }

  const removeParagraph = (index) => {
    setProfile(prev => {
      const newParagraphs = [...(prev.about_me_paragraphs || [])]
      newParagraphs.splice(index, 1)
      return { ...prev, about_me_paragraphs: newParagraphs }
    })
  }

  const moveParagraph = (index, direction) => {
    setProfile(prev => {
      const newParagraphs = [...(prev.about_me_paragraphs || [])]
      if (direction === 'up' && index > 0) {
        [newParagraphs[index], newParagraphs[index - 1]] = [newParagraphs[index - 1], newParagraphs[index]]
      } else if (direction === 'down' && index < newParagraphs.length - 1) {
        [newParagraphs[index], newParagraphs[index + 1]] = [newParagraphs[index + 1], newParagraphs[index]]
      }
      return { ...prev, about_me_paragraphs: newParagraphs }
    })
  }

  const insertFormatting = (index, lang, prefix, suffix) => {
    const id = `textarea-${index}-${lang}`
    const textarea = document.getElementById(id)
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    const selectedText = text.substring(start, end)
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end)
    
    handleParagraphChange(index, lang, newText)

    // Optional: restore focus and selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length)
    }, 0)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('adminToken')
    
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
      toast.success('Sección Sobre Mí guardada exitosamente')
      fetchProfile()
    } else {
      toast.error('Error al guardar')
    }
    setSaving(false)
  }

  if (loading) return <div className="text-center py-10">Cargando sección Sobre Mí...</div>

  return (
    <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Sobre Mí (About Me)</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <form className="space-y-8" onSubmit={handleSave}>
        <section className="pt-2 border-t border-dark-200 dark:border-dark-800">
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Foto de la sección Sobre Mí</label>
              <div className="flex gap-4 items-center">
                <input type="url" name="about_image_url" value={profile?.about_image_url || ''} onChange={handleChange} className="flex-1 p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="URL o subir imagen..." />
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  id="about-image-upload"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    toast.loading('Subiendo imagen...', { id: 'about-image-upload' });
                    const token = localStorage.getItem('adminToken');
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('bucket', 'portfolio');
                    try {
                      let res = await fetch('/api/admin/upload', {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData
                      });
                      let data = await res.json();
                      if (!res.ok && data.error?.includes('Bucket not found')) {
                        formData.set('bucket', 'documents');
                        res = await fetch('/api/admin/upload', {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${token}` },
                          body: formData
                        });
                        data = await res.json();
                      }
                      if (res.ok && data.success) {
                        setProfile(prev => ({...prev, about_image_url: data.url}));
                        toast.success('Imagen subida correctamente', { id: 'about-image-upload' });
                      } else {
                        throw new Error(data.error);
                      }
                    } catch (error) {
                      toast.error('Error al subir: ' + error.message, { id: 'about-image-upload' });
                    }
                  }}
                />
                <label htmlFor="about-image-upload" className="cursor-pointer bg-dark-200 hover:bg-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-800 dark:text-dark-200 px-4 py-2 rounded-lg flex items-center gap-2 border border-dark-300 dark:border-dark-700 whitespace-nowrap">
                  Subir Foto
                </label>
              </div>
              {profile?.about_image_url && (
                <div className="mt-3">
                  <img src={profile.about_image_url} alt="Vista previa" className="h-40 rounded-lg object-cover shadow-md" />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 dark:text-dark-300">Alineación del Texto de Descripción</label>
              <div className="flex bg-dark-100 dark:bg-dark-800 p-1 rounded-lg w-fit">
                {[
                  { value: 'left', icon: <FiAlignLeft />, label: 'Izquierda' },
                  { value: 'center', icon: <FiAlignCenter />, label: 'Centro' },
                  { value: 'right', icon: <FiAlignRight />, label: 'Derecha' },
                  { value: 'justify', icon: <FiAlignJustify />, label: 'Justificado' }
                ].map(align => (
                  <button
                    key={align.value}
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, about_me_alignment: align.value }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                      profile?.about_me_alignment === align.value 
                        ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                        : 'text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'
                    }`}
                    title={align.label}
                  >
                    {align.icon}
                    <span className="hidden sm:inline">{align.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-dark-800 dark:text-dark-200">Párrafos Dinámicos</h3>
                <button 
                  type="button" 
                  onClick={addParagraph}
                  className="flex items-center gap-2 text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <FiPlus /> Añadir Párrafo
                </button>
              </div>

              <div className="space-y-6">
                {profile?.about_me_paragraphs?.map((paragraph, index) => (
                  <div key={index} className="bg-dark-50 dark:bg-dark-950 p-4 rounded-xl border border-dark-200 dark:border-dark-800 relative">
                    <div className="flex justify-between items-center border-b border-dark-200 dark:border-dark-800 pb-2 mb-4">
                      <span className="font-bold text-primary-600 dark:text-primary-400">Párrafo {index + 1}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => moveParagraph(index, 'up')} disabled={index === 0} className="p-1.5 bg-dark-200 hover:bg-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700 rounded transition disabled:opacity-30">
                          <FiArrowUp />
                        </button>
                        <button type="button" onClick={() => moveParagraph(index, 'down')} disabled={index === profile.about_me_paragraphs.length - 1} className="p-1.5 bg-dark-200 hover:bg-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700 rounded transition disabled:opacity-30">
                          <FiArrowDown />
                        </button>
                        <button type="button" onClick={() => removeParagraph(index)} className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded transition ml-2">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Español */}
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="block text-xs font-medium dark:text-dark-400">Español</label>
                          <div className="flex gap-1">
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormatting(index, 'es', '<span class="text-crusta-800 dark:text-crusta-300 font-bold">', '</span>')} className="p-1.5 bg-crusta-100 text-crusta-800 hover:bg-crusta-200 dark:bg-crusta-900/30 dark:text-crusta-400 dark:hover:bg-crusta-900/50 rounded text-xs" title="Color Naranja">
                              <BiColorFill />
                            </button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormatting(index, 'es', '<span class="text-primary-700 dark:text-primary-400 font-bold">', '</span>')} className="p-1.5 bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 rounded text-xs" title="Color Azul">
                              <BiColorFill />
                            </button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormatting(index, 'es', '<span class="font-bold">', '</span>')} className="p-1.5 bg-dark-200 text-dark-800 hover:bg-dark-300 dark:bg-dark-800 dark:text-dark-300 dark:hover:bg-dark-700 rounded text-xs" title="Negrita">
                              <FiBold />
                            </button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => {
                              setLinkModal({ isOpen: true, index, lang: 'es', url: 'https://' })
                            }} className="p-1.5 bg-dark-200 text-dark-800 hover:bg-dark-300 dark:bg-dark-800 dark:text-dark-300 dark:hover:bg-dark-700 rounded text-xs" title="Enlace Naranja">
                              <FiLink />
                            </button>
                          </div>
                        </div>
                        <textarea 
                          id={`textarea-${index}-es`}
                          value={paragraph.es} 
                          onChange={(e) => handleParagraphChange(index, 'es', e.target.value)} 
                          rows={6} 
                          className="w-full p-3 border rounded-md dark:bg-dark-900 dark:border-dark-700 resize-y font-mono text-sm leading-relaxed" 
                          placeholder="Texto en español..."
                        ></textarea>
                      </div>

                      {/* Inglés */}
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="block text-xs font-medium dark:text-dark-400">Inglés</label>
                          <div className="flex gap-1">
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormatting(index, 'en', '<span class="text-crusta-800 dark:text-crusta-300 font-bold">', '</span>')} className="p-1.5 bg-crusta-100 text-crusta-800 hover:bg-crusta-200 dark:bg-crusta-900/30 dark:text-crusta-400 dark:hover:bg-crusta-900/50 rounded text-xs" title="Color Naranja">
                              <BiColorFill />
                            </button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormatting(index, 'en', '<span class="text-primary-700 dark:text-primary-400 font-bold">', '</span>')} className="p-1.5 bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 rounded text-xs" title="Color Azul">
                              <BiColorFill />
                            </button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormatting(index, 'en', '<span class="font-bold">', '</span>')} className="p-1.5 bg-dark-200 text-dark-800 hover:bg-dark-300 dark:bg-dark-800 dark:text-dark-300 dark:hover:bg-dark-700 rounded text-xs" title="Negrita">
                              <FiBold />
                            </button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => {
                              setLinkModal({ isOpen: true, index, lang: 'en', url: 'https://' })
                            }} className="p-1.5 bg-dark-200 text-dark-800 hover:bg-dark-300 dark:bg-dark-800 dark:text-dark-300 dark:hover:bg-dark-700 rounded text-xs" title="Enlace Naranja">
                              <FiLink />
                            </button>
                          </div>
                        </div>
                        <textarea 
                          id={`textarea-${index}-en`}
                          value={paragraph.en} 
                          onChange={(e) => handleParagraphChange(index, 'en', e.target.value)} 
                          rows={6} 
                          className="w-full p-3 border rounded-md dark:bg-dark-900 dark:border-dark-700 resize-y font-mono text-sm leading-relaxed" 
                          placeholder="Texto en inglés..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!profile?.about_me_paragraphs || profile.about_me_paragraphs.length === 0) && (
                  <div className="text-center p-8 bg-dark-50 dark:bg-dark-950 border border-dashed border-dark-300 dark:border-dark-700 rounded-xl">
                    <p className="text-dark-500 dark:text-dark-400">No hay párrafos agregados. Haz clic en &quot;Añadir Párrafo&quot; para empezar.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 mt-8 pt-4 border-t border-dark-200 dark:border-dark-800">
              <h4 className="text-md font-semibold text-dark-800 dark:text-dark-200 mb-4">Currículum Vitae (CV)</h4>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto del Botón CV (ES)</label>
                  <input type="text" name="cv_btn_text_es" value={profile?.cv_btn_text_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: Descargar CV" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-dark-300">Texto del Botón CV (EN)</label>
                  <input type="text" name="cv_btn_text_en" value={profile?.cv_btn_text_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="Ej: Download CV" />
                </div>
              </div>

              <label className="block text-sm font-medium mb-1 dark:text-dark-300">URL o Archivo PDF</label>
              <div className="flex gap-4 items-center">
                <input type="url" name="cv_url" value={profile?.cv_url || ''} onChange={handleChange} className="flex-1 p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700" placeholder="URL o subir PDF..." />
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
                    formData.append('bucket', 'documents'); 
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
                <label htmlFor="cv-upload" className="cursor-pointer bg-dark-200 hover:bg-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-800 dark:text-dark-200 px-4 py-2 rounded-lg flex items-center gap-2 border border-dark-300 dark:border-dark-700 whitespace-nowrap">
                  Subir PDF
                </label>
              </div>
            </div>

          </div>
        </section>
      </form>

      {/* Modal para el Link */}
      {linkModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Insertar Enlace</h3>
            <label className="block text-sm font-medium mb-1 dark:text-dark-300">URL del enlace:</label>
            <input 
              type="url" 
              value={linkModal.url}
              onChange={(e) => setLinkModal(prev => ({ ...prev, url: e.target.value }))}
              className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 mb-6"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setLinkModal({ isOpen: false, index: null, lang: '', url: 'https://' })}
                className="px-4 py-2 text-sm font-medium text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (linkModal.url) {
                    insertFormatting(linkModal.index, linkModal.lang, `<a href="${linkModal.url}" target="_blank" rel="noopener noreferrer" class="underline font-bold text-crusta-800 dark:text-crusta-300">`, '</a>');
                  }
                  setLinkModal({ isOpen: false, index: null, lang: '', url: 'https://' })
                }}
                className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition"
              >
                Insertar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
