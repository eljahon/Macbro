<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row>
        <a-col v-if="!form">
          <a-skeleton active />
        </a-col>
        <a-col v-else>
          <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-tabs type="card" @change="callback">
              <a-tab-pane key="1" tab="English">
                <a-form-model-item label="Название работы">
                  <a-input v-model="form.title.en" />
                </a-form-model-item>
                <a-form-model-item label="Описание">
                  <a-input v-model="form.description.en" type="textarea" />
                </a-form-model-item>
              </a-tab-pane>
              <a-tab-pane key="2" tab="Русский">
                <a-form-model-item label="Название работы">
                  <a-input v-model="form.title.ru" />
                </a-form-model-item>
                <a-form-model-item label="Описание">
                  <a-input v-model="form.description.ru" type="textarea" />
                </a-form-model-item>
              </a-tab-pane>
              <a-tab-pane key="3" tab="Uzbek">
                <a-form-model-item label="Название работы">
                  <a-input v-model="form.title.uz" />
                </a-form-model-item>
                <a-form-model-item label="Описание">
                  <a-input v-model="form.description.uz" type="textarea" />
                </a-form-model-item>
              </a-tab-pane>
            </a-tabs>
            <a-form-model-item label="Курсы">
              <a-select v-model="form.course_ids" mode="multiple" placeholder="выбрать курс">
                <a-select-option v-for="(item, i) in courses" :key="i" :value="item.id">
                  {{ item.title.ru }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 24, offset: 1 }">
              <a-button v-if="isNewForm" type="primary" @click="onSubmit" :loading="loading">
                {{ $t('button.create') }}
              </a-button>
              <a-button v-else type="primary" @click="saveForm" :loading="loading">
                {{ $t('button.save') }}
              </a-button>
              <a-button @click="$router.push('/courses/job-list')" style="margin-left: 10px;">
                {{ $t('button.cancel') }}
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>
<script>

export default {
  data () {
    return {
      loading: false,
      labelCol: { span: 3 },
      wrapperCol: { span: 10 },
      courses: [],
      isNewForm: null,
      form: {
        course_ids: [],
        description: {},
        picture: {
          uuid: 'http://',
          url: 'url'
        },
        title: {}
}
    }
  },
  watch: {
  },
  methods: {
    callback (val) {
      // console.log(val)
    },
    getCourses () {
      this.$store.dispatch('getCourses').then(res => {
        // console.log(res)
        this.courses = res
      })
    },
    getJob () {
      this.$store.dispatch('getJob', this.$route.params.id).then(res => {
        this.form = res
        this.form.course_ids = res.course_ids.map(el => el.id)
        this.form.picture = {
          url: 'http://',
          uuid: 'uid'
        }
      })
    },
    alertMessage (type, title, desc = '') {
      this.$notification[type]({
        message: title,
        description: desc,
        duration: 2
      })
    },
    onSubmit () {
      this.loading = true
      console.log(this.form)
      this.$store.dispatch('postJob', this.form).then(res => {
        this.alertMessage('success', this.form.title.ru, 'Успешно создан')
        this.loading = false
        this.$router.push('/courses/job-list')
      }).finally(() => (this.loading = false))
    },
    saveForm () {
      this.loading = true
       console.log(this.form)
      this.$store.dispatch('updateJob', this.form).then(() => {
        this.alertMessage('success', this.form.title.ru, 'Успешно изменен')
        this.$router.push('/courses/job-list')
      })
    }
  },
  created () {
    this.isNewForm = this.$route.name === 'new-job'
    if (!this.isNewForm) this.getJob()
    this.getCourses()
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
