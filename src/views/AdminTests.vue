<template>
  <div class="admin-page">
    <Navbar />

    <div class="admin-body">
      <!-- 左侧：量表列表与操作 -->
      <el-card class="admin-card">
        <template #header>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="title-xl">心理测试量表管理</div>
            <div class="admin-actions">
              <el-button type="primary" class="btn-primary" @click="showTextDialog = true">新增（文字生成）</el-button>
              <el-button @click="showFileDialog = true">新增（文件上传）</el-button>
            </div>
          </div>
        </template>

        <el-table :data="scales" v-loading="loading" style="width: 100%">
          <el-table-column prop="title" label="标题" min-width="160" />
          <el-table-column prop="description" label="描述" min-width="220" />
          <el-table-column label="题目数" width="100">
            <template #default="{ row }">{{ (row.items || []).length }}</template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template #default="{ row }">
              <el-button size="small" @click="openEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="removeScale(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 右侧：选中量表预览 -->
      <el-card class="admin-card" v-if="selected">
        <template #header>
          <div class="title-xl">量表预览</div>
        </template>
        <div class="scale-preview">
          <h3>{{ selected.title }}</h3>
          <p class="text-muted">{{ selected.description }}</p>
          <div v-for="(item, idx) in selected.items" :key="idx" class="item-block">
            <div style="font-weight:600; margin-bottom:8px;">{{ idx + 1 }}. {{ item.question }}</div>
            <div class="options" v-if="item.options && item.options.length">
              <el-tag v-for="(opt, i) in item.options" :key="i" type="success">{{ opt }}</el-tag>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 新增：文字生成对话框 -->
    <el-dialog v-model="showTextDialog" title="新增量表（通过文字生成）" width="600">
      <el-form label-position="top">
        <el-form-item label="描述文本（例如题目需求、量表说明等）">
          <el-input v-model="genText" type="textarea" :rows="8" placeholder="请输入将用于生成量表的文字" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTextDialog = false">取消</el-button>
        <el-button type="primary" class="btn-primary" :loading="creating" @click="createByText">生成并保存</el-button>
      </template>
    </el-dialog>

    <!-- 新增：文件上传对话框 -->
    <el-dialog v-model="showFileDialog" title="新增量表（上传文件生成）" width="600">
      <el-upload
        :http-request="handleCustomUpload"
        :auto-upload="false"
        :file-list="fileList"
        :on-change="onFileChange"
      >
        <el-button>选择文件</el-button>
        <template #tip>
          <div class="text-muted">支持上传文档，由后端解析生成量表</div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="showFileDialog=false">取消</el-button>
        <el-button type="primary" class="btn-primary" :loading="creating" @click="createByFile">上传并保存</el-button>
      </template>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog v-model="showEditDialog" title="编辑量表" width="720">
      <el-form label-position="top">
        <el-form-item label="标题">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-divider>题目</el-divider>
        <div v-for="(it, idx) in editForm.items" :key="idx" class="item-block">
          <el-input v-model="it.question" placeholder="题目内容" />
          <div style="margin-top:8px">
            <el-input v-for="(opt,i) in it.options" :key="i" v-model="it.options[i]" placeholder="选项" style="margin-bottom:6px" />
            <el-button size="small" @click="it.options.push('')">新增选项</el-button>
            <el-button size="small" type="danger" @click="removeOption(it, i)" v-if="it.options.length">删除最后一个选项</el-button>
          </div>
        </div>
        <el-button size="small" @click="addItem">新增题目</el-button>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog=false">取消</el-button>
        <el-button type="primary" class="btn-primary" :loading="saving" @click="saveEdit">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import '@/assets/css/Admin.css'
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { getScales, createScaleFromText, createScaleFromFile, updateScale, deleteScale } from '@/api/tests'

const loading = ref(false)
const creating = ref(false)
const saving = ref(false)

const scales = ref([])
const selected = ref(null)

const showTextDialog = ref(false)
const showFileDialog = ref(false)
const showEditDialog = ref(false)

const genText = ref('')
const fileList = ref([])

const editForm = ref({ id: null, title: '', description: '', items: [] })

onMounted(async () => {
  await fetchScales()
})

async function fetchScales() {
  loading.value = true
  try {
    const res = await getScales()
    scales.value = res.data || []
    selected.value = scales.value[0] || null
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openEdit(row) {
  editForm.value = JSON.parse(JSON.stringify(row || {}))
  showEditDialog.value = true
}

function addItem() {
  editForm.value.items = editForm.value.items || []
  editForm.value.items.push({ question: '', options: [] })
}

function removeOption(item) {
  if (item.options && item.options.length) item.options.pop()
}

async function saveEdit() {
  saving.value = true
  try {
    const res = await updateScale(editForm.value.id, {
      title: editForm.value.title,
      description: editForm.value.description,
      items: editForm.value.items,
    })
    // 更新列表
    const idx = scales.value.findIndex(s => s.id === editForm.value.id)
    if (idx >= 0) scales.value[idx] = res.data || editForm.value
    selected.value = scales.value[idx]
    showEditDialog.value = false
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

function onFileChange(file, files) {
  fileList.value = files
}

async function handleCustomUpload() { /* 使用手动上传 */ }

async function createByFile() {
  if (!fileList.value.length) return
  creating.value = true
  try {
    const file = fileList.value[0].raw || fileList.value[0]
    const res = await createScaleFromFile(file)
    const created = res.data
    if (created) {
      scales.value.unshift(created)
      selected.value = created
      showFileDialog.value = false
      fileList.value = []
    }
  } catch (e) {
    console.error(e)
  } finally {
    creating.value = false
  }
}

async function createByText() {
  if (!genText.value.trim()) return
  creating.value = true
  try {
    const res = await createScaleFromText(genText.value)
    const created = res.data
    if (created) {
      scales.value.unshift(created)
      selected.value = created
      showTextDialog.value = false
      genText.value = ''
    }
  } catch (e) {
    console.error(e)
  } finally {
    creating.value = false
  }
}

async function removeScale(row) {
  try {
    await deleteScale(row.id)
    scales.value = scales.value.filter(s => s.id !== row.id)
    if (selected.value && selected.value.id === row.id) {
      selected.value = scales.value[0] || null
    }
  } catch (e) {
    console.error(e)
  }
}
</script>