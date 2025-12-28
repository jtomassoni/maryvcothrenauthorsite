import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import pages
import Home from './pages/Home.vue'
import About from './pages/About.vue'
import Writings from './pages/Writings.vue'
import WritingPost from './pages/WritingPost.vue'
import Contact from './pages/Contact.vue'
import Login from './pages/Login.vue'
import AdminWritings from './pages/AdminWritings.vue'
import MarkdownHelp from './pages/MarkdownHelp.vue'
import NotFound from './pages/NotFound.vue'

// Router configuration
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/writings', name: 'Writings', component: Writings },
  { path: '/writings/:slug', name: 'WritingPost', component: WritingPost },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/login', name: 'Login', component: Login },
  { path: '/admin', name: 'AdminWritings', component: AdminWritings },
  { path: '/markdown-help', name: 'MarkdownHelp', component: MarkdownHelp },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80, // Account for sticky header
      }
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guard to protect admin routes
router.beforeEach(async (to, from, next) => {
  // Check if route is an admin route
  if (to.path.startsWith('/admin')) {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('auth_token')

      if (!token) {
        // No token, redirect to login
        next('/login')
        return
      }

      const response = await fetch('/api/auth/check', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        // Non-JSON response, redirect to login
        next('/login')
        return
      }

      const data = await response.json()

      if (data.ok && data.authenticated) {
        // User is authenticated, allow access
        next()
      } else {
        // User is not authenticated, clear token and redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_username')
        next('/login')
      }
    } catch (error) {
      console.error('Auth check error in router guard:', error)
      // On error, clear token and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_username')
      next('/login')
    }
  } else {
    // Not an admin route, allow access
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
