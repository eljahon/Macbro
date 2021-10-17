<template>
  <a-table
    style="margin-top: 30px"
    :columns="columnsTwo"
    :rowKey="() => Math.random()"
    :dataSource="getTabTwoList"
    :pagination="getPaginationTwo"
    :loading="loading"
    @change="handleTableChangeTabTwo"
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
    <div slot="statuses" style="padding: 8px; width: 230px;">
      <a-select
        :placeholder="$t('Тип аккаунта')"
        style="width: 220px"
        @change="statusesSearch"
        allowClear
      >
        <a-select-option v-for="(catigoriya, index) in status" :key="index" :value="catigoriya.value">
          {{ catigoriya.label }}
        </a-select-option>
      </a-select>
    </div>
    <div
      slot="IdPartiya"
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
      <a-tag :color="StatusSwitch(row.status).color">{{ StatusSwitch(row.status).name }}</a-tag>
    </template>
  </a-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
// eslint-disable-next-line no-unused-vars
export default {
  computed: {
    ...mapGetters(['allList', 'allPagination']),
    getTabTwoList () {
      return this.allList
    },
    getPaginationTwo () {
      return this.AllPagination
    }
  },
  data () {
    return {
      status: [
        {
          label: 'Все',
          value: 'accepted,in-process,incomplete'
        },
        {
          label: 'Принято',
          value: 'accepted'
        },
        {
          label: 'В процессе',
          value: 'in-process'
        },
        {
          label: 'Неполный',
          value: 'incomplete'
        }],
      page: { current: 1, pageSize: 10, total: null },
      params: {
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        statuses: 'accepted,in-process,incomplete,rejected',
        page: 1,
        limit: 10,
        number: '',
        receiver_warehouse_id: '',
        sender_warehouse_id: '',
        type: 'relocation'
      },
      loading: false,
      columnsTwo: [
        {
          title: this.$t('ID партии'),
          dataIndex: 'number',
          scopedSlots: {
            filterDropdown: 'IdPartiya',
            filterIcon: 'filterIcon',
            customRender: 'партии'
          }
        },
        {
          title: this.$t('Отправитель'),
          dataIndex: 'sending_warehouse.name',
          scopedSlots: { customRender: 'Отправитель',
          filterDropdown: 'senderDropdown',
filterIcon: 'filterIcon' }
        },
        {
          title: this.$t('Получатель'),
          dataIndex: 'accepting_warehouse.name',
          scopedSlots: {
            filterDropdown: 'branchDropdown',
            filterIcon: 'filterIcon' }
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
          title: this.$t('Статус'),
          key: 'fsfdsf',
          scopedSlots: {
            filterDropdown: 'statuses',
            filterIcon: 'filterIcon',
            customRender: 'Статус'
          }
        }
      ],
      branchList: [],
      fetching: false
    }
  },
  methods: {
    ...mapActions(['AllTabList', 'getBranchList']),
    moment,
    StatusSwitch (item) {
      switch (item) {
        case 'accepted' : return { color: 'blue', name: 'Принято' }
        case 'in-process' : return { color: 'orange', name: 'В процессе' }
        case 'incomplete' : return { color: 'gray', name: 'Неполный' }
        case 'rejected' : return { color: 'red', name: 'Отклоненный' }
      }
    },
    SearchData (data) {
      this.params.from_date = data.from_date
      this.params.to_date = data.to_date
      this.GetAllTabList()
    },
    GetAllTabList () {
      this.loading = true
      this.AllTabList(this.params)
      .then(res => {
      })
      .finally(() => {
        this.loading = false
      })
    },
    statusesSearch (val) {
      this.params.statuses = val === undefined ? this.status[0].value : val
      this.GetAllTabList()
    },
    PartiyaIdSearch (val) {
      this.params.number = val
      this.GetAllTabList()
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
    searchBranchId (val) {
      console.log('=====', val)
      this.params.receiver_warehouse_id = val
      this.GetAllTabList()
    },
    searchSenderId (val) {
      console.log('=====', val)
      this.params.sender_warehouse_id = val
      this.GetAllTabList()
    },
    handleTableChangeTabTwo (pagination) {
      this.page = { ...pagination }
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
    }
  },
  created () {
    this.GetAllTabList()
    this.searchBranch()
  }
}
</script>

<style scoped>

</style>
