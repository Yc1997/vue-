import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/Login')
const Home = () => import('@/views/home')
const Welcome = () => import('@/views/welcome')
const User = () => import('@/views/home/children/User')
const Roles = () => import('@/views/home/children/Roles')
const Right = () => import('@/views/home/children/Right')
const Categories = () => import('@/views/home/children/Categories')
const Params = () => import('@/views/home/children/Params')
const Goods = () => import('@/views/home/children/Goods')
const AddGoods = () => import('@/views/home/children/AddGoods')
const Order = () => import('@/views/home/children/Order')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Right },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Order }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
