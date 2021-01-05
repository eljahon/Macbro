<template>
  <a-card>
    <a-divider orientation="left">Форма тарифа</a-divider>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="Activity name">
        <a-tabs type="card" @change="callback">
          <a-tab-pane key="1" tab="Russian">
            <a-input v-model="form.title.ru" placeholder="Title of tariff"></a-input>
            <a-textarea
              class="my-1"
              v-model="form.description.ru"
              placeholder="Description"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
            <a-textarea
              class="my-1"
              v-model="form.body.ru"
              placeholder="Body"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-tab-pane>
          <a-tab-pane key="2" tab="Uzbek">
            <a-input v-model="form.title.uz" placeholder="Title of tariff"></a-input>
            <a-textarea
              class="my-1"
              v-model="form.description.uz"
              placeholder="Description"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
            <a-textarea
              class="my-1"
              v-model="form.body.uz"
              placeholder="Body"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-tab-pane>
          <a-tab-pane key="3" tab="English">
            <a-input v-model="form.title.en" placeholder="Title of tariff"></a-input>
            <a-textarea
              class="my-1"
              v-model="form.description.en"
              placeholder="Description"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
            <a-textarea
              class="my-1"
              v-model="form.body.en"
              placeholder="Body"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-tab-pane>
        </a-tabs>
      </a-form-model-item>
      <a-form-model-item label="Picture upload">
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
              Upload
            </div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-model-item>
    </a-form-model>
    <a-form-model-item :wrapper-col="{ span: 12, offset: 13 }">
      <a-button @click="$router.push('/courses/tariffs')">{{ $t('button.cancel') }}</a-button>
      <a-button style="margin-left: 10px" v-if="isNewForm" type="primary" @click="postTariff">{{ $t('button.create') }}</a-button>
      <a-button
        style="margin-left: 10px"
        v-else
        type="primary"
        @click="updateTariff"
      >{{ $t('button.save') }}</a-button
      >
    </a-form-model-item>
  </a-card>
</template>

<script>
export default {
data () {
    return {
        labelCol: { span: 3 },
        wrapperCol: { span: 14 },
        isNewForm: false,
        previewVisible: false,
        previewImage: '',
        fileList: [],
        form: {
            'body': {
                'en': '',
                'ru': '',
                'uz': ''
            },
            'created_at': '',
            'description': {
                'en': '',
                'ru': '',
                'uz': ''
            },
            'picture': {
                'url': '',
                'uuid': ''
            },
            'title': {
                'en': '',
                'ru': '',
                'uz': ''
            },
            'updated_at': ''
        }
    }
},
methods: {
  postTariff () {
    this.$store.dispatch('postTariff', this.form).then(res => {
      this.$alertMessage('success', this.form.title.ru, 'Successfully created', this)
      this.$router.push('/courses/tariffs')
    })
  },
  updateTariff () {
     this.$store.dispatch('updateTariff', this.form).then(res => {
      this.$alertMessage('success', this.form.title.ru, 'Successfully updated', this)
      this.$router.push('/courses/tariffs')
    })
  },
    callback () {

    },
    async uploadImage (data) {
        const formData = new FormData()
        formData.append('file', data.file)
        const preview = await this.$getBase64(data.file)
        this.$store.dispatch('uploadFile', formData).then(res => {
        console.log(res)
        this.form.picture.uuid = res.filename
        this.fileList.push({
          uid: res.filename,
          name: data.file.name,
          status: 'done',
          url: preview
        })
      }).catch(err => console.log(err))
    },
 handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
        if (fileList.length === 0) {
            this.fileList = []
        }
        console.log(fileList)
    //   this.fileList = fileList
    },
    getTariff () {
      this.$store.dispatch('getTariff', this.$route.params.id).then(res => {
        this.form = res
        this.fileList = [{
          uid: res.picture.uuid,
          name: res.picture.uuid,
          status: 'done',
          url: res.picture.url
        }]
        console.log(res)
      })
    }
},
created () {
  if (Object.keys(this.$route.params).length === 0 && this.$route.params.constructor === Object) { this.isNewForm = true } else this.getTariff()
}
}
</script>

<style>

</style>
