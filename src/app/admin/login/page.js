'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeSwitch } from '@/components/ThemeSwich'
import { FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    const correctEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'jaimetr1309@gmail.com'
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Tarazona1309'

    if (email === correctEmail && password === correctPassword) {
      localStorage.setItem('adminToken', 'admin123')
      router.push('/admin/dashboard')
    } else {
      setError('Credenciales incorrectas')
      setPassword('')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center px-6 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitch />
      </div>
      <div className="absolute top-0 z-[-2] h-screen w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,153,255,0.25),rgba(255,255,255,0))]"></div>

      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 border border-dark-200 dark:border-dark-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent inline-block">🔐</div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              Dashboard Admin
            </h1>
            <p className="text-dark-600 dark:text-dark-400 text-sm">
              Acceso restringido - Ingresa tus credenciales
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-3.5 text-dark-500 dark:text-dark-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-dark-50 dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50 text-dark-900 dark:text-white transition-all"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-dark-500 dark:text-dark-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-11 pr-12 py-3 bg-dark-50 dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50 text-dark-900 dark:text-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-dark-500 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex gap-3 text-sm text-red-700 dark:text-red-400 font-medium">
                <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold tracking-wide py-3 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-primary-500/20 mt-2"
            >
              {loading ? 'Verificando...' : 'Acceder'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
