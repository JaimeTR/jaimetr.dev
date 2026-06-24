'use client'

import { useState } from 'react'
import { FiLogOut, FiMenu, FiX, FiSettings } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

import { ThemeSwitch } from '@/components/ThemeSwich'

export function AdminHeader({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
    onLogout?.()
  }

  return (
    <header className="bg-dark-100 dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-primary-600 dark:text-primary-400">
            <FiSettings size={28} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-dark-900 dark:text-white">Dashboard Admin</h1>
            <p className="text-xs text-dark-500 dark:text-dark-400">Gestión de contenido</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitch />
          
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition font-medium"
          >
            <FiLogOut /> Cerrar sesión
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-dark-700 dark:text-dark-300"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-dark-200 dark:border-dark-800 p-4 sm:hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition font-medium"
          >
            <FiLogOut /> Cerrar sesión
          </button>
        </div>
      )}
    </header>
  )
}
