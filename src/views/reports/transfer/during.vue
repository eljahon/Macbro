<template>
  <a-table
    style="margin-top: 30px"
    :columns="columns"
    :rowKey="() => Math.random()"
    :dataSource="getUserListTable"
    :pagination="getPagination"
    :loading="loading"
    @change="handleTableChangeTabOne"
    test-attr="list-customer"
    :customRow="customRowClick"
    bordered
  >
    <div
      slot="branchDropdown"
      style="padding: 8px"
    >
      <a-select
        style="width: 200px"
        show-search
        allowClear
        @change="searchBranchId"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :placeholder="`Филиал`"
        :options="branchList"
        @search="searchBranch"
        v-model="params.receiver_warehouse_id"
      />
    </div>
    <div
      slot="senderDropdown"
      style="padding: 8px"
    >
      <a-select
        style="width: 200px"
        show-search
        allowClear
        @change="searchSenderId"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :placeholder="`Филиал`"
        :options="branchList"
        @search="searchBranch"
        v-model="params.sender_warehouse_id"
      />
    </div>
    <div
      slot="партии"
      style="padding: 8px"
    >
      <a-input-number
        :placeholder="`ID партии`"
        v-debounce="IdSearch"
        style="width: 188px; margin-bottom: 8px; display: block;"
      />
    </div>
    <a-icon
      style="font-size: 20px; color: transparent; background-color: transparent"
      slot="filterIcon"
      class="filter-dropdown-icon"
      :component="$myIcons.filterDownIcon"
    />
    <template slot="Время" slot-scope="text, row">
      <span>{{ moment(row.create_at).format('hh:mm DD-MM-YYYY') }}</span>
    </template>
  </a-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      branchList: [],
      page: { current: 1, pageSize: 10, total: null },
      params: {
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        statuses: 'in-process',
        // from_date: moment().startOf('month').format('YYYY-MM-DD'),
        // to_date: moment().endOf('month').format('YYYY-MM-DD'),
        receiver_warehouse_id: '',
        sender_warehouse_id: '',
        type: 'relocation',
        page: 1,
        limit: 10,
         number: ''
      },

      loading: false,
      columns: [
        {
          title: this.$t('ID партии'),
          dataIndex: 'number',
          scopedSlots: {
            filterDropdown: 'партии',
            filterIcon: 'filterIcon',
            customRender: 'number'
          }
        },
        {
          title: this.$t('Отправитель'),
          dataIndex: 'sending_warehouse.name',
          scopedSlots: {
            customRender: 'accepting_warehouse',
            filterDropdown: 'senderDropdown',
            filterIcon: 'filterIcon' }
        },
        {
          title: this.$t('Получатель'),
          dataIndex: 'accepting_warehouse.name',
          scopedSlots: {
            filterDropdown: 'branchDropdown',
            filterIcon: 'filterIcon',
            customRender: 'Получатель' }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Время отправки'),
          key: 'action',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Время'
          }
        }
        // {
        //   title: this.$t('Опоздал(а) на х минут'),
        //   key: 'werree',
        //   scopedSlots: {
        //     filterDropdown: 'аккаунта',
        //     filterIcon: 'filterIcon',
        //     customRender: 'Опоздал'
        //   },
        //   align: 'center'
        // }
      ]
    }
  },
  methods: {
    ...mapActions(['TransferGetAll', 'getBranchList']),
    moment,
    TransferGetListAll () {
      this.loading = true
      this.TransferGetAll(this.params)
        .finally(() => {
          this.loading = false
        })
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
    searchSenderId (val) {
      console.log('=====', val)
      this.params.sender_warehouse_id = val
      this.TransferGetListAll()
    },
    handleTableChangeTabOne (pagination) {},
    searchBranchId (val) {
      console.log('=====', val)
      this.params.receiver_warehouse_id = val
      this.TransferGetListAll()
    },
    customRowClick (record) {
      console.log('record ===>>', record.user)
      return {
        on: {
          click: (event) => {
            // console.log(record)
            this.$router.push({ name: 'TransferItemListMain',
              params: { id: record.id }
            })
          }
        }
      }
    },
    IdSearch (val) {
      this.params.number = val
      this.TransferGetListAll()
    },
    SearchData (data) {
      this.params.from_date = data.from_date
      this.params.to_date = data.to_date
      this.TransferGetListAll()
    }

  },
  computed: {
    ...mapGetters(['tronferPagination', 'trnseferList']),
    getPagination () {
      return this.tronferPagination
    },
    getUserListTable () {
      return this.trnseferList
    }

  },
  created () {
    this.TransferGetListAll()
    this.searchBranch()
  }
}
</script>

<style scoped>

</style>
