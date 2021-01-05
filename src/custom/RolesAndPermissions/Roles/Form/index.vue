<template>
  <a-card>
    <a-row type="flex">
      <a-col :span="12" :offset="2">
        <a-divider orientation="left">Форма для ролей</a-divider>
        <a-form-model
          :colon="false"
          ref="ruleForm"
          :model="form"
          :rules="rules"
        >
          <a-row class="form-row" :gutter="16">
            <a-col>
              <a-form-model-item ref="name" label="Название" prop="name">
                <a-input
                  placeholder="название роли"
                  v-model="form.name"
                  @blur="
                    () => {
                      $refs.name.onFieldBlur();
                    }"
                />
              </a-form-model-item>
            </a-col>
            <a-col v-if="false">
              <a-form-model-item ref="name" label="Роли для пользовател" prop="user_type_id">
                <a-select v-model="form.user_type_id">
                  <a-select-option v-for="item in userTypes" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="">
                <a-row type="flex" justify="end">
                  <a-col span="auto">
                    <a-button @click="cancelPost" type="grey" style="margin-right:6px">{{ $t('button.cancel') }}</a-button>
                    <a-button @click="postUserRole" v-if="isNewForm" type="primary">{{ $t('button.create') }}</a-button>
                    <a-button @click="updateUserRole" v-else type="primary">{{ $t('button.save') }}</a-button>
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
      isNewForm: false,
      form: {
          'name': '',
          'user_type_id': '2a1efd4a-d527-4cc2-adfa-a7546021f0f6'
        },
       rules: {
        name: [
          { required: true, message: 'Пожалуйста, введите имя репетитора', trigger: 'blur' }
        ],
        user_type_id: [
          { required: true, message: 'Пожалуйста, выберите роль' }
        ]
      }
    }
  },
  computed: {
    userTypes () {
      return this.$store.getters.getUserTypes
    }
  },
  methods: {

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
    postUserRole () {
      if (this.checkPost() === false) {
        return -1
      }
      console.log(this.form)
      this.$store.dispatch('postUserRole', this.form).then(res => {
        console.log(res)
        this.$alertMessage('success', 'Role', 'Role created successfully', this)
        this.cancelPost()
      })
    },
    getUserRole (id) {
      this.$store.dispatch('getUserRole', id).then(res => {
        console.log(res)
        this.form = res.user_role
      })
    },
    updateUserRole () {
      if (this.checkPost() === false) {
        return -1
      }
      this.$store.dispatch('updateUserRole', this.form).then(res => {
        this.$alertMessage('success', 'Role', 'Role has updated successfully', this)
        this.cancelPost()
      })
    },
    cancelPost () {
      this.$router.replace('/role-permission/roles')
    },
    handleSubmit (e) {
      console.log(e)
    }
  },
  created () {
   if (this.$isNewForm(this.$route.params)) {
      this.isNewForm = true
    } else this.getUserRole(this.$route.params.id)
  }

}
</script>

<style>

</style>
