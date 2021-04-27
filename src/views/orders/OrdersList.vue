<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('orders') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra" style="float: right">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          v-decorator="['search', { initialValue: getSearchQuery }]"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('orders')" class="breadcrumb-row" :bordered="false">
    </a-card>

    <a-card :bordered="false">

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllOrders"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        showPagination="auto"
        test-attr="list-order"
        bordered
      >
        <span style="color: #1890FF" slot="tag" slot-scope="tag">
          {{ tag }}
        </span>
        <!-- <template slot="tag" slot-scope="tag">
          <a-tag color="red">{{ tag }}</a-tag>
        </template> -->
        <template slot="status" slot-scope="text, row">
          <status-tag
            :color="statusColor[row.status]"
            :text="statusTranslator(row.status)"
          />
        </template>
        <template slot="action" slot-scope="text, row, index">
          <router-link :to="`/order/details/${row.number}`">
            <preview-btn :test-attr="`preview-order${index}`"/>
          </router-link>
          <router-link :to="`/order/edit/${row.number}`" :test-attr="`edit-order${index}`">
            <edit-btn/>
          </router-link>
        </template>
        <template slot="total" slot-scope="text, row">
          <div>{{ numberToPrice(calcTotalPrice(row.items)) }} </div>
        </template>
      </a-table>
      <!-- <a-pagination show-quick-jumper :default-current="getPagination.current" :total="getPagination.total" @change="handleTableChange" /> -->
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedOrder"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
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
import calcTotalPrice from '@/utils/calcTotalPrice'
import numberToPrice from '@/utils/numberToPrice'
export default {
  data () {
    return {
      value: '',
      excelFile: null,
      data: [],
      loading: true,
       columns: [
        {
          title: this.$t('order_number'),
          key: 'tag',
          dataIndex: 'number',
          scopedSlots: { customRender: 'tag' },
          width: '10%'
        },
        {
          title: this.$t('customer_name'),
          dataIndex: 'customer_name'
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone'
        },
        {
          title: this.$t('date'),
          dataIndex: 'created_at',
          width: '20%'
        },
        {
          title: this.$t('total'),
          key: 'total',
          width: '20%',
          scopedSlots: { customRender: 'total' }
        },
        {
          title: this.$t('status'),
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '10%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedOrder: null,
      filterParams: {},
      orderStatus: {
          'in-process': 'В обработке',
          'finished': 'Завершено',
          'cancelled': 'Отменен',
          'payment': 'Оплачено',
          'order_accepted': 'Заказ принят'
      },
      statusColor: {
          'in-process': 'blue',
          'finished': 'green',
          'cancelled': 'red',
          'payment': 'orange',
          'order_accepted': 'purple'
      }
    }
  },
  computed: {
    ...mapGetters(['ordersData', 'ordersPagination', 'searchQuery']),
    getPagination () {
      return this.ordersPagination
    },
    getAllOrders () {
      return this.ordersData
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    // this.exportExcel()
    this.setSearchQuery('')
    console.log('this.ordersPagination', this.ordersPagination)
    this.getOrders({ page: this.ordersPagination })
      .then((res) => console.log('res', res))
      .catch((err) => console.error(err))
      .finally(() => (this.loading = false))
  },
  beforeDestroy () {
    this.setSearchQuery('')
  },
  methods: {
    ...mapActions(['getOrders', 'setSearchQuery']),
    handleTableChange (pagination) {
      console.log('Pagination', pagination)
      this.loading = true
      this.getOrders({ page: pagination, search: true })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    calcTotalPrice (arrOfItems) {
      return calcTotalPrice(arrOfItems)
    },
     numberToPrice (number) {
      return numberToPrice(number)
    },
    exportExcel () {
      request({
        url: '/order-report-excel',
        method: 'GET'
      }).then(res => {
        this.excelFile = res.filename
        console.log(res)
      })
      .catch(err => {
        this.$message.error('Системная ошибка' + ' ' + err.message)
      })
    },
    // showPreviewModal (orderNumber) {
    //   this.previewVisible = true
    //   this.getSelectedOrder(orderNumber)
    // },
    getSelectedOrder (selectedOrderNumber) {
      request({
        url: `/order/${selectedOrderNumber}`,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedOrder = response
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedOrder = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getOrders()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteOrder (e, slug) {
      this.loading = true
      request({
        url: `/order/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getOrders({ page: this.ordersPagination })
      })
      .catch(err => {
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => (this.loading = false))
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        this.loading = true
        if (!err) {
          this.filterParams = values
          this.getOrders()
            .then(res => console.log('res', res))
            .catch(err => console.error('err', err))
            .finally(() => (this.loading = false))
        }
      })
    },
    statusTranslator (status) {
      return this.orderStatus[status]
    }
  }
}
</script>
<style>
img.order-preview-image {
    display: block !important;
    margin: 0 auto !important;
    max-width: 600px !important;
    width: auto !important;
    height: auto !important;
}
</style>
