<template>
  <div class="home-app">
    <!-- 导航栏 - 使用复用组件 -->
    <Navbar>
      <!-- 中间插入呼吸灯 -->
      <template #center-controls>
        <BreathingCard :showBreathing="showBreathing" :rhythm="selectedRhythm" />
      </template>
    </Navbar>

    <!-- 主体内容 -->
    <div class="home-body">
      <!-- 左侧区域 -->
      <div class="left-section">
        <!-- AI问答入口 -->
        <el-card class="ai-chat-card" @click="goToChat">
          <div class="ai-chat-content">
            <div class="ai-chat-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="#4ECDC4" stroke-width="2"/>
                <path d="M12 6L7 9V15L12 18L17 15V9L12 6Z" fill="#4ECDC4"/>
              </svg>
            </div>
            <h2>开始心理AI对话 🌿</h2>
            <p>与专业的心理健康AI助手开始对话，获得个性化心理支持</p>
          </div>
        </el-card>

        <!-- 三个模块横向排列 -->
        <div class="three-modules">
          <el-card class="module-card" @click="goToHotline">
  <h3>咨询热线</h3>
  <p>点击获取热线信息</p>
</el-card>

          <el-card class="module-card">
            <h3>心理测试</h3>
            <p>完成心理测试，了解心理健康状况</p>
            <el-button type="primary" size="small">开始测试</el-button>
          </el-card>

          <el-card class="module-card">
            <h3>放松训练</h3>
            <p>简短放松练习</p>
          </el-card>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="right-section">
        <!-- 个人信息模块 -->
        <el-card class="profile-card">
          <div class="profile-info">
            <el-avatar :size="60" class="profile-avatar">
              {{ isLoggedIn ? user.username.charAt(0) : 'G' }}
            </el-avatar>
            <div class="profile-text">
              <h4>{{ isLoggedIn ? user.username : '游客' }}</h4>
              <p>欢迎回来，保持平和的心态 🌼</p>
            </div>
          </div>
        </el-card>

        <!-- 情绪日志模块 -->
        <el-card class="mood-card">
          <h3>情绪日志</h3>
          <el-calendar v-model="selectedDate" class="mood-calendar">
            <template #date-cell="{ data }">
              <div class="calendar-day">
                <span>{{ data.day.split('-').slice(2).join('-') }}</span>
              </div>
            </template>
          </el-calendar>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/Home.css'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import Navbar from '@/components/Navbar.vue'
import BreathingCard from '@/components/BreathingCard.vue'

const router = useRouter()
function goToChat() {
  router.push('/chat')
}

// 用户状态
const userStore = useUserStore()
userStore.loadUserFromStorage()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.user)

const showBreathing = ref(true)
const selectedRhythm = ref('slow')

// 情绪日志
const selectedDate = ref(new Date())

const showUserMenu = ref(false)



function goToHotline() {
  router.push('/hotline')
}

</script>
