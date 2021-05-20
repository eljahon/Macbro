<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/currency/list" test-attr="prev-link-permissions">{{ $t('Currency') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ currencyType ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :bordered="false" :title="currencyType ? $t('update') : $t('fillIn')">
      <a-popconfirm
        v-if="currencyType"
        placement="topRight"
        slot="extra"
        :title="$t('deleteMsg')"
        @click.native.stop=""
        @confirm="deleteCategory"
        :okText="$t('yes')"
        :cancelText="$t('no')"
      >
        <a-button type="danger" html-type="submit" test-attr="save-customer">
          <a-icon :component="$myIcons.binSvg" /> {{ $t('delete') }}
        </a-button>
      </a-popconfirm>
    </a-card>

    <a-card :bordered="false" style="flex: 1">
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
            <a-form-model-item ref="currency" :label="$t('name')" prop="currency">
              <a-input
                style="width: 100%"
                size="large"
                v-model="form.currency"
                test-attr="name-permissions"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" style="padding: 0 15px">
            <a-form-model-item ref="currency" :label="$t('dollarCurrency')" prop="currency">
              <a-input-number
                style="width: 100%"
                :min="0"
                size="large"
                v-model="form.amount"
                test-attr="name-permissions"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <a-row class="edit-btns" style="margin-top: 20px">
      <a-col :span="24">
        <a-form-model-item>
          <a-button type="primary" html-type="submit" @click="onSubmit" test-attr="save-permissions">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm" test-attr="reset-permissions">
            {{ $t('reset') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import request from '@/utils/request'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
export default {
  components: {
    'tinymce': tinymce
  },
  data () {
    return {
      roleList: [],
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      currencyType: this.$route.params.id,
      currencyId: '',
      form: {
          amount: null,
          currency: ''
      },
      rules: {
        amount: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
        // role_id: [
        //   { required: true, message: this.$t('required'), trigger: 'change' }
        // ]
      }
    }
  },
  mounted () {
    if (this.currencyType) this.getCurrency(this.currencyType)
  },
  methods: {
    deleteCategory (e) {
        this.loading = true
      request({
          url: `/rate/${this.currencyId}`,
        method: 'delete'
      })
      .then(res => {
          console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.$router.go(-1)
        // this.getCurrencyList({ page: this.paginationCurrency })
      })
      .catch(err => {
          this.$message.error('error')
        console.error(err)
      })
      .finally(() => (this.loading = false))
    },
    getCurrency (currencyType) {
      request({
        url: `/rate/${currencyType}`,
        method: 'get'
      })
      .then((response) => {
        console.log('response', response)
        this.form.amount = +response.rate.amount
        this.form.currency = response.rate.currency
        this.currencyId = response.rate.id
      })
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            var url = '/rate'
            var method = 'post'
          if (this.currencyType) {
            url = `/rate/${this.currencyId}`
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          request({
              url: url,
              method: method,
              data: {
                  ...this.form
              },
              headers: headers
          })
          .then(res => {
              console.log(res)
              this.$router.replace('/currency/list')
          })
          .catch(err => {
              console.log(err)
              this.$message.success(this.$t('error'))
          })
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
