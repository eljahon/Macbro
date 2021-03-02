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
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import { AutoComplete } from 'ant-design-vue'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
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
      cityId: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      form: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted () {
    if (this.cityId) {
      this.getCity()
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['getCityDetail', 'createOrUpdateCity']),
    getCity () {
      this.loading = true
      this.getCityDetail(this.cityId)
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
          this.createOrUpdateCity(this.form)
          .then(res => {
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
