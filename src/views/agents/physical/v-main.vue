<template>
  <div>
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="physicalAgent"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('firstName')" prop="name">
            <a-input
              :disabled="requesting"
              size="large"
              v-model="physicalAgent.name"
              test-attr="name-physical-agent"
            />
          </a-form-model-item>
        </a-col>
        <!-- number -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
            <a-input
              :disabled="requesting"
              size="large"
              v-model="physicalAgent.phone_number"
              test-attr="phone_number-physical-agent"
            />
          </a-form-model-item>
        </a-col>
        <!-- address 1 -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="address" :label="$t('address')" prop="address">
            <a-input
              :disabled="requesting"
              size="large"
              v-model="physicalAgent.address"
              test-attr="address-physical-agent"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item ref="description" :label="$t('description')" prop="description">
            <a-textarea
              placeholder="Basic usage"
              :rows="4"
              size="large"
              v-model="physicalAgent.description"
              :disbled="requesting"
              test-attr="description-physical-agent"
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
      physicalAgentId: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingTable: false,
      physicalAgent: {
        name: '',
        description: '',
        phone_number: '',
        address: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        address: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted () {
    if (this.physicalAgentId) {
      this.getphysicalAgentAttrs(this.physicalAgentId).then(res => {
        this.loadingTable = true
      })
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['getPhysicalAgents', 'createOrUpdatePhysicalAgent']),
    getphysicalAgentAttrs () {
      this.loading = true
      return new Promise((resolve) => {
        request({
          url: `/physical-counter-agent/${this.physicalAgentId}`,
          method: 'get'
        }).then((response) => {
          this.loading = false
          resolve()
          console.log('response', response)
          Object.keys(this.physicalAgent).forEach(key => {
            if (response[key] !== null) {
              this.physicalAgent[key] = response[key]
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
          this.physicalAgent.id = this.physicalAgentId
          this.createOrUpdatePhysicalAgent(this.physicalAgent)
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
