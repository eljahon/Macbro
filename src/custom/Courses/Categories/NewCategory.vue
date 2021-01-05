<template>
  <div>
    <a-modal v-model="visible.flag" title="Форма категории" on-ok="handleOk" :maskClosable="false" :closable="false">
      <template slot="footer">
        <a-button key="back" @click="handleCancels">
          {{ $t('button.cancel') }}
        </a-button>
        <a-button v-if="visible.type == 'new'" key="submit" type="primary" :loading="loading" @click="submitForm">
          {{ $t('button.create') }}
        </a-button>
        <a-button v-else key="save" type="primary" :loading="loading" @click="saveForm">
          {{ $t('button.save') }}
        </a-button>
      </template>
      <a-form-model :model="newCategory" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-tabs type="card" @change="callback">
          <a-tab-pane key="1" tab="English">
            <a-form-model-item
              class="mb-2"
              label="Название"
            >
              <a-input
                v-model="newCategory.title.en"
                placeholder="Пожалуйста, введите название здесь"
              />
            </a-form-model-item>
            <a-form-model-item
              class="mb-2"
              label="Описание"
            >
              <a-textarea
                v-model="newCategory.description.en"
                :auto-size="{ minRows: 3, maxRows: 5 }"
                placeholder="Пожалуйста, введите описание здесь"
              />
            </a-form-model-item>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Русский">
            <a-form-model-item
              class="mb-2"
              label="Название"
            >
              <a-input
                v-model="newCategory.title.ru"
                placeholder="Пожалуйста, введите название здесь"
              />
            </a-form-model-item>
            <a-form-model-item
              class="mb-2"
              label="Описание"
            >
              <a-textarea
                v-model="newCategory.description.ru"
                :auto-size="{ minRows: 3, maxRows: 5 }"
                placeholder="Пожалуйста, введите описание здесь"
              />
            </a-form-model-item>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Uzbek">
            <a-form-model-item
              class="mb-2"
              label="Название"
            >
              <a-input
                v-model="newCategory.title.uz"
                placeholder="Пожалуйста, введите название здесь"
              />
            </a-form-model-item>
            <a-form-model-item
              class="mb-2"
              label="Описание"
            >
              <a-textarea
                v-model="newCategory.description.uz"
                :auto-size="{ minRows: 3, maxRows: 5 }"
                placeholder="Пожалуйста, введите описание здесь"
              />
            </a-form-model-item>
          </a-tab-pane>
        </a-tabs>
        <a-form-model-item label="Вакансии">
          <a-select v-model="newCategory.job_ids" mode="multiple" placeholder="выбрать курс">
            <a-select-option v-for="(item, i) in jobs" :key="i" :value="item.id">
              {{ item.title.ru }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Картина">
          <a-upload
            :customRequest="uploadImage"
            list-type="picture-card"
            :file-list="newCategory.fileList"
            @preview="handlePreview"
            @change="handleChange($event, newCategory)"
          >
            <div v-if="newCategory.fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                {{ $t('button.upload') }}
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="newCategory.picture.url" />
          </a-modal>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  props: {
    visible: {
      type: Object,
      required: true
    },
    addNewCategory: {
      type: Function,
      required: true
    },
    newCategory: {
      type: Object,
      required: true
    },
    editCategory: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      jobs: [],
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      previewVisible: false,
      formData: new FormData()
    }
  },
  methods: {
    callback () {

    },
    getJobs () {
      this.$store.dispatch('getJobs').then(res => {
        console.log(res)
        this.jobs = res
      })
    },
    formValidator () {
      return (this.newCategory.title.ru.length > 0 && this.newCategory.description.ru.length > 0 && this.newCategory.picture.url.length > 0)
    },
    async uploadImage (data) {
      this.formData.append('file', data.file)
      this.newCategory.picture.url = await getBase64(data.file)
      this.$store.dispatch('uploadFile', this.formData).then(res => {
        console.log(res)
        this.newCategory.picture.uuid = res.filename
        this.newCategory.fileList.push({
          uid: res.filename,
          name: res.filename,
          status: 'done',
          url: this.newCategory.picture.url
        })
      }).catch(err => console.log(err))
    },
    handleOk (e) {
      this.loading = true
      setTimeout(() => {
        this.visible = false
        this.loading = false
      }, 3000)
    },
    handleCancels (e) {
      this.visible.flag = false
    },
    handleChange (ev, data) {
      console.log(ev)
      if (ev.fileList.length === 0) {
          data.fileList = ev.fileList
      }
      console.log(this.newCategory)
    },
    submitForm () {
      if (!this.formValidator()) {
        alert('Please provide all fields')
        return
      }
      this.addNewCategory({
        title: {
          en: this.newCategory.title.en,
          ru: this.newCategory.title.ru,
          uz: this.newCategory.title.uz
        },
        description: {
          en: this.newCategory.description.en,
          ru: this.newCategory.description.ru,
          uz: this.newCategory.description.uz
        },
        picture: this.newCategory.picture,
        job_ids: this.newCategory.job_ids
      })
      this.cleanFields()
    },
    saveForm () {
      if (!this.formValidator()) {
        alert('Please provide all fields')
        return
      }
      this.editCategory(this.newCategory.id, {
        title: {
          uz: this.newCategory.title.uz,
          ru: this.newCategory.title.ru,
          en: this.newCategory.title.en
        },
        description: {
          uz: this.newCategory.description.uz,
          ru: this.newCategory.description.ru,
          en: this.newCategory.description.en
        },
        picture: this.newCategory.picture,
        key: this.newCategory.key,
        job_ids: this.newCategory.job_ids,
        id: this.newCategory.id
      })
      this.visible.flag = false
      this.newCategory.fileList = []
    },
    cleanFields () {
      this.visible.flag = false
      this.newCategory.title = {}
      this.newCategory.description = {}
      this.newCategory.fileList = []
      this.newCategory.job_ids = []
      this.newCategory.picture = {}
      this.formData = new FormData()
    },
    handleCancel (e) {
      this.previewVisible = false
    },
    async handlePreview (file) {
      console.log(file)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.newCategory.picture.url = file.url || file.preview
      this.previewVisible = true
    }
  },
  created () {
    this.getJobs()
  }
}
</script>
<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
