<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/price-list/category" test-attr="prev-link-brand">{{ $t('categories') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="`/price-list/category/${$route.params.id}`" test-attr="prev-link-brand">{{ $t('products') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('product_variants_list') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <!-- <div slot="extra" style="float: right">
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
      </div> -->
    </breadcrumb-row>

    <a-card :title="$t('product_variants_list')" class="breadcrumb-row" :bordered="false"  style="flex: 1">

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
          :dataSource="items"
          :loading="loading"
          @change="handleTableChange"
          test-attr="list-product-vars"
          bordered
        >
          <template v-for="col in ['price', 'old_price']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <template v-if="record.editable">
                <a-form-model-item :ref="col" :prop="col">
                  <a-input-number
                    style="margin: -5px 0"
                    :min="0"
                    :value="col === 'price' ? record.price : record.old_price"
                    @change="e => handleChange(e, index, col)"
                  />
                </a-form-model-item>
              </template>
              <template v-else>
                {{ col === 'price' ? $numberToPrice(record.price) : $numberToPrice(record.old_price) }}
              </template>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <!-- <a-button @click="() => save(index)">{{ $t('save') }}</a-button> -->
                <a-popconfirm title="Sure to save?" @confirm="() => save(index)">
                  <a-tooltip>
                    <template slot="title">{{ $t('save') }}</template>
                    <a-button icon="check" type="primary"/>
                  </a-tooltip>
                </a-popconfirm>
                <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(index)">
                  <a-tooltip placement="bottom">
                    <template slot="title">{{ $t('cancel') }}</template>
                    <a-button icon="close" type="danger"/>
                  </a-tooltip>
                </a-popconfirm>
              </span>
              <span v-else>
                <!-- <a :disabled="editingKey !== '' || order.status !== 'in-process'" @click="() => edit(index)">{{ $t('update') }}</a> -->
                <a-tooltip>
                  <template slot="title">{{ $t('update') }}</template>
                  <a-button
                    @click="() => edit(index)"
                    :disabled="editingKey !== ''"
                    id="buttonOrderDetails"
                    type="primary"
                    icon="edit"
                  ></a-button>
                </a-tooltip>
              </span>
            </div>
          </template>
          <template slot="update_price" slot-scope="text, record, index">
            <span>
              <a-input-number
                style="margin: -5px 0"
                :min="0"
                v-model="updatePricesForm.item_new_prices[index].price"
              />
            </span>
          </template>
        </a-table>
      </a-form-model>
    </a-card>
    <a-row class="edit-btns">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="loading" type="primary" html-type="submit" @click.prevent="updateAllPrices" test-attr="save-category">
            {{ $t('save') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
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
      productSlug: this.$route.params.product_id,
      items: [],
      cacheData: [],
      updatePricesForm: {
        item_new_prices: []
      },
      editingKey: '',
      productRules: {
        price: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        old_price: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      },
      data: [],
      loading: true,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name',
          width: '50%'
        },
        {
          title: this.$t('currentPrice'),
          key: 'price',
          width: '30%',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$t('newPriceInput'),
          key: 'newPrice',
          scopedSlots: { customRender: 'update_price' }
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
      productVariantsPaginationCurrent: {},
      selectedProductVariantCategory: '',
      updateVisible: false,
      filterParams: {},
      page: { current: 1, pageSize: 10, total: 45 },
      Interval: null,
      usd: ''
    }
  },
  computed: {
    ...mapGetters(['productVariantsData', 'productVariantsPagination', 'searchQuery']),
    getPagination () {
      return this.productVariantsPagination
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    // this.setSearchQuery()
    // this.getProductVariants({ page: this.productVariantsPagination, category: this.$route.params.id })
    //   .then(() => {
    //     this.ArrangeItemsList()
    //     console.log('this.productVariantsData', this.productVariantsData)
    //   })
    //   .catch(err => {
    //     this.$message.error(this.$t('error'))
    //     console.error(err)
    //   })
    //   .finally(() => (this.loading = false))
    this.getProductWithVariants()
    this.getUSD()
  },
  beforeDestroy () {
    this.setSearchQuery('')
  },
  methods: {
    ...mapActions(['getProductVariants', 'setSearchQuery']),
    getUSD () {
      request({
        url: '/rate/usd',
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.usd = response.rate.amount
      })
    },
    getProductWithVariants () {
      this.loading = true
      request({
        url: `/product/${this.productSlug}`,
        method: 'get',
        params: {
          lang: this.lang,
          onlyRelatedProducts: true
        }
      }).then((response) => {
        const { product } = response
        console.log('response', response)
        // this.product.variants = product.variants && product.variants.map(item => {
        //   return { name: item.name, value: item.value.id, valueName: item.value.name }
        // }) || []
        this.productVariants = product.variants.map(item => {
          return item.value
        }) || []
        this.ArrangeItemsList()
        // console.log('response', response)
      }).then((data) => {
          console.log('data', data)
      }).catch((err) => console.error(err))
      .finally(() => {
        this.loading = false
      })
    },
    updateAllPrices () {
      const headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      const form = { ...this.updatePricesForm }
      form.item_new_prices = form.item_new_prices.map(item => {
        return {
          ...item,
          price: String(item.price),
          'old_price': String(item.old_price)
        }
      })
      request({
        url: '/many-product-variants',
        method: 'put',
        data: form,
        headers: headers
      })
        .then(() => {
          this.getProductWithVariants()
          this.ArrangeItemsList()
        })
        .catch(err => this.$message.error(err))
        .finally(() => (this.loading = false))
    },
    ArrangeItemsList () {
      if (this.productVariants) {
        this.items = this.productVariants.map(item => {
          return {
            slug: item.slug,
            name: item.name,
            price: +item.price.price,
            old_price: +item.price.old_price
          }
        })
      } else {
        this.items = []
      }
      this.cacheData = JSON.parse(JSON.stringify(this.items))
      this.updatePricesForm.item_new_prices = this.productVariants && this.productVariants.map(item => {
        return {
          'old_price': +item.price.old_price,
          'price': +item.price.price,
          'price_type_id': '0',
          'product_variant_id': item.slug
        }
      })
    },
    handleChange (value, index, column) {
      // console.log('CHANGE', index, value)
      const newData = [...this.items]
      const target = newData[index]
      if (target) {
        target[column] = value
        this.items = newData
      }
    },
    edit (index) {
      const newData = [...this.items]
      const target = newData[index]
      this.editingKey = index
      if (target) {
        target.editable = true
        this.items = newData
      }
    },
    save (index) {
      this.$refs.productRuleForm.validate(valid => {
        if (valid) {
          const newData = [...this.items]
          const target = newData[index]
          delete target.editable
          this.editingKey = ''
          this.updateProductPrice(target)
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    cancel (index) {
      const newData = [...this.items]
      const target = newData[index]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData[index])
        delete target.editable
        this.items = newData
      }
    },
    updateProductPrice (item) {
      console.log('ITEM', item)
      const headers = {
        'Content-Type': 'application/json'
      }
      this.loading = true
      request({
        url: '/product-variant/' + item.slug + '/update-price',
        method: 'put',
        data: {
          price_type_id: '0',
          price: String(item.price),
          old_price: String(item.old_price)
        },
        headers: headers
      })
        .then(() => {
          this.ArrangeItemsList()
        })
        .catch(err => this.$message.error(err))
        .finally(() => (this.loading = false))
    },
    handleTableChange (pagination) {
      console.log(pagination)
      this.editingKey = ''
      this.loading = true
      this.getProductVariants({ page: pagination, search: true, category: this.$route.params.id })
        .then(res => {
          this.ArrangeItemsList()
          console.log(res)
        })
        .catch(err => this.$message.error(err))
        .finally(() => (this.loading = false))
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getProductVariants({ category: this.$route.params.id })
        .then(res => {
          this.ArrangeItemsList()
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
          this.getProductVariants({ category: this.$route.params.id })
            .then(res => {
              this.ArrangeItemsList()
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
