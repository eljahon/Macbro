<template>
  <div>
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="corporate"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="bank_name" :label="$t('bank_name')" prop="bank_name">
            <a-input
              :disabled="requesting"
              v-model="corporate.bank_name"
              test-attr="name-corporate"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="account_number" :label="$t('account_number')" prop="account_number">
            <a-input-number
              style="width: 100%"
              :disabled="requesting"
              v-model="corporate.account_number"
              test-attr="inn-corporate"
            />
          </a-form-model-item>
        </a-col>
        <!-- number -->
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="address" :label="$t('address')" prop="address">
            <a-input
              :disabled="requesting"
              v-model="corporate.address"
              test-attr="address-corporate"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
            <a-input
              :disabled="requesting"
              v-model="corporate.phone_number"
              test-attr="phone_number-corporate"
            />
          </a-form-model-item>
        </a-col>
        <!-- address 1 -->
        <!-- address 2 -->
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="inn" :label="$t('inn')" prop="inn">
            <a-input-number
              style="width: 100%"
              :disabled="requesting"
              v-model="corporate.inn"
              test-attr="inn-corporate"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :lg="8" style="padding: 0 15px">
          <a-form-model-item ref="mfo" :label="$t('mfo')" prop="mfo">
            <a-input-number
              style="width: 100%"
              :disabled="requesting"
              v-model="corporate.mfo"
              test-attr="inn-corporate"
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
      cityList: [],
      requesting: false,
      activeTabKey: '1',
      corporateId: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingTable: false,
      corporate: {
        bank_name: '',
        phone_number: '',
        address: '',
        inn: null,
        mfo: null,
        account_number: null,
        company_id: this.$route.params.company_id
      },
      rules: {
        bank_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        address: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        inn: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        mfo: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        account_number: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted () {
    if (this.corporateId) {
      this.getCorporateAttrs(this.corporateId).then(res => {
        this.loadingTable = true
      })
    }
  },
  methods: {
    ...mapActions(['getCompanies']),
    getCorporateAttrs () {
      this.loading = true
      return new Promise((resolve) => {
        request({
          url: `/corporate/${this.corporateId}`,
          method: 'get'
        }).then((response) => {
          this.loading = false
          resolve()
          console.log('response', response)
          Object.keys(this.corporate).forEach(key => {
            if (key === 'company_id') {
              this.corporate[key] = response.company.id
            } else if (response[key] !== null) {
              this.corporate[key] = response[key]
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
            url: this.corporateId ? `/corporate/${this.corporateId}` : '/corporate',
            method: this.corporateId ? 'put' : 'post'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          this.$emit('clickParent', true)
          request({
              url: req.url,
              method: req.method,
              data: this.corporate,
              headers: headers
          })
          .then(res => {
            this.requesting = false
            console.log('response after submit', res)
            if (this.$route.path !== '/company/list') {
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
