<template>
  <div>

  </div>
</template>

<script>
import request from '@/utils/request'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
const headers = {
  'Content-Type': 'application/json'
}
export default {
  components: {
    'tinymce': tinymce
  },
  data () {
    return {
      roleList: [],
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      permissionId: this.$route.params.id,
      permission: {
        name: '',
        key: '',
        // role_id: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        key: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
        // role_id: [
        //   { required: true, message: this.$t('required'), trigger: 'change' }
        // ]
      }
    }
  },
  mounted () {
    if (this.permissionId) this.getPermissionAttrs(this.permissionId)
    this.getRoles()
  },
  methods: {
    getRoles () {
      request({
          url: `/role`,
          headers: headers
      })
        .then(result => {
          this.roleList = result.roles
        })
        .catch(error => {
          console.log(error)
        })
    },
    getPermissionAttrs (permissionId) {
      request({
        url: `/permissions/${permissionId}`,
        method: 'get'
      })
      .then((response) => {
        console.log('response', response)
        const { key, name, role, description } = response
        this.permission.key = key
        this.permission.name = name
        this.permission.role_id = role.id
        this.permission.description = description
      })
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            var url = '/permissions'
            var method = 'post'
          if (this.permissionId) {
            url = `/permissions/${this.permissionId}`
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
              this.$router.replace('/permissions-new/list')
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
