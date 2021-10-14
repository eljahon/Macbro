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
    <template slot="cashier" slot-scope="row" >
      <table-user-column :image="row.cashier.profile_image" :name="`${row.cashier.first_name} ${row.cashier.last_name}`" :phone="row.cashier.phone_number" :type="row.cashier.user_type" />
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
        type="text"
        style="width: 200px"
        :placeholder="`ИД. заказаssss`"
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
        v-model="dataParams.warehouse_id"
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
        :placeholder="`Кассир`"
        :options="merchantList"
        @search="searchMerchant"
        v-model="dataParams.merchant_id"
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
      limit: 10,
      number: null,
      warehouse_id: undefined,
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
        title: 'Кассир',
        scopedSlots: {
          customRender: 'cashier',
          filterDropdown: 'merchantDropdown',
          filterIcon: 'filterIcon'
        }
      },
      {
        title: 'Комментария',
        dataIndex: 'comment',
        key: 'comment'
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
    ...mapActions(['getBookmarkList', 'getBranchList', 'merchantsSearch']),
    fetchTableData () {
      this.loading = true
      this.getBookmarkList({
        ...this.dataParams,
        page: this.pagination.current,
        from_date: this.date[0] ? this.date[0].format('YYYY-MM-DD') : null,
        to_date: this.date[1] ? this.date[1].format('YYYY-MM-DD') : null
      }).then(res => {
        const orders = res.orders
        this.tableData = orders
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
    searchMerchant (value) {
      this.merchantsSearch({ search: value, user_type: 'cashier' })
        .then(res => {
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
            this.$router.push({ name: 'SaleItemListMain', params: { id: record.id }, query: { id: 2 } })
          }
        }
      }
    }
  },
  mounted () {
    this.fetchTableData()
    this.searchBranch()
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
    'dataParams.warehouse_id' () {
      this.pagination.current = 1
      this.fetchTableData()
    },
    'dataParams.merchant_id' () {
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
