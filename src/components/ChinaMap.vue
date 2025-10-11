<template>
  <div class="china-map-page">
    <Navbar>
      <template #center-controls>
        <BreathingCard :showBreathing="showBreathing" :rhythm="selectedRhythm" />
      </template>
    </Navbar>

    <div class="map-layout">
      <div class="china-map-container">
        <v-chart
      ref="chartRef"
      v-if="mapLoaded"
      :option="chartOption"
      autoresize
      style="width: 100%; height: 600px;"
    />


      </div>

      <!-- 侧边全国心理热线卡片（保持地图为主视觉） -->
      <div class="national-hotline">
        <el-card class="hotline-card" shadow="hover">
          <h3>【全国心理热线】</h3>
          <ul class="hotline-list">
            <li>卫生健康热线：<strong>12320</strong></li>
            <li>全国青少年心理咨询热线：<strong>12355</strong></li>
            <li>全国妇女儿童心理咨询热线：<strong>12338</strong></li>
          </ul>
          <p class="hint">提示：点击地图省份可复制当地热线</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'


import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { MapChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import * as echarts from 'echarts'
import axios from 'axios'

import Navbar from '@/components/Navbar.vue'
import BreathingCard from '@/components/BreathingCard.vue'




use([CanvasRenderer, MapChart, TitleComponent, TooltipComponent, VisualMapComponent])

const hotlineData = [
  { name: '北京', hotline: '010-82951332' },
  { name: '天津', hotline: '022-88188858' },
  { name: '河北', hotline: '0312-96312' },
  { name: '内蒙古', hotline: '0471-12320' },
  { name: '浙江', hotline: '0571-85029595' },
  { name: '山东', hotline: '0531-86336666' },
  { name: '山西', hotline: '0351-8726199' },
  { name: '安徽', hotline: '0551-63666903' },
  { name: '湖北', hotline: '027-87832211' },
  { name: '湖南', hotline: '0731-85292999' },
  { name: '江西', hotline: '0791-966525' },
  { name: '上海', hotline: '021-962525' },
  { name: '广东', hotline: '020-11223344' },
  { name: '江苏', hotline: '025-83712977' },
  { name: '河南', hotline: '0373-7095888' },
  { name: '广西', hotline: '0772-3136120' },
  { name: '福建', hotline: '0595-968908' },
  { name: '黑龙江', hotline: '0451-12320' },
  { name: '吉林', hotline: '0431-89685000' },
  { name: '辽宁', hotline: '024-96687' },
  { name: '四川', hotline: '96111' },
  { name: '重庆', hotline: '023-96320-1' },
  { name: '贵州', hotline: '0851-88417888' },
  { name: '云南', hotline: '0871-6501111' },
  { name: '西藏', hotline: '0891-12320' },
  { name: '陕西', hotline: '029-63609288' },
  { name: '青海', hotline: '0971-8140371' },
  { name: '甘肃', hotline: '0931-4638858' },
  { name: '宁夏', hotline: '0951-2160707' },
  { name: '新疆', hotline: '0991-3016111' },
  { name: '海南', hotline: '0898-96363' },
  { name: '香港', hotline: '18111' },
  { name: '澳门', hotline: '28261126' },
  { name: '台湾', hotline: '412-8185' },
]

const chartRef = ref(null)
const mapLoaded = ref(false)

// 新增：存储用户省份
const userProvince = ref('北京')

const chartOption = ref({
  title: { text: '全国心理咨询热线地图', left: 'center', top: 20 },
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      const data = hotlineData.find(d => d.name === params.name)
      const hotlineText = data ? data.hotline : '暂无数据'
      const clickHint = data ? '<br/><span style="color:#aaa;font-size:12px;">点击省份可复制热线</span>' : ''
      return `${params.name}<br/>心理咨询热线：${hotlineText}${clickHint}`
    }
  },
  visualMap: { show: false },
  // series 配置
series: [
  {
    name: '心理咨询热线',
    type: 'map',
    map: 'china',
    roam: true,
    label: {
      show: true,
      color: '#2D3748',
      fontSize: 12,
      formatter: '{b}' // 只显示省份名称
    },
    labelLayout: { hideOverlap: true },
    emphasis: { label: { show: true }, itemStyle: { borderColor: '#4ECDC4', borderWidth: 1 } },
    data: hotlineData.map(d => ({ name: d.name, value: 1 }))
  }
]

})

const showBreathing = ref(true)
const selectedRhythm = ref('slow')

onMounted(async () => {
  try {
    const { data } = await axios.get('https://geojson.cn/api/china/100000.json')
    echarts.registerMap('china', data)
    mapLoaded.value = true

    // 等 v-chart 渲染完成
    await nextTick()
    const chart = chartRef.value?.chart  // 直接通过 ref.chart 拿到 ECharts 实例
    if (chart) {
      chart.on('click', (params) => {
        const province = hotlineData.find(d => d.name === params.name)
        if (province?.hotline) {
          navigator.clipboard.writeText(province.hotline)
            .then(() => alert(`已复制热线：${province.hotline}`))
            .catch(() => alert('复制失败，请手动复制'))
        } else {
          alert(`${params.name} 暂无热线信息`)
        }
      })
    }
  } catch(err) {
    console.error('地图加载失败', err)
  }
})
 

</script>

<style scoped>
.map-layout {
  display: flex;
  gap: 16px;
  padding: 16px;
}

.china-map-container {
  flex: 3;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  padding: 8px;
}

.national-hotline {
  flex: 1;
  min-width: 280px;
}

.hotline-card {
  border-radius: 16px;
}
.hotline-card h3 {
  margin: 0 0 8px 0;
  color: #2D3748;
}
.hotline-list {
  list-style: none;
  padding: 0;
  margin: 0 0 8px 0;
}
.hotline-list li {
  padding: 6px 0;
  color: #4A5568;
}
.hint {
  color: #718096;
  font-size: 12px;
}

@media (max-width: 1024px) {
  .map-layout {
    flex-direction: column;
  }
  .national-hotline {
    min-width: unset;
  }
}
</style>