/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from 'react'
import { FiAlertCircle, FiCheck, FiCheckCircle, FiDownload, FiEdit2, FiEye, FiImage, FiLoader, FiSend, FiZap } from 'react-icons/fi'

const TEMAS_ALEATORIOS = [
  'Next.js 15 App Router: Server Components y Server Actions en produccion',
  'Arquitectura de RAG con LLMs para aplicaciones empresariales',
  'Optimizacion de Core Web Vitals en React 19',
  'TypeScript avanzado: tipos condicionales, infer y template literals',
  'Automatizaciones con IA: agentes, n8n y workflows inteligentes',
  'Supabase en produccion: RLS, Edge Functions y escalabilidad',
  'WordPress headless con Next.js como frontend',
  'Microservicios vs Monolito Modular: decision de arquitectura en 2025',
  'Docker multi-stage builds para aplicaciones Node.js y Python',
  'SEO tecnico avanzado: structured data, sitemaps dinamicos y Core Web Vitals',
  'Testing end-to-end con Playwright y CI/CD en GitHub Actions',
  'APIs con Hono.js y Edge Computing: la alternativa ligera a Express',
  'Patrones de caching: Redis, SWR, ISR y estrategias hibridas',
  'Autenticacion moderna: NextAuth, JWT, OAuth y magic links',
  'WebSockets vs SSE vs Polling: comunicacion en tiempo real',
  'Prisma ORM avanzado: migraciones, relaciones y optimizacion de queries'
]

export function BlogGeneratorForm() {
  const [provider, setProvider] = useState('groq')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [topic, setTopic] = useState('')
  const [currentTopic, setCurrentTopic] = useState(null)
  const [topicInput, setTopicInput] = useState('')

  const [titles, setTitles] = useState([])
  const [selectedTitle, setSelectedTitle] = useState(null)
  const [generatingTitles, setGeneratingTitles] = useState(false)

  const [content, setContent] = useState(null)
  const [editingContent, setEditingContent] = useState('')
  const [generatingContent, setGeneratingContent] = useState(false)

  const [covers, setCovers] = useState([])
  const [selectedCover, setSelectedCover] = useState(null)
  const [generatingCovers, setGeneratingCovers] = useState(false)
  const [downloadingCoverId, setDownloadingCoverId] = useState(null)

  const [publishing, setPublishing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const clearError = () => setError(null)
  const clearSuccess = () => setSuccess(null)

  const resetAll = () => {
    setCurrentTopic(null)
    setTopic('')
    setTitles([])
    setSelectedTitle(null)
    setContent(null)
    setEditingContent('')
    setCovers([])
    setSelectedCover(null)
    setShowPreview(false)
  }

  const handleGenerateTopic = () => {
    const randomTopic = TEMAS_ALEATORIOS[Math.floor(Math.random() * TEMAS_ALEATORIOS.length)]
    applyNewTopic(randomTopic)
  }

  const handleSetCustomTopic = () => {
    if (!topic.trim()) {
      setError('Ingresa un tema personalizado')
      return
    }
    const cleanTopic = topic.trim()
    applyNewTopic(cleanTopic)
  }

  const applyNewTopic = (newTopic) => {
    const clean = String(newTopic).trim()
    if (!clean) {
      setError('Ingresa un tema válido')
      return
    }
    setCurrentTopic(clean)
    setTopicInput(clean)
    setTitles([])
    setSelectedTitle(null)
    setContent(null)
    setEditingContent('')
    setCovers([])
    setSelectedCover(null)
    setShowPreview(false)
    setSuccess(`✨ Tema actualizado: "${clean}"`)
  }

  const handleGenerateTitles = async () => {
    if (!currentTopic) return
    setGeneratingTitles(true)
    clearError()

    try {
      const response = await fetch('/api/admin/blog/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ topic: currentTopic, provider })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setContent(null)
      setEditingContent('')
      setCovers([])
      setSelectedCover(null)

      setTitles(data.data.titles)
      setSelectedTitle(data.data.titles[0])
      setSuccess('✅ 3 títulos generados')
    } catch (err) {
      setError(err.message)
    } finally {
      setGeneratingTitles(false)
    }
  }

  const handleGenerateContent = async () => {
    if (!currentTopic || !selectedTitle) return
    setGeneratingContent(true)
    clearError()

    try {
      const response = await fetch('/api/admin/blog/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ topic: currentTopic, title: selectedTitle, provider })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setContent(data.data)
      setEditingContent(data.data.content || '')
      setSuccess('✅ Contenido generado')
    } catch (err) {
      setError(err.message)
    } finally {
      setGeneratingContent(false)
    }
  }

  const handleGenerateCovers = async () => {
    if (!currentTopic || !content) return
    setGeneratingCovers(true)
    clearError()

    try {
      const response = await fetch('/api/admin/blog/generate-covers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ title: selectedTitle || currentTopic, tags: [] })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setCovers(data.data.variants)
      setSelectedCover(data.data.variants[0])
      setSuccess('✅ 3 portadas generadas')
    } catch (err) {
      setError(err.message)
    } finally {
      setGeneratingCovers(false)
    }
  }

  const handleDownloadCover = (coverId) => {
    const cover = covers.find((c) => c.id === coverId)
    if (!cover) return

    setDownloadingCoverId(coverId)
    try {
      const link = document.createElement('a')
      link.href = cover.image
      link.download = `portada-${coverId}.webp`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setError('Error descargando portada')
    } finally {
      setDownloadingCoverId(null)
    }
  }

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',')
    const mimeMatch = arr[0]?.match(/:(.*?);/)
    const mime = mimeMatch ? mimeMatch[1] : 'image/webp'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) u8arr[n] = bstr.charCodeAt(n)
    return new Blob([u8arr], { type: mime })
  }

  const handlePublish = async (e) => {
    e.preventDefault()
    if (!currentTopic || !selectedTitle || !content || !selectedCover) {
      setError('Completa todos los campos: tema, título, contenido y portada')
      return
    }

    setPublishing(true)
    clearError()

    try {
      const blob = dataURLtoBlob(selectedCover.image)

      const formData = new FormData()
      formData.append('topic', currentTopic)
      formData.append('title', selectedTitle)
      formData.append('provider', provider)
      formData.append('content', editingContent)
      formData.append('coverImage', blob, 'portada.webp')

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setSuccess('🎉 ¡Artículo publicado exitosamente!')
      resetAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2 justify-between items-start text-sm text-red-700 dark:text-red-400">
          <span className="flex gap-2"><FiAlertCircle className="mt-0.5" />{error}</span>
          <button onClick={clearError} className="hover:bg-red-200 dark:hover:bg-red-800 px-2 py-1 rounded">✕</button>
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex gap-2 justify-between items-start text-sm text-green-700 dark:text-green-400">
          <span className="flex gap-2"><FiCheckCircle className="mt-0.5" />{success}</span>
          <button onClick={clearSuccess} className="hover:bg-green-200 dark:hover:bg-green-800 px-2 py-1 rounded">✕</button>
        </div>
      )}

      <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-4 border border-dark-200 dark:border-dark-800">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Proveedor de IA</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="groq">Groq (Llama 3.3 70B) - Recomendado</option>
          <option value="gemini">Google Gemini</option>
          <option value="openai">OpenAI</option>
        </select>
      </div>

      <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-4 border border-dark-200 dark:border-dark-800">
        <h2 className="text-lg font-semibold mb-3 text-dark-900 dark:text-white">Tema del Artículo</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Ej: Optimización de base de datos en MySQL"
            className="flex-1 px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleGenerateTopic}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <FiZap size={18} /> Aleatorio
            </button>
            <button
              onClick={() => applyNewTopic(topicInput)}
              disabled={!topicInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <FiCheck size={18} /> Guardar Tema
            </button>
          </div>
        </div>
        {currentTopic && (
          <p className="mt-2 text-sm text-dark-600 dark:text-dark-400">Tema actual: <span className="font-medium text-dark-900 dark:text-white">{currentTopic}</span></p>
        )}
      </div>

      {currentTopic && (
        <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white">2️⃣ Título del Artículo</h2>
            <button
              onClick={handleGenerateTitles}
              disabled={generatingTitles}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition"
            >
              {generatingTitles ? <FiLoader className="animate-spin" size={16} /> : <FiZap size={16} />}
              {generatingTitles ? 'Generando...' : 'Generar 3 Títulos'}
            </button>
          </div>

          {titles.length > 0 ? (
            <div className="grid gap-2">
              {titles.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTitle(title)
                    setContent(null)
                    setEditingContent('')
                    setCovers([])
                    setSelectedCover(null)
                  }}
                  className={`p-3 rounded-lg border-2 transition text-left ${
                    selectedTitle === title
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-dark-300 dark:border-dark-700 bg-white dark:bg-dark-800 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedTitle === title && <FiCheck className="text-blue-600" size={18} />}
                    <span className="text-dark-900 dark:text-white">{title}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-dark-600 dark:text-dark-400">Haz clic en &quot;Generar 3 Títulos&quot; para obtener opciones</p>
          )}
        </div>
      )}

      {currentTopic && (
        <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white">3️⃣ Contenido del Artículo</h2>
            <button
              onClick={handleGenerateContent}
              disabled={generatingContent || !selectedTitle}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition"
            >
              {generatingContent ? <FiLoader className="animate-spin" size={16} /> : <FiEdit2 size={16} />}
              {generatingContent ? 'Generando...' : 'Generar Contenido'}
            </button>
          </div>

          {!selectedTitle && <p className="text-dark-600 dark:text-dark-400 text-sm">Selecciona un título para habilitar el generador de contenido.</p>}

          {content ? (
            <div className="space-y-3">
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                rows={10}
              />
              <p className="text-xs text-dark-600 dark:text-dark-400">Puedes editar el contenido aquí</p>
            </div>
          ) : (
            <p className="text-dark-600 dark:text-dark-400">Haz clic en &quot;Generar Contenido&quot; para crear el contenido del artículo</p>
          )}
        </div>
      )}

      {currentTopic && content && (
        <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white">4️⃣ Imagen de Portada</h2>
            <button
              onClick={handleGenerateCovers}
              disabled={generatingCovers || !content}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition"
            >
              {generatingCovers ? <FiLoader className="animate-spin" size={16} /> : <FiImage size={16} />}
              {generatingCovers ? 'Generando...' : 'Generar 3 Portadas'}
            </button>
          </div>

          {covers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {covers.map((cover) => (
                <div
                  key={cover.id}
                  onClick={() => setSelectedCover(cover)}
                  className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                    selectedCover?.id === cover.id
                      ? 'border-blue-600 ring-2 ring-blue-500'
                      : 'border-dark-300 dark:border-dark-700 hover:border-blue-400'
                  }`}
                >
                  <img src={cover.image} alt={cover.name} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadCover(cover.id)
                      }}
                      disabled={downloadingCoverId === cover.id}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      {downloadingCoverId === cover.id ? <FiLoader className="animate-spin" size={18} /> : <FiDownload size={18} />}
                    </button>
                  </div>
                  <div className="p-2 bg-dark-800 dark:bg-dark-700 text-xs text-dark-300 dark:text-dark-400">
                    <p className="font-medium">{cover.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-600 dark:text-dark-400">Haz clic en &quot;Generar 3 Portadas&quot; para obtener opciones</p>
          )}
        </div>
      )}

      {currentTopic && selectedTitle && content && selectedCover && (
        <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-6 border border-dark-200 dark:border-dark-800">
          <h2 className="text-lg font-semibold mb-4 text-dark-900 dark:text-white">✅ Listo para Publicar</h2>

          <div className="space-y-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition"
            >
              <FiEye size={18} />
              {showPreview ? 'Ocultar' : 'Ver'} Vista Previa
            </button>

            {showPreview && (
              <div className="bg-white dark:bg-dark-800 p-4 rounded-lg space-y-4 border border-dark-300 dark:border-dark-700">
                <div>
                  <h3 className="text-sm font-semibold text-dark-600 dark:text-dark-400 mb-1">📌 Título:</h3>
                  <p className="text-dark-900 dark:text-white font-semibold">{selectedTitle}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-dark-600 dark:text-dark-400 mb-1">🖼️ Portada:</h3>
                  <img src={selectedCover.image} alt="Portada" className="w-full max-h-48 object-cover rounded" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-dark-600 dark:text-dark-400 mb-1">📝 Contenido (primeras líneas):</h3>
                  <p className="text-dark-700 dark:text-dark-300 text-sm line-clamp-4">{editingContent}</p>
                </div>
              </div>
            )}

            <button
              onClick={handlePublish}
              disabled={publishing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              {publishing ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Publicando...
                </>
              ) : (
                <>
                  <FiSend size={18} />
                  Publicar Artículo
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
