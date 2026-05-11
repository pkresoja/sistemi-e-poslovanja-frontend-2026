import About from '@/pages/About.vue'
import Cinema from '@/pages/Cinema.vue'
import Details from '@/pages/Details.vue'
import EditCinema from '@/pages/EditCinema.vue'
import Home from '@/pages/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/about',
      component: About,
      meta: {
        title: 'About'
      }
    },
    {
      path: '/details/:id',
      component: Details,
      meta: {
        title: 'Details'
      }
    },
    {
      path: '/cinema',
      component: Cinema,
      meta: {
        title: 'Cinemas'
      }
    },
    {
      path: '/cinema/:id',
      component: EditCinema,
      meta: {
        title: 'Edit Cinema'
      }
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} :: PSEP 2026`
  }

  next()
})

export default router
