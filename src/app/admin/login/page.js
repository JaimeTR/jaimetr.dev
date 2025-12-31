'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiLock, FiAlertCircle } from 'react-icons/fi'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    const token = localStorage.getItem('adminToken')
    if (token) {
      router.push('/admin/dashboard')
    }
  }, [router])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Token por defecto (cambia esto a una variable de entorno en producción)
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

    if (password === correctPassword) {
      localStorage.setItem('adminToken', 'admin123')
      router.push('/admin/dashboard')
    } else {
      setError('Contraseña incorrecta')
      setPassword('')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center px-6">
      <div className="absolute top-0 z-[-2] h-screen w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,153,255,0.25),rgba(255,255,255,0))]"></div>

      <div className="w-full max-w-md">
        <div className="bg-dark-100 dark:bg-dark-900 rounded-lg p-8 border border-dark-200 dark:border-dark-800">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              Dashboard Admin
            </h1>
            <p className="text-dark-600 dark:text-dark-400">
              Acceso restringido - Ingresa tu contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3 text-dark-500 dark:text-dark-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2 text-sm text-red-700 dark:text-red-400">
                <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Verificando...' : 'Acceder'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition"
          >
            ← Volver al sitio
          </a>
        </div>
      </div>
    </div>
  )
}
