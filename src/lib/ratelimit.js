const store = new Map()

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 5 * 60 * 1000)

export function rateLimit(key, { limit = 10, windowMs = 60000 } = {}) {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  entry.count++
  if (entry.count > limit) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  return { allowed: true, remaining: limit - entry.count }
}

// Rate limits especificos por endpoint
export const RATE_LIMITS = {
  chat: { limit: 10, windowMs: 60000 },
  tts: { limit: 5, windowMs: 60000 },
  twofaSend: { limit: 3, windowMs: 60000 },
  twofaVerify: { limit: 10, windowMs: 60000 },
  admin: { limit: 60, windowMs: 60000 },
}
