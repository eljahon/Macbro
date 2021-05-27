<template>
  <div>
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="company"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('company')" prop="name">
            <a-input
              size="large"
              :disabled="requesting"
              v-model="company.name"
              test-attr="name-company"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="account_number" :label="$t('account_number')" prop="account_number">
            <a-input-number
              size="large"
              style="width: 100%"
              :disabled="requesting"
              v-model="company.account_number"
              test-attr="account_number-company"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="email" :label="$t('email')" prop="email">
            <a-input
              :autocomplete="false"
              size="large"
              :disabled="requesting"
              v-model="company.email"
              test-attr="email-company"
            />
          </a-form-model-item>
        </a-col>
        <!-- number -->
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
            <a-input
              size="large"
              :disabled="requesting"
              v-model="company.phone_number"
              test-attr="phone-number-company"
            />
          </a-form-model-item>
        </a-col>
        <!-- work hours -->
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="inn" :label="$t('inn')" prop="inn">
            <a-input-number
              size="large"
              style="width: 100%"
              :disabled="requesting"
              v-model="company.inn"
              test-attr="inn-company"
            />
          </a-form-model-item>
        </a-col>
        <!-- address 1 -->
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="address" :label="$t('address')" prop="address">
            <a-input
              size="large"
              :disabled="requesting"
              v-model="company.address"
              test-attr="address-company"
            />
          </a-form-model-item>
        </a-col>
        <!-- address 2 -->
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="mfo" :label="$t('mfo')" prop="mfo">
            <a-input-number
              size="large"
              style="width: 100%"
              :disabled="requesting"
              v-model="company.mfo"
              test-attr="mfo-company"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item ref="description" :label="$t('description')" prop="description">
            <tinymce v-model="company.description" test-attr="descrition-company"></tinymce>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import { AutoComplete } from 'ant-design-vue'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import request from '@/utils/request'
import { mapActions } from 'vuex'
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
        callback(new Error(this.$t('incorrectPhone')))
      }
    }
    // const validateEmail = (rule, value, callback) => {
    //   // eslint-disable-next-line no-useless-escape
    //     if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error(this.$t('errorEmail')))
    //     }
    // }
    const validateNumber = (rule, value, callback) => {
      if (!isNaN(value) && value > 0) {
        callback()
      } else {
        callback(new Error(this.$t('Введите номер')))
      }
    }
    return {
      requesting: false,
      activeTabKey: '1',
      companySlug: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingTable: false,
      company: {
        name: '',
        description: '',
        phone_number: '',
        address: '',
        account_number: null,
        email: '',
        inn: '',
        mfo: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        address: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        // eslint-disable-next-line standard/object-curly-even-spacing
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validatePhone, trigger: 'change' }],
        account_number: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validateNumber, trigger: 'change' }],
        email: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        inn: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validateNumber, trigger: 'change' }],
        mfo: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validateNumber, trigger: 'change' }]
      }
    }
  },
  mounted () {
    if (this.companySlug) {
      this.getCompanyAttrs(this.companySlug).then(res => {
        this.loadingTable = true
      })
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['getCompanies']),
    getCompanyAttrs () {
      this.loading = true
      return new Promise((resolve) => {
        request({
          url: `/company/${this.companySlug}?lang=${this.lang}`,
          method: 'get'
        }).then((response) => {
          this.loading = false
          resolve()
          console.log('response', response)
          Object.keys(this.company).forEach(key => {
            if (response[key] !== null) {
              this.company[key] = response[key]
            }
          })
          // images' urls to show images to user
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
      })
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.requesting = true
          const req = {
            url: this.companySlug ? `/company/${this.companySlug}` : '/company',
            method: this.companySlug ? 'put' : 'post'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          this.$emit('clickParent', true)
          request({
              url: req.url,
              method: req.method,
              data: this.company,
              headers: headers
          })
          .then(res => {
            this.requesting = false
            console.log('response after submit', res)
            if (this.$route.path !== '/company/list') {
              this.$router.replace('/company/list')
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
