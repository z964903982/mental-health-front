<template>
  <div class="page-bg">
    <Navbar />
    <div style="padding:20px; display:grid; grid-template-columns: 1.1fr 1.6fr; gap:20px;">
      <!-- 量表列表 -->
      <el-card class="glass-card">
        <template #header>
          <div class="title-xl">心理测试列表</div>
        </template>
        <el-table :data="scales" v-loading="loadingScales" @row-click="onSelectScale" style="width:100%">
          <el-table-column prop="title" label="名称" min-width="160" />
          <el-table-column prop="description" label="描述" min-width="220" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button size="small" type="primary" class="btn-primary" @click.stop="onSelectScale(row)">开始测试</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 量表详情与作答表单 -->
      <el-card class="glass-card" v-loading="loadingDetail">
        <template #header>
          <div class="title-xl">{{ detail?.title || '请选择一个量表' }}</div>
        </template>
        <div v-if="detail">
          <p class="text-muted" style="margin-bottom:12px">{{ detail.description }}</p>
          <el-form label-position="top">
            <div v-for="(item, idx) in detail.items" :key="item.itemId || item.id || idx" style="margin-bottom:16px">
              <el-form-item :label="(idx+1) + '. ' + (item.question || item.title || '题目')">
                <template v-if="item.options && item.options.length">
                  <el-radio-group v-model="answers[getKey(item, idx)]">
                    <el-radio
                      v-for="(opt,i) in item.options"
                      :key="i"
                      :label="getOptionText(opt)"
                    >{{ getOptionText(opt) }}</el-radio>
                  </el-radio-group>
                </template>
                <template v-else>
                  <el-input type="textarea" :rows="3" v-model="answers[getKey(item, idx)]" placeholder="请输入答案" />
                </template>
              </el-form-item>
            </div>
            <el-button type="primary" class="btn-primary" :loading="submitting" @click="submit">提交并查看分析</el-button>
          </el-form>
          <!-- AI 分析展示 -->
          <div style="margin-top:16px">
            <el-divider>AI 分析</el-divider>
            <div v-if="analyzing" class="text-muted">已提交，结果分析中...</div>
            <div v-else-if="analysisHtml" v-html="analysisHtml"></div>
            <div v-else class="text-muted">提交后将展示AI分析结果。</div>
          </div>
        </div>
        <div v-else class="text-muted">请选择左侧量表开始测试。</div>
      </el-card>
    </div>

    <!-- 历史记录 -->
    <div style="padding:0 20px 20px;">
      <el-card class="glass-card">
        <template #header>
          <div class="title-xl">历史测试记录</div>
        </template>
        <el-table :data="records" v-loading="loadingRecords" style="width:100%" @row-click="openRecord">
          <el-table-column prop="id" label="记录ID" width="120" />
          <el-table-column prop="scaleTitle" label="量表" min-width="180" />
          <el-table-column prop="createdAt" label="时间" min-width="180" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button size="small" @click.stop="openRecord(row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 记录详情弹窗 -->
    <el-dialog v-model="recordDialogVisible" title="记录详情" width="720">
      <div v-if="recordDetail">
        <h3 style="margin-bottom:8px">{{ recordDetail.scaleTitle }}</h3>
        <p class="text-muted" style="margin-bottom:12px">{{ recordDetail.createdAt }}</p>
        <el-divider>作答</el-divider>
        <div v-for="(ans, idx) in recordDetail.answers || []" :key="idx" style="margin-bottom:10px">
          <div style="font-weight:600">{{ ans.question || ('题目 ' + (idx+1)) }}</div>
          <div>答案：{{ ans.answerText }}</div>
        </div>
        <el-divider v-if="recordDetail && (recordDetail.analysis || recordDetail.aiAnalysis || recordDetail.result)">AI 分析</el-divider>
        <div v-if="recordDetail && (recordDetail.analysis || recordDetail.aiAnalysis || recordDetail.result)" v-html="toHtmlFromAnalysis(recordDetail.analysis || recordDetail.aiAnalysis || recordDetail.result)"></div>
      </div>
      <template #footer>
        <el-button @click="recordDialogVisible=false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { fetchAllScales, fetchScaleDetail, submitScale, fetchUserRecords, fetchRecordDetail } from '@/api/scales'

const userStore = useUserStore()
userStore.loadUserFromStorage()
const userId = userStore.user?.id

const scales = ref([])
const loadingScales = ref(false)

const detail = ref(null)
const loadingDetail = ref(false)

const answers = reactive({})
const submitting = ref(false)

const records = ref([])
const loadingRecords = ref(false)

const recordDialogVisible = ref(false)
const recordDetail = ref(null)
// AI 分析状态
const analyzing = ref(false)
const analysisHtml = ref('')
const currentRecordId = ref(null)
let pollTimer = null

onMounted(async () => {
  await loadScales()
  await loadRecords()
})

async function loadScales() {
  loadingScales.value = true
  try {
    const res = await fetchAllScales()
    scales.value = res.data || []
  } catch (e) { console.error(e) } finally { loadingScales.value = false }
}

async function onSelectScale(row) {
  loadingDetail.value = true
  try {
    const res = await fetchScaleDetail(row.id)
    if(res.data) {
      detail.value = { ...res.data, id: row.id } // 保留 id
    } else {
      detail.value = null
    }
    // 重置答案
    Object.keys(answers).forEach(k => delete answers[k])
    // 重置分析状态
    analyzing.value = false
    analysisHtml.value = ''
    currentRecordId.value = null
  } catch (e) {
    console.error(e)
  } finally {
    loadingDetail.value = false
  }
}

async function submit() {
  if (!detail.value) return
  submitting.value = true
  try {
    const payload = {
  userId: Number(userId) || 0,
  answers: (detail.value.items || []).map((it, index) => {
    const key = getKey(it, index);
    const val = answers[key];
    return {
      itemId: Number(it.itemId || it.id), // 确保数字
      answerText: val != null ? String(val) : "" // 空值转空字符串
    }
  })
}

let res = null
try {
  res = await submitScale(detail.value.id, payload)
  console.log('=== submitScale 返回 ===', res)
} catch (err) {
  console.error('=== submitScale 异常 ===', err)
  ElMessage.error('提交失败，请检查控制台日志')
  return  // 提交失败直接返回
}

const data = res?.data || {}

    // 刷新历史记录
    await loadRecords()

    // 处理 AI 分析
    currentRecordId.value = data.recordId
    const directAnalysis = data.analysis || data.aiAnalysis || data.result || data.analysisText
    const text = extractAnalysisText(directAnalysis) || extractAnalysisText(data)
    if (isNonEmpty(text)) {
      analysisHtml.value = toHtmlFromAnalysis(text)
      analyzing.value = false
      ElMessage.success('提交成功，已获得分析结果')
    } else {
      analyzing.value = true
      analysisHtml.value = ''
      ElMessage.success(data.message || '提交成功，结果分析中')
      startPollAnalysis()
    }
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}

async function loadRecords() {
  loadingRecords.value = true
  try {
    if (!userId) return
    const res = await fetchUserRecords(userId)
    records.value = res.data || []
  } catch (e) { console.error(e) } finally { loadingRecords.value = false }
}

async function openRecord(row) {
  try {
    const res = await fetchRecordDetail(row.id)
    recordDetail.value = res.data || null
    recordDialogVisible.value = true
    if (recordDetail.value) {
      await ensureRecordQuestions()
    }
  } catch (e) { console.error(e) }
}

// 轮询获取分析结果
function startPollAnalysis() {
  stopPollAnalysis()
  if (!currentRecordId.value) return
  pollTimer = setInterval(async () => {
    try {
      const res = await fetchRecordDetail(currentRecordId.value)
      const rd = res.data?.data || res.data || {}
      const analysis = rd.analysis || rd.aiAnalysis || rd.result || rd.analysisText || rd.analysis?.analysisText
      const text = extractAnalysisText(analysis) || extractAnalysisText(rd)
      if (isNonEmpty(text)) {
        analysisHtml.value = toHtmlFromAnalysis(text)
        analyzing.value = false
        stopPollAnalysis()
      }

    } catch (e) {
      console.error("轮询异常", e)
    }
  }, 2000)
}


function stopPollAnalysis() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

onUnmounted(() => stopPollAnalysis())

// 确保记录详情具备题目文本；若缺失，则通过量表详情映射 itemId → question
async function ensureRecordQuestions() {
  const rd = recordDetail.value
  if (!rd) return
  const answersArr = rd.answers || []
  const hasQuestions = answersArr.some(a => a.question)
  if (hasQuestions) return

  const scaleId = rd.scaleId || (detail.value && detail.value.id)
  let items = (detail.value && detail.value.items) || []
  if (!items.length && scaleId) {
    try {
      const res = await fetchScaleDetail(scaleId)
      items = (res.data && res.data.items) || []
    } catch (e) {}
  }
  const qMap = Object.create(null)
  items.forEach(it => {
    const key = it.itemId || it.id
    if (key != null) qMap[key] = it.question || it.title || ''
  })
  rd.answers = answersArr.map(a => ({
    ...a,
    question: a.question || qMap[a.itemId] || `题目 ${a.itemId}`
  }))
}

// 工具：判定分析结果是否非空
function isNonEmpty(val) {
  if (val == null) return false
  if (typeof val === 'string') return val.trim() !== '' && val !== 'null' && val !== '[object Object]'
  if (Array.isArray(val)) return val.length > 0
  if (typeof val === 'object') return Object.keys(val).length > 0
  return true
}

// 将分析结果转为 Markdown 文本
function toMarkdown(val) {
  if (val == null) return ''
  if (typeof val === 'string') return val
  if (Array.isArray(val)) {
    return val
      .map((v) => (typeof v === 'object' ? `- ${JSON.stringify(v, null, 2)}` : `- ${String(v)}`))
      .join('\n')
  }
  if (typeof val === 'object') {
    // 常见字段优先
    const preferred = val.analysisText || val.markdown || val.md || val.text || val.content || val.summary
    if (typeof preferred === 'string' && preferred.trim() !== '') return preferred
    // 组合为易读 Markdown
    let md = '# AI 分析结果\n\n'
    for (const [key, v] of Object.entries(val)) {
      md += `### ${key}\n\n`
      if (typeof v === 'object') {
        md += '```json\n' + JSON.stringify(v, null, 2) + '\n```\n\n'
      } else {
        md += String(v) + '\n\n'
      }
    }
    return md
  }
  return String(val)
}

// 将 Markdown 渲染为安全 HTML
function toHtmlFromAnalysis(val) {
  try {
    const md = toMarkdown(val)
    const html = marked.parse(md || '')
    return DOMPurify.sanitize(html)
  } catch (e) {
    return DOMPurify.sanitize(String(val))
  }
}

// 仅提取分析文本，避免显示 id/recordId 等无关字段
function extractAnalysisText(val) {
  if (val == null) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'object') {
    const candidates = [
      val.analysisText,
      val.analysis?.analysisText,
      val.analysis,
      val.aiAnalysis,
      val.result,
      val.markdown,
      val.md,
      val.text,
      val.content,
      val.summary
    ]
    for (const c of candidates) {
      if (typeof c === 'string' && c.trim() !== '') return c
    }
  }
  return ''
}

// 工具：为每题生成稳定的答案键
function getKey(item, idx) {
  return String(item?.itemId ?? item?.id ?? idx)
}

// 工具：从选项对象提取并净化文本，仅显示描述
function getOptionText(opt) {
  const raw = typeof opt === 'string' ? opt : (opt?.optionText ?? '')
  // 去除前导编号和等号/冒号等，例如 "0=几乎没有" → "几乎没有"
  return raw.replace(/^\s*\d+\s*[=：:\-\.、]?\s*/, '')
}
</script>