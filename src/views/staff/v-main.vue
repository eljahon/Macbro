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
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('name')" prop="name">
            <a-input
              :disabled="requesting"
              v-model="form.name"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="last_name" :label="$t('lastName')" prop="last_name">
            <a-input
              :disabled="requesting"
              v-model="form.last_name"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
            <a-input
              :disabled="requesting"
              v-model="form.phone_number"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="password" :label="$t('password')" prop="password">
            <a-input-password
              :disabled="requesting"
              v-model="form.password"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="user_type" :label="$t('userType')" prop="user_type">
            <a-select id="attrSelect" style="width: 100%" v-model="form.user_type">
              <a-select-option v-for="type in userTypeList" :key="type.id" :value="type.id">
                {{ type.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="role_id" :label="$t('role')" prop="role_id">
            <a-select id="attrSelect" style="width: 100%" v-model="form.role_id">
              <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">
                {{ role.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>import request from '@/utils/request'
import { AutoComplete } from 'ant-design-vue'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import { mapActions } from 'vuex'
const headers = {
  'Content-Type': 'application/json'
}
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
      userTypeList: [],
      roleList: [],
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
        phone_number: '',
        last_name: '',
        password: '',
        user_type: 'asda',
        role_id: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        last_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        password: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        user_type: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        role_id: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted () {
    if (this.cityId) {
      this.getStaff()
    }
    this.getRoles()
  },
  computed: {
  },
  methods: {
    ...mapActions(['getStaffDetail', 'createOrUpdateStaff']),
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
    getStaff () {
      this.loading = true
      this.getStaffDetail(this.cityId)
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
          this.createOrUpdateStaff(this.form)
          .then(res => {
            this.requesting = false
            if (res) {
              this.$router.go(-1)
            }
          })
          .catch(err => {
            this.requesting = false
            console.error(err)
            this.$message.error(this.$t('error'))
          })
          .finally(() => {
            this.$emit('clickParent', false)
          })
          console.log('valid')
        } else {
          console.log('error submit, validation failed')
          return false
        }
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
