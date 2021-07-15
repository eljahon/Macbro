<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/company/list" test-attr="prev-link-company">{{ $t('companies') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ false ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-card>
      <h1 v-if="loading">loading......</h1>
      <a-form-model
        v-else
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <a-col :md="24" :lg="8" style="padding: 0 15px">
            <a-form-model-item ref="name" :label="$t('firstName')" prop="first_name">
              <a-input
                size="large"
                :disabled="requesting"
                v-model="form.first_name"
                test-attr="name-company"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :lg="8" style="padding: 0 15px">
            <a-form-model-item ref="account_number" :label="$t('lastName')" prop="last_name">
              <a-input
                size="large"
                style="width: 100%"
                :disabled="requesting"
                v-model="form.last_name"
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
                v-model="form.email"
              />
            </a-form-model-item>
          </a-col>
          <!-- number -->
          <a-col :md="24" :lg="8" style="padding: 0 15px">
            <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
              <a-input
                style="width: 100%"
                size="large"
                v-model="form.phone_number"
              />
            </a-form-model-item>
          </a-col>
          <!-- work hours -->
          <a-col :md="24" :lg="8" style="padding: 0 15px">
            <a-form-model-item ref="password" :label="$t('password')" prop="password">
              <a-input
                size="large"
                style="width: 100%"
                :disabled="requesting"
                v-model="form.password"
                test-attr="inn-company"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :lg="8" style="padding: 0 15px">
            <a-form-model-item ref="inn" :label="$t('passport_numbera')" prop="passport_number">
              <a-input
                size="large"
                style="width: 100%"
                :disabled="requesting"
                v-model="form.passport_number"
                test-attr="inn-company"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :lg="8" style="padding: 0 15px">
            <a-form-model-item ref="mfo" :label="$t('inn')" prop="inn">
              <a-input
                size="large"
                style="width: 100%"
                :disabled="requesting"
                v-model="form.inn"
                test-attr="mfo-company"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :lg="8" style="padding: 0 15px">
            <a-form-model-item ref="description" :label="$t('middelname')" prop="middel_name">
              <a-input v-model="form.middle_name" size="large"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :lg="8" style="padding: 0 15px">
            <a-form-model-item ref="description" :label="$t('Логин')" prop="middel_name">
              <a-input v-model="form.login" size="large"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :lg="8" style="padding: 0 15px">
            <a-form-model-item ref="description" :label="$t('user_type')" prop="user_type">
              <a-select v-model="form.user_type">
                <a-select-option v-for="usertype in UserTypeSelect" :value="usertype.en" :key="usertype.ru">{{ usertype.ru }}</a-select-option>
              </a-select>
              <!--              <a-input v-model="form.user_type" size="large"></a-input>-->
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div style="float: right">
        <a-row class="edit-btns">
          <a-col :span="24" style="padding: 15px 0">
            <a-form-model-item>
              <a-button type="primary" @click.prevent="onSubmit" test-attr="save-company">
                {{ $t('save') }}
              </a-button>
              <a-button style="margin-left: 10px;" @click.prevent="resetForm" test-attr="reset-company">
                {{ $t('reset') }}
              </a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { AutoComplete } from 'ant-design-vue'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
export default {
  watch: {
    'form.date_of_birth' (e) {
      console.log(moment(e).format('YYYY-MM-DD'))
    },
    'form.user_type' (event) {
      // eslint-disable-next-line camelcase,no-unused-vars
      const _user_type = this.UserTypeSelect.map(e => {
        if (e.en === event) {
        this.$store.dispatch('userType', e)
          console.log(e)
        }
      })
    }
  },
  components: {
    'a-auto-complete': AutoComplete,
    'tinymce': tinymce
  },
  // props: {
  //   // eslint-disable-next-line
  //   lang: String
  // },
  data () {
    const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    }
    const validateEmail = (rule, value, callback) => {
      // eslint-disable-next-line no-useless-escape
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          callback()
        } else {
          callback(new Error(this.$t('errorEmail')))
        }
    }
    // const validateNumber = (rule, value, callback) => {
    //   if (!isNaN(value) && value > 0) {
    //     callback()
    //   } else {
    //     callback(new Error(this.$t('Введите номер')))
    //   }
    // }
    return {
      mode1: 'time',
      requesting: false,
      activeTabKey: '1',
      companySlug: this.$route.params.id,
      shopId: null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      key: 'updatable',
      loading: false,
      loadingTable: false,
      form: {
        company_id: this.$route.query.companyId,
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        passport_number: '',
        date_of_birth: '',
        inn: '',
        login: '',
        middle_name: '',
        profile_image: '',
        user_type: '',
        id: ''
      },
      rules: {
        first_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        last_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        // eslint-disable-next-line standard/object-curly-even-spacing
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validatePhone, trigger: 'change' }],
        password: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        date_of_birth: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        email: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validateEmail, trigger: 'change' }],
        inn: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        passport_number: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        middle_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        user_type: [{ required: true, message: this.$t('required'), trigger: 'change' }]

      },
      params: {
        page: {
          pageSize: 10,
          current: 1,
          total: null
        },
        search: '',
        company_id: this.$route.query.companyId,
        user_type: '',
        user: '',
        offset: 0
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
    ...mapGetters(['UserTypeSelect'])
  },
  methods: {
    ...mapActions(['getCompanies', 'companyUserTypeCreate', 'getUsers']),
    handleOpenChange1 (open) {
      if (open) {
        this.mode1 = 'time'
      }
    },
    handleChange (value) {
      this.value = value
    },
    getCompanyAttrs () {
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
          // eslint-disable-next-line standard/object-curly-even-spacing,no-undef
          // this.$message.loading({ content: 'Loading...', key })
          this.$emit('clickParent', true)
          this.$store.dispatch('companyUserTypeCreate', this.form)
            .then(res => {
              this.$router.push({ name: 'CompaniesEdit', params: { id: this.$route.query.companyId } })
              this.getUsers(this.params)
              this.$message.success(this.$t('auth_api_url_useraAdd'))
            })
            .finally(() => {
            this.$emit('clickParent', false)
              this.loading = false
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
