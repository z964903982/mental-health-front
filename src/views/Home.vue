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
        <template v-if="isLoggedIn">
          <div class="user-profile" @click="toggleUserMenu">
            <div class="avatar">{{ user.username.charAt(0) }}</div>
            <span>{{ user.username }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="#718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div v-if="showUserMenu" class="user-menu">
            <button @click="goToSettings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              设置
            </button>
            <button @click="logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              退出登录
            </button>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">登录</router-link>
        </template>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="home-body">
      <!-- 左侧区域 (2/3宽度) -->
      <div class="left-section">
        <!-- AI问答入口 -->
        <el-card class="ai-chat-card" @click="goToChat">
          <div class="ai-chat-content">
            <div class="ai-chat-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 6L7 9V15L12 18L17 15V9L12 6Z" fill="#4ECDC4"/>
              </svg>
            </div>
            <h2>开始心理AI对话 🌿</h2>
            <p>与专业的心理健康AI助手开始对话，获得个性化的心理支持和建议</p>
          </div>
        </el-card>

        <!-- 咨询热线模块 -->
        <el-card class="hotline-card">
          <h3>咨询热线</h3>
          <div class="hotline-buttons">
            <el-button type="primary" class="hotline-btn">心理援助热线</el-button>
            <el-button type="success" class="hotline-btn">校园咨询中心</el-button>
            <el-button type="info" class="hotline-btn">24小时危机干预</el-button>
          </div>
        </el-card>

        <!-- 放松训练模块 -->
        <el-card class="relax-card">
          <h3>放松训练</h3>
          <div class="relax-items">
            <div class="relax-item">
              <span class="relax-icon">🧘‍♀️</span>
              <span>冥想放松训练</span>
            </div>
            <div class="relax-item">
              <span class="relax-icon">🫁</span>
              <span>呼吸练习</span>
            </div>
            <div class="relax-item">
              <span class="relax-icon">🎵</span>
              <span>音乐疗愈</span>
            </div>
          </div>
        </el-card>
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

        <!-- 呼吸灯组件 -->
        <el-card class="breathing-card">
          <h3>呼吸放松</h3>
          <div class="breathing-container">
            <div class="breathing-light" :class="{ 'breathing': isBreathing }"></div>
            <p class="breathing-text">跟随呼吸节奏放松 🌬️</p>
            <el-button @click="toggleBreathing" type="primary" size="small">
              {{ isBreathing ? '停止' : '开始' }}
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 用户状态
const isLoggedIn = ref(false)
const user = ref({ username: '' })
const showUserMenu = ref(false)

// 情绪日志
const selectedDate = ref(new Date())

// 呼吸灯状态
const isBreathing = ref(false)

// 初始化用户状态
onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    const parsedUser = JSON.parse(userData)
    isLoggedIn.value = true
    user.value = parsedUser
  }
})

// 导航功能
const goToChat = () => {
  router.push('/chat')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const goToSettings = () => {
  router.push('/settings')
}

const logout = () => {
  localStorage.removeItem('user')
  isLoggedIn.value = false
  user.value = { username: '' }
  showUserMenu.value = false
}

// 呼吸灯控制
const toggleBreathing = () => {
  isBreathing.value = !isBreathing.value
}
</script>

<style scoped>
/* 导入Chat.css的CSS变量和基础样式 */
:root {
  --primary-color: #4ECDC4;
  --secondary-color: #FF6B6B;
  --light-bg: #F7FAFC;
  --dark-text: #2D3748;
  --light-text: #718096;
  --border-color: #E2E8F0;
  --hover-color: #EDF2F7;
}

.home-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--light-bg);
  color: var(--dark-text);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 导航栏样式 - 复用Chat.css */
.navbar {
  padding: 12px 20px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  z-index: 10;
  backdrop-filter: blur(8px);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 18px;
  color: var(--dark-text);
}

.nav-features {
  display: flex;
  gap: 14px;
  margin-left: 20px;
}

.nav-btn {
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 500;
  color: #2D3748;
  text-decoration: none;
  background: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
  backdrop-filter: blur(6px);
}

.nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.nav-btn.hotline {
  background: linear-gradient(135deg, #FFECEC 0%, #FFF5F5 100%);
}

.nav-btn.test {
  background: linear-gradient(135deg, #F4E9FF 0%, #FAF5FF 100%);
}

.nav-btn.mood {
  background: linear-gradient(135deg, #E3F6FF 0%, #F0FBFF 100%);
}

.nav-btn.relax {
  background: linear-gradient(135deg, #E5FFF3 0%, #F3FFF9 100%);
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--light-bg);
  border-radius: 20px;
  padding: 6px 12px;
  width: 300px;
  position: relative;
}

.search-bar input {
  border: none;
  background: transparent;
  width: 100%;
  padding: 6px;
  outline: none;
  color: var(--dark-text);
}

.search-bar svg {
  position: absolute;
  right: 12px;
}

.nav-right {
  position: relative;
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: var(--hover-color);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #805AD5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-menu {
  position: absolute;
  top: 48px;
  right: 0;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px;
  display: flex;
  flex-direction: column;
  min-width: 150px;
  z-index: 100;
}

.user-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  color: var(--dark-text);
}

.user-menu button:hover {
  background-color: var(--hover-color);
}

.login-btn {
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #3dbdb5;
}

.nav-text {
  margin: 0 10px;
  cursor: pointer;
  color: #4ECDC4;
  font-weight: 500;
  text-decoration: none;
}
.nav-text:hover {
  color: #FF6B6B;
}


/* 主体内容布局 */
.home-body {
  display: flex;
  flex: 1;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

.left-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* AI问答入口卡片 */
.ai-chat-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
}

.ai-chat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.ai-chat-content {
  text-align: center;
  padding: 40px 20px;
}

.ai-chat-icon {
  margin-bottom: 20px;
}

.ai-chat-content h2 {
  margin: 0 0 12px 0;
  color: var(--primary-color);
  font-size: 24px;
  font-weight: 600;
}

.ai-chat-content p {
  margin: 0;
  color: var(--light-text);
  font-size: 16px;
  line-height: 1.5;
}

/* 咨询热线卡片 */
.hotline-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
}

.hotline-card h3 {
  margin: 0 0 16px 0;
  color: var(--dark-text);
  font-size: 18px;
  font-weight: 600;
}

.hotline-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hotline-btn {
  border-radius: 20px;
  font-size: 14px;
  padding: 8px 16px;
}

/* 放松训练卡片 */
.relax-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
}

.relax-card h3 {
  margin: 0 0 16px 0;
  color: var(--dark-text);
  font-size: 18px;
  font-weight: 600;
}

.relax-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.relax-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: var(--light-bg);
  border-radius: 12px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.relax-item:hover {
  background-color: var(--hover-color);
}

.relax-icon {
  font-size: 24px;
}

/* 个人信息卡片 */
.profile-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar {
  background-color: var(--primary-color) !important;
}

.profile-text h4 {
  margin: 0 0 4px 0;
  color: var(--dark-text);
  font-size: 18px;
  font-weight: 600;
}

.profile-text p {
  margin: 0;
  color: var(--light-text);
  font-size: 14px;
}

/* 情绪日志卡片 */
.mood-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
  flex: 1;
}

.mood-card h3 {
  margin: 0 0 16px 0;
  color: var(--dark-text);
  font-size: 18px;
  font-weight: 600;
}

.mood-calendar {
  width: 100%;
}

.calendar-day {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 呼吸灯卡片 */
.breathing-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
}

.breathing-card h3 {
  margin: 0 0 16px 0;
  color: var(--dark-text);
  font-size: 18px;
  font-weight: 600;
}

.breathing-container {
  text-align: center;
}

.breathing-light {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--primary-color), #3dbdb5);
  margin: 0 auto 16px;
  transition: all 0.3s ease;
}

.breathing-light.breathing {
  animation: breathingAnimation 19s infinite;
}

@keyframes breathingAnimation {
  0% {
    transform: scale(1);
    opacity: 0.6;
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
  }
  21% {
    transform: scale(1.2);
    opacity: 1;
    box-shadow: 0 0 40px rgba(78, 205, 196, 0.6);
  }
  58% {
    transform: scale(1.2);
    opacity: 1;
    box-shadow: 0 0 40px rgba(78, 205, 196, 0.6);
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
  }
}

.breathing-text {
  margin: 0 0 16px 0;
  color: var(--light-text);
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-body {
    flex-direction: column;
    padding: 16px;
  }
  
  .left-section,
  .right-section {
    flex: none;
  }
  
  .nav-features {
    display: none;
  }
  
  .search-bar {
    width: 200px;
  }
}
</style>