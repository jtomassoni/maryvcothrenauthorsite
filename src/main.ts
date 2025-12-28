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
import Blog from './pages/Blog.vue'
import BlogPost from './pages/BlogPost.vue'
import Login from './pages/Login.vue'
import AdminBlogList from './pages/AdminBlogList.vue'
import AdminBlogEditor from './pages/AdminBlogEditor.vue'
import NotFound from './pages/NotFound.vue'

// Router configuration
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/writings', name: 'Writings', component: Writings },
  { path: '/writings/:slug', name: 'WritingPost', component: WritingPost },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/blog', name: 'Blog', component: Blog },
  { path: '/blog/:slug', name: 'BlogPost', component: BlogPost },
  { path: '/login', name: 'Login', component: Login },
  { path: '/admin', name: 'AdminBlogList', component: AdminBlogList },
  { path: '/admin/blog', redirect: '/admin' },
  { path: '/admin/blog/new', name: 'AdminBlogNew', component: AdminBlogEditor },
  { path: '/admin/blog/:id/edit', name: 'AdminBlogEdit', component: AdminBlogEditor },
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
        top: 80 // Account for sticky header
      }
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard to protect admin routes
router.beforeEach(async (to, from, next) => {
  // Check if route is an admin route
  if (to.path.startsWith('/admin')) {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
      })
      const data = await response.json()
      
      if (data.ok && data.authenticated) {
        // User is authenticated, allow access
        next()
      } else {
        // User is not authenticated, redirect to login
        next('/login')
      }
    } catch (error) {
      console.error('Auth check error in router guard:', error)
      // On error, redirect to login
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
