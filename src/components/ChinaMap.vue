<template>
    <div class="china-map-container">
      <v-chart :option="chartOption" autoresize style="width: 100%; height: 600px;" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { use } from 'echarts/core'
  import VChart from 'vue-echarts'
  import { CanvasRenderer } from 'echarts/renderers'
  import { MapChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    VisualMapComponent,
  } from 'echarts/components'
  import chinaJson from '@/assets/china.json'


  
  // 注册必须组件
  use([
    CanvasRenderer,
    MapChart,
    TitleComponent,
    TooltipComponent,
    VisualMapComponent,
  ])
  
  // 各省心理咨询热线数据
  const hotlineData = [
    { name: '北京', hotline: '010-12345678' },
    { name: '上海', hotline: '021-87654321' },
    { name: '广东', hotline: '020-11223344' },
    { name: '江苏', hotline: '025-99887766' },
    // ...继续添加其他省份
  ]
  
  // 注册中国地图
  import * as echarts from 'echarts'
  echarts.registerMap('china', chinaJson)
  
  // 构建 ECharts 配置
  const chartOption = ref({
    title: {
      text: '中国心理咨询热线地图',
      left: 'center',
      top: 20,
      textStyle: { fontSize: 20 },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = hotlineData.find((d) => d.name === params.name)
        return `${params.name}<br/>心理咨询热线：${data ? data.hotline : '暂无数据'}`
      },
    },
    visualMap: {
      show: false,
    },
    series: [
      {
        name: '心理咨询热线',
        type: 'map',
        map: 'china',
        roam: true,
        emphasis: {
          label: { show: true },
        },
        data: hotlineData.map((d) => ({ name: d.name, value: 1 })),
      },
    ],
  })
  </script>
  
  <style scoped>
  .china-map-container {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }
  </style>
  