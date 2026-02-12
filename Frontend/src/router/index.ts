import { createRouter, createWebHistory, NavigationGuardNext } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import Showtimes from '../pages/Showtimes.vue'
import SeatSelect from '../pages/SeatSelect.vue'
import FilmDetail from '../pages/FilmDetail.vue'
import orderStore from '../store/OrderStore'
import AdminView from '../pages/AdminView.vue'
import AboutView from '../pages/AboutView.vue'
import Payment from '../pages/Payment.vue'
import authStore from '../store/AuthStore'

async function requireRoles(roles: string[], next: NavigationGuardNext) {
  if (!authStore.user.value) {
    await authStore.loadUser()
  }
  const role = authStore.user.value?.role
  if (!role) return next('/')
  if (!roles.includes(role)) return next('/')
  return next()
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

        //type check before sending to the route
        const hallId = Number(to.query.hallId)
        const showtimeId = Number(to.query.showtimeId)
        if (Number.isNaN(showtimeId)) throw new Error('showtimeId is not a number')
        if (Number.isNaN(hallId)) throw new Error('hallId is not a number')

        return next()
      },
    },
    {
      path: '/films/:id',
      name: 'film-detail',
      component: FilmDetail,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      beforeEnter: async (to, from, next) => {
        await requireRoles(['admin', 'super_admin'], next)
      },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/payment',
      name: 'payment',
      component: Payment,
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../pages/Orders.vue'),
    },
  ],
})

router.afterEach(async (to, from, failure) => {
  if (!failure) setTimeout(() => window.HSStaticMethods?.autoInit?.(), 300)
})

export default router
