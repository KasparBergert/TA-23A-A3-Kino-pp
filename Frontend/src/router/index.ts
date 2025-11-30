import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Showtimes from '../views/Showtimes.vue'
import SeatSelect from '../views/SeatSelect.vue'
import orderStore from '../store/OrderStore'

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
        if (!to.query.theatre_id) {
          console.error('Missing theatre_id in query parameters')
          return next('/')
        }
        return next()
      },
    },
    {
      path: '/showtime/seat-select',
      name: 'seat-select',
      component: SeatSelect,
      beforeEnter: (to, from, next) => {
        if (!orderStore.getShowtime()) {
          console.error('invalid showtime or film')
          return next('/')
        }

        if (!to.query.hall_id) {
          console.error('Missing theatre_id in query parameters')
          return next('/')
        }
        return next()

      },
    },
  ],
})

router.afterEach(async (to, from, failure) => {
  if (!failure) setTimeout(() => window.HSStaticMethods?.autoInit?.(), 300)
})

export default router
