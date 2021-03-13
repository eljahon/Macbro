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
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('company')" prop="name">
            <a-input
              :disabled="requesting"
              v-model="company.name"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="account_number" :label="$t('account_number')" prop="account_number">
            <a-input-number
              style="width: 100%"
              :disabled="requesting"
              v-model="company.account_number"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="email" :label="$t('email')" prop="email">
            <a-input
              :disabled="requesting"
              v-model="company.email"
            />
          </a-form-model-item>
        </a-col>
        <!-- number -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
            <a-input
              :disabled="requesting"
              v-model="company.phone_number"
            />
          </a-form-model-item>
        </a-col>
        <!-- work hours -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="inn" :label="$t('inn')" prop="inn">
            <a-input-number
              style="width: 100%"
              :disabled="requesting"
              v-model="company.inn"
            />
          </a-form-model-item>
        </a-col>
        <!-- address 1 -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="address" :label="$t('address')" prop="address">
            <a-input
              :disabled="requesting"
              v-model="company.address"
            />
          </a-form-model-item>
        </a-col>
        <!-- address 2 -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="mfo" :label="$t('mfo')" prop="mfo">
            <a-input-number
              style="width: 100%"
              :disabled="requesting"
              v-model="company.mfo"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="description" :label="$t('description')" prop="description">
            <a-textarea
              placeholder="Basic usage"
              :rows="4"
              v-model="company.description"
              :disbled="requesting"
            />
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
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        account_number: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        email: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        inn: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        mfo: [{ required: true, message: this.$t('required'), trigger: 'change' }]
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
