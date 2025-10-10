// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Chat from '@/views/Chat.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Home from '@/views/Home.vue'
import ChinaMap from '@/components/ChinaMap.vue'  // 导入新组件

// import Settings from '@/views/Settings.vue' // 如果还没创建，先注释

const routes = [
  { path: '/', component: Home }, // 首页现在是 Home.vue
  { path: '/chat', component: Chat }, // 如果还想保留聊天页
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  // { path: '/settings', component: Settings },
  { path: '/hotline', name: 'Hotline', component: ChinaMap },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
