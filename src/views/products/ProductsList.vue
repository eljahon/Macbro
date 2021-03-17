<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('products') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link to="./create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-products">{{ $t('add') }}</a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-card :title="$t('list')">
      <div slot="extra">
        <a-form layout="horizontal" :form="form" @submit="search">
          <a-row>
            <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-input
                  id="inputSearch"
                  :placeholder="$t('search') + '...'"
                  v-decorator="['search', { initialValue: this.getSearchQuery }]"
                  v-debounce="debouncedSearch"
                  test-attr="search-products"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-button id="buttonSearch" type="default" html-type="submit" icon="search" test-attr="search-btn-products">{{ $t('search') }}</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="productsData"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-products"
      >
        <template slot="tag" slot-scope="id">
          <a-tag color="red">{{ id }}</a-tag>
        </template>
        <template slot="status" slot-scope="is_active">
          <status-tag
            :active="is_active"
            default-val
          />
        </template>
        <template slot="action" slot-scope="text, row">
          <preview-btn @click="showPreviewModal(row.id)" test-attr="preview-products"/>
          <router-link :to="{path: `./update/${row.slug}`, pagination: getPagination}" >
              <edit-btn test-attr="edit-products"/>
          </router-link>
          <delete-btn @confirm="deleteProduct($event, row.slug)" test-attr="delete-products"/>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model="previewVisible"
      width="800px"
      v-if="selectedProduct"
      :title="$t('previewProduct')"
      @cancel="handleCloseModal"
    >
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('name')">
          {{ selectedProduct.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('brand_name')">
          {{ selectedProduct.brand.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('category_name')">
          {{ selectedProduct.category.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('product_external_id')">
          {{ selectedProduct.external_id }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('price')">
          <p>Current Price: {{ this.numberToPrice(selectedProduct.price.price) }}</p>
          <p>Old Price: {{ this.numberToPrice(selectedProduct.price.old_price) }}</p>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('status')">
          <status-tag
            :active="selectedProduct.active"
            default-val
          />
        </a-descriptions-item>
        <a-descriptions-item :label="$t('productPicture')">
          <img v-if="selectedProduct.image" style="max-height: 800px; max-width: 100%" :src="selectedProduct.image"/>
          <div v-else>
            {{ $t('noImage') }}
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel" test-attr="cancel-prev-products">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
import { numberToPrice } from '@/utils/util'
function getSelected (products, selectedProduct) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === selectedProduct) {
      return products[i]
    }
  }
}
function getCategoryName (categories, id) {
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].id === id) {
      return categories[i].name
    }
  }
}
export default {
  data () {
    return {
      data: [],
      loading: true,
      columns: [
        {
          title: this.$t('product_name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('product_external_id'),
          key: 'tag',
          dataIndex: 'external_id',
          scopedSlots: { customRender: 'tag' },
          width: '10%'
        },
        {
          title: this.$t('brand'),
          dataIndex: 'brand.name'
        },
        {
          title: this.$t('category_name'),
          dataIndex: 'category.name'
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
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      products: [],
      selectedProduct: null,
      productsPaginationCurrent: {},
      selectedProductCategory: '',
      updateVisible: false,
      filterParams: {},
      page: { current: 1, pageSize: 10, total: 45 },
      Interval: null
    }
  },
  computed: {
    ...mapGetters(['productsData', 'productsPagination', 'categories', 'categoriesWithChildren', 'searchQuery']),
    getPagination () {
      return this.productsPagination
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.getCategories()
    this.getProducts({ page: this.productsPagination })
      .then(() => console.log('this.productsData', this.productsData))
      .catch(err => {
        this.$message.error(this.$t('error'))
        console.error(err)
      })
      .finally(() => (this.loading = false))
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getProducts', 'getCategories', 'setSearchQuery']),
    handleTableChange (pagination) {
      console.log(pagination)
      this.loading = true
      this.getProducts({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.$message.error(err))
        .finally(() => (this.loading = false))
        },
    getSelectedProduct (selectedProduct) {
      this.selectedProduct = getSelected(this.productsData, selectedProduct)
      this.selectedProductCategory = getCategoryName(this.categoriesWithChildren, this.selectedProduct.category_id)
    },
    showPreviewModal (productId) {
      this.getSelectedProduct(productId)
      this.previewVisible = true
      console.log('selected', this.selectedProduct)
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedProduct = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getProducts()
        .then((res) => console.log(res))
        .catch(err => this.$message.error(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteProduct (e, slug) {
      console.log('slug', slug)
      this.loading = true
      request({
        url: '/product/' + slug,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getProducts({ page: this.productsPagination })
          .then(() => {
            this.products = []
            if ((this.productsPaginationCurrent.total - (this.productsPaginationCurrent.current * 10) > 0)) {
              for (let i = 0; i < 10; i++) {
                this.products.push(this.productsData[(i + ((this.productsPaginationCurrent.current - 1) * 10))])
              }
              this.productsthis.productsPaginationCurrentCurrent = this.productsPaginationCurrent
            } else {
            var size = this.productsPaginationCurrent.total - ((this.productsPaginationCurrent.current - 1) * 10)
            console.log(size)
            for (let i = 0; i < size; i++) {
              this.products.push(this.productsData[(i + ((this.productsPaginationCurrent.current - 1) * 10))])
            }
            this.productsPaginationCurrent = this.productsPagination
          }
        })
        this.handleTableChange(this.productsPaginationCurrent)
      })
      .catch(err => {
        this.$message.error(err)
      })
      .finally(() => (this.loading = false))
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.filterParams = values
          this.getProducts()
            .then(res => { console.log('res', res) })
            .catch(err => { console.error(err) })
            .finally(() => { this.loading = false })
        }
      })
    },
    numberToPrice (num) {
      return numberToPrice(num)
    }
  }
}
</script>
