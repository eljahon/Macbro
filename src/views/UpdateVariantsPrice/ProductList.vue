<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/price-list/category" test-attr="prev-link-brand">{{ $t('categories') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('products') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra" style="float: right">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          :disabled="editingKey !== ''"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          v-decorator="['search', { initialValue: getSearchQuery }]"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('products')" class="breadcrumb-row" :bordered="false"  style="flex: 1">

      <div slot="extra">
        {{ $t('dollarCurrency') }}: <b>{{ usd }}</b>
      </div>
      <a-form-model
        ref="productRuleForm"
        :model="editingKey !== '' ? items[editingKey] : {}"
        :rules="productRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-table
          :columns="columns"
          :rowKey="record => record.slug"
          :dataSource="productsData"
          :pagination="getPagination"
          :loading="loading"
          @change="handleTableChange"
          test-attr="list-product-vars"
          bordered
            :customRow="customRowClick"
        >
        </a-table>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
import { numberToPrice } from '@/utils/util'
// function getSelected (productVariants, selectedProductVariant) {
//   for (let i = 0; i < productVariants.length; i++) {
//     if (productVariants[i].id === selectedProductVariant) {
//       return productVariants[i]
//     }
//   }
// }
export default {
  data () {
    return {
      items: [],
      cacheData: [],
      updatePricesForm: {
        item_new_prices: []
      },
      editingKey: '',
      productRules: {},
      data: [],
      loading: true,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name',
          width: '50%'
        }
        // {
        //   title: this.$t('action'),
        //   dataIndex: 'operation',
        //   scopedSlots: { customRender: 'operation' }
        // }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      productVariants: [],
      selectedProductVariant: null,
      productsPaginationCurrent: {},
      selectedProductVariantCategory: '',
      updateVisible: false,
      filterParams: {},
      page: { current: 1, pageSize: 10, total: 45 },
      Interval: null,
      usd: ''
    }
  },
  computed: {
    ...mapGetters(['productsData', 'productsPagination', 'searchQuery']),
    getPagination () {
      return this.productsPagination
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.setSearchQuery()
    this.getProducts({ page: this.productsPagination, category: this.$route.params.id })
      .then(() => {
        console.log('this.productsData', this.productsData)
      })
      .catch(err => {
        this.$message.error(this.$t('error'))
        console.error(err)
      })
      .finally(() => (this.loading = false))
    this.getUSD()
  },
  beforeDestroy () {
    this.setSearchQuery('')
  },
  methods: {
    ...mapActions(['getProducts', 'setSearchQuery']),
    getUSD () {
      request({
        url: '/rate/usd',
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.usd = response.rate.amount
      })
    },
    customRowClick (record) {
        return {
            on: {
                click: (e) => {
                    console.log('Category id', record.id)
                    this.$router.push(`${this.$route.path}/${record.id}`)
                }
            }
        }
    },
    handleTableChange (pagination) {
      console.log(pagination)
      this.editingKey = ''
      this.loading = true
      this.getProducts({ page: pagination, search: true, category: this.$route.params.id })
        .then(res => {
          console.log(res)
        })
        .catch(err => this.$message.error(err))
        .finally(() => (this.loading = false))
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getProducts({ category: this.$route.params.id })
        .then(res => {
          console.log(res)
        })
        .catch(err => this.$message.error(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.filterParams = values
          this.getProducts({ category: this.$route.params.id })
            .then(res => {
              console.log('res', res)
            })
            .catch(err => {
              console.error(err)
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    numberToPrice (num) {
      return numberToPrice(num)
    }
  }
}
</script>
