<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h2 class="auth-title">用户注册</h2>
        <p class="auth-subtitle">欢迎加入，请填写您的信息</p>
      </div>

      <el-form label-position="top" @submit.prevent>
        <el-form-item label="账号（登录用）">
          <el-input v-model="account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="username" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="邮箱（可选）">
          <el-input v-model="email" placeholder="请输入邮箱" />
        </el-form-item>
        <div class="auth-actions">
          <el-button type="primary" class="btn-primary" @click="handleRegister">注册</el-button>
        </div>
      </el-form>

      <p class="text-muted" v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/Auth.css'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerUser } from '@/api/user';

const router = useRouter();
const account = ref('');
const username = ref('');
const password = ref('');
const email = ref('');
const message = ref('');

// 简单邮箱验证
function isValidEmail(email) {
  if (!email) return true; // 可选
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function handleRegister() {
  if (!isValidEmail(email.value)) {
    message.value = '邮箱格式不正确';
    return;
  }

  try {
    const res = await registerUser({
      account: account.value,
      username: username.value,
      password: password.value,
      email: email.value || null,
    });

    message.value = res.data;
    if (res.data === '注册成功') {
      router.push('/login');
    }
  } catch (err) {
    console.error(err);
    message.value = '网络或服务器错误';
  }
}
</script>
s