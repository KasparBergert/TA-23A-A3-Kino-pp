import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue';
import Showtime from '../views/Showtime.vue';
import ChooseSeat from "../views/ChooseSeat.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/showtimes/:theatre_id',
      name: 'showtimes',
      component: Showtime,
    },
    {
      path: '/chooseSeat',
      name: 'chooseSeat',
      component: ChooseSeat,
    },
  ],
});

router.afterEach(async (to, from, failure) => {
  if (!failure) setTimeout(() => window.HSStaticMethods?.autoInit?.(), 100);
});

export default router;
