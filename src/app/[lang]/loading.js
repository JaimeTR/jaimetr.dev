export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        <p className="mt-4 text-dark-600 dark:text-dark-400">Cargando...</p>
      </div>
    </div>
  )
}
