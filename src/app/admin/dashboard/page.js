'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/Admin/AdminHeader'
import { BlogGeneratorForm } from '@/components/Admin/BlogGeneratorForm'
import { BlogsList } from '@/components/Admin/BlogsList'
import { BlogEditor } from '@/components/Admin/BlogEditor'
import { ManageProjects } from '@/components/Admin/ManageProjects'
import { ManageHeader } from '@/components/Admin/ManageHeader'
import { ManageProfile } from '@/components/Admin/ManageProfile'
import { ManageAboutMe } from '@/components/Admin/ManageAboutMe'
import { ManageExperience } from '@/components/Admin/ManageExperience'
import { ManageSkills } from '@/components/Admin/ManageSkills'
import { ManageSectionsModal } from '@/components/Admin/ManageSectionsModal'
import { FiFileText, FiPackage, FiBriefcase, FiEdit3, FiUser, FiCode, FiLayout, FiSmile, FiEdit2 } from 'react-icons/fi'

const baseComponents = {
  'header': { icon: FiLayout, component: ManageHeader },
  'profile': { icon: FiUser, component: ManageProfile },
  'aboutme': { icon: FiSmile, component: ManageAboutMe },
  'experience': { icon: FiBriefcase, component: ManageExperience },
  'project': { icon: FiPackage, component: ManageProjects },
  'manage-blog': { icon: FiEdit3, component: null }, // Manejo especial
  'skills': { icon: FiCode, component: ManageSkills }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('header')
  const [editingSlug, setEditingSlug] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sectionsConfig, setSectionsConfig] = useState([])
  const [isEditingSections, setIsEditingSections] = useState(false)

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    setIsAuthenticated(true)
    fetchSections()
  }, [router])

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/sections')
      const data = await res.json()
      if (data.success && data.data) {
        setSectionsConfig(data.data)
      }
    } catch (e) {
      console.error('Error fetching sections:', e)
    } finally {
      setLoading(false)
    }
  }

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

  // Construir las tabs basándonos en sectionsConfig
  // Siempre ponemos "header" al principio ya que no es una sección de la landing page arrastrable
  const headerTab = {
    id: 'header',
    label: 'Encabezado',
    is_hidden: false,
    ...baseComponents['header']
  }

  const dynamicTabs = sectionsConfig.map(s => ({
    ...s,
    ...baseComponents[s.id]
  }))

  const tabs = [headerTab, ...dynamicTabs]
  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <AdminHeader onLogout={() => setIsAuthenticated(false)} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs Wrapper */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
          <div className="flex flex-row gap-4 overflow-x-auto pb-2 flex-1 w-full">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setEditingSlug(null)
                    setIsGenerating(false)
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800'
                  } ${tab.is_hidden ? 'opacity-60' : ''}`}
                  title={tab.is_hidden ? 'Esta sección está oculta en la Landing Page' : ''}
                >
                  <Icon size={18} />
                  <span className={tab.is_hidden ? 'line-through' : ''}>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setIsEditingSections(true)}
            className="flex items-center justify-center p-3 bg-dark-100 hover:bg-dark-200 dark:bg-dark-800 dark:hover:bg-dark-700 border border-dark-200 dark:border-dark-700 text-dark-700 dark:text-dark-300 rounded-lg transition shadow-sm"
            title="Ordenar secciones"
          >
            <FiEdit2 size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-8">
          {activeTab === 'manage-blog' ? (
            isGenerating ? (
              <div className="space-y-4">
                <button 
                  onClick={() => setIsGenerating(false)} 
                  className="text-sm px-4 py-2 bg-dark-200 dark:bg-dark-800 hover:bg-dark-300 dark:hover:bg-dark-700 rounded text-dark-700 dark:text-dark-300 transition flex items-center gap-2 w-fit"
                >
                  &larr; Volver a la lista de Blogs
                </button>
                <BlogGeneratorForm />
              </div>
            ) : editingSlug ? (
              <>
                <BlogEditor
                  slug={editingSlug}
                  onBack={() => setEditingSlug(null)}
                />
              </>
            ) : (
              <>
                <BlogsList 
                  onSelectEdit={setEditingSlug} 
                  onGenerateNew={() => setIsGenerating(true)} 
                />
              </>
            )
          ) : (
            <>
              {ActiveComponent && <ActiveComponent />}
            </>
          )}
        </div>
      </main>

      {isEditingSections && (
        <ManageSectionsModal 
          sections={sectionsConfig}
          onClose={() => setIsEditingSections(false)}
          onSave={(newSections) => {
            setSectionsConfig(newSections)
            setIsEditingSections(false)
          }}
        />
      )}
    </div>
  )
}
