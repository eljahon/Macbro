<template>
  <a-table
    style="margin-top: 30px"
    :columns="columnsThee"
    :rowKey="() => Math.random()"
    :dataSource="getComplited"
    :pagination="getPaginationComplited"
    :loading="loading"
    @change="handleTableChangeTabThee"
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
      slot="аккаунта"
      style="padding: 8px"
    >
      <a-input-number
        :placeholder="`ИД. аккаунта`"
        v-debounce="PartiyaIdSearch"
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
    <template slot="прихода" slot-scope="text, row">
      <span>{{ moment(row.updated_at).format('hh:mm DD-MM-YYYY') }}</span>
    </template>
    <template slot="Статус" slot-scope="text, row">
      <a-tag><span>{{ Count(row.items).c }}/{{ Count(row.items).s }}</span></a-tag>
    </template>
  </a-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  data () {
    return {
      loading: false,
      page: { current: 1, pageSize: 10, total: null },
      params: {
        statuses: 'incomplete',
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        // from_date: '2021-09-01',
        // to_date: '2021-09-31',
        page: 1,
        limit: 10,
        number: '',
        receiver_warehouse_id: '',
        sender_warehouse_id: '',
        type: 'relocation'
      },
      columnsThee: [
        {
          title: this.$t('ID партии'),
          dataIndex: 'number',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'партии'
          }
        },
        {
          title: this.$t('Отправитель'),
          dataIndex: 'accepting_warehouse.name',
          scopedSlots: { customRender: 'Отправитель', filterDropdown: 'senderDropdown', filterIcon: 'filterIcon' }
        },
        {
          title: this.$t('Получатель'),
          dataIndex: 'branch_name',
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
        },
        {
          title: this.$t('Время прихода'),
          key: 'werree',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'прихода'
          }
        },
        {
          title: this.$t('Принято'),
          key: 'fsfdsf',
          scopedSlots: {
            filterDropdown: 'Принято',
            filterIcon: 'filterIcon'
          }
        }
      ],
      branchList: []
    }
  },
  methods: {
    ...mapActions(['TransferGetAllTheeTab', 'getBranchList']),
    handleTableChangeTabThee (pagination) {
    },
    moment,
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
      this.getListAll()
    },
    getListAll () {
      this.loading = true
      this.TransferGetAllTheeTab(this.params)
        .finally(() => {
          this.loading = false
        })
    },
    searchBranchId (val) {
      console.log('=====', val)
      this.params.receiver_warehouse_id = val
      this.getListAll()
    },
    searchSenderId (val) {
      console.log('=====', val)
      this.params.sender_warehouse_id = val
      this.getListAll()
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
    PartiyaIdSearch (val) {
      this.params.number = val
      this.getListAll()
    },
    SearchData (data) {
      this.params.from_date = data.from_date
      this.params.to_date = data.to_date
      this.getListAll()
    }
  },
  computed: {
    ...mapGetters(['complited', 'complitedPagnation']),
    getComplited () {
      return this.complited
    },
    getPaginationComplited () {
      return this.complitedPagination
    }
  },
  created () {
    this.getListAll()
    this.searchBranch()
  }
}
</script>

<style scoped>

</style>
