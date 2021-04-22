<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px">
        <a-breadcrumb-item>{{ $t('product_variants') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :title="$t('product_variants')" class="breadcrumb-row" :bordered="false">
      <router-link to="./create" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="add-product-vars">{{ $t('add') }}</a-button>
      </router-link>
    </a-card>

    <a-card class="breadcrumb-row" :bordered="false">
      <a-row type="flex" align="middle">
        <a-col :span="12">
          <span>{{ $t('list') }}</span>
        </a-col>
        <a-col :span="12">
          <a-form layout="horizontal" :form="form" @submit="search" style="float: right">
            <a-row type="flex">
              <a-col span="auto">
                <a-form-item style="margin: 0">
                  <a-input
                    id="inputSearch"
                    :placeholder="$t('search') + '...'"
                    v-decorator="['search', { initialValue: this.getSearchQuery }]"
                    v-debounce="debouncedSearch"
                    test-attr="search-product-vars"
                  />
                </a-form-item>
              </a-col>
              <a-col span="auto" style="padding-left: 5px">
                <a-form-item style="margin: 0">
                  <a-button id="buttonSearch" type="default" html-type="submit" icon="search" test-attr="search-btn-product-vars">{{ $t('search') }}</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
    </a-card>

    <a-card :bordered="false">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="productVariantsData"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-product-vars"
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
          <preview-btn @click="showPreviewModal(row.id)" :test-attr="`preview-product-vars${index}`"/>
          <router-link :to="{path: `./update/${row.slug}`, pagination: getPagination}" >
            <edit-btn :test-attr="`edit-product-vars${index}`"/>
          </router-link>
          <delete-btn @confirm="deleteProductVariant($event, row.slug)" :test-attr="`delete-product-vars${index}`"/>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model="previewVisible"
      width="800px"
      v-if="selectedProductVariant"
      :title="$t('previewProduct')"
      @cancel="handleCloseModal"
    >
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('name')">
          {{ selectedProductVariant.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('brand_name')">
          {{ selectedProductVariant.brand.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('category_name')">
          {{ selectedProductVariant.category.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('product_external_id')">
          {{ selectedProductVariant.external_id }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('price')">
          <p>Current Price: {{ this.numberToPrice(selectedProductVariant.price.price) }}</p>
          <p>Old Price: {{ this.numberToPrice(selectedProductVariant.price.old_price) }}</p>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('status')">
          <status-tag
            :active="selectedProductVariant.active"
            default-val
          />
        </a-descriptions-item>
        <a-descriptions-item :label="$t('productPicture')">
          <img v-if="selectedProductVariant.image" style="max-height: 800px; max-width: 100%" :src="selectedProductVariant.image"/>
          <div v-else>
            {{ $t('noImage') }}
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel" test-attr="cancel-prev-product-vars">
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
function getSelected (productVariants, selectedProductVariant) {
  for (let i = 0; i < productVariants.length; i++) {
    if (productVariants[i].id === selectedProductVariant) {
      return productVariants[i]
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
          title: this.$t('name'),
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
      productVariants: [],
      selectedProductVariant: null,
      productVariantsPaginationCurrent: {},
      selectedProductVariantCategory: '',
      updateVisible: false,
      filterParams: {},
      page: { current: 1, pageSize: 10, total: 45 },
      Interval: null
    }
  },
  computed: {
    ...mapGetters(['productVariantsData', 'productVariantsPagination', 'categories', 'categoriesWithChildren', 'searchQueryProductVar']),
    getPagination () {
      return this.productVariantsPagination
    },
    getSearchQuery () {
      return this.searchQueryProductVar
    }
  },
  mounted () {
    this.getCategories()
    this.getProductVariants({ page: this.productVariantsPagination, search: true })
      .then(() => console.log('this.productVariantsData', this.productVariantsData))
      .catch(err => {
        this.$message.error(this.$t('error'))
        console.error(err)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getProductVariants', 'getCategories', 'setSearchQueryProductVar']),
    handleTableChange (pagination) {
      console.log(pagination)
      this.loading = true
      this.getProductVariants({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.$message.error(err))
        .finally(() => (this.loading = false))
        },
    getSelectedProductVariant (selectedProductVariant) {
      this.selectedProductVariant = getSelected(this.productVariantsData, selectedProductVariant)
      this.selectedProductVariantCategory = getCategoryName(this.categoriesWithChildren, this.selectedProductVariant.category_id)
    },
    showPreviewModal (productVariantId) {
      this.getSelectedProductVariant(productVariantId)
      this.previewVisible = true
      console.log('selected', this.selectedProductVariant)
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedProductVariant = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQueryProductVar(searchQuery)
      this.loading = true
      this.getProductVariants()
        .then((res) => console.log(res))
        .catch(err => this.$message.error(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteProductVariant (e, slug) {
      console.log('slug', slug)
      this.loading = true
      request({
        url: '/product-variant/' + slug,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getProductVariants({ page: this.productVariantsPagination })
          .then(() => {
            this.productVariants = []
            if ((this.productVariantsPaginationCurrent.total - (this.productVariantsPaginationCurrent.current * 10) > 0)) {
              for (let i = 0; i < 10; i++) {
                this.productVariants.push(this.productVariantsData[(i + ((this.productVariantsPaginationCurrent.current - 1) * 10))])
              }
              this.productVariantsthis.productVariantsPaginationCurrentCurrent = this.productVariantsPaginationCurrent
            } else {
            var size = this.productVariantsPaginationCurrent.total - ((this.productVariantsPaginationCurrent.current - 1) * 10)
            console.log(size)
            for (let i = 0; i < size; i++) {
              this.productVariants.push(this.productVariantsData[(i + ((this.productVariantsPaginationCurrent.current - 1) * 10))])
            }
            this.productVariantsPaginationCurrent = this.productVariantsPagination
          }
        })
        this.handleTableChange(this.productVariantsPaginationCurrent)
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
          this.getProductVariants()
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
