<template>
  <div>
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-tabs type="card" v-model="activeTabKey">
          <a-tab-pane key="1" :tab="$t('basicSettings')">
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('name')" prop="name">
                <a-input
                  :disabled="requesting"
                  v-model="form.name"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="key" :label="$t('key')" prop="key">
                <a-input
                  :disabled="requesting"
                  v-model="form.key"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="form.description"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-tab-pane>
          <a-tab-pane v-if="cityId" key="2" :tab="$t('permissions')">
            <a-col :span="24">
              <a-list bordered :data-source="getAllPermissions">
                <a-list-item slot="renderItem" slot-scope="permission">
                  {{ permission.name }}
                  <a-switch
                    slot="extra"
                    :checked="rolePermissions.includes(permission.id)"
                    @change="handlePermissionChange(permission.id)"
                  >
                    <a-icon slot="checkedChildren" type="check" />
                    <a-icon slot="unCheckedChildren" type="close" />
                  </a-switch>
                </a-list-item>
              </a-list>
            </a-col>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import { AutoComplete } from 'ant-design-vue'
import request from '@/utils/request'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    'a-auto-complete': AutoComplete,
    'tinymce': tinymce
  },
  props: {
  // eslint-disable-next-line
    lang: String
  },
  data () {
    return {
      cityList: [],
      allPermissions: [],
      rolePermissions: [],
      requesting: false,
      activeTabKey: '1',
      cityId: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      form: {
        name: '',
        key: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted () {
    if (this.cityId) {
      this.getCity()
      this.getRolePermissions()
      .then(() => {
        })
      .catch(err => console.log(err))
    }
    this.getPermissionsNew()
      .then(() => {
        if (this.cityId) {
          this.allPermissions = this.getAllPermissions && this.getAllPermissions.map(p => {
            return { ...p, checked: this.checkPermission(p) }
          })
        }
      })
      .catch(err => console.log(err))
  },
  computed: {
    ...mapGetters(['rolesList', 'rolesPagination', 'searchQuery', 'permissionsList']),
    getAllPermissions () {
      return this.permissionsList
    }
  },
  methods: {
    ...mapActions(['getRoleDetail', 'createOrUpdateRole', 'getPermissionsNew']),
    handlePermissionChange (id) {
      if (this.rolePermissions.includes(id)) {
        const index = this.rolePermissions.indexOf(id)
        this.rolePermissions.splice(index, 1)
      } else {
        this.rolePermissions.push(id)
      }
    },
    checkPermission (p) {
      const permission = this.rolePermissions &&
        this.rolePermissions.find(per => per.key === p.key)
      return !!permission
    },
    getRolePermissions () {
      return new Promise((resolve, reject) => {
        request({
          url: `/role-permissions/${this.cityId}`,
          method: 'get'
        })
        .then((response) => {
          console.log('response', response)
          this.rolePermissions = response.permissions.map(item => {
            return item.id
          }) || []
          resolve()
        })
        .catch(err => {
          console.error(err)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject()
        })
      })
    },
    getCity () {
      this.loading = true
      this.getRoleDetail(this.cityId)
        .then((response) => {
          this.loading = false
          console.log('response', response)
          Object.keys(this.form).forEach(key => {
            if (response[key] !== null) {
              this.form[key] = response[key]
            }
          })
          // images' urls to show images to user
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.requesting = true
          this.$emit('clickParent', true)
          this.form.id = this.cityId
          this.createOrUpdateRole(this.form)
          .then(res => {
            this.requesting = false
            if (!this.cityId) {
              this.$router.go(-1)
            }
          })
          .catch(err => {
            this.requesting = false
            console.error(err)
            this.$message.error(this.$t('error'))
          })
          .finally(() => {
            if (this.cityId) {
              this.updateRolePermissions()
            } else {
              this.$emit('clickParent', false)
            }
          })
          console.log('valid')
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    updateRolePermissions () {
      this.requesting = true
      request({
        url: `/add-role-permissions`,
        method: 'post',
        data: {
          permission_ids: this.rolePermissions,
          role_id: this.cityId
        },
        headers: { 'Content-Type': 'application/json' }
      })
      .then(() => {
        this.requesting = false
        this.$router.go(-1)
      })
      .catch(err => {
        this.requesting = false
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => {
        this.$emit('clickParent', false)
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    activeTabHandler (_activeTabKey) {
      this.activeTabKey = _activeTabKey
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style>
</style>
