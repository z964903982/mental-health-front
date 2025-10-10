<template>
    <div class="nav-breathing">
      <!-- 左侧引导文字 -->
      <span v-if="localShowBreathing" class="breathing-guide">跟随呼吸灯调整呼吸</span>
  
      <!-- 中间呼吸灯 -->
      <div v-if="localShowBreathing" class="breathing-light" :class="[currentRhythmClass, { breathing: true }]" />
  
      <!-- 右侧下拉菜单 -->
      <el-dropdown v-model:visible="contextVisible" trigger="click" @command="handleCommand">
        <span class="mode-label">{{ localShowBreathing ? rhythmLabelMap[localRhythm] : '显示' }} ▼</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="slow">平缓呼吸</el-dropdown-item>
            <el-dropdown-item command="deep">深呼吸</el-dropdown-item>
            <el-dropdown-item command="478">4-7-8呼吸法</el-dropdown-item>
            <el-dropdown-item command="box">盒式呼吸</el-dropdown-item>
            <el-dropdown-item command="alternate">交替鼻孔呼吸</el-dropdown-item>
            <el-dropdown-item command="stimulate">短促醒脑呼吸</el-dropdown-item>
            <el-dropdown-item command="toggle">{{ localShowBreathing ? '隐藏' : '显示' }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  
  const props = defineProps({
    showBreathing: { type: Boolean, default: true },
    rhythm: { type: String, default: 'slow' },
  })
  
  const localShowBreathing = ref(props.showBreathing)
  const localRhythm = ref(props.rhythm)
  
  // 同步 props
  watch(() => props.showBreathing, val => localShowBreathing.value = val)
  watch(() => props.rhythm, val => localRhythm.value = val)
  
  const currentRhythmClass = computed(() => `rhythm-${localRhythm.value}`)
  
  // 显示文字
  const rhythmLabelMap = {
    slow: '平缓',
    deep: '深呼吸',
    '478': '4-7-8',
    box: '盒式呼吸',
    alternate: '交替呼吸',
    stimulate: '短促醒脑'
  }
  
  // 下拉菜单控制
  const contextVisible = ref(false)
  
  function handleCommand(command) {
    if (command === 'toggle') {
      localShowBreathing.value = !localShowBreathing.value
    } else {
      localRhythm.value = command
      // 自动显示呼吸灯
      if (!localShowBreathing.value) localShowBreathing.value = true
    }
    contextVisible.value = false
  }
  </script>
  
  <style scoped>
  .nav-breathing {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 6px 12px;
  }
  
  .breathing-guide {
    font-size: 16px;
    color: #666;
    white-space: nowrap;
    font-weight: 500;
  }
  
  .breathing-light {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #4ECDC4;
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.6);
    transition: transform 1s ease-in-out;
  }
  
  /* 动画 */
  .rhythm-slow.breathing { animation: breathe-slow 6s infinite ease-in-out; }
  .rhythm-deep.breathing { animation: breathe-deep 8s infinite ease-in-out; }
  .rhythm-478.breathing { animation: breathe-478 12s infinite ease-in-out; }
  .rhythm-box.breathing { animation: breathe-box 16s infinite ease-in-out; }
  .rhythm-alternate.breathing { animation: breathe-alternate 4s infinite ease-in-out; }
  .rhythm-stimulate.breathing { animation: breathe-stimulate 2s infinite ease-in-out; }
  
  /* 呼吸灯动画 keyframes */
  @keyframes breathe-slow { 0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.5);opacity:1} }
  @keyframes breathe-deep { 0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.7);opacity:1} }
  @keyframes breathe-478 { 0%{transform:scale(1);opacity:0.6}33%{transform:scale(1.6);opacity:1}58%{transform:scale(1.6);opacity:0.9}100%{transform:scale(1);opacity:0.6} }
  @keyframes breathe-box { 0%,25%,50%,75%,100% { transform: scale(1); } 12.5%,37.5%,62.5%,87.5% { transform: scale(1.5); } }
  @keyframes breathe-alternate { 0%,50%,100% { transform: scale(1.4); } 25%,75% { transform: scale(1.2); } }
  @keyframes breathe-stimulate { 0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.8);opacity:1} }
  
  .mode-label {
    font-size: 16px;
    color: #333;
    cursor: pointer;
    padding: 0 6px;
    font-weight: 500;
    user-select: none;
  }
  .mode-label:hover {
    color: #4ECDC4;
  }
  </style>
  