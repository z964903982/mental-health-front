<template>
  <div class="home-app">
    <!-- 导航栏 - 复用Chat.vue的导航栏结构 -->
    <div class="navbar">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 8V16" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 12H16" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>心理健康咨询小助手</span>
      </div>
      
      <div class="search-bar">
        <input type="text" placeholder="搜索会话..." />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 21L16.65 16.65" stroke="#718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <div class="nav-features">
    <router-link to="/" class="nav-text">首页</router-link>
    <router-link to="/chat" class="nav-text">开始问答</router-link>
  </div>
      
  <div class="nav-right">
  <template v-if="userStore.isLoggedIn">
    <div class="user-profile" @click="showUserMenu = !showUserMenu">
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
    <!-- 咨询热线 -->
    <el-card class="module-card">
      <h3>咨询热线</h3>
      <p>点击获取热线信息</p>
    </el-card>

    <!-- 心理测试 -->
    <el-card class="module-card">
      <h3>心理测试</h3>
      <p>完成心理测试，了解心理健康状况</p>
      <el-button type="primary" size="small">开始测试</el-button>
    </el-card>

    <!-- 放松训练 -->
    <el-card class="module-card">
      <h3>放松训练</h3>
      <p>简短放松练习</p>
    </el-card>
  </div>
</div>


      <!-- 右侧区域 (1/3宽度) -->
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

        <!-- 呼吸放松模块 -->
<el-card class="breathing-card">
  <div class="breathing-header">
    <h3>呼吸放松</h3>
    <div class="breathing-controls">
      <el-switch v-model="showBreathing" active-text="显示" inactive-text="隐藏" />
      <el-select v-model="selectedRhythm" placeholder="选择节奏" size="small">
        <el-option label="平缓呼吸" value="slow" />
        <el-option label="深呼吸" value="deep" />
        <el-option label="4-7-8呼吸法" value="478" />
      </el-select>
    </div>
  </div>

  <div v-if="showBreathing" class="breathing-container">
    <div class="breathing-light" :class="[currentRhythmClass, { breathing: true }]"></div>
    <p class="breathing-text">
      当前呼吸法：{{ rhythmTextMap[selectedRhythm] }} 🌬️  
      <br>跟随节奏进行呼吸，放松身心。
    </p>
  </div>
</el-card>

      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/Home.css'

import { ref, onMounted, computed } from 'vue' // ✅ 加上 computed
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
userStore.loadUserFromStorage();


const router = useRouter()

function goToChat() {
  router.push('/chat');
}


// 用户状态
const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.user)

const showUserMenu = ref(false)

// 情绪日志
const selectedDate = ref(new Date())

// 呼吸灯控制
const showBreathing = ref(true)
const selectedRhythm = ref('slow')

// 呼吸节奏说明
const rhythmTextMap = {
  slow: '平缓呼吸（4秒吸气 / 4秒呼气）',
  deep: '深呼吸（5秒吸气 / 5秒呼气）',
  '478': '4-7-8 呼吸法（4秒吸气 / 7秒屏息 / 8秒呼气）'
}

// 动态样式绑定
const currentRhythmClass = computed(() => {
  return `rhythm-${selectedRhythm.value}`
})

// 自动开始呼吸动画
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('user')
})
</script>


