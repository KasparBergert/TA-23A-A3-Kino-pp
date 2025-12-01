

export function objectToQueryFields(filters: Object) {
  return Object.entries(filters).map((key, val) => {
    return `${key}=${val}&`
  })
}
