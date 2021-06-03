<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/company/list" test-attr="prev-link-company">{{ $t('companies') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ true ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>
    <a-card>
      <a-form-model
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
            <a-form-model-item ref="inn" :label="$t('password')" prop="passport_number">
              <a-input
                size="large"
                style="width: 100%"
                :disabled="requesting"
                v-model="form.passport_number"
                test-attr="inn-company"
              />
            </a-form-model-item>
          </a-col>
          <!-- address 1 -->
          <!--          <a-col :md="24" :lg="8" style="padding: 0 15px">-->
          <!--            <a-form-model-item ref="address" :label="$t('data_of_birth')" prop="date_of_birth">-->
          <!--              <a-date-picker-->
          <!--                style="width: 100%;"-->
          <!--                size="large"-->
          <!--                @openChange="handleOpenChange1"-->
          <!--                v-model="form.date_of_birth"-->
          <!--              />-->
          <!--              &lt;!&ndash;              <a-input&ndash;&gt;-->
          <!--              &lt;!&ndash;                size="large"&ndash;&gt;-->
          <!--              &lt;!&ndash;                :disabled="requesting"&ndash;&gt;-->
          <!--              &lt;!&ndash;                v-model="form.date_of_birth"&ndash;&gt;-->
          <!--              &lt;!&ndash;                test-attr="address-company"&ndash;&gt;-->
          <!--              &lt;!&ndash;              />&ndash;&gt;-->
          <!--            </a-form-model-item>-->
          <!--          </a-col>-->
          <!-- address 2 -->
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
          <!--          <a-col :md="24" :lg="8" style="padding: 0 15px">-->
          <!--            <a-form-model-item ref="description" :label="$t('description')" prop="description">-->
          <!--              <a-input v-model="form.user_type" size="large"></a-input>-->
          <!--            </a-form-model-item>-->
          <!--          </a-col>-->
          <a-col :md="24" :lg="8" style="padding: 0 15px">
            <a-form-model-item ref="description" :label="$t('user_type')" prop="user_type">
              <a-select v-model="form.user_type">
                <a-select-option v-for="usertype in array" :value="usertype.en" :key="usertype.ru">{{ usertype.ru }}</a-select-option>
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
    'form.user_type' (e) {
      console.log(e)
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
    // const validateEmail = (rule, value, callback) => {
    //   // eslint-disable-next-line no-useless-escape
    //     if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error(this.$t('errorEmail')))
    //     }
    // }
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
      loading: false,
      loadingTable: false,
      array: [
        { ru: 'кассир', en: 'cashier' },
        { ru: 'админ', en: 'admin' },
        { ru: 'директор', en: 'director' },
        { ru: 'менеджер', en: 'manager' },
        { ru: 'консультант', en: 'consultant' },
        { ru: 'курьер', en: 'courier' },
        { ru: 'контрагент', en: 'counteragent' },
        { ru: 'клиент', en: 'client' }
      ],
      form: {
        company_id: localStorage.getItem('company_id'),
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        passport_number: '',
        date_of_birth: '',
        inn: '',
        middle_name: '',
        profile_image: '',
        user_type: ''
      },
      rules: {
        first_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        last_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        // eslint-disable-next-line standard/object-curly-even-spacing
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validatePhone, trigger: 'change' }],
        date_of_birth: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        email: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        inn: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        passport_number: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        middle_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        user_type: [{ required: true, message: this.$t('required'), trigger: 'change' }]

      }
    }
  },
  mounted () {
    console.log('salom')
    if (this.$route.params.userid) {
      this.getCompanyUserItem(this.$route.params.userid).then(res => {
        console.log(res)
        const form = this.form
        form.date_of_birth = res.date_of_birth
        form.middle_name = res.middle_name
        form.last_name = res.last_name
        form.first_name = res.first_name
        form.inn = res.inn
        form.email = res.email
        form.phone_number = res.phone_number
        form.user_type = res.user_type
        form.passport_number = res.passport_number
        form.profile_image = res.profile_image
      }).catch(err => {
        console.log(err)
      })
    }
  },
  computed: {
    ...mapGetters(['CompanId'])
  },
  methods: {
    ...mapActions(['getCompanies', 'getCompanyUserItem']),
    callback (value) {
      console.log(value)
    },
    handleOpenChange1 (open) {
      if (open) {
        this.mode1 = 'time'
      }
    },
    handleChange (value) {
      this.value = value
    },
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
          const headers = {
            'Content-Type': 'application/json'
          }
          this.$emit('clickParent', true)
          console.log(this.form)
          request({
            url: `user/${this.$route.params.userid}`,
            method: 'put',
            data: this.form,
            headers: headers
          })
            .then(res => {
              this.$message.success(this.$t('usertypenewadd'))
              this.$router.push({ name: 'CompaniesEdit', params: { id: localStorage.getItem('company_id') } })
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
