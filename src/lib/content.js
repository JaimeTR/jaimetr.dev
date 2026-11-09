export async function getProfile() {
  try {
    const response = await fetch('/api/personal')
    if (!response.ok) return { data: null, error: new Error('ERP unavailable') }
    const { perfil = {} } = await response.json()
    return { data: perfil, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
