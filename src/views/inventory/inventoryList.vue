<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('inventory') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link to="././create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus">{{ $t('add') }}</a-button>
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
                />
              </a-form-item>
            </a-col>
            <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-button id="buttonSearch" type="default" html-type="submit" icon="search">{{ $t('search') }}</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getInventoryList"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, row">
          <preview-btn @click="showPreviewModal(row.id)"/>
          <router-link :to="`./update/${row.id}`" >
            <edit-btn/>
          </router-link>
          <!-- <delete-btn @confirm="deleteItem($event, row.slug)"/> -->
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedInventory"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
      <a-descriptions layout="horizontal" bordered>
        <a-descriptions-item :span="3" :label="$t('branchName')">
          {{ selectedInventory.branch_name }}
        </a-descriptions-item>
        <a-descriptions-item :span="3" :label="$t('product_name')">
          <div v-html="selectedInventory.product_name"></div>
        </a-descriptions-item>
        <a-descriptions-item :span="3" :label="$t('buy_price')">
          {{ $numberToPrice(selectedInventory.buy_price) }}
        </a-descriptions-item>
        <a-descriptions-item :span="4" :label="$t('sell_price')">
          {{ $numberToPrice(selectedInventory.sell_price) }}
        </a-descriptions-item>
        <a-descriptions-item :span="5" :label="$t('comment')">
          {{ selectedInventory.comment }}
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
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
      loading: true,
       columns: [
        {
          title: this.$t('branchName'),
          dataIndex: 'branch_name'
        },
        {
          title: this.$t('product_name'),
          dataIndex: 'product_name'
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
      selectedInventory: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['inventoryData', 'inventoryPagination', 'searchQuery']),
    getPagination () {
      return this.inventoryPagination
    },
    getInventoryList () {
      return this.inventoryData
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.getInventory({ page: this.inventoryPagination })
      .then((res) => console.log('res', res))
      .catch(err => {
        this.$message.error(this.$t('error'))
        console.error(err)
      })
      .finally(() => (this.loading = false))
  },
  beforeDestroy () {
    this.setSearchQuery()
  },
  methods: {
    ...mapActions(['getInventory', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getInventory({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    showPreviewModal (slug) {
      this.getSelectedInventory(slug)
      this.previewVisible = true
    },
    getSelectedInventory (selectedInventory) {
      request({
        url: `/inventory-item/${selectedInventory}`,
        method: 'get'
      }).then((response) => {
        console.log('Selected inventory', response)
        this.selectedInventory = response
      })
    },
    handleCancel () {
      this.selectedInventory = null
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedInventory = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getInventory()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteItem (e, slug) {
      this.loading = true
      request({
        url: `/inventory-item/${slug}`,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getInventory({ page: this.inventoryPagination })
      })
      .catch(err => {
        this.$message.error(this.$t('error'))
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
          this.getInventory()
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
img.news-preview-image {
    display: block !important;
    max-width: 600px !important;
    width: auto !important;
    height: auto !important;
}
</style>
