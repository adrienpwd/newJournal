export default function filterFormValues(value) {
  if (value === false || value === null || value === 0 || value === '' || value === '0') {
    return false
  } else if (Array.isArray(value) && value.length === 0) {
    return false
  } else {
    return true
  }
}
