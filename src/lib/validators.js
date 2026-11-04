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

export function isValidPoll({ question, options }) {
  if (typeof question !== 'string' || question.trim().length === 0) return false;
  if (!Array.isArray(options) || options.length < 2) return false;

  // Check if all options are non-empty strings
  const hasEmptyOption = options.some(opt => typeof opt !== 'string' || opt.trim().length === 0);
  if (hasEmptyOption) return false;

  return true;
}

export function isValidPollStatus(status) {
  const allowedStatuses = ['open', 'closed'];
  return allowedStatuses.includes(status);
}

export function isValidOptionId(optionId) {
  return typeof optionId === 'number' && Number.isInteger(optionId) && optionId > 0;
}