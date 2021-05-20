<template>
  <div>
    <a-switch
      slot="extra"
      v-model="featuredProduct.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px 0"
    />
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="featuredProduct"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
        <a-tab-pane key="1" :tab="$t('basicSettings')">
          <a-row>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item ref="title" :label="$t('title')" prop="title">
                <a-input size="large" v-model="featuredProduct.title" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item ref="order" :label="$t('order_no')" prop="order">
                <a-input-number size="large" style="width: 100%" v-model="featuredProduct.order" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 30px 0 15px 15px">
              <a-form-model-item ref="description" :label="$t('description')" prop="description">
                <tinymce v-model="featuredProduct.description"></tinymce>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="this.$t('products')">
          <a-button type="primary" @click="fetchTableData" style="margin: 0 0 15px">
            {{ $t('add') }}
          </a-button>
          <a-modal
            width="80%"
            v-model="modalVisible"
            :title="$t('add')"
            centered
            @ok="handleAddFeaturedProducts"
            @cancel="() => (modalVisible = false)"
          >
            <!--  -->
            <!--  -->
            <!--  -->
            <a-row>
              <a-col :span="24">
                <a-input size="large" v-debounce="searchFeaturedProducts" :placeholder="$t('search')" />
              </a-col>
            </a-row>
            <a-table
              bordered
              @change="getPagination1"
              :pagination="pagination"
              :rowKey="record => record.id"
              :row-selection="rowSelection"
              :columns="columnsModal"
              :data-source="insctock"
              :loading="loadTable"
            >
              <template slot="status" slot-scope="is_active">
                <status-tag
                  :active="is_active"
                  default-val
                />
              </template>
              <template slot="brand" slot-scope="brand">
                <a-tag color="green">
                  {{ brand }}
                </a-tag>
              </template>
            </a-table>
          </a-modal>
          <a-table
            bordered
            :rowKey="record => record.id"
            :row-selection="featuredProductsRowSelection"
            :columns="columns"
            :data-source="featuredProduct.products"
          >
            <template slot="status" slot-scope="is_active">
              <status-tag
                :active="is_active"
                default-val
              />
            </template>
            <template slot="brand" slot-scope="brand">
              <a-tag color="green">
                {{ brand.name }}
              </a-tag>
            </template>
            <template slot="action" slot-scope="text, item">
              <a-popconfirm
                placement="topRight"
                slot="extra"
                :title="$t('deleteMsg')"
                @confirm="removeFeaturedProduct(item)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip
                ><template slot="title">{{ $t('delete') }}</template>
                  <a-button type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-form-model>
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import tinymce from '@/components/Editor/tinyMCE/tinyEditor'

export default {
  components: {
    'tinymce': tinymce
  },
  props: {
    lang: String
  },
  data () {
    return {
      insctock: [],
      feature: [],
      pagination: {
        current: 1
      },
      featuredProductSlug: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      loading: false,
      modalVisible: false,
      activeTabKey: '1',
      loadTable: false,
      // widgets
      productsRow: [],
      allProducts: [],
      featuredProduct: {
        title: '',
        order: '',
        active: true,
        description: '',
        products: []
      },
      selectedRowKeys: [],
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('category'),
          dataIndex: 'category.name'
        },
        {
          title: this.$t('brand'),
          dataIndex: 'brand.name',
          scopedSlots: { customRender: 'brand' }
        },
        {
          title: this.$t('status'),
          dataIndex: 'active',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columnsModal: [
        {
          title: this.$t('title'),
          dataIndex: 'name'
        },
        {
          title: this.$t('category'),
          dataIndex: 'category.name'
        },
        {
          title: this.$t('brand'),
          dataIndex: 'brand.name',
          scopedSlots: { customRender: 'brand' }
        },
        {
          title: this.$t('status'),
          dataIndex: 'active',
          scopedSlots: { customRender: 'status' }
        }
      ],
      rules: {
        title: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        order: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted () {
    if (this.featuredProductSlug) {
      this.getFeaturedProductAttrs()
    }
    // this.getProducts({ page: this.productsPagination, search: false })
    //   .then(res => console.log('products', this.products))
    //   .catch(err => console.error(err))
    //   .finally(() => (this.loading = false))
  },
  watch: {
    modalVisible (val) {
      if (val === false) {
        this.$router.replace({ query: {} })
      }
    }
  },
  computed: {
    ...mapGetters(['productsData', 'productsPagination']),
    getPagination () {
      return this.productsPagination
    },
    rowSelection () {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        selections: [
          {
            key: 'all-data',
            text: 'Select All Data',
            onSelect: () => {
              // this.selectedRowKeys = this.productsData
              console.log('onSelect')
            }
          }
        ],
        onSelection: this.onSelection
      }
    },
    featuredProductsRowSelection () {
      const { productsRow } = this
      return {
        selectedRowKeys: productsRow,
        onChange: this.onProductsSelectChange,
        hideDefaultSelections: true,
        selections: [
          // {
          //   key: 'all-data',
          //   text: 'Select All Data',
          //   onSelect: () => {getProductAttributes
          //     // this.selectedRowKeys = this.productsData
          //     console.log('onSelect')
          //   }
          // }
        ],
        onSelection: this.onSelection
      }
    }
  },
  methods: {
    ...mapActions(['getProducts', 'setSearchQuery']),
    getFeaturedProductAttrs () {
      request({
        url: `/featured-list/${this.featuredProductSlug}?lang=${this.lang}`,
        method: 'get'
      }).then(response => {
        console.log('response', response)
        const {
          featured_list: { active, title, order, description, products }
        } = response
        this.featuredProduct.active = active
        this.featuredProduct.title = title
        this.featuredProduct.order = order
        this.featuredProduct.description = description
        this.featuredProduct.products = products
        this.selectedRowKeys = products?.map(p => p.id)
      })
    },
    activeTabHandler (_tabKey) {
      this.activeTabKey = _tabKey
    },
    // Products tab
    fetchTableData () {
      this.modalVisible = true
      this.loadTable = true
      console.log('this.modalVisible', this.modalVisible)
      this.getProducts({ page: this.productsPagination, lang: this.lang, search: false })
        .then(res => {
          this.allProducts = this.insctock
        })
        .catch(err => {
          this.$message.error(this.$t('error'))
          console.error(err)
        })
        .finally(() => (this.loadTable = false))
    },
    handleAddFeaturedProducts () {
      // this.featuredProduct.products = this.insctock.filter(product => {
      //   return this.selectedRowKeys.includes(product.id)
      // })
      this.featuredProduct.products = this.featuredProduct.products
      // this.feature = this.featuredProduct.products.pop()
      console.log('featured', this.rowSelection)
      this.modalVisible = false
      this.getPagination1({ current: 1, total: 380, pageSize: 10 })
    },
    searchFeaturedProducts (val) {
      this.loadTable = true
      this.setSearchQuery(val)
      this.getProducts({
        page: this.current,
        search: val
      }).then(res => {
        this.loadTable = false
      })
      // console.log(val)
    },
    // Products table
    handleTableChange (pagination) {
      this.getProducts({ page: pagination, search: true })
        .then(res => {
          console.log(res)
          const allProductIds = this.allProducts?.map(w => w.id)
          for (let i = 0; i < this.insctock.length; i++) {
            if (!allProductIds.includes(this.insctock[i].id)) {
              this.allProducts.push(this.insctock[i])
            }
          }
          console.log('this.allProducts', this.allProducts)
        })
        .catch(err => {
          this.$message.error(this.$t('error'))
          console.error(err)
        })
    },
    removeFeaturedProduct (item) {
      this.featuredProduct.products = this.featuredProduct.products.filter(product => product !== item)
      console.log('this.featuredProduct.products', this.featuredProduct.products)
    },
    onProductsSelectChange (selectedProducts) {
      this.productsRow = selectedProducts
      //   console.log('this.productsRow', this.productsRow)
      // console.log(this.relatedProductsRow)
    },
    onSelectChange (selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    getFeaturedProductsIds (products) {
      return products?.map(p => p.id).join(',')
    },
    // Submit method
    onSubmit (e) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = '/featured-list'
          var method = 'post'
          if (this.featuredProductSlug) {
            url = `/featured-list/${this.featuredProductSlug}`
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          this.$emit('clickParent', true)
          console.log('this.featuredProduct', this.featuredProduct)
          request({
            url,
            method,
            data: {
              ...this.featuredProduct,
              order: Number(this.featuredProduct.order),
              lang: this.lang || 'ru',
              products: this.getFeaturedProductsIds(this.featuredProduct.products)
            },
            headers
          })
            .then(res => {
              console.log(res)
              if (this.$route.path !== '/catalog/featured-products/list') {
                this.$router.replace('/catalog/featured-products/list')
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error(this.$t('error'))
            })
            .finally(() => {
              this.$emit('clickParent', false)
            })
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    getPagination1 (e) {
      this.$router.push({ path: this.$router.fullPath, query: { page: e.current, limit: 10 } })
      this.getProducts1({ page: e.current, limit: 10 })
      this.pagination.current = e.current
      console.log('e', e)
      this.feature = this.insctock.filter(product => {
        return this.selectedRowKeys.includes(product.id)
      })
    //  this.featuredProduct.products = Array.from(new Set(this.featuredProduct.products.concat(this.feature)))
      this.featuredProduct.products = this.featuredProduct.products.concat(this.feature)
      const ids = this.featuredProduct.products.map(o => o.id)
      this.featuredProduct.products = this.featuredProduct.products.filter(({ id }, index) => !ids.includes(id, index + 1))
      console.log('featured products in pagination', this.featuredProduct.products)
    },
    //  getProducts2 (query) {
    //   request({
    //           url: `/product`,
    //           method: 'get',
    //           params: {
    //             in_stock: true
    //           }
    //       })
    //       .then((res) => {
    //         console.log('res', res)
    //         this.feature = res.products
    //         console.log('feature', this.feature)
    //       })
    //       .catch(err => console.error(err))
    //       .finally(() => (this.loading = false))
    // },
    getProducts1 (query) {
      request({
              url: `/product`,
              method: 'get',
              params: {
                ...query,
                in_stock: true
              }
          })
          .then((res) => {
            console.log('res', res)
            this.insctock = res.products
            const pagination = { ...this.pagination }
            pagination.total = parseInt(res.count)
            this.pagination = pagination
            console.log('true products', this.insctock)
          })
          .catch(err => console.error(err))
          .finally(() => (this.loading = false))
    }
  },
  created (query) {
    console.log('creted')
    this.getProducts1(query)
    // this.getProducts2(query)
  }
}
</script>

<style></style>
