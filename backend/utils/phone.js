import { parsePhoneNumber } from 'libphonenumber-js'

export const normalizePhone = (value) => {
  if (!value) return ''
  const cleaned = String(value).trim()
  if (!cleaned) return ''
  try {
    const parsed = parsePhoneNumber(cleaned)
    if (parsed && parsed.isValid()) {
      return parsed.number
    }
  } catch (error) {
    // invalid input, fall through
  }
  return cleaned
}

export const isPhoneValid = (value) => {
  if (!value) return false
  try {
    const parsed = parsePhoneNumber(String(value).trim())
    return !!(parsed && parsed.isValid())
  } catch (error) {
    return false
  }
}