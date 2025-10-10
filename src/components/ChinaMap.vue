<template>
  <div class="china-map-page">
    <Navbar>
      <template #center-controls>
        <BreathingCard :showBreathing="showBreathing" :rhythm="selectedRhythm" />
      </template>
    </Navbar>

    <div class="china-map-container">
      <v-chart 
        ref="chartRef"
        v-if="mapLoaded"
        :option="chartOption" 
        autoresize 
        style="width: 100%; height: 600px;" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
  { name: '北京', hotline: '010-12345678' },
  { name: '上海', hotline: '021-87654321' },
  { name: '广东', hotline: '020-11223344' },
  { name: '江苏', hotline: '025-99887766' },
]

const chartRef = ref(null)
const mapLoaded = ref(false) // 地图加载完成标志

const chartOption = ref({
  title: { text: '中国心理咨询热线地图', left: 'center', top: 20 },
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
  series: [
    {
      name: '心理咨询热线',
      type: 'map',
      map: 'china',
      roam: true,
      emphasis: { label: { show: true } },
      data: [] // 等地图加载后填充
    }
  ]
})

const showBreathing = ref(true)
const selectedRhythm = ref('slow')

onMounted(async () => {
  try {
    const { data } = await axios.get('https://geojson.cn/api/china/100000.json')
    echarts.registerMap('china', data)

    // 填充省份数据
    chartOption.value.series[0].data = hotlineData.map(d => ({ name: d.name, value: 1 }))

    mapLoaded.value = true // 显示图表

    // 等下一次 DOM 渲染完成后再获取 chart 实例
    setTimeout(() => {
      const chart = chartRef.value?.echartsInstance
      if (chart) {
        chart.on('click', (params) => {
          const province = hotlineData.find(d => d.name === params.name)
          if (province && province.hotline) {
            navigator.clipboard.writeText(province.hotline)
              .then(() => alert(`已复制 ${province.name} 热线：${province.hotline}`))
              .catch(() => alert('复制失败，请手动复制'))
          } else {
            alert(`${params.name} 暂无热线信息`)
          }
        })
      }
    }, 0)

  } catch (err) {
    console.error('地图加载失败:', err)
  }
})
</script>
