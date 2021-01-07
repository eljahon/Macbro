<template>
  <div>
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="permission"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('name')" prop="name">
            <a-input
              v-model="permission.name"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="key" :label="$t('key')" prop="key">
            <a-input
              v-model="permission.key"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item>
            <a-button type="primary" html-type="submit" @click="onSubmit">
              {{ $t('save') }}
            </a-button>
            <a-button style="margin-left: 10px;" @click="resetForm">
              {{ $t('reset') }}
            </a-button>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data () {
    return {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      permissionId: this.$route.params.id,
      permission: {
        name: '',
        key: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        key: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    if (this.permissionId) this.getPermissionAttrs(this.permissionId)
  },
  methods: {
    getPermissionAttrs (permissionId) {
      request({
        url: `/permission/${permissionId}`,
        method: 'get'
      })
      .then((response) => {
        console.log('response', response)
        const { permission: { key, name } } = response
        this.permission.key = key
        this.permission.name = name
      })
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            var url = '/permission'
            var method = 'post'
          if (this.permissionId) {
            url = `/permission/${this.permissionId}`
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          request({
              url: url,
              method: method,
              data: this.permission,
              headers: headers
          })
          .then(res => {
              console.log(res)
              this.$router.replace('/permissions/list')
          })
          .catch(err => {
              console.log(err)
              this.$message.success(this.$t('error'))
          })
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
