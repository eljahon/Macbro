<template>
  <a-card>
    <a-row type="flex">
      <a-col :span="12" :offset="2">
        <a-divider orientation="left">Форма для разрешение роли пользователя</a-divider>
        <a-form-model
          :colon="false"
          ref="ruleForm"
          :model="form"
          :rules="rules"
        >
          <a-row class="form-row">
            <a-col>
              <a-form-model-item ref="name" label="Permission" prop="permission_id">
                <a-select v-model="form.permission_id">
                  <a-select-option v-for="item in permissionList" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item prop="actions" label="Доступ для действий">
                <a-row type="flex" justify="space-between">
                  <a-col span="auto">
                    <h4>СОЗДАТЬ</h4>
                  </a-col>
                  <a-col span="auto">
                    <a-switch default-checked v-model="form.actions.create" />
                  </a-col>
                </a-row>
                <a-divider style="my-0"></a-divider>
                <a-row type="flex" justify="space-between">
                  <a-col span="auto">
                    <h4>ЧИТАТЬ</h4>
                  </a-col>
                  <a-col span="auto">
                    <a-switch default-checked v-model="form.actions.read" />
                  </a-col>
                </a-row>
                <a-divider></a-divider>
                <a-row type="flex" justify="space-between">
                  <a-col span="auto">
                    <h4>ОБНОВИТЬ</h4>
                  </a-col>
                  <a-col span="auto">
                    <a-switch default-checked v-model="form.actions.update" />
                  </a-col>
                </a-row>
                <a-divider></a-divider>
                <a-row type="flex" justify="space-between">
                  <a-col span="auto">
                    <h4>УДАЛИТЬ</h4>
                  </a-col>
                  <a-col span="auto">
                    <a-switch default-checked v-model="form.actions.delete" />
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="">
                <a-row type="flex" justify="end">
                  <a-col span="auto">
                    <a-button @click="cancelPost" type="grey" style="margin-right:6px">{{ $t('button.cancel') }}</a-button>
                    <a-button @click="postUserRolePermission" v-if="isNewForm" type="primary">{{ $t('button.create') }}</a-button>
                    <a-button @click="updateUserRolePermission" v-else type="primary">{{ $t('button.save') }}</a-button>
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
      permissionList: [],
      form: {
        'actions': {
            'create': false,
            'delete': false,
            'read': false,
            'update': false
        },
        'permission_id': '',
        'permission_name': ''
        },
       rules: {
        name: [
          { required: true, message: 'Пожалуйста, введите имя репетитора', trigger: 'blur' }
        ],
        permission_id: [
          { required: true, message: 'Пожалуйста, выберите роль' }
        ],
        actions: [
            { required: true, message: 'Пожалуйста, введите имя репетитора', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    getPermissionsList () {
        this.$store.dispatch('getPermissions').then(res => {
            this.permissionList = res
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
    postUserRolePermission () {
      if (this.checkPost() === false) {
        return -1
      }
      console.log(this.form)
      this.$store.dispatch('postUserRolePermission', { ...this.form, user_role_id: this.$route.params.id }).then(res => {
        console.log(res)
        this.$alertMessage('success', 'Created', 'User Role Permission created successfully', this)
        this.cancelPost()
      })
    },
    getUserRolePermission (id) {
      this.$store.dispatch('getUserRolePermission', id).then(res => {
        console.log(res)
        this.form = res.user_role
      })
    },
    updateUserRolePermission () {
      if (this.checkPost() === false) {
        return -1
      }
      this.$store.dispatch('updateUserRolePermission', this.form).then(res => {
        this.$alertMessage('success', 'Role', 'Role has updated successfully', this)
        this.cancelPost()
      })
    },
    cancelPost () {
      this.$router.replace('/role-permission/user-permissions')
    },
    handleSubmit (e) {
      console.log(e)
    }
  },
  created () {
      this.getPermissionsList()
      console.log(this.$route.params)
      this.isNewForm = true
//    if (this.$isNewForm(this.$route.params)) {
//       this.isNewForm = true
//     } else this.getUserRolePermission(this.$route.params.id)
  }

}
</script>

<style>

</style>
