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

    <!-- 未登录提示 -->
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

// 检查登录状态
onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    user.value = storedUser;
    isLoggedIn.value = true;
  }
});

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const fillPrompt = (prompt) => {
  inputText.value = prompt;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    selectedFiles.value = Array.from(files);
    const fileNames = selectedFiles.value.map((f) => f.name).join(", ");
    messages.value.push({ role: "系统", text: `📎 已选择文件：${fileNames}` });
    scrollToBottom();
  }
};

const sendQuestion = async () => {
  if (!inputText.value && selectedFiles.value.length === 0) return;

  messages.value.push({ role: "用户", text: inputText.value || "（发送文件）" });
  scrollToBottom();


  try {
    let res;
    if (selectedFiles.value.length > 0) {
      const formData = new FormData();
      formData.append("text", inputText.value || "请分析这个文件");
      selectedFiles.value.forEach((file) => formData.append("files", file));

      res = await axios.post("http://localhost:8000/ask_with_file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      selectedFiles.value = [];
      fileInput.value.value = "";
    } else {
      res = await axios.post("http://localhost:8000/ask", {
        text: inputText.value,
      });
    }

    messages.value.push({ role: "AI", text: res.data.answer });
  } catch (error) {
    messages.value.push({ role: "系统", text: "❌ 问答服务出错了" });
    console.error(error);
  }

  inputText.value = "";
  scrollToBottom();
};

// 导航栏操作
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const goToSettings = () => {
  router.push("/settings");
};

const logout = () => {
  localStorage.removeItem("user");
  isLoggedIn.value = false;
  user.value = { id: null, username: "" };
};
</script>

<style scoped>
.chat-app {
  max-width: 700px;
  margin: auto;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  padding: 8px;
  text-align: center;
  font-weight: bold;
  background-color: #a3d5ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-right {
  position: relative;
}

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

.not-logged-in {
  text-align: center;
  color: #ff6600;
  margin: 4px 0;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #ffffff;
}

.chat-message {
  margin-bottom: 8px;
}

.chat-message.user {
  text-align: right;
}

.chat-message.ai {
  text-align: left;
}

.message-content {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 6px;
  max-width: 60%;
}

.chat-input-area {
  display: flex;
  gap: 6px;
  padding: 8px;
}

.chat-input-area input[type="text"] {
  flex: 1;
  padding: 6px;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px;
}
</style>
