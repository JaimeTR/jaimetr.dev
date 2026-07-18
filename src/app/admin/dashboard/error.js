'use client'

export default function DashboardError({ error, reset }) {
  return (
    <div className="min-h-screen bg-dark-100 dark:bg-dark-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6 text-red-500">⚠️</div>
        <h1 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
          Error en el Panel de Administracion
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mb-2 text-sm">
          {error?.message || 'Ocurrio un error inesperado.'}
        </p>
        <button
          onClick={reset}
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
        >
          Reintentar
        </button>
        <button
          onClick={() => window.location.href = '/admin/login'}
          className="mt-3 block w-full text-sm text-dark-500 dark:text-dark-400 hover:text-primary-500 transition"
        >
          Volver al Login
        </button>
      </div>
    </div>
  )
}
