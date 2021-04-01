<template>
  <div>
    <a-card :title="$t('warehouse')" class="breadcrumb-row" :bordered="false">
      <!-- <router-link :to="{ path: `${$route.path}/items/create` }" slot="extra">
        <a-button style="float: right" shape="round" type="primary link" icon="plus" test-attr="search-warehouse">{{
          $t('add')
        }}</a-button>
      </router-link> -->
    </a-card>

    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getInventoryItemsList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-inventoryitems"
      >
        <template slot="action" slot-scope="text, row, index">
          <router-link :to="`/warehouse/update/${$route.params.id}/items/update/${row.id}`">
            <edit-btn :test-attr="`edit-warehouse${index}`" />
          </router-link>
          <delete-btn @confirm="deleteCompany($event, row.id)" :test-attr="`delete-branch${index}`" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'

export default {
  data () {
    return {
      value: '',
      data: [],
      warehouseId: this.$route.params.id,
      loading: true,
      columns: [
        {
          title: this.$t('products'),
          dataIndex: 'product_name'
        },
        {
          title: this.$t('imeiCode'),
          dataIndex: 'code'
        },
        {
          title: this.$t('productState'),
          dataIndex: 'product_state'
        },
        {
          title: this.$t('sellPrice'),
          dataIndex: 'sell_price'
        },
        {
          title: this.$t('buyPrice'),
          dataIndex: 'buy_price'
        },
        {
          title: this.$t('action'),
          key: 'product_slug',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedCompany: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['inventoryItemsList', 'inventoryItemsPagination', 'searchQuery']),
    getPagination () {
      return this.inventoryItemsPagination
    },
    getInventoryItemsList () {
      return this.inventoryItemsList
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.setSearchQuery()
    this.getInventoryItems({ page: this.inventoryItemsPagination, warehouse_id: this.$route.params.id })
      .then(() => console.log('companybranches'))
      .catch(error => {
        this.requestFailed(error)
        console.error(error)
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getInventoryItems', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getInventoryItems({ page: pagination, search: true, warehouse_id: this.$route.params.id })
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true

      this.getInventoryItems({ warehouse_id: this.$route.params.id })
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    deleteCompany (e, slug) {
      this.loading = true
      request({
        url: `/inventory-item/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getInventoryItems({ page: this.inventoryItemsPagination, search: true, warehouse_id: this.$route.params.id })
      })
      .catch(err => {
        this.$message.error(err)
        console.error(err)
      })
      .finally(() => (this.loading = false))
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        this.loading = true
        if (!err) {
          this.filterParams = values
          this.getInventoryItems({ warehouse_id: this.$route.params.id })
            .then(res => console.log('res', res))
            .catch(err => console.error('err', err))
            .finally(() => (this.loading = false))
        }
      })
    }
  }
}
</script>
<style>
img.shops-image {
  display: block !important;
  margin: 0 auto !important;
  max-width: 600px !important;
  width: auto !important;
  height: auto !important;
}
</style>
