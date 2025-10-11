import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// ✅ 引入 Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/css/theme.css"; // 全局主题样式

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus); // ✅ 注册 Element Plus

app.mount("#app");
