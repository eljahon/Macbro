<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/admins/list">{{ $t('admins') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card :title="$t('fillIn')">
      <a-row>
        <div>
          <a-form-model
            @submit="onSubmit"
            ref="ruleForm"
            :model="admin"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row>
              <a-col :span="24" style="padding: 0 15px">
                <a-form-model-item ref="name" :label="$t('firstName')" prop="name">
                  <a-input v-model="admin.name" test-attr="name-account" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="username" :label="$t('username')" prop="username" test-attr="username-account">
                  <a-input v-model="admin.username" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="phone" :label="$t('phone')" prop="phone" test-attr="phone-account">
                  <a-input type="tel" v-model="phone" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="password" :label="$t('password')" prop="password" test-attr="password-account">
                  <a-input v-model="admin.password" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="confirmPassword" :label="$t('confirmPassword')" prop="confirmPassword" test-attr="confirmPass-account">
                  <a-input v-model="confirmPassword" />
                </a-form-model-item>
              </a-col>
              <a-col :span="24" style="padding: 0 15px">
                <a-form-model-item>
                  <a-button type="primary" html-type="submit" @click="onSubmit" test-attr="save-account">
                    {{ $t('save') }}
                  </a-button>
                  <a-button style="margin-left: 10px;" @click="resetForm" test-attr="reset-account">
                    {{ $t('reset') }}
                  </a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import request from '@/utils/request'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  data () {
    return {
      adminId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      loading: false,
      phone: '',
      permissions: null,
      confirmPassword: '',
      admin: {
        name: '',
        username: '',
        password: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.getAdminToken()
    // this.getAdminAttrs()
  },
  methods: {
    getAdminToken () {
      request({
        url: `/admin/profile`,
        method: 'get',
        headers: { Authorization: storage.get(ACCESS_TOKEN), 'Content-Type': 'application/json' }
      })
        .then(response => {
          console.log('response', response)
          const { name, username, phone, permissions } = response
          this.admin.name = name
          this.admin.username = username
          this.phone = phone
          this.permissions = permissions
          console.log('this.admin', this.admin)
        })
        .catch(err => console.error(err))
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (this.admin.password === this.confirmPassword) {
          if (valid) {
            var url = '/admin/profile'
            var method = 'put'
            const data = {
              ...this.admin,
              phone: this.phone
            }
            request({
              url: url,
              method: method,
              data,
              headers: { Authorization: storage.get(ACCESS_TOKEN), 'Content-Type': 'application/json' }
            })
              .then(res => {
                console.log(res)
                this.$router.replace('/dashboard')
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
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
