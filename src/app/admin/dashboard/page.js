'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BlogGeneratorForm } from '@/components/Admin/BlogGeneratorForm'
import { BlogsList } from '@/components/Admin/BlogsList'
import { BlogEditor } from '@/components/Admin/BlogEditor'
import { ManageProjects } from '@/components/Admin/ManageProjects'
import { ManageProfile } from '@/components/Admin/ManageProfile'
import { ManageAboutMe } from '@/components/Admin/ManageAboutMe'
import { ManageExperience } from '@/components/Admin/ManageExperience'
import { ManageSkills } from '@/components/Admin/ManageSkills'
import { ManageSectionsModal } from '@/components/Admin/ManageSectionsModal'
import { ManageChatMessages } from '@/components/Admin/ManageChatMessages'
import {
  FiPackage, FiBriefcase, FiEdit3, FiUser, FiCode,
  FiLayout, FiSmile, FiEdit2, FiMessageSquare, FiLogOut,
  FiMenu, FiX, FiHome
} from 'react-icons/fi'

const menuItems = [
  { id: 'profile', label: 'Perfil', icon: FiUser },
  { id: 'aboutme', label: 'Sobre Mi', icon: FiSmile },
  { id: 'experience', label: 'Experiencia', icon: FiBriefcase },
  { id: 'project', label: 'Proyectos', icon: FiPackage },
  { id: 'skills', label: 'Habilidades', icon: FiCode },
  { id: 'manage-blog', label: 'Blogs', icon: FiEdit3 },
  { id: 'chat-messages', label: 'Chats', icon: FiMessageSquare },
]

const componentMap = {
  'header': ManageProfile,
  'profile': ManageProfile,
  'aboutme': ManageAboutMe,
  'experience': ManageExperience,
  'project': ManageProjects,
  'skills': ManageSkills,
  'manage-blog': null,
  'chat-messages': ManageChatMessages,
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('profile')
  const [editingSlug, setEditingSlug] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sectionsConfig, setSectionsConfig] = useState([])
  const [isEditingSections, setIsEditingSections] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchSections()
  }, [router])

  const fetchSections = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('/api/admin/sections', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
        return
      }
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const ActiveComponent = componentMap[activeMenu]

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-dark-700 dark:text-dark-300">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-100 dark:bg-dark-950 flex">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 w-64 bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-200 dark:border-dark-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'lg:hidden'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiLayout className="text-white" size={18} />
            </div>
            <div>
              <h1 className="font-bold text-dark-900 dark:text-white text-sm">Admin Panel</h1>
              <p className="text-xs text-dark-500 dark:text-dark-400">jaimetr.dev</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg text-dark-500 dark:text-dark-400"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.id
            const isHidden = sectionsConfig.find(s => s.id === item.id)?.is_hidden

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id)
                  setEditingSlug(null)
                  setIsGenerating(false)
                  if (window.innerWidth < 1024) setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white'
                } ${isHidden ? 'opacity-50' : ''}`}
                title={isHidden ? 'Oculta en la Landing Page' : item.label}
              >
                <Icon size={20} className="shrink-0" />
                <span className={`truncate ${!sidebarOpen && 'lg:hidden'} ${isHidden ? 'line-through' : ''}`}>
                  {item.label}
                </span>
                {isHidden && sidebarOpen && (
                  <span className="ml-auto text-[10px] bg-dark-200 dark:bg-dark-700 px-1.5 py-0.5 rounded hidden lg:inline-block">OFF</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-dark-200 dark:border-dark-800 space-y-1">
          <button
            onClick={() => setIsEditingSections(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white transition"
          >
            <FiEdit2 size={20} />
            <span className={`${!sidebarOpen && 'lg:hidden'}`}>Ordenar Secciones</span>
          </button>
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white transition"
          >
            <FiHome size={20} />
            <span className={`${!sidebarOpen && 'lg:hidden'}`}>Ver Sitio</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <FiLogOut size={20} />
            <span className={`${!sidebarOpen && 'lg:hidden'}`}>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-dark-950/80 backdrop-blur-md border-b border-dark-200 dark:border-dark-800 px-4 lg:px-8 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg text-dark-600 dark:text-dark-400"
          >
            <FiMenu size={22} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-dark-900 dark:text-white">
              {menuItems.find(m => m.id === activeMenu)?.label || 'Dashboard'}
            </h2>
            {activeMenu === 'manage-blog' && isGenerating && (
              <p className="text-xs text-dark-500 dark:text-dark-400">Generando nuevo articulo</p>
            )}
            {activeMenu === 'manage-blog' && editingSlug && (
              <p className="text-xs text-dark-500 dark:text-dark-400">Editando: {editingSlug}</p>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {activeMenu === 'manage-blog' ? (
            isGenerating ? (
              <div className="space-y-4">
                <button
                  onClick={() => setIsGenerating(false)}
                  className="text-sm px-4 py-2 bg-dark-200 dark:bg-dark-800 hover:bg-dark-300 dark:hover:bg-dark-700 rounded-lg text-dark-700 dark:text-dark-300 transition flex items-center gap-2"
                >
                  &larr; Volver a la lista de Blogs
                </button>
                <BlogGeneratorForm />
              </div>
            ) : editingSlug ? (
              <BlogEditor slug={editingSlug} onBack={() => setEditingSlug(null)} />
            ) : (
              <BlogsList
                onSelectEdit={setEditingSlug}
                onGenerateNew={() => setIsGenerating(true)}
              />
            )
          ) : (
            ActiveComponent && <ActiveComponent />
          )}
        </div>
      </main>

      {/* Sections Order Modal */}
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
