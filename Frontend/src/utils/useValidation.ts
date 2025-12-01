import { useRoute } from 'vue-router'
import useSafeRouter from './useSafeBack'

function getNumberQueryParam(paramName: string) {
  const route = useRoute()
  const { safeBack } = useSafeRouter()

  const raw = route.query[paramName]
  const n = Number(raw)

  if (isNaN(n)) {
    safeBack('/')
  }

  return n
}

export const useValidation = {
  getNumberQueryParam
}
