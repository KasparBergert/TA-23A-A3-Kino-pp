export function hasParameterValue(value: any, errorMsg: string, next: (arg?: any) => void) {
  if (!value) {
    console.error(errorMsg)
    return next('/') // redirect home
  }
  return next()
}
