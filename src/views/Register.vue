<template>
  <div class="register-container">
    <h2>用户注册</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="account" placeholder="账号（登录用）" required />
      <input v-model="username" placeholder="昵称" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <input v-model="email" placeholder="邮箱（可选）" />
      <button type="submit">注册</button>
    </form>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
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

<style scoped>
.register-container {
  max-width: 300px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
s