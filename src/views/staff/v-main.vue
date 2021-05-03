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
          <a-form-model-item ref="name" :label="$t('firstName')" prop="name">
            <a-input
              size="large"
              :disabled="checking || loading"
              v-model="form.name"
              test-attr="name-staff"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="last_name" :label="$t('lastName')" prop="last_name">
            <a-input
              size="large"
              :disabled="checking || loading"
              v-model="form.last_name"
              test-attr="last_name-staff"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
            <a-input
              size="large"
              :disabled="checking || loading"
              v-model="form.phone_number"
              test-attr="phone-number-staff"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="password" :label="$t('password')" prop="password">
            <a-input-password
              size="large"
              :disabled="checking || loading"
              v-model="form.password"
              test-attr="password-staff"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="user_type" :label="$t('userType')" prop="user_type">
            <a-select
              size="large"
              id="attrSelect"
              style="width: 100%"
              v-model="form.user_type"
              :disabled="checking || loading"
              test-attr="user-type-staff"
            >
              <a-icon slot="suffixIcon" :component="$myIcons.arrowDown" />
              <a-select-option v-for="type in userTypeList" :key="type.key" :value="type.key">
                {{ type.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="role_id" :label="$t('role')" prop="role_id">
            <a-select
              size="large"
              id="attrSelect"
              style="width: 100%"
              v-model="form.role_id"
              :disabled="checking || loading"
              test-attr="role-staff"
            >
              <a-icon slot="suffixIcon" :component="$myIcons.arrowDown" />
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

<script>
import request from '@/utils/request'
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
    const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('Phone Error'))
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{5,30})').test(value)) {
        console.log('PAssworddan otdi')
        callback()
      } else {
        console.log('otmadi', value)
        callback(new Error('Password Error'))
      }
    }
    return {
      userTypeList: [
        {
          key: 'cashier',
          name: this.$t('cashier')
        },
        {
          key: 'consultant',
          name: this.$t('consultant')
        },
        {
          key: 'admin',
          name: this.$t('admin')
        },
        {
          key: 'manager',
          name: this.$t('manager')
        }
      ],
      roleList: [],
      checking: false,
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
        user_type: '',
        role_id: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        last_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone_number: [{ required: true, message: this.$t('requiredField'), trigger: 'blur' },
          { validator: validatePhone, message: this.$t('errorPhone'), value: 'change' }],
        password: [{ required: true, message: this.$t('required'), trigger: 'blur' },
          { validator: validatePassword, message: this.$t('validatePassword'), value: 'change' }],
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
    submitMethod () {
      this.loading = true
      this.$emit('clickParent', true)
      this.createOrUpdateStaff(this.form)
      .then(res => {
        this.loading = false
        if (res) {
          this.$router.go(-1)
        }
      })
      .catch(err => {
        this.loading = false
        console.error(err)
        this.$message.error(this.$t('error') + err)
      })
      .finally(() => {
        this.$emit('clickParent', false)
      })
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.checking = true
          if (this.cityId) {
            this.form.id = this.cityId
            this.submitMethod()
          } else {
            request({
              url: '/auth/login-exists',
              method: 'post',
              data: {
                login: this.form.phone_number
              },
              headers: headers
            })
              .then(res => {
                if (!res.is_exists) {
                  this.submitMethod()
                  // console.log('valid')
                } else {
                  this.$message.error(this.$t('phoneInUse'))
                }
                this.checking = false
              })
              .catch(err => {
                this.$message.error(this.$t('error') + err)
                this.checking = false
              })
          }
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
