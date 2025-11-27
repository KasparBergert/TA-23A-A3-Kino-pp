import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Showtimes from '../views/Showtimes.vue'
import SeatSelect from '../views/SeatSelect.vue'

function resolveRoute(value: any, errorMsg: string, next: (arg?: any) => void) {
  if (!value) {
    console.error(errorMsg)
    return next('/') // redirect home
  }
  return next() // allow navigation
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/showtimes',
      name: 'showtimes',
      component: Showtimes,
      beforeEnter: (to, from, next) => {
        resolveRoute(to.query.theatre_id, 'Missing theatre_id in query parameters', next)
      },
    },
    {
      path: '/showtime/seat-select',
      name: 'seat-select',
      component: SeatSelect,
      beforeEnter: (to, from, next) => {
        resolveRoute(to.query.showtime_id, 'Missing showtime_id in query parameters', next)
      },
    },
  ],
})

router.afterEach(async (to, from, failure) => {
  if (!failure) setTimeout(() => window.HSStaticMethods?.autoInit?.(), 300)
})

export default router
