import { useRouter } from 'vue-router'

//routes the user back or to home page
export default function useSafeBack() {
  const router = useRouter()

  function safeBack(fallback: string = '/') {
    if (window.history.length === 0) {
      router.push(fallback)
    } else {
      router.back()
    }
  }

  return { safeBack }
}
