<template>
  <div>
    <a-switch
      slot="extra"
      v-model="active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px 0"
      test-attr="switch-admins"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="admin"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-tabs type="card" v-model="activeTabKey">
          <a-tab-pane key="1" :tab="$t('basicSettings')">
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('firstName')" prop="name">
                <a-input
                  v-model="admin.name"
                  test-attr="name-admins"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="username" :label="$t('username')" prop="username">
                <a-input
                  v-model="admin.username"
                  test-attr="username-admins"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="phone" :label="$t('phone')" prop="phone">
                <a-input
                  type="tel"
                  v-model="admin.phone"
                  test-attr="phone-admins"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="password" :label="$t('password')" prop="password">
                <a-input
                  v-model="admin.password"
                  test-attr="password-admins"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="confirmPassword" :label="$t('confirmPassword')" prop="confirmPassword">
                <a-input
                  v-model="confirmPassword"
                  test-attr="confirmPass-admins"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item>
                <a-button type="primary" html-type="submit" @click="onSubmit" test-attr="save-admins">
                  {{ $t('save') }}
                </a-button>
                <a-button style="margin-left: 10px;" @click="resetForm" test-attr="reset-admins">
                  {{ $t('reset') }}
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-tab-pane>
          <a-tab-pane v-if="this.permissionsVisibility" key="2" :tab="$t('permissions')">
            <a-col :span="24">
              <a-list bordered :data-source="allPermissions">
                <a-list-item slot="renderItem" slot-scope="permission">
                  {{ permission.name }}
                  <a-switch
                    slot="extra"
                    v-model="permission.checked"
                    @change="handlePermissionChange(permission.id)"
                    test-attr="permission-admins"
                  >
                    <a-icon slot="checkedChildren" type="check" />
                    <a-icon slot="unCheckedChildren" type="close" />
                  </a-switch>
                </a-list-item>
              </a-list>
            </a-col>
            <router-link to="/admins/list">
              <a-button type="primary" style="margin-top: 15px;" test-attr="back-admins">
                {{ $t('backToList') }}
              </a-button>
            </router-link>
          </a-tab-pane>
        </a-tabs>

      </a-row>
    </a-form-model>
  </div>
</template>

<script>
/* eslint-disable no-unneeded-ternary */
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      adminId: this.$route.params.id,
      createMode: !this.$route.params.id,
      createdAdminId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      activeTabKey: '1',
      loading: false,
      active: true,
      adminPermissions: null,
      allPermissions: null,
      permissionsVisibility: false,
      confirmPassword: '',
      admin: {
        name: '',
        username: '',
        password: '',
        phone: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        username: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        phone: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        password: [
          { required: !this.$route.params.id, message: this.$t('required'), trigger: 'change' },
          { min: 4, message: this.$t('minLength'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    if (this.adminId) {
      this.permissionsVisibility = true
      this.getAdminAttrs(this.adminId)
        .then(() => {
          this.getPermissions()
            .then(() => {
              this.allPermissions = this.permissions && this.permissions.map(p => {
                return { ...p, checked: this.checkPermission(p) }
              })
            })
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    ...mapActions(['getPermissions']),
    checkPermission (p) {
      const permission = this.adminPermissions &&
              this.adminPermissions.find(adminPermission => adminPermission.key === p.key)
      return !!permission
    },
    handlePermissionChange (permissionId, adminId) {
      request({
        url: '/admin/update-permission',
        method: 'post',
        data: {
          admin_id: adminId || this.adminId,
          permission_id: permissionId
        },
        headers: { 'Content-Type': 'application/json' }
      })
    },
    getAdminAttrs (adminId) {
      return new Promise((resolve, reject) => {
        request({
          url: `/admin/profile/${adminId}`,
          method: 'get'
        })
        .then((response) => {
          console.log('response', response)
          const { id, name, username, active, phone, permissions } = response
          this.adminId = id
          this.admin.name = name
          this.admin.username = username
          this.active = active
          this.admin.phone = phone
          this.adminPermissions = permissions
          console.log('this.admin', this.admin)
          resolve()
        })
        .catch(err => {
          console.error(err)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject()
        })
      })
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (this.admin.password === this.confirmPassword) {
          if (valid) {
            var url = '/admin'
            var method = 'post'
            if (this.adminId) {
              url = `/admin/profile/${this.adminId}`
              method = 'put'
            }
            const headers = {
              'Content-Type': 'application/json'
            }
            request({
                url: url,
                method: method,
                data: this.admin,
                headers: headers
            })
            .then(res => {
              if (this.createMode) {
                this.createdAdminId = res.id
                this.permissionsVisibility = true
                this.activeTabKey = '2'
                this.getAdminAttrs(this.createdAdminId)
                  .then(() => {
                    this.getPermissions()
                      .then(() => {
                        this.allPermissions = this.permissions && this.permissions.map(p => {
                          // by default giving access to dashboard to any admins
                          if (p.key === 'dashboard') {
                            this.handlePermissionChange(p.id, this.createdAdminId)
                            return { ...p, checked: true }
                          }
                          return { ...p, checked: this.checkPermission(p) }
                        })
                      console.log('this.allPermissions', this.allPermissions)
                      })
                      .catch(err => console.error(err))
                  })
                  .catch(err => console.error(err))
                return
              }
              console.log(res)
              this.$router.replace('/admins/list')
            })
            .catch(err => {
              console.log(err)
              this.$message.error(this.$t('error'))
            })
          } else {
            console.log('error submit, validation failed')
            return false
          }
        } else {
          this.$message.error(this.$t('passwordMatchError'))
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style>
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

/* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
</style>
