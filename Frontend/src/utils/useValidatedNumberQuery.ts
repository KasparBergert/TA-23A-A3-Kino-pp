import { useRoute } from 'vue-router'
import useSafeRouter from './useSafeRouter'

export function useValidatedNumberQuery(paramName: string) {
  const route = useRoute()
  const { safeRoute } = useSafeRouter()

  const raw = route.query[paramName]
  const n = Number(raw)

  if (isNaN(n)) {
    safeRoute('/')
  }

  return n
}


