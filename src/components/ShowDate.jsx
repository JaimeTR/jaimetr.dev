'use client'
import { useEffect, useState } from 'react'

function formatDate(date) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const ShowDate = ({ date, className }) => {
  const [mounted, setMounted] = useState(false)
  const isValid = Number.isFinite(new Date(date).getTime())
  const safeDate = isValid ? date : null

  useEffect(() => { setMounted(true) }, [])

  if (!safeDate) return null

  return (
    <span className={className || 'text-sm font-medium text-dark-500 dark:text-dark-300'} suppressHydrationWarning>
      {formatDate(safeDate)}
    </span>
  )
}
