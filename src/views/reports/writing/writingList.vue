<template>
  <div v-if="rendertype" style="background-color: transparent; position: relative">
    <a-spin style="z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" size="large" />
  </div>
  <a-card v-else>
    <div slot="title">{{ $t('writing') }}</div>
    <div slot="extra" style="display: flex; gap: 5px">
      <a-input v-model="params.search" v-debounce="Search">
        <a-icon @click="Searches" style="color: blue" slot="addonAfter" type="search" />
      </a-input>
      <a-button icon="dowlond" style="background-color: #1890FF; color: white; border:none">
        <a-icon :component="myIcons.excal"></a-icon></a-button>
    </div>
    <a-card>
      <table-companenet
        v-if="render"
        :columns="columns"
        :customRowClick="customRowClick"
        @handleTableChange="handleTableChange"
        :dataSource="getwritingData"
        :getPagination="getPagination"
        :branchList="branchList"
        @searchBranch="searchBranch"
        :handleBranch="handleBranch"
        :loading="loading"
        :userList="userList"
        @searchUser="searchUsers"
        @selectUser="selectUser"
        @selectBranch="searchBranchId"
        @handelStatus="status"
        @number="searcherNumber"

      />

    </a-card>
  </a-card>
</template>

<script>
import myIcons from '@/core/icons'
import { mapActions, mapGetters } from 'vuex'
import Table from './Table'
import moment from 'moment'

export default {
  components: {
    'table-companenet': Table
  },
  data () {
    return {
      myIcons,
      loading: false,
      banchList: [],
      userList: [],
      render: false,
      rendertype: true,
      columns: [
        {
          title: 'ИД заказа',
          dataIndex: 'number',
          key: 'number',
          width: 220,
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
            filterDropdown: 'branchDropdown',
            filterIcon: 'filterIcon'
          }
        },
        {
          title: 'Кассир',
          scopedSlots: {
            customRender: 'customer',
            filterDropdown: 'userDropdown',
            filterIcon: 'filterIcon'
          }
        },
        {
          title: 'Статус',
          scopedSlots: {
            customRender: 'statuses',
            filterDropdown: 'statusDropdown',
            filterIcon: 'filterIcon'
          }
        },
        {
          title: 'Кол-во',
          dataIndex: 'items_count',
          key: 'items_count',
          width: 100
        },
        {
          title: 'Сумма',
          key: 'sum',
          scopedSlots: {
            customRender: 'sum'
          }
        }
      ],
      page: { current: 1, pageSize: 10, total: null },
      params: {
        search: '',
        date_from: moment().startOf('month').format('YYYY-MM-DD'),
        date_to: moment().endOf('month').format('YYYY-MM-DD'),
        page: 1,
        limit: 10,
        number: '',
        warehouse_id: '',
        cashier_id: '',
        causer_id: '',
        status: ''
      }
    }
  },
  computed: {
    ...mapGetters(['allListWriting', 'allPaginationWriting']),
    getwritingData () {
      return this.allListWriting
    },
    getPagination () {
      return this.allPagination
    }
  },
  methods: {
    ...mapActions(['writingList', 'getBranchList', 'getUserList']),
    moment,
    searchUsers (value) {
      this.loading = true
      return this.getUserList({ search: value }).then(res => {
        console.log(res.users)
        const users = res.users
        this.userList = users.map(user => ({
          label: `${user.first_name} ${user.last_name}`,
          value: user.id,
          companyId: user.company_id
        }))
      }).catch(error => {
        console.log(error)
        this.userList = []
      }).finally(() => {
        this.loading = false
      })
    },
    searchBranchId (data) {
      console.log(data)
      this.params.warehouse_id = data.id
      this.writingGetAllList()
    },
    handleTableChange (paginotion) {
      this.loading = true
      this.params.page = { ...paginotion }
      this.writingGetAllList()
    },
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push({ name: 'writingMainItem', params: { id: record.id } })
          }
        }
      }
    },
    Search (val) {
      console.log(val)
      this.writingGetAllList()
    },
    Searches (val) {
      console.log(val)
    },
    searId (val) {
      console.log(val)
    },
    status (value) {
      this.params.status = value
      this.writingGetAllList()
    },
    writingGetAllList () {
      this.loading = true
     return this.writingList(this.params)
       .finally(() => {
         this.loading = false
       })
    },
    searchBranch (value) {
      return this.getBranchList({ name: value }).then(res => {
        const branches = res.branches.length ? res.branches : []
        this.branchList = branches?.map(branch => ({
          label: branch.name,
          value: branch.warehouse_id
        }))
        this.render = true
        this.rendertype = false
        // console.log('this.banchList ==>>', this.branchList)
      })
    },
    handleBranch (value, data) {
      console.log(value, data)
    },
    selectUser (data) {
      this.params.cashier_id = data.id
      this.writingGetAllList()
    },
    searcherNumber (val) {
      this.params.number = val
      this.writingGetAllList()
    }
  },
  mounted () {
    Promise.all([
      this.writingGetAllList(),
      this.searchBranch(),
      this.searchUsers()])
  }
}
</script>

<style scoped>

</style>
