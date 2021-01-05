<template>
  <a-card>
    <a-row type="flex" :gutter="16">
      <a-col :offset="2" :span="14">
        <a-divider orientation="left">
          {{ isNewForm ? 'Форма студента' : 'Форма редактирования студента' }}
        </a-divider>
        <div>
          <label for=""><span style="color: red">*</span> Имя студента</label>
          <a-input v-model="form.name" placeholder="Имя студента"></a-input>
        </div>
        <div class="my-1">
          <label for=""><span style="color: red">*</span> Телефон</label>
          <a-input v-model="form.phone" placeholder="Телефонный номер"></a-input>
        </div>
        <div>
          <a-row type="flex">
            <a-col :span="24">
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
            <a-col :span="24">
              <label for=""><span style="color: red">*</span> Статус</label><br>
              <a-switch v-model="form.active"></a-switch>
            </a-col>
          </a-row>
        </div>
        <a-row type="flex" justify="end">
          <a-col span="auto">
            <a-button @click="routeBack" type="grey" style="margin-right:6px">{{ $t('button.cancel') }}</a-button>
            <a-button @click="postStudent" v-if="isNewForm" type="primary">{{ $t('button.create') }}</a-button>
            <a-button @click="updateStudent" v-else type="primary">{{ $t('button.save') }}</a-button>
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
      form: {
        'active': true,
        'image': { url: '', uuid: '' },
        'name': '',
        'phone': ''
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

    routeBack () {
      this.$router.go(-1)
    },
    getStudent (id) {
      this.$store.dispatch('getStudent', id).then(res => {
        this.form = res.student
        if (res.student.image) {
          this.fileList = [{ uid: res.image.uuid, name: res.image.url, url: res.image.url, status: 'done' }]
        } else this.fileList = []
      })
    },
    postStudent () {
        this.form.image = {
        url: '',
        uuid: this.fileList[0].uid
      }
      this.$store.dispatch('postStudent', this.form).then(res => {
        this.$alertMessage('success', 'Student', 'student added successfully', this)
        this.routeBack()
      })
    },
    updateStudent () {
      this.form.image = {
        url: this.fileList[0].url,
        uuid: this.fileList[0].uid
      }
        this.$store.dispatch('updateStudent', this.form).then(res => {
        this.$alertMessage('success', 'Student', 'Student updated successfully', this)
        this.routeBack()
      })
    }
  },
  created () {
    if (this.$isNewForm(this.$route.params)) {
      this.isNewForm = true
    } else this.getStudent(this.$route.params.id)
  }
}
</script>

<style>
</style>
