<template>
  <a-card>
    <a-row type="flex" :gutter="16">
      <a-col :offset="2" :span="14">
        <a-divider orientation="left">
          {{ isNewForm ? 'Форма' : 'Форма' }}
        </a-divider>
        <div>
          <label for=""><span style="color: red">*</span> Имя ученика</label>
          <a-input v-model="form.user" placeholder="Имя ученика"></a-input>
        </div>
        <div class="my-1">
          <label for=""><span style="color: red">*</span> Социальная ссылка</label>
          <a-input v-model="form.link" placeholder="Социальная ссылка"></a-input>
        </div>
        <div>
          <label for=""><span style="color: red">*</span> Append надлежащий курс</label>
          <a-select v-model="form.course" style="width: 100%">
            <a-select-option v-for="item in courses" :key="item.id" :value="item.title.ru">
              {{ item.title.ru }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <a-row type="flex">
            <a-col :span="24" class="my-1">
              <label for=""><span style="color: red">*</span> Загрузить фотографию ученика</label>
              <a-upload
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
            </a-col>
            <a-col span="auto">
              <label for=""><span style="color: red">*</span> Икона</label>
              <a-upload
                :customRequest="uploadIcon"
                list-type="picture-card"
                :file-list="fileListIcon"
                @preview="handlePreviewIcon"
                @change="handleChangeIcon"
              >
                <div v-if="fileListIcon.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    {{ $t('button.upload') }}
                  </div>
                </div>
              </a-upload>
              <a-modal v-if="false" :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </a-col>
          </a-row>
        </div>
        <a-row type="flex" justify="end">
          <a-col span="auto">
            <a-button @click="cancelFeatured" type="grey" style="margin-right:6px">{{ $t('button.cancel') }}</a-button>
            <a-button @click="postFeatured" v-if="isNewForm" type="primary">{{ $t('button.create') }}</a-button>
            <a-button @click="updateFeatured" v-else type="primary">{{ $t('button.save') }}</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  data () {
    return {
      isNewForm: false,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileListIcon: [],
      courses: [],
      form: {
        course: '',
        created_at: '',
        icon: {
          url: '',
          uuid: ''
        },
        link: '',
        picture: {
          url: '',
          uuid: ''
        },
        updated_at: '',
        user: ''
      }
    }
  },
  methods: {
    uploadImage (data) {
      this.$uploadImage(data.file, this.fileList, this)
    },
       uploadIcon (data) {
      this.$uploadImage(data.file, this.fileListIcon, this)
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    async handlePreviewIcon (file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      if (fileList.length === 0) { this.fileList = fileList }
    },
    handleChangeIcon ({ fileList }) {
      if (fileList.length === 0) { this.fileListIcon = fileList }
    },
    cancelFeatured () {
      this.$router.push('/cms-settings/enrolled/list')
    },
    getFeatured (id) {
      this.$store.dispatch('getFeatureStudent', id).then(res => {
        this.form = res
        this.fileList = [{ uid: res.picture.uuid, name: res.picture.uuid, url: res.picture.url, status: 'done' }]
        this.fileListIcon = [{ uid: res.icon.uuid, name: res.icon.uuid, url: res.icon.url, status: 'done' }]
      })
    },
    postFeatured () {
      console.log(this.form.course)
      this.form.picture = {
        url: this.fileList[0].uid,
        uuid: this.fileList[0].uid
      }
      this.form.icon = {
        url: this.fileListIcon[0].uid,
        uuid: this.fileListIcon[0].uid
      }
      this.$store.dispatch('postFeatureStudent', this.form).then(res => {
        this.$alertMessage('success', 'Graduated student', 'student appended successfully', this)
        this.$router.push('/cms-settings/enrolled/list')
      })
    },
    updateFeatured () {
      this.form.picture = {
        url: this.fileList[0].uid,
        uuid: this.fileList[0].uid
      }
      this.form.icon = {
        url: this.fileListIcon[0].uid,
        uuid: this.fileListIcon[0].uid
      }
        this.$store.dispatch('updateFeatureStudent', this.form).then(res => {
        this.$alertMessage('success', 'Graduated student', 'student updated successfully', this)
        this.$router.push('/cms-settings/enrolled/list')
      })
    },
    getCourses () {
      this.$store.dispatch('getCourses').then(res => {
        this.courses = res
      })
    }

  },
  created () {
    if (this.$isNewForm(this.$route.params)) {
      this.isNewForm = true
    } else this.getFeatured(this.$route.params.id)
    this.getCourses()
  }
}
</script>

<style>
</style>
