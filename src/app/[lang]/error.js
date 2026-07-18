'use client'

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-4">
          Algo salio mal
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mb-8">
          Ocurrio un error inesperado. Intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
