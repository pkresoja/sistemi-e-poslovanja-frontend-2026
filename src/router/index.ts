import AddCinema from '@/pages/AddCinema.vue'
import AddTimeTable from '@/pages/AddTimeTable.vue'
import Cart from '@/pages/Cart.vue'
import Cinema from '@/pages/Cinema.vue'
import Details from '@/pages/Details.vue'
import EditCinema from '@/pages/EditCinema.vue'
import EditTimeTable from '@/pages/EditTimeTable.vue'
import Home from '@/pages/Home.vue'
import Invoice from '@/pages/Invoice.vue'
import Login from '@/pages/Login.vue'
import Print from '@/pages/Print.vue'
import Signup from '@/pages/Signup.vue'
import User from '@/pages/User.vue'
import Verify from '@/pages/Verify.vue'
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
      path: '/cinema/add',
      component: AddCinema,
      meta: {
        title: 'Add Cinema'
      }
    },
    {
      path: '/cinema/:id',
      component: EditCinema,
      meta: {
        title: 'Edit Cinema'
      }
    },
    {
      path: '/time-table/add',
      component: AddTimeTable,
      meta: {
        title: 'Add Time Table'
      }
    },
    {
      path: '/time-table/:id',
      component: EditTimeTable,
      meta: {
        title: 'Edit Time Table'
      }
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/signup',
      component: Signup,
      meta: {
        title: 'Signup Now'
      }
    },
    {
      path: '/verify',
      component: Verify,
      meta: {
        title: 'Email Verification'
      }
    },
    {
      path: '/cart',
      component: Cart,
      meta: {
        title: 'Cart'
      }
    },
    {
      path: '/user',
      component: User,
      meta: {
        title: 'User Profile'
      }
    },
    {
      path: '/invoice/:id/print',
      component: Print,
      meta: {
        title: 'Invoice Print'
      }
    },
    {
      path: '/invoice/:id',
      component: Invoice,
      meta: {
        title: 'Invoice Details'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} :: PSEP 2026`
  }

  next()
})

export default router
