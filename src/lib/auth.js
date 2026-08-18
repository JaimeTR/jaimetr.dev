import crypto from 'crypto'

const TOKEN_TTL = 24 * 60 * 60 * 1000 // 24 horas

function getAdminSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_TOKEN || null
}

export function createAuthToken(payload = {}) {
  const secret = getAdminSecret()
  if (!secret) {
    throw new Error('ADMIN_SECRET or ADMIN_TOKEN must be configured')
  }

  const data = JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL,
  })
  const hash = crypto.createHmac('sha256', secret).update(data).digest('hex')
  const token = Buffer.from(JSON.stringify({ data, hash })).toString('base64url')
  return token
}

export function verifyAuthToken(token) {
  const secret = getAdminSecret()
  if (!secret || !token) return null

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString())
    const { data, hash } = decoded
    const expectedHash = crypto.createHmac('sha256', secret).update(data).digest('hex')
    if (hash !== expectedHash) return null

    const payload = JSON.parse(data)
    if (Date.now() > payload.exp) return null

    return payload
  } catch {
    return null
  }
}

export function validateAdminRequest(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) return false

  const payload = verifyAuthToken(token)
  if (!payload) return false

  return true
}
