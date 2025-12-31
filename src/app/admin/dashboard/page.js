'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/Admin/AdminHeader'
import { BlogGeneratorForm } from '@/components/Admin/BlogGeneratorForm'
import { BlogsList } from '@/components/Admin/BlogsList'
import { BlogEditor } from '@/components/Admin/BlogEditor'
import { ProjectForm } from '@/components/Admin/ProjectForm'
import { ExperienceForm } from '@/components/Admin/ExperienceForm'
import { FiFileText, FiPackage, FiBriefcase, FiEdit3 } from 'react-icons/fi'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('blog')
  const [editingSlug, setEditingSlug] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    setIsAuthenticated(true)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-dark-700 dark:text-dark-300">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const tabs = [
    {
      id: 'blog',
      label: 'Generar Blogs',
      icon: FiFileText,
      component: BlogGeneratorForm
    },
    {
      id: 'manage-blog',
      label: 'Gestionar Blogs',
      icon: FiEdit3,
      component: null // Manejo especial
    },
    {
      id: 'project',
      label: 'Agregar Proyecto',
      icon: FiPackage,
      component: ProjectForm
    },
    {
      id: 'experience',
      label: 'Agregar Experiencia',
      icon: FiBriefcase,
      component: ExperienceForm
    }
  ]

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <AdminHeader onLogout={() => setIsAuthenticated(false)} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setEditingSlug(null)
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-100 dark:bg-dark-900 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-800'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="grid gap-8">
          {activeTab === 'manage-blog' ? (
            editingSlug ? (
              <>
                <BlogEditor
                  slug={editingSlug}
                  onBack={() => setEditingSlug(null)}
                />
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">📝 Editor de Blogs</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Modifica el contenido, título, tags e imagen de portada de tu blog.
                  </p>
                </div>
              </>
            ) : (
              <>
                <BlogsList onSelectEdit={setEditingSlug} />
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">📚 Gestión de Blogs</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Visualiza todos tus blogs, edita su contenido, imagen de portada o elimina los que ya no necesites.
                  </p>
                </div>
              </>
            )
          ) : (
            <>
              {ActiveComponent && <ActiveComponent />}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Información</h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  {activeTab === 'blog' &&
                    'Los artículos se generan automáticamente usando IA. Se crearán los archivos MDX en src/posts/ y se generará una portada.'}
                  {activeTab === 'project' &&
                    'Los proyectos se agregan a tu portafolio y aparecerán en la sección de Proyectos.'}
                  {activeTab === 'experience' &&
                    'La experiencia laboral se añadirá a tu CV y aparecerá en la sección de Experiencia.'}
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
