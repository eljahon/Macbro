<template>
  <a-table
    style="margin-top: 30px; cursor: pointer"
    bordered
    :pagination="pagination"
    :loading="loading"
    @change="tableChangeHandler"
    :dataSource="tableData"
    :columns="columns"
    :customRow="rowClick"
    :scroll="{ x: true }"
  >
    <!-- ---------CUSTOM RENDERS---------- -->

    <template slot="branch" slot-scope="text" >
      <span style="white-space: nowrap">{{ text }}</span>
    </template>
    <template slot="customer" slot-scope="row" >
      <table-user-column :image="row.customer.image" :name="`${row.customer.firstname} ${row.customer.lastname}`" :phone="row.customer.phone_number" :type="row.customer.user_type" />
    </template>
    <template slot="merchant" slot-scope="row">
      <table-user-column v-if="row.merchant.id.length" :image="row.merchant.image" :name="`${row.merchant.firstname} ${row.merchant.lastname}`" :phone="row.merchant.phone_number" :type="row.merchant.user_type" />
      <table-user-column v-else :image="row.initiator.image" :name="`${row.initiator.firstname} ${row.initiator.lastname}`" :phone="row.initiator.phone_number" :type="row.initiator.user_type" />
    </template>
    <template slot="status" slot-scope="text, row">
      <a-tag v-if="row.status === 'sold'" color="blue">Продано</a-tag>
      <a-tag v-else :color="'rgba(0, 0, 0, 0.1)'"><span style="color: black">Бронировано</span></a-tag>
    </template>
    <template slot="summ" slot-scope="text">
      <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(text) }}</span>
    </template>

    <!-- ---------FILTERS---------- -->

    <a-icon
      slot="filterIcon"
      class="filter-dropdown-icon"
      :component="$myIcons.filterDownIcon"
    />

    <div
      slot="numberDropdown"
      style="padding: 8px"
    >
      <a-input
        style="width: 200px"
        :placeholder="`ИД. заказа`"
        v-model="dataParams.number"
      />
    </div>

    <div
      slot="branchDropdown"
      style="padding: 8px"
    >
      <a-select
        style="width: 200px"
        show-search
        allowClear
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :placeholder="`Филиал`"
        :options="branchList"
        @search="searchBranch"
        v-model="dataParams.receiver_warehouse_id"
      />
    </div>

    <div
      slot="customerDropdown"
      style="padding: 8px"
    >
      <a-select
        style="width: 200px"
        show-search
        allowClear
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :placeholder="`Покупатель`"
        :options="customerList"
        @search="searchCustomer"
        v-model="dataParams.customer_id"
      />
    </div>

    <div
      slot="merchantDropdown"
      style="padding: 8px"
    >
      <a-select
        style="width: 200px"
        show-search
        allowClear
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :placeholder="`Продавец`"
        :options="merchantList"
        @search="searchMerchant"
        v-model="dataParams.merchant_id"
      />
    </div>

    <div
      slot="statusDropdown"
      style="padding: 8px"
    >
      <a-select
        style="width: 200px"
        allowClear
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :placeholder="`Статус`"
        :options="statusList"
        v-model="dataParams.statuses"
      />
    </div>

  </a-table>
</template>

<script>
import { mapActions } from 'vuex'
import TableUserColumn from '@/components/TableUserColumn/TableUserColumn.vue'

export default {
  components: {
    TableUserColumn
  },
  props: ['date'],
  data: () => ({
    tableData: null,
    branchList: [],
    customerList: [],
    merchantList: [],
    statusList: [{ value: 'booked', label: 'booked' }, { value: 'sold', label: 'sold' }],
    dataParams: {
      type: 'order',
      statuses: undefined,
      limit: 10,
      number: null,
      receiver_warehouse_id: undefined,
      customer_id: undefined,
      merchant_id: undefined
    },
    loading: false,
    pagination: {
      current: 1,
      total: 1,
      pageSize: 10
    },
    columns: [
      {
        title: 'ИД заказа',
        dataIndex: 'number',
        key: 'number',
        width: 150,
        scopedSlots: {
          filterDropdown: 'numberDropdown',
          filterIcon: 'filterIcon'
        }
      },
      {
        title: 'Филиал',
        dataIndex: 'branch_name',
        key: 'branch_name',
        scopedSlots: {
          customRender: 'branch',
          filterDropdown: 'branchDropdown',
          filterIcon: 'filterIcon'
        }
      },
      {
        title: 'Покупатель',
        scopedSlots: {
          customRender: 'customer',
          filterDropdown: 'customerDropdown',
          filterIcon: 'filterIcon'
        }
      },
      {
        title: 'Продавец',
        scopedSlots: {
          customRender: 'merchant',
          filterDropdown: 'merchantDropdown',
          filterIcon: 'filterIcon'
        }
      },
      {
        title: 'Статус',
        scopedSlots: {
          customRender: 'status',
          filterDropdown: 'statusDropdown',
          filterIcon: 'filterIcon'
        }
      },
      {
        title: 'Кол-во',
        dataIndex: 'items_count',
        key: 'items_count',
        width: 100,
        align: 'center'
      },
      {
        title: 'Сумма',
        dataIndex: 'total_amount',
        key: 'total_amount',
        scopedSlots: {
          customRender: 'summ'
        }
      }
    ]
  }),
  methods: {
    ...mapActions(['OflineTabList', 'getBranchList', 'customersSearch', 'merchantsSearch']),
    fetchTableData () {
      this.loading = true
      this.OflineTabList({
        ...this.dataParams,
        page: this.pagination.current,
        from_date: this.date[0] ? this.date[0].format('YYYY-MM-DD') : null,
        to_date: this.date[1] ? this.date[1].format('YYYY-MM-DD') : null,
        statuses: this.dataParams.statuses ?? 'booked,sold'
      }).then(res => {
        const orders = res.orders
        const computedOrders = orders.map(order => {
          let summ = 0
          order.items.forEach(el => { summ += el.count })
          return {
            ...order,
            items_count: summ
          }
        })

        this.tableData = computedOrders
        this.pagination.total = res.count
      }).finally(() => { this.loading = false })
    },
    tableChangeHandler (pagination) {
      this.pagination = pagination
      this.fetchTableData()
    },
    searchBranch (value) {
      this.getBranchList({ name: value }).then(res => {
        const branches = res.branches
        this.branchList = branches.map(branch => ({
          label: branch.name,
          value: branch.warehouse_id
        }))
      })
    },
    searchCustomer (value) {
      this.customersSearch(value).then(res => {
        const customers = res.clients
        this.customerList = customers.map(customer => ({
          label: `${customer.first_name} ${customer.last_name}`,
          value: customer.id
        }))
      })
    },
    searchMerchant (value) {
      this.merchantsSearch({ search: value }).then(res => {
        const merchants = res.users
        this.merchantList = merchants.map(merchant => ({
          label: `${merchant.first_name} ${merchant.last_name}`,
          value: merchant.id
        }))
      })
    },
    rowClick (record) {
      return {
        on: {
          click: (e) => {
            this.$router.push({ name: 'SaleItemListMain', params: { id: record.id }, query: { id: 1 } })
          }
        }
      }
    }
  },
  mounted () {
    this.fetchTableData()
    this.searchBranch()
    this.searchCustomer()
    this.searchMerchant()
  },
  watch: {
    date () {
      this.pagination.current = 1
      this.fetchTableData()
    },
    'dataParams.number' () {
      this.pagination.current = 1
      this.fetchTableData()
    },
    'dataParams.receiver_warehouse_id' () {
      this.pagination.current = 1
      this.fetchTableData()
    },
    'dataParams.customer_id' () {
      this.pagination.current = 1
      this.fetchTableData()
    },
    'dataParams.merchant_id' () {
      this.pagination.current = 1
      this.fetchTableData()
    },
    'dataParams.statuses' () {
      this.pagination.current = 1
      this.fetchTableData()
    }
  }
}
</script>

<style scoped>
  .filter-dropdown-icon {
    font-size: 20px !important;;
    color: transparent !important;
    background-color: transparent !important;
    margin-right: 10px !important;
    transform: translateY(-3px) !important;;
  }
</style>
