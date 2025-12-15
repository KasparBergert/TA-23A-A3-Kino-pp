import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import Showtimes from '../pages/Showtimes.vue'
import SeatSelect from '../pages/SeatSelect.vue'
import FilmDetail from '../pages/FilmDetail.vue'
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
        if (!to.query.theatreId) {
          console.error('Missing theatreId in query parameters')
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

        if (!to.query.hallId) {
          console.error('Missing hallId in query parameters')
          return next('/')
        }

        if (!to.query.showtimeId) {
          console.error('Missing showtimeId in query parameters')
          return next('/')
        }

        return next()

      },
    },
    {
      path: '/films/:id',
      name: 'film-detail',
      component: FilmDetail,
    },
  ],
})

router.afterEach(async (to, from, failure) => {
  if (!failure) setTimeout(() => window.HSStaticMethods?.autoInit?.(), 300)
})

export default router
