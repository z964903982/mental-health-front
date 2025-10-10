<template>
  <div class="chat-app">
    <!-- 导航栏 -->
    <Navbar>
  <template #center-controls>
    <BreathingCard :showBreathing="showBreathing" :rhythm="selectedRhythm" ref="breathingCard" />

  </template>
</Navbar>



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
import Navbar from '@/components/Navbar.vue'
import BreathingCard from '@/components/BreathingCard.vue'

import { ref, nextTick, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();  // ✅ 这里创建实例
userStore.loadUserFromStorage();   // 如果你想立即从 localStorage 加载用户数据

import { marked } from "marked";
import DOMPurify from "dompurify";


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

// 计算属性
const isLoggedIn = computed(() => userStore.isLoggedIn);
const user = computed(() => userStore.user);
const showUserMenu = ref(false);

const sessions = ref([]);
const currentSessionId = ref(null);
const sessionCreatedInDB = ref(false); // 是否已保存到数据库

const aiLoading = ref(false); // 是否正在加载AI回复
const aiTypingIndex = ref(0); // 当前AI输出的字符索引

const emotionToRhythm = {
  happy: 'deep',
  neutral: 'slow',
  anxious: '478',
  stressed: 'box',
  angry: 'box',   // 添加 angry 对应呼吸节奏
  tired: 'alternate',
  excited: 'stimulate',
  sad: '478'
  
};

const emotionToChinese = {
  happy: '高兴',
  neutral: '平静',
  anxious: '焦虑',
  stressed: '紧张',
  angry: '生气',
  sad: '难过',
  tired: '疲惫',
  excited: '兴奋',
  sad: '难过'
};



const showBreathing = ref(true); // 是否显示呼吸灯
const selectedRhythm = ref('slow'); // 当前呼吸模式





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
    setTimeout(typeChar, 20);
  } else {
    aiLoading.value = false;

    // ✅ 根据 AI 情绪切换呼吸模式
const aiEmotion = res.data.emotion || 'neutral';
// 只在负面情绪时切换
const triggerEmotions = ['sad', 'angry', 'anxious', 'stressed'];
if (triggerEmotions.includes(aiEmotion) && emotionToRhythm[aiEmotion]) {
  selectedRhythm.value = emotionToRhythm[aiEmotion];
  showBreathing.value = true;
  messages.value.push({ 
    role: '系统', 
    content: `💡 系统察觉到您的情绪（${emotionToChinese[aiEmotion]}），已为您切换了呼吸模式，请您跟随呼吸灯慢慢放松~` 
  });
  scrollToBottom();
}

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


