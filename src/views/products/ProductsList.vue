<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('products') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          :value="getSearchQuery"
          v-decorator="['search', { initialValue: getSearchQuery }]"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>
    <a-card :title="$t('products')" class="breadcrumb-row" :bordered="false">
      <router-link slot="extra" to="./create">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-products">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card :bordered="false" style="flex: 1">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="productsData"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-products"
        bordered
        :customRow="customRowClick"
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
        <template slot="action" slot-scope="text, row, index">
          <div style="display: flex; justify-content: space-around;">
          <!-- <preview-btn @click="showPreviewModal(row.id)" :test-attr="`preview-products${index}`"/> -->
            <router-link :to="{path: `./update/${row.slug}`, pagination: getPagination}" >
                <edit-btn :test-attr="`edit-products${index}`"/>
            </router-link>
            <delete-btn @confirm="deleteProduct($event, row.slug)" :test-attr="`delete-products${index}`"/>
          </div>
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
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: '120px',
        //   scopedSlots: { customRender: 'action' }
        // }
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
    ...mapGetters(['productsData', 'productsPagination', 'categories', 'categoriesWithChildren', 'searchQueryProduct']),
    getPagination () {
      return this.productsPagination
    },
    getSearchQuery () {
      return this.searchQueryProduct
    }
  },
  mounted () {
    this.getCategories()
    this.getProducts({ page: this.productsPagination, search: true })
      .then(() => console.log('this.productsData', this.productsData))
      .catch(err => {
        this.$message.error(this.$t('error'))
        console.error(err)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getProducts', 'getCategories', 'setSearchQueryProduct']),
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            console.log('ID', record.id)
            this.$router.push(`/catalog/products/update/${record.slug}`)
          }
        }
      }
    },
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
      this.setSearchQueryProduct(searchQuery)
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
