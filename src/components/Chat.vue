<template>
  <div class="chat-app">
    <!-- 导航栏 -->
    <header class="navbar">
      心理健康咨询小助手
      <div class="nav-right">
        <template v-if="isLoggedIn">
          <span @click="toggleUserMenu">你好，{{ user.username }}</span>
          <div v-if="showUserMenu" class="user-menu">
            <button @click="goToSettings">设置</button>
            <button @click="logout">退出登录</button>
          </div>
        </template>
        <template v-else>
          <router-link to="/login">登录</router-link>
        </template>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="chat-body">
      <!-- 左侧历史会话 -->
      <div class="chat-sidebar">
        <button class="new-session-btn" @click="createNewSession">+ 新建对话</button>
        <div 
          v-for="session in sessions" 
          :key="session.id" 
          :class="['session-item', {active: session.id === currentSessionId}]"
          @click="loadSession(session)"
        >
          {{ session.title || '新对话' }}
        </div>
      </div>

      <!-- 右侧聊天主区 -->
      <div class="chat-main">
        <div v-if="!isLoggedIn" class="not-logged-in">
          ⚠️ 您未登录，会话不会被存储
        </div>

        <!-- 聊天窗口 -->
        <div class="chat-container" ref="chatContainer">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['chat-message', msg.role === '用户' ? 'user' : 'ai']"
          >
            <div class="message-content" v-html="msg.text"></div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-area">
          <button @click="triggerFileInput">上传文件</button>
          <input
            ref="fileInput"
            type="file"
            multiple
            style="display: none"
            @change="handleFileUpload"
          />
          <input
            v-model="inputText"
            @keyup.enter="sendQuestion"
            placeholder="输入消息..."
          />
          <button @click="sendQuestion">发送</button>
        </div>

        <!-- 快速提示 -->
        <div class="quick-prompts">
          <button
            v-for="(prompt, i) in prompts"
            :key="i"
            @click="fillPrompt(prompt)"
          >
            {{ prompt }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const inputText = ref("");
const messages = ref([]);
const selectedFiles = ref([]);
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
    messages.value.push({ role: "系统", text: `📎 已选择文件：${fileNames}` });
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
  const newSession = { id: Date.now(), title: "新对话", userId: isLoggedIn.value ? user.value.id : null };
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
      { role: "用户", text: log.question },
      { role: "AI", text: log.answer }
    ]);
  } else {
    messages.value = [];
  }
  scrollToBottom();
};

// ------------------ 发送消息 ------------------
const sendQuestion = async () => {
  if (!inputText.value) return;
  messages.value.push({ role: "用户", text: inputText.value });
  scrollToBottom();

  try {
    let res;

    // 如果是临时会话，首次发送消息时创建DB记录
    if (isLoggedIn.value && !sessionCreatedInDB.value) {
      const createRes = await axios.post("http://localhost:8080/api/chat/session", null, {
        params: { userId: user.value.id, title: inputText.value.slice(0,10) }
      });
      currentSessionId.value = createRes.data.id;
      sessionCreatedInDB.value = true;
      await loadSessions();
    }

    if (isLoggedIn.value) {
      res = await axios.post("http://localhost:8080/api/chat/send", null, {
        params: {
          userId: user.value.id,
          sessionId: currentSessionId.value,
          text: inputText.value,
        },
      });
    } else {
      res = await axios.post("http://localhost:8000/ask", { text: inputText.value });
    }

    messages.value.push({ role: "AI", text: res.data.answer });
    scrollToBottom();
  } catch (error) {
    messages.value.push({ role: "系统", text: "❌ 问答服务出错了" });
    console.error(error);
  }

  inputText.value = "";
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
</script>

<style scoped>
html, body, #app, .chat-app {
  height: 100%;
  margin: 0;
}

.chat-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  padding: 8px;
  background-color: #a3d5ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-right { position: relative; }

.user-menu {
  position: absolute;
  top: 24px;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  padding: 4px;
  display: flex;
  flex-direction: column;
}

.chat-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-sidebar {
  width: 220px;
  border-right: 1px solid #ccc;
  padding: 8px;
  overflow-y: auto;
  background: #f7f7f7;
}

.new-session-btn {
  width: 100%;
  margin-bottom: 10px;
  padding: 6px;
}

.session-item {
  padding: 6px;
  margin-bottom: 4px;
  cursor: pointer;
  border-radius: 4px;
}

.session-item.active { background-color: #a3d5ff; }

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.not-logged-in {
  text-align: center;
  color: #ff6600;
  margin: 4px 0;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #fff;
}

.chat-message {
  margin-bottom: 8px;
}

.chat-message.user { text-align: right; }
.chat-message.ai { text-align: left; }

.message-content {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 6px;
  max-width: 60%;
  word-break: break-word;
}

.chat-input-area {
  display: flex;
  gap: 6px;
  padding: 8px;
}

.chat-input-area input[type="text"] { flex: 1; padding: 6px; }

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px;
}
</style>
