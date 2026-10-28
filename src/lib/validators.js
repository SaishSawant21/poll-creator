export function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8
}

export function normalizeName(name) {
  if (name === undefined || name === null) return null
  if (typeof name !== 'string') return undefined
  const trimmed = name.trim()
  return trimmed.length === 0 ? null : trimmed
}