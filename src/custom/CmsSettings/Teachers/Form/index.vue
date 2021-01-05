<template>
  <div>
    <a-card>
      <a-row type="flex" :gutter="16">
        <a-col :offset="2" :span="14">
          <a-divider orientation="left">
            {{ isNewForm ? 'Teacher create form' : 'Edit teacher form' }}
          </a-divider>
          <a-input v-model="form.user" placeholder="Teacher name" class="my-1"></a-input>
          <a-tabs type="card">
            <a-tab-pane key="1" tab="Русский">
              <a-textarea
                v-model="form.about.ru"
                :rows="10"
                placeholder="Controlled autosize"
                :auto-size="{ minRows: 10, maxRows: 15 }"
              />
            </a-tab-pane>
            <a-tab-pane key="2" tab="Uzbek">
              <a-textarea
                v-model="form.about.uz"
                :rows="5"
                placeholder="Controlled autosize"
                :auto-size="{ minRows: 10, maxRows: 15 }"
              />
            </a-tab-pane>
            <a-tab-pane key="3" tab="English">
              <a-textarea
                v-model="form.about.en"
                :rows="5"
                placeholder="Controlled autosize"
                :auto-size="{ minRows: 10, maxRows: 15 }"
              />
            </a-tab-pane>
          </a-tabs>
          <a-upload
            class="my-1"
            :customRequest="uploadImage"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                {{ $t('button.upload') }}
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
          <a-row type="flex" justify="end">
            <a-col span="auto">
              <a-button @click="cancelPost" type="grey" style="margin-right:6px">{{ $t('button.cancel') }}</a-button>
              <a-button @click="postTeacher" v-if="isNewForm" type="primary">{{ $t('button.create') }}</a-button>
              <a-button @click="updateTeacher" v-else type="primary">{{ $t('button.save') }}</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      isNewForm: null,
      form: {
        'about': {
            'en': '',
            'ru': '',
            'uz': ''
        },
        'created_at': '',
        'picture': {
            'url': '',
            'uuid': ''
        },
        'updated_at': '',
        'user': ''
    }
    }
  },
  methods: {

    uploadImage (data) {
      this.$uploadImage(data.file, this.fileList, this)
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      if (fileList.length === 0) { this.fileList = fileList }
    },
    callback (key) {
      // console.log(key)
    },

    postTeacher () {
      this.form.picture.uuid = this.fileList[0].uid
      console.log(this.form)
      this.$store.dispatch('postTeacher', this.form).then(res => {
        console.log(res)
        this.$alertMessage('success', 'teacher', 'teacher added successfully', this)
        this.$router.push('/cms-settings/teacher')
      })
    },
    getTeacher (id) {
      this.$store.dispatch('getTeacher', id).then(res => {
        console.log(res)
        this.form = res
        this.fileList = [{ uid: res.picture.uuid, status: 'done', name: res.picture.uuid, url: res.picture.url }]
      })
    },
    updateTeacher () {
      this.form.picture.uuid = this.fileList[0].uid
      this.$store.dispatch('updateTeacher', this.form).then(res => {
        this.$alertMessage('success', 'teacher', 'teacher has updated successfully', this)
        this.$router.push('/cms-settings/teacher')
      })
    },
    cancelPost () {
      this.$router.replace('/cms-settings/teacher')
    }
  },
  created () {
     if (this.$isNewForm(this.$route.params)) {
      this.isNewForm = true
    } else this.getTeacher(this.$route.params.id)
  }
}
</script>

<style>

</style>
