<template>
  <a-card>
    <a-card :bordered="false">
      <div slot="title">
        {{ $t('parishes') }}
      </div>
      <div slot="extra">
        <div slot="extra" style="display: flex; justify-content: right">
          <div style="display: flex; gap: 5%; justify-content: flex-end">
            <a-range-picker
              style="width: 260px"
              :value="date"
              :placeholder="['от даты ', 'до даты']"
              v-model="date"
            >
              <a-icon type="calendar" style="color: #1890FF" slot="suffixIcon"/>
            </a-range-picker>
            <a-button icon="dowlond" style="background-color: #1890FF; color: white; border:none">
              <a-icon :component="$myIcons.excal"></a-icon></a-button>
          </div>
        </div>
      </div>
      <a-table
        style="margin-top: 30px; cursor: pointer"
        bordered
        :rowKey="row => row.id "
        :pagination="pagination"
        :loading="loading"
        @change="tableChangeHandler"
        :dataSource="tableData"
        :columns="columns"
        :customRow="rowClick"
        :scroll="{ x: true }"
      >

        <!-- ----------CUSTOM RENDERS---------- -->

        <template slot="branch" slot-scope="text" >
          <span style="white-space: nowrap">{{ text }}</span>
        </template>

        <template slot="seller" slot-scope="row" >
          <table-user-column :image="row.seller.profile_image" :name="`${row.seller.first_name} ${row.seller.last_name}`" :phone="row.seller.phone_number" :type="row.seller.user_type" />
        </template>

        <template slot="buyer" slot-scope="row" >
          <table-user-column :image="row.buyer.profile_image" :name="`${row.buyer.first_name} ${row.buyer.last_name}`" :phone="row.buyer.phone_number" :type="row.buyer.user_type" />
        </template>

        <template slot="summ" slot-scope="text">
          <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(text) }}</span>
        </template>

        <template slot="status" slot-scope="row">
          <a-tag style="width: 100%" :color="row.items_count === row.scanned_count ? 'blue' : 'red'">{{ row.items_count === row.scanned_count ? 'Сканировано' : `${'Не сканировано'} ${row.items_count}/${row.scanned_count}` }}</a-tag>
        </template>

        <!-- ------------FILTERS--------------- -->

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
            v-model="dataParams.warehouse_id"
          />
        </div>

        <div
          slot="sellerDropdown"
          style="padding: 8px"
        >
          <a-select
            style="width: 200px"
            show-search
            allowClear
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            :placeholder="`Поставщики`"
            :options="sellerList"
            @search="searchSeller"
            v-model="dataParams.counter_agent_id"
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
            v-model="dataParams.cashier_id"
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
            v-model="dataParams.status"
          />
        </div>

      </a-table>
    </a-card>
  </a-card>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import TableUserColumn from '@/components/TableUserColumn/TableUserColumn.vue'

export default {
  components: {
    TableUserColumn
  },
  data: () => ({
    fetching: false,
    date: [moment().startOf('month'), moment().endOf('month')],
    tableData: null,
    branchList: [],
    merchantList: [],
    sellerList: [],
    statusList: [{ value: 'complate', label: 'Сканировано' }, { value: 'incomplete', label: 'Не сканировано' }],
    dataParams: {
      limit: 10,
      number: null,
      warehouse_id: undefined,
      cashier_id: undefined,
      counter_agent_id: undefined,
      status: undefined
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
        title: 'Поставщики',
        scopedSlots: {
          customRender: 'seller',
          filterDropdown: 'sellerDropdown',
          filterIcon: 'filterIcon'
        }
      },
      {
        title: 'Кассир',
        scopedSlots: {
          customRender: 'buyer',
          filterDropdown: 'merchantDropdown',
          filterIcon: 'filterIcon'
        }
      },
      {
        title: 'Кол-во',
        dataIndex: 'items_count',
        key: 'items_count',
        align: 'center',
        width: 100
      },
      {
        title: 'Сумма',
        dataIndex: 'total_amount',
        key: 'total_amount',
        scopedSlots: {
          customRender: 'summ'
        }
      },
      {
        title: 'Статус',
        scopedSlots: {
          customRender: 'status',
          filterDropdown: 'statusDropdown',
          filterIcon: 'filterIcon'
        }
      }
    ]
  }),
  methods: {
    ...mapActions(['getAllParishes', 'getBranchList', 'merchantsSearch']),
    fetchTableData () {
      this.loading = true
      this.getAllParishes({
        ...this.dataParams,
        page: this.pagination.current,
        from_date: this.date[0] ? this.date[0].format('YYYY-MM-DD') : null,
        to_date: this.date[1] ? this.date[1].format('YYYY-MM-DD') : null
      }).then(res => {
        const parties = res.parties

        this.tableData = parties
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
    searchSeller (value) {
      this.merchantsSearch({ search: value, user_type: 'counteragent' })
        .then(res => {
          const merchants = res.users
          this.sellerList = merchants.map(merchant => ({
            label: `${merchant.first_name} ${merchant.last_name}`,
            value: merchant.id
          }))
        })
    },
    rowClick (record) {
     return {
       on: {
         click: (event) => {
       this.$router.push({ name: 'parishesItemListMain', params: { id: record.id } })
         }
       }
     }
    }
  },
  mounted () {
    this.fetchTableData()
    this.searchBranch()
    this.searchMerchant()
    this.searchSeller()
  },
  computed: {
    watchOptions () {
      return `${this.dataParams.number} / ${this.date} / ${this.dataParams.warehouse_id} / ${this.dataParams.cashier_id} / ${this.dataParams.counter_agent_id} / ${this.dataParams.status}`
    }
  },
  watch: {
    watchOptions () {
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
