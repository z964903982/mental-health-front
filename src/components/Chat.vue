<template>
  <div class="chat-app">
    <!-- 导航栏 -->
    <header class="navbar">
      心理健康咨询小助手
    </header>

    <!-- 聊天窗口 -->
    <div class="chat-container" ref="chatContainer">
      <div v-for="(msg, index) in messages" :key="index"
           :class="['chat-message', msg.role === '用户' ? 'user' : 'ai']">
        <div class="message-content" v-html="msg.text"></div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-area">
      <button @click="handleFileUpload">上传文件</button>
      <input v-model="inputText" @keyup.enter="sendQuestion" placeholder="输入消息..." />
      <button @click="sendQuestion">发送</button>
    </div>

    <!-- 快速提示 -->
    <div class="quick-prompts">
      <button v-for="(prompt, i) in prompts" :key="i" @click="fillPrompt(prompt)">
        {{ prompt }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'

const inputText = ref('')
const messages = ref([])
const files = ref([])

const prompts = ref([
  "您好，我最近情绪低落，不知道该怎么办",
  "我经常焦虑，晚上总是睡不好",
  "我想了解抑郁症的常见症状",
  "请告诉我焦虑症患者可以尝试的放松方法"
])

const chatContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 点击提示词只填入输入框
const fillPrompt = (prompt) => {
  inputText.value = prompt
}

// 模拟文件上传
const handleFileUpload = () => {
  alert("这里可以添加文件上传逻辑")
}

const sendQuestion = async () => {
  if (!inputText.value) return;

  messages.value.push({ role: "用户", text: inputText.value })
  scrollToBottom()

  try {
    const res = await axios.post("http://localhost:8000/ask", { text: inputText.value })
    messages.value.push({ role: "AI", text: res.data.answer })
  } catch (error) {
    messages.value.push({ role: "系统", text: "问答服务出错了" })
    console.error(error)
  }

  inputText.value = ''
  scrollToBottom()
}
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
