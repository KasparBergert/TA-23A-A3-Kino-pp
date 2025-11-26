import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue';
import Showtimes from "../views/Showtimes.vue";

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
    }
  ],
});

router.afterEach(async (to, from, failure) => {
  if (!failure) setTimeout(() => window.HSStaticMethods?.autoInit?.(), 100);
});

export default router;
