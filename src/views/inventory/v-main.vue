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
          <a-form-model-item ref="product_name" :label="$t('product_name')" prop="product_name">
            <a-select
                show-search
                :auto-clear-search-value="false"
                @search="onSearch($event, 'product')"
                :value="form.product_name"
                :filter-option="false"
                @popupScroll="onScrollBottom($event, 'product')"
                placeholder="brand"
                @change="handleChange($event, 'product')"
                :disbled="loading"
                test-attr="product_name-inventory"
            >
                <a-select-option v-for="product in productList" :title="product.name" :key="product.id" :value="product.slug">
                    {{ product.name }}
                </a-select-option>
                <a-select-option key="productFetching" v-if="productParams.total > productList.length || productFetching">
                    <a-spin slot="notFoundContent" size="small" />
                </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="branch_name" :label="$t('branchName')" prop="branch_name">
            <a-select
                show-search
                :auto-clear-search-value="false"
                @search="onSearch($event, 'branch')"
                :value="form.branch_name"
                :filter-option="false"
                @popupScroll="onScrollBottom($event, 'branch')"
                placeholder="brand"
                @change="handleChange($event, 'branch')"
                :disbled="loading"
                test-attr="branch_name-inventory"
            >
                <a-select-option v-for="branch in branchList" :title="branch.name" :key="branch.id" :value="branch.id">
                    {{ branch.name }}
                </a-select-option>
                <a-select-option key="branchFetching" v-if="branchParams.total > branchList.length || branchFetching">
                    <a-spin slot="notFoundContent" size="small" />
                </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="buy_price" :label="$t('buy_price')" prop="buy_price">
            <a-input-number
                style="width: 100%"
                :min="1"
                v-model="form.buy_price"
                :disbled="loading"
                test-attr="buy-price-inventory"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="sell_price" :label="$t('sell_price')" prop="sell_price">
            <a-input-number
                style="width: 100%"
                :min="1"
                v-model="form.sell_price"
                :disbled="loading"
                test-attr="sell-price-inventory"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item ref="comment" :label="$t('comment')" prop="comment">
            <a-textarea
              :placeholder="$t('comment')"
              :rows="3"
              v-model="form.comment"
              :disbled="loading"
              test-attr="comment-inventory"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" style="padding: 0 15px">
          <a-form-model-item>
            <a-button type="primary" html-type="submit" @click="onSubmit" test-attr="save-inventory">
              {{ $t('save') }}
            </a-button>
            <a-button style="margin-left: 10px;" @click="resetForm" test-attr="reset-inventory">
              {{ $t('reset') }}
            </a-button>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import request from '@/utils/request'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'
import debounce from 'lodash/debounce'
// const headers = {
//   'Content-Type': 'application/json'
// }
export default {
  components: {
    'tinymce': tinymce
  },
  data () {
    this.onSearch = debounce(this.onSearch, 400)
    this.productGetAll = debounce(this.productGetAll, 100)
    this.branchGetAll = debounce(this.branchGetAll, 100)
    return {
      roleList: [],
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      formId: this.$route.params.id,
      form: {
        branch_id: '',
        branch_name: '',
        buy_price: '',
        comment: '',
        product_name: '',
        product_slug: '',
        sell_price: ''
      },
      rules: {
        branch_name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        product_name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        buy_price: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        sell_price: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      branchList: [],
      productList: [],
      branchParams: {
        limit: 10,
        page: 1,
        total: null
      },
      productParams: {
        limit: 20,
        page: 1,
        total: null
      },
      productFetching: false,
      branchFetching: false,
      lang: 'ru'
    }
  },
  mounted () {
    if (this.formId) {
        this.getInventoryAttrs(this.formId)
    }
    this.productParams = { search: '', lang: this.lang, limit: 10, page: 1 }
    this.productGetAll()
    this.branchParams = { search: '', lang: this.lang, limit: 10, page: 1 }
    this.branchGetAll()
  },
  methods: {
    handleChange (value, type) {
        if (type === 'product') {
            const product = this.productList.find(item => item.slug === value)
            this.form.product_slug = product.slug
            this.form.product_name = product.name
        } else {
            const branch = this.branchList.find(item => item.id === value)
            this.form.branch_id = branch.id
            this.form.branch_name = branch.name
        }
    },
    onSearch (value, type) {
      console.log(type, 'Search')
      this[`${type}Fetching`] = true
      this[`${type}List`] = []
      this[`${type}Params`] = { search: value, lang: this.lang, limit: 10, page: 1 }
      this[`${type}GetAll`]()
    },
    onScrollBottom (event, type) {
      var target = event.target
      if (!this[`${type}Fetching`] && target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (this[`${type}Params`].total > this[`${type}List`].length) {
          this[`${type}Params`].page += 1
          this[`${type}Params`].lang = this.lang || 'ru'
          target.scrollTo(0, target.scrollHeight)
          this[`${type}GetAll`]()
        }
      }
    },
    productGetAll () {
      this.productFetching = true
      request({
        url: '/product',
        method: 'get',
        params: this.productParams
      })
      .then(response => {
        this.productFetching = false
        this.productList.push(...response.products)
        this.productParams.total = response.count
      })
      .catch(() => {
        this.productFetching = false
      })
    },
    branchGetAll () {
      this.branchFetching = true
      request({
        url: '/branch',
        method: 'get',
        params: this.branchParams
      })
      .then(response => {
        this.branchFetching = false
        this.branchList.push(...response.branches)
        this.branchParams.total = response.count
      })
      .catch(() => {
        this.branchFetching = false
      })
    },
    getInventoryAttrs (formId) {
        this.loading = true
        request({
            url: `/inventory-item/${formId}`,
            method: 'get'
        })
        .then((response) => {
            this.loading = false
            console.log('response', response)
            this.form.branch_id = response.branch_id
            this.form.branch_name = response.branch_name
            this.form.buy_price = response.buy_price
            this.form.comment = response.comment
            this.form.product_name = response.product_name
            this.form.product_slug = response.product_slug
            this.form.sell_price = response.sell_price
        })
        .catch(() => {
            this.loading = false
        })
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            var url = '/inventory-item'
            var method = 'post'
          if (this.formId) {
            url = `/inventory-item/${this.formId}`
            method = 'put'
          }
          this.loading = true
          const headers = {
            'Content-Type': 'application/json'
          }
          const newForm = { ...this.form }
          newForm.buy_price = String(newForm.buy_price)
          newForm.sell_price = String(newForm.sell_price)
          request({
              url: url,
              method: method,
              data: newForm,
              headers: headers
          })
          .then(res => {
              console.log(res)
                this.loading = false
              this.$router.replace('/inventory/list')
          })
          .catch(err => {
              console.log(err)
                this.loading = false
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
