<template>
  <a-card>
    <a-divider orientation="left">Форма клиента</a-divider>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="Activity name">
        <a-tabs type="card" @change="callback">
          <a-tab-pane key="1" tab="Russian">
            <a-input class="mb-3" v-model="form.name.ru" placeholder="Client name"></a-input>
            <a-input v-model="form.title.ru" placeholder="title"></a-input>
            <a-textarea
              class="my-1"
              v-model="form.description.ru"
              placeholder="Description"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-tab-pane>
          <a-tab-pane key="2" tab="Uzbek">
            <a-input class="mb-3" v-model="form.name.uz" placeholder="Client name"></a-input>
            <a-input v-model="form.title.uz" placeholder="title"></a-input>
            <a-textarea
              class="my-1"
              v-model="form.description.uz"
              placeholder="Description"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-tab-pane>
          <a-tab-pane key="3" tab="English">
            <a-input class="mb-3" v-model="form.name.en" placeholder="Client name"></a-input>
            <a-input v-model="form.title.en" placeholder="title"></a-input>
            <a-textarea
              class="my-1"
              v-model="form.description.en"
              placeholder="Description"
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
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-model-item>
      <a-form-model-item label="Action">
        <a-button @click="$router.push('/tariffs')">{{ $t('button.cancel') }}</a-button>
        <a-button style="margin-left: 10px" v-if="isNewForm" type="primary" @click="postClient">{{
          $t('button.create')
        }}</a-button>
        <a-button style="margin-left: 10px" v-else type="primary" @click="updateClient">{{
          $t('button.save')
        }}</a-button>
      </a-form-model-item>
    </a-form-model>
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
        created_at: '',
        description: {
          en: '',
          ru: '',
          uz: ''
        },
        name: {
          en: '',
          ru: '',
          uz: ''
        },
        picture: {
          url: '',
          uuid: ''
        },
        title: {
          en: '',
          ru: '',
          uz: ''
        },
        updated_at: ''
      }
    }
  },
  methods: {
    postClient () {
      this.form.picture = {
        uuid: this.fileList[0].uid,
        url: ''
      }
      this.$store.dispatch('postClient', this.form).then((res) => {
        this.$alertMessage('success', this.form.title.ru, 'Successfully created', this)
        this.$router.push('/cms-settings/clients')
      })
    },
    updateClient () {
       this.form.picture = {
        uuid: this.fileList[0].uid,
        url: ''
      }
      this.$store.dispatch('updateClient', this.form).then((res) => {
        this.$alertMessage('success', this.form.title.ru, 'Successfully updated', this)
        this.$router.push('/cms-settings/clients')
      })
    },
    callback () {},
    async uploadImage (data) {
      this.$uploadImage(data.file, this.fileList, this)
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
    getClient () {
      this.$store.dispatch('getClient', this.$route.params.id).then((res) => {
        this.form = res
        this.fileList = [
          {
            uid: res.picture.uuid,
            name: res.picture.uuid,
            status: 'done',
            url: res.picture.url
          }
        ]
        console.log(res)
      })
    }
  },
  created () {
    if (Object.keys(this.$route.params).length === 0 && this.$route.params.constructor === Object) {
      this.isNewForm = true
    } else this.getClient()
  }
}
</script>

<style>
</style>
