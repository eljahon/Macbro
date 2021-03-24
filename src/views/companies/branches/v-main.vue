<template>
  <div>
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="branch"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="name" :label="$t('name')" prop="name">
            <a-input
              :disabled="requesting"
              v-model="branch.name"
              test-attr="name-branch"
            />
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="company_id" :label="$t('company')" prop="company_id">
            <a-select
              style="width: 100%"
              v-model="branch.company_id"
              :placeholder="$t('company')"
              test-attr="company-branch"
            >
              <a-select-option v-for="company in companiesList" :key="company.value" :value="company.id">{{
                company.name
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col> -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="city_id" :label="$t('city')" prop="city_id">
            <a-select
              style="width: 100%"
              v-model="branch.city_id"
              :placeholder="$t('city')"
              test-attr="city-branch"
            >
              <a-select-option v-for="city in cityList" :key="city.value" :value="city.id">{{
                city.name
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <!-- number -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
            <a-input
              :disabled="requesting"
              v-model="branch.phone_number"
              test-attr="phone_number-branch"
            />
          </a-form-model-item>
        </a-col>
        <!-- address 1 -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="address" :label="$t('address')" prop="address">
            <a-input
              :disabled="requesting"
              v-model="branch.address"
              test-attr="address-branch"
            />
          </a-form-model-item>
        </a-col>
        <!-- address 2 -->
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="number_of_employees" :label="$t('number_of_employees')" prop="number_of_employees">
            <a-input-number
              style="width: 100%"
              :disabled="requesting"
              v-model="branch.number_of_employees"
              test-attr="number_of_employees-branch"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="branch_type" :label="$t('branchType')" prop="branch_type">
            <a-select
              style="width: 100%"
              v-model="branch.branch_type"
              :placeholder="$t('branchType')"
              test-attr="branch_type-branch"
            >
              <a-select-option value="franchise">
                {{ $t('franchise') }}
              </a-select-option>
              <a-select-option value="own">
                {{ $t('own') }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item ref="description" :label="$t('description')" prop="description">
            <tinymce v-model="branch.description" test-attr="description-branch"></tinymce>
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
      requesting: false,
      activeTabKey: '1',
      branchId: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingTable: false,
      branch: {
        name: '',
        description: '',
        phone_number: '',
        address: '',
        city_id: '',
        company_id: this.$route.params.company_id || '',
        number_of_employees: null,
        branch_type: '',
        corporate_id: '770aa014-b7c9-4456-966b-224cc515b3b7'
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        address: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        number_of_employees: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        branch_type: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted () {
    if (this.branchId) {
      this.getBranchAttrs(this.branchId).then(res => {
        this.loadingTable = true
      })
    }
    this.getCities()
    this.getCompanies()
  },
  computed: {
    ...mapGetters(['companiesList'])
  },
  methods: {
    ...mapActions(['getCompanies']),
    getCities () {
      return new Promise((resolve) => {
        request({
          url: `/city`,
          method: 'get'
        }).then((response) => {
          resolve()
          // images' urls to show images to user
          this.cityList = response.cities
        })
        .catch(err => {
          console.log(err)
        })
      })
    },
    getBranchAttrs () {
      this.loading = true
      return new Promise((resolve) => {
        request({
          url: `/branch/${this.branchId}`,
          method: 'get'
        }).then((response) => {
          this.loading = false
          resolve()
          console.log('response', response)
          Object.keys(this.branch).forEach(key => {
            if (response[key] !== null) {
              this.branch[key] = response[key]
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
            url: this.branchId ? `/branch/${this.branchId}` : '/branch',
            method: this.branchId ? 'put' : 'post'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          this.$emit('clickParent', true)
          request({
              url: req.url,
              method: req.method,
              data: this.branch,
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
