import { useRouter } from "vue-router";

export function useSafeBack() {

  const router = useRouter(); // runs when inside the component and gets the current route.

  function safeBack(fallback = "/") {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return { safeBack };
}
