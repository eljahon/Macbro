<template>
  <a-card>
    <a-row type="flex">
      <a-col :span="12" :offset="2">
        <a-divider orientation="left">Системная форма пользователя</a-divider>
        <a-form-model
          :colon="false"
          ref="ruleForm"
          :model="form"
          :rules="rules"
        >
          <a-row class="form-row" :gutter="16">
            <a-col>
              <a-form-model-item ref="name" label="Имя" prop="name">
                <a-input
                  placeholder="Имя"
                  v-model="form.name"
                  @blur="
                    () => {
                      $refs.name.onFieldBlur();
                    }"
                />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item ref="name" label="Роли для системного пользователя" prop="role">
                <a-select v-model="form.user_role_id">
                  <a-select-option v-for="item in roles" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
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
              <a-form-model-item label="Статус">
                <a-switch v-model="form.active"></a-switch>
                <a-row type="flex" justify="end">
                  <a-col span="auto">
                    <a-button @click="cancelPost" type="grey" style="margin-right:6px">{{ $t('button.cancel') }}</a-button>
                    <a-button @click="postSystemUser" v-if="isNewForm" type="primary">{{ $t('button.create') }}</a-button>
                    <a-button @click="updateSystemUser" v-else type="primary">{{ $t('button.save') }}</a-button>
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
      roles: [],
      isNewForm: false,
      previewImage: '',
      previewVisible: false,
      form: {
        'active': true,
        'image': {
          'url': '',
          'uuid': ''
        },
        'login': '',
        'name': '',
        'password': '',
        'user_role_id': ''
        },
       rules: {
        name: [
          { required: true, message: 'Пожалуйста, введите имя репетитора', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur' }
        ],
        login: [
          { required: true, message: 'Пожалуйста, введите логин', trigger: 'blur' }
        ],
        user_role_id: [
          { required: true, message: 'Пожалуйста, выберите роль' }
        ]
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
    postSystemUser () {
      if (this.checkPost() === false) {
        return -1
      }
      this.form.image = {
        url: '',
        uuid: this.fileList[0].uid
      }
      this.$store.dispatch('postSystemUser', this.form).then(res => {
        console.log(res)
        this.$alertMessage('success', 'System-user', 'System user added successfully', this)
        this.$router.push('/users/system-user')
      })
    },
    getSystemUser (id) {
      this.$store.dispatch('getSystemUser', id).then(res => {
        console.log(res)
        this.form = res
        this.fileList = [{ uid: res.image.uuid, status: 'done', name: res.image.url, url: res.image.url }]
      })
    },
    updateSystemUser () {
      if (this.checkPost() === false) {
        return -1
      }
      this.form.image = {
        url: this.fileList[0].url,
        uuid: this.fileList[0].uid
      }
      this.$store.dispatch('updateSystemUser', this.form).then(res => {
        this.$alertMessage('success', 'System-user', 'System-user has updated successfully', this)
        this.$refs.ruleForm.resetFields()
        this.$router.push('/users/system-user')
      })
    },
    cancelPost () {
      this.$router.replace('/users/system-user')
    },
    getRoles () {
      this.$store.dispatch('getUserRoles').then(res => {
        this.roles = res.user_roles
      }).catch(err => console.log(err))
    },
    handleSubmit (e) {
      console.log(e)
    }
  },
  created () {
    this.getRoles()
   if (this.$isNewForm(this.$route.params)) {
      this.isNewForm = true
    } else this.getSystemUser(this.$route.params.id)
  }

}
</script>

<style>

</style>
