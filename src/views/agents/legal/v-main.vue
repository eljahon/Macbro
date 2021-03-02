<template>
  <div>
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="legalAgent"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('name')" prop="name">
            <a-input
              :disabled="requesting"
              v-model="legalAgent.name"
            />
          </a-form-model-item>
        </a-col>
        <!-- number -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
            <a-input
              :disabled="requesting"
              v-model="legalAgent.phone_number"
            />
          </a-form-model-item>
        </a-col>
        <!-- address 1 -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="address" :label="$t('address')" prop="address">
            <a-input
              :disabled="requesting"
              v-model="legalAgent.address"
            />
          </a-form-model-item>
        </a-col>
        <!-- address 2 -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="account_number" :label="$t('account_number')" prop="account_number">
            <a-input-number
              :disabled="requesting"
              v-model="legalAgent.account_number"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="inn" :label="$t('inn')" prop="inn">
            <a-input-number
              :disabled="requesting"
              v-model="legalAgent.inn"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="mfo" :label="$t('mfo')" prop="mfo">
            <a-input-number
              :disabled="requesting"
              v-model="legalAgent.mfo"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="description" :label="$t('description')" prop="description">
            <a-textarea
              placeholder="Basic usage"
              :rows="4"
              v-model="legalAgent.description"
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
      cityList: [],
      requesting: false,
      activeTabKey: '1',
      legalAgentId: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingTable: false,
      legalAgent: {
        name: '',
        description: '',
        phone_number: '',
        address: '',
        inn: null,
        mfo: null,
        account_number: null
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        address: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        inn: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        mfo: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        account_number: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted () {
    if (this.legalAgentId) {
      this.getLegalAgentAttrs(this.legalAgentId).then(res => {
        this.loadingTable = true
      })
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['createOrUpdateLegalAgent']),
    getLegalAgentAttrs () {
      this.loading = true
      return new Promise((resolve) => {
        request({
          url: `/legal-counter-agent/${this.legalAgentId}`,
          method: 'get'
        }).then((response) => {
          this.loading = false
          resolve()
          console.log('response', response)
          Object.keys(this.legalAgent).forEach(key => {
            if (response[key] !== null) {
              this.legalAgent[key] = response[key]
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
          this.$emit('clickParent', true)
          this.legalAgent.id = this.legalAgentId
          this.createOrUpdateLegalAgent(this.legalAgent)
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
