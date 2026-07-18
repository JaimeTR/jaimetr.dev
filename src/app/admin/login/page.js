'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle, FiShield, FiArrowLeft, FiLoader, FiMail } from 'react-icons/fi'

export default function AdminLogin() {
  const router = useRouter()
  const [step, setStep] = useState('login') // 'login' | '2fa'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hash, setHash] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      router.push('/admin/dashboard')
    }
  }, [router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleCredentials = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validar credenciales server-side
      const authRes = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!authRes.ok) {
        const errData = await authRes.json().catch(() => ({}))
        setError(errData.error || 'Credenciales incorrectas')
        setPassword('')
        return
      }

      // Enviar codigo 2FA
      const res = await fetch('/api/admin/2fa/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setHash(data.hash)
      setCodeSent(true)
      setStep('2fa')
      setCountdown(300)
    } catch (err) {
      setError(err.message || 'Error de conexion')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (code.length !== 6) {
      setError('Ingresa el codigo de 6 digitos')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, hash }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // El token JWT lo genera el servidor al validar el 2FA
      const { token: authToken } = data
      localStorage.setItem('adminToken', authToken)
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Codigo invalido')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 270) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/2fa/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHash(data.hash)
      setCountdown(300)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center px-6 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitch />
      </div>
      <div className="absolute top-0 z-[-2] h-screen w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,153,255,0.25),rgba(255,255,255,0))]" />

      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 border border-dark-200 dark:border-dark-700 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 text-primary-600 dark:text-primary-400 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/20">
              {step === 'login' ? <FiLock size={40} /> : <FiMail size={40} />}
            </div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              {step === 'login' ? 'Dashboard Admin' : 'Verificacion 2FA'}
            </h1>
            <p className="text-dark-600 dark:text-dark-400 text-sm">
              {step === 'login'
                ? 'Acceso restringido - Ingresa tus credenciales'
                : `Codigo enviado a ${email}`}
            </p>
          </div>

          {/* Step 1: Credentials */}
          {step === 'login' && (
            <form onSubmit={handleCredentials} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                  Correo Electronico
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
                  Contrasena
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 text-dark-500 dark:text-dark-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
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
                    className="absolute right-4 top-3.5 text-dark-500 dark:text-dark-400 hover:text-primary-500 transition-colors"
                    tabIndex={-1}
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
                {loading ? 'Verificando...' : 'Continuar'}
              </button>
            </form>
          )}

          {/* Step 2: 2FA Code */}
          {step === '2fa' && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-3 text-sm text-blue-700 dark:text-blue-400">
                <FiMail className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Revisa tu correo electronico</p>
                  <p className="text-xs mt-1 opacity-80">
                    {codeSent
                      ? 'Hemos enviado un codigo de 6 digitos. Revisa tu bandeja de entrada y spam.'
                      : 'No se pudo enviar el email. Revisa la consola del servidor para ver el codigo.'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                  Codigo de Verificacion
                </label>
                <div className="relative">
                  <FiShield className="absolute left-4 top-3.5 text-dark-500 dark:text-dark-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setCode(val)
                      if (val.length === 6) setError('')
                    }}
                    placeholder="000000"
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-dark-50 dark:bg-dark-800 border border-dark-300 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50 text-dark-900 dark:text-white text-center text-2xl tracking-[0.5em] font-mono transition-all"
                    autoFocus
                    required
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-dark-500 dark:text-dark-400">
                    {countdown > 0 ? `Expira en ${formatTime(countdown)}` : 'Codigo expirado'}
                  </p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading || countdown > 270}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    Reenviar codigo
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
                disabled={loading || code.length !== 6}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold tracking-wide py-3 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-primary-500/20 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" /> Verificando...
                  </span>
                ) : (
                  'Verificar y Acceder'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('login')
                  setCode('')
                  setError('')
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition py-2"
              >
                <FiArrowLeft size={16} />
                Volver al login
              </button>
            </form>
          )}
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
