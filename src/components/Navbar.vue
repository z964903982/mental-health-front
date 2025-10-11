<!-- src/components/Navbar.vue -->
<template>
    <div class="navbar">
      <!-- 左侧 Logo -->
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 8V16" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 12H16" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>心理健康咨询小助手</span>
      </div>
  
      <!-- 中间呼吸灯插槽 -->
      <div class="navbar-center">
        <slot name="center-controls"></slot>
      </div>
  
     
  
      <!-- 右侧用户信息 -->
      <div class="nav-right">
         <!-- 中间导航 -->
      <div class="nav-features">
        <router-link to="/" class="nav-text">首页</router-link>
        <router-link to="/chat" class="nav-text">开始问答</router-link>
      </div>
        <template v-if="userStore.isLoggedIn">
          <div class="user-profile" @click="toggleUserMenu">
            <div class="avatar">{{ userStore.user.username.charAt(0) }}</div>
            <span>{{ userStore.user.username }}</span>
          </div>
          <div v-if="showUserMenu" class="user-menu">
            <button @click="$router.push('/settings')">设置</button>
            <button @click="userStore.logout()">退出登录</button>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">登录</router-link>
        </template>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useUserStore } from '@/stores/user'

  // 引入外部 CSS
import '@/assets/css/navbar.css'
  
  const userStore = useUserStore()
  userStore.loadUserFromStorage()
  
  const showUserMenu = ref(false)
  function toggleUserMenu() {
    showUserMenu.value = !showUserMenu.value
  }
  </script>
  
  
