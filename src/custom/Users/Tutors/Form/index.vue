<template>
  <a-card>
    <a-row type="flex">
      <a-col :span="12" :offset="2">
        <a-divider orientation="left">Форма</a-divider>
        <a-form-model
          :colon="false"
          ref="ruleForm"
          :model="form"
          :rules="rules"
        >
          <a-row class="form-row" :gutter="16">
            <a-col>
              <a-form-model-item ref="name" label="Имя репетитора" prop="name">
                <a-input
                  placeholder="Имя репетитора"
                  v-model="form.name"
                  @blur="
                    () => {
                      $refs.name.onFieldBlur();
                    }"
                />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="Эл. адрес" prop="email">
                <a-input
                  v-model="form.email"
                  placeholder="Адрес электронной почты" />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="Описание" prop="description">
                <a-input
                  placeholder="Описание репетитора"
                  v-model="form.description"
                />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="Телефонный номер" prop="phone">
                <a-input
                  placeholder="Телефон репетитора"
                  v-model="form.phone"/>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="Настройка логина и пароля" prop="login">
                <a-row type="flex" :gutter="[16]">
                  <a-col span="12">
                    <a-input placeholder="логин" v-model="form.login"></a-input>
                  </a-col>
                  <a-col span="12" v-if="isNewForm">
                    <a-input-password v-model="form.password" type="password" placeholder="пароль"></a-input-password>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="Загрузка изображения">
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
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="Ссылки в социальных сетях" >
                <div v-for="(item,i) in form.links" :key="i">
                  <a-input placeholder="link" v-model="item.link"></a-input>
                </div>
                <a-button type="dashed" @click="addLink" block>Добавить ссылку</a-button>

              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="Статус">
                <a-switch v-model="form.active"></a-switch>
                <a-row type="flex" justify="end">
                  <a-col span="auto">
                    <a-button @click="cancelPost" type="grey" style="margin-right:6px">{{ $t('button.cancel') }}</a-button>
                    <a-button @click="postTutor" v-if="isNewForm" type="primary">{{ $t('button.create') }}</a-button>
                    <a-button @click="updateTutor" v-else type="primary">{{ $t('button.save') }}</a-button>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  data () {
    return {
      fileList: [],
      isNewForm: false,
      previewImage: '',
      previewVisible: false,
      form: {
        'active': true,
        'description': '',
        'email': '',
        'image': '',
        'links': [],
        'login': '',
        'name': '',
        'password': '',
        'phone': ''
      },
       rules: {
        name: [
          { required: true, message: 'Пожалуйста, введите имя репетитора', trigger: 'blur' }
        ],
        email: [
          { required: true, type: 'email', message: 'Пожалуйста, введите адрес электронной почты', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'Пожалуйста, введите название описания', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'Пожалуйста, введите имя телефона', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input password name', trigger: 'blur' }
        ],
        login: [
          { required: true, message: 'Пожалуйста, введите логин', trigger: 'blur' }
        ]
        // fileList: [
        //   { required: true, type: 'array', message: 'Пожалуйста, введите имя изображения', trigger: 'blur' }
        // ]

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
    addLink () {
      this.form.links.push({
        link: ''
      })
    },
    checkPost () {
      let flag = null
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          flag = true
          return true
        } else {
          flag = false
          console.log('error submit!!')
          return false
        }
      })
      return flag
    },
    postTutor () {
      if (this.checkPost() === false) {
        return -1
      }
      this.form.image = {
        url: '',
        uuid: this.fileList[0].uid
      }
      const data = this.form.links.map(el => (el.link))
      this.form.links = data
      this.$store.dispatch('postTutor', this.form).then(res => {
        console.log(res)
        this.$alertMessage('success', 'Tutor', 'Tutor added successfully', this)
        // this.$refs.ruleForm.resetFields()
        this.$router.push('/users/tutors')
      })
    },
    getTutor (id) {
      this.$store.dispatch('getTutor', id).then(res => {
        console.log(res)
        this.form = res.tutor
        this.fileList = [{ uid: res.tutor.image.uuid, status: 'done', name: res.tutor.image.url, url: res.tutor.image.url }]
        this.form.links = res.tutor.links.map(el => ({ link: el }))
      })
    },
    updateTutor () {
      if (this.checkPost() === false) {
        return -1
      }
      this.form.image = {
        url: this.fileList[0].url,
        uuid: this.fileList[0].uid
      }
      this.form.links = this.form.links.map(el => (el.link))
      this.$store.dispatch('updateTutor', this.form).then(res => {
        this.$alertMessage('success', 'Tutor', 'Tutor has updated successfully', this)
        // this.$refs.ruleForm.resetFields()
        this.$router.push('/users/tutors')
      })
    },
    cancelPost () {
      this.$router.replace('/users/tutors')
    },
    handleSubmit (e) {
      console.log(e)
    }
  },
  created () {
   if (this.$isNewForm(this.$route.params)) {
      this.isNewForm = true
      this.form.links = [{ link: '' }]
    } else this.getTutor(this.$route.params.id)
  }

}
</script>

<style>

</style>
