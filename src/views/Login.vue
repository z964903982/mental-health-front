<template>
  <div class="login-container">
    <h2>{{ isAdmin ? "管理员登录" : "用户登录" }}</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="account" placeholder="账号" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <button type="submit">登录</button>
    </form>

    <button @click="toggleRole">
      切换到{{ isAdmin ? "用户" : "管理员" }}登录
    </button>

    <p>
      还没有账号？ 
      <router-link to="/register">去注册</router-link>
    </p>

    <p>{{ message }}</p>
  </div>
</template>

<script setup>
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

<style scoped>
.login-container {
  max-width: 300px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
