import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'hero',
        name: 'hero',
        component: () => import('@/views/HeroView.vue'),
        meta: { title: 'Hero Page' }
      },
      {
        path: 'tentang',
        name: 'tentang',
        component: () => import('@/views/TentangView.vue'),
        meta: { title: 'Tentang' }
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/MenuView.vue'),
        meta: { title: 'Katalog Menu' }
      },
      {
        path: 'lokasi',
        name: 'lokasi',
        component: () => import('@/views/LokasiView.vue'),
        meta: { title: 'Jangkauan' }
      },
      {
        path: 'galeri',
        name: 'galeri',
        component: () => import('@/views/GaleriView.vue'),
        meta: { title: 'Galeri' }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login Admin' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} - Grand Kebab Hejo`
  }

  const isAuthenticated = !!sessionStorage.getItem('admin_token')
  
  if (to.path !== '/login' && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
