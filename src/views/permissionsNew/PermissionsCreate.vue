<template>
  <div>
    <breadcrumb-row >
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/permissions-new/list" test-attr="prev-link-permissions">{{ $t('permissions') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-card :title="$t(edit ? 'update' : 'fillIn')" :bordered="false"></a-card>

    <a-card :bordered="false" style="flex: 1">
      <a-row>
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
                  size="large"
                  v-model="permission.name"
                  test-attr="name-permissions"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="key" :label="$t('key')" prop="key">
                <a-input
                  size="large"
                  v-model="permission.key"
                  test-attr="key-permissions"
                />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="role_id" :label="$t('role')" prop="role_id">
                <a-select id="attrSelect" style="width: 100%" v-model="permission.role_id">
                  <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">
                    {{ role.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="permission.description" test-attr="description-permissions"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-row>
    </a-card>
    <a-row class="edit-btns" style="margin-top: 20px">
      <a-col :span="24">
        <a-form-model-item>
          <a-button type="primary" html-type="submit" @click="onSubmit" test-attr="save-permissions">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm" test-attr="reset-permissions">
            {{ $t('reset') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import request from '@/utils/request'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
const headers = {
  'Content-Type': 'application/json'
}
// import vMain from './v-main'
export default {
  components: {
    'tinymce': tinymce
  },
  data () {
    return {
      edit: !!this.$route.params.id,
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
