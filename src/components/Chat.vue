<template>
  <div class="chat-app">
    <!-- 导航栏 -->
    <header class="navbar">
      心理健康咨询小助手
    </header>

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
      <!-- 文件上传按钮 -->
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
import { ref, nextTick } from "vue";
import axios from "axios";

const inputText = ref("");
const messages = ref([]);
const selectedFiles = ref([]); // 存储上传的文件

const prompts = ref([
  "您好，我最近情绪低落，不知道该怎么办",
  "我经常焦虑，晚上总是睡不好",
  "我想了解抑郁症的常见症状",
  "请告诉我焦虑症患者可以尝试的放松方法",
]);

const chatContainer = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

// 点击提示词只填入输入框
const fillPrompt = (prompt) => {
  inputText.value = prompt;
};

// ✅ 触发隐藏的文件输入框
const fileInput = ref(null);
const triggerFileInput = () => {
  fileInput.value.click();
};

// ✅ 处理文件上传
const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    selectedFiles.value = Array.from(files);
    const fileNames = selectedFiles.value.map((f) => f.name).join(", ");
    messages.value.push({ role: "系统", text: `📎 已选择文件：${fileNames}` });
    scrollToBottom();
  }
};

// ✅ 发送消息（根据是否有文件自动选择接口）
const sendQuestion = async () => {
  if (!inputText.value && selectedFiles.value.length === 0) return;

  messages.value.push({ role: "用户", text: inputText.value || "（发送文件）" });
  scrollToBottom();

  try {
    let res;

    if (selectedFiles.value.length > 0) {
      // 带文件：走 /ask_with_file
      const formData = new FormData();
      formData.append("text", inputText.value || "请分析这个文件");

      selectedFiles.value.forEach((file) => {
        formData.append("files", file);
      });

      res = await axios.post("http://localhost:8000/ask_with_file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 清空文件
      selectedFiles.value = [];
      fileInput.value.value = "";
    } else {
      // 普通文本：走 /ask
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
