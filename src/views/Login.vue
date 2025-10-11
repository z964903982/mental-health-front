<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h2 class="auth-title">{{ isAdmin ? "管理员登录" : "用户登录" }}</h2>
        <p class="auth-subtitle">欢迎回来，请使用您的账号登录</p>
      </div>

      <div class="role-toggle">
        <span>登录身份：</span>
        <el-switch
          v-model="isAdmin"
          inline-prompt
          active-text="管理员"
          inactive-text="用户"
        />
      </div>

      <el-form label-position="top" @submit.prevent>
        <el-form-item label="账号">
          <el-input v-model="account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <div class="auth-actions">
          <el-button type="primary" class="btn-primary" @click="handleLogin">登录</el-button>
        </div>
      </el-form>

      <div class="auth-footer">
        还没有账号？ <router-link to="/register">去注册</router-link>
      </div>

      <p class="text-muted" v-if="message">{{ message }}</p>
    </div>
  </div>
  
</template>

<script setup>
import '@/assets/css/Auth.css'
import { ref } from "vue";
import { loginUser, adminLogin } from "@/api/user";
import { useRouter } from "vue-router";

const router = useRouter();
const account = ref("");
const password = ref("");
const message = ref("");
const isAdmin = ref(false);

function toggleRole() {
  isAdmin.value = !isAdmin.value;
}

async function handleLogin() {
  const api = isAdmin.value ? adminLogin : loginUser;
  
  try {
    const res = await api({
      account: account.value,
      password: password.value,
    });

    if (typeof res.data === "string") {
      message.value = res.data; // 错误消息
    } else {
      // 登录成功
      message.value = "登录成功";

      // 保存用户信息到 localStorage
      const userInfo = {
        id: res.data.id,
        username: res.data.username,
        role: res.data.role,
        account: res.data.account
      };
      localStorage.setItem("user", JSON.stringify(userInfo));

      // 跳转页面
      if (res.data.role === "admin") {
        router.push("/admin"); // 管理员首页
      } else {
        router.push("/"); // 普通用户首页 Chat.vue
      }
    }
  } catch (err) {
    console.error(err);
    message.value = "网络或服务器错误";
  }
}
</script>
