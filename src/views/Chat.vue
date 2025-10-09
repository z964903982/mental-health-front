<template>
  <div class="chat-app">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 8V16" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 12H16" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>心理健康助手</span>
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
                <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
    <div class="chat-body">
      <!-- 左侧历史会话 -->
      <div class="chat-sidebar">
        <button class="new-session-btn" @click="createNewSession">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          新会话
        </button>
        
        <div class="sessions-list">
          <div 
            v-for="session in sessions" 
            :key="session.id" 
            :class="['session-item', {active: session.id === currentSessionId}]"
            @click="loadSession(session)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ session.title || '新会话' }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧聊天主区 -->
      <div class="chat-main">
        <!-- <div class="chat-header">
          <h2>心理健康咨询</h2>
          <div class="chat-stats">
            <div class="stat-item">
              <span class="stat-label">今日对话</span>
              <span class="stat-value">{{ messages.length }}</span>
            </div>
          </div>
        </div> -->

        <div v-if="!isLoggedIn" class="not-logged-in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 8V12" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 16H12.01" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          您未登录，会话不会被存储
        </div>

        <!-- 聊天窗口 -->
        <div class="chat-container" ref="chatContainer" :class="{'expanded': !showQuickPrompts}">
          <!-- 空白聊天框提示文字 -->
          <div v-if="messages.length === 0" class="empty-chat-prompt">
            您好，今天感觉怎么样？
          </div>
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['chat-message', msg.role === 'user' || msg.role === '用户' ? 'user' : 'ai']"
          >
            <div class="message-avatar">
              <template v-if="msg.role === 'user' || msg.role === '用户'">
                <div class="user-avatar">{{ user.username ? user.username.charAt(0) : 'U' }}</div>
              </template>
              <template v-else>
                <div class="ai-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 6L7 9V15L12 18L17 15V9L12 6Z" fill="#4ECDC4"/>
                  </svg>
                </div>
              </template>
            </div>
            <div class="message-bubble">
              <div class="message-content" v-html="msg.content"></div>
              <div class="message-time">{{ getCurrentTime() }}</div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-area">
          <button class="upload-btn" @click="triggerFileInput">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 8L12 3L7 8" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 3V15" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <input
            ref="fileInput"
            type="file"
            multiple
            style="display: none"
            @change="handleFileUpload"
          />
          <input
            class="chat-input"
            v-model="inputText"
            @keyup.enter="sendQuestion"
            placeholder="输入您想咨询的问题..."
          />
          <button class="send-btn" @click="sendQuestion">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- 快速提示 -->
        <div class="quick-prompts" v-if="showQuickPrompts">
          <h3>常见问题</h3>
          <div class="prompts-container">
            <button
              v-for="(prompt, i) in prompts"
              :key="i"
              @click="fillPrompt(prompt)"
              class="prompt-btn"
            >
              {{ prompt }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/Chat.css'



import { marked } from "marked";
import DOMPurify from "dompurify";


import { ref, nextTick, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const inputText = ref("");
const messages = ref([]);
const selectedFiles = ref([]);
const showQuickPrompts = ref(true); // 控制是否显示常见问题区域
const prompts = ref([
  "您好，我最近情绪低落，不知道该怎么办",
  "我经常焦虑，晚上总是睡不好",
  "我想了解抑郁症的常见症状",
  "请告诉我焦虑症患者可以尝试的放松方法",
]);

const chatContainer = ref(null);
const fileInput = ref(null);

const user = ref({ id: null, username: "" });
const isLoggedIn = ref(false);
const showUserMenu = ref(false);

const sessions = ref([]);
const currentSessionId = ref(null);
const sessionCreatedInDB = ref(false); // 是否已保存到数据库

const aiLoading = ref(false); // 是否正在加载AI回复
const aiTypingIndex = ref(0); // 当前AI输出的字符索引


// ------------------ 生命周期 ------------------
onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    user.value = storedUser;
    isLoggedIn.value = true;
  }

  await loadSessions();
  createNewSession(); // 前端新建临时会话，不立刻存DB
});

// ------------------ 滚动 ------------------
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

// ------------------ 快速提示 ------------------
const fillPrompt = (prompt) => {
  inputText.value = prompt;
};

// ------------------ 文件上传 ------------------
const triggerFileInput = () => fileInput.value.click();
const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    selectedFiles.value = Array.from(files);
    const fileNames = selectedFiles.value.map(f => f.name).join(", ");
    messages.value.push({ role: "系统", content: `📎 已选择文件：${fileNames}` });
    scrollToBottom();
  }
};

// ------------------ 会话管理 ------------------
const loadSessions = async () => {
  if (!isLoggedIn.value) return;
  const res = await axios.get("http://localhost:8080/api/chat/sessions", {
    params: { userId: user.value.id },
  });
  sessions.value = res.data.sort((a,b)=>new Date(b.updatedTime)-new Date(a.updatedTime));
};

const createNewSession = () => {
  const newSession = { id: Date.now(), title: "当前会话", userId: isLoggedIn.value ? user.value.id : null };
  sessions.value.unshift(newSession);
  currentSessionId.value = newSession.id;
  messages.value = [];
  sessionCreatedInDB.value = false; // 尚未保存到数据库
};

const loadSession = async (session) => {
  currentSessionId.value = session.id;
  sessionCreatedInDB.value = true;

  if (isLoggedIn.value) {
    const res = await axios.get(`http://localhost:8080/api/chat/session/${session.id}`);
    messages.value = res.data.flatMap(log => [
  { 
    role: "用户", 
    content: DOMPurify.sanitize(marked.parse(log.question)) 
  },
  { 
    role: "AI", 
    content: DOMPurify.sanitize(marked.parse(log.answer)) 
  }
]);

  } else {
    messages.value = [];
  }
  scrollToBottom();
};

// ------------------ 发送消息 ------------------
const sendQuestion = async () => {
  if (!inputText.value) return;

  // 用户消息
  messages.value.push({ role: "用户", content: inputText.value });
  scrollToBottom();
  showQuickPrompts.value = false;

  const questionText = inputText.value;
  inputText.value = "";

  // 显示加载动画
  const loadingMessage = { role: "AI", content: "AI正在思考...", isLoading: true };
  messages.value.push(loadingMessage);
  aiLoading.value = true;
  scrollToBottom();

  try {
    let res;

    if (isLoggedIn.value) {
      if (!sessionCreatedInDB.value) {
        const createRes = await axios.post("http://localhost:8080/api/chat/session", null, {
          params: { userId: user.value.id, title: questionText.slice(0,10) }
        });
        currentSessionId.value = createRes.data.id;
        sessionCreatedInDB.value = true;
        await loadSessions();
      }
      res = await axios.post("http://localhost:8080/api/chat/send", null, {
        params: {
          userId: user.value.id,
          sessionId: currentSessionId.value,
          text: questionText,
        },
      });
    } else {
      res = await axios.post("http://localhost:8000/ask", { text: questionText });
    }

    // 渲染Markdown
    const rawAnswer = res.data.answer || "AI未返回内容";
    const safeHtml = DOMPurify.sanitize(marked.parse(rawAnswer));

    // 移除加载动画
    const loadingIdx = messages.value.findIndex(m => m.isLoading);
    if (loadingIdx !== -1) messages.value.splice(loadingIdx, 1);

    // 逐字输出
    messages.value.push({ role: "AI", content: "" });
    const newMsg = messages.value[messages.value.length - 1];
    aiTypingIndex.value = 0;

    function typeChar() {
      if (aiTypingIndex.value < safeHtml.length) {
        newMsg.content += safeHtml[aiTypingIndex.value];
        aiTypingIndex.value++;
        scrollToBottom();
        setTimeout(typeChar, 20); // 逐字输出速度，20ms一个字符
      } else {
        aiLoading.value = false;
      }
    }
    typeChar();

  } catch (error) {
    messages.value.push({ role: "系统", content: "❌ 问答服务出错了" });
    console.error(error);
    aiLoading.value = false;
  }
};


// ------------------ 导航栏 ------------------
const toggleUserMenu = () => { showUserMenu.value = !showUserMenu.value; };
const goToSettings = () => { router.push("/settings"); };
const logout = () => {
  localStorage.removeItem("user");
  isLoggedIn.value = false;
  user.value = { id:null, username:"" };
  createNewSession(); // 登出后新建前端临时会话
};

// ------------------ 辅助函数 ------------------
const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};


</script>


