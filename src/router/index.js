// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Chat from '@/components/Chat.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
// import Settings from '@/views/Settings.vue' // 如果还没创建，先注释

const routes = [
  { path: '/', component: Chat }, // 首页
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  // { path: '/settings', component: Settings },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
