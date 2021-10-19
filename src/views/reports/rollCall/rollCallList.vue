<template>
  <a-card>
    <a-card :bordered="false">
      <div slot="title">
        {{ $t('Перекличка') }}
      </div>
      <div slot="extra">
        <div slot="extra" style="display: flex; gap: 5%">
          <a-input v-debounce="SearchRollCallList" style="width: 260px">
            <a-icon style="color: blue" slot="addonAfter" type="search" />
          </a-input>
          <a-range-picker
            style="width: 260px"
            :defaultValue="[moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]"
            :placeholder="['от даты ', 'до даты']"
            @change="rangepicker"
          >
            <a-icon type="calendar" style="color: blue" slot="suffixIcon"/>
          </a-range-picker>
          <a-button icon="dowlond" style="background-color: #1890FF; color: white; border: none">
            <a-icon :component="myIcons.excal"></a-icon></a-button>
        </div>

      </div>
      <div>
      </div>
      <div>
        <a-table
          style="margin-top: 30px; cursor: pointer"
          :columns="columns"
          :rowKey="() => Math.random()"
          :dataSource="getUserListTable"
          :pagination="getPagination"
          :loading="loading"
          @change="handleTableChange"
          test-attr="list-customer"
          :customRow="customRowClick"
          bordered
        >
          <div slot="userType" style="padding: 8px; width: 230px;">
            <a-select
              :placeholder="$t('Должность')"
              style="width: 220px"
              @change="userTypeSearch"
              allowClear
            >
              <a-select-option v-for="(item, index) of AccountGrups" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <div slot="minutes" style="padding: 8px; width: 230px;">
            <a-select
              :placeholder="$t('Отсутствующие дни')"
              style="width: 220px"
              show-search
              @change="userTypeSearchA"
              allowClear
              @search="CancelMiut"
            >
              <a-select-option v-for="(item, index) of listmitut" :key="index" :value="item">
                {{ item }} {{' Минуты'}}
              </a-select-option>
            </a-select>
          </div>  <div slot="opazdal" style="padding: 8px; width: 230px;">
            <a-select
              :placeholder="$t('Опоздал(а) на х минут')"
              style="width: 220px"
              show-search
              @change="userTypeSearchC"
              allowClear
              @search="CancelMiutC"
              v-model="params.late_time_diff"
            >
              <a-select-option v-for="(item, index) of opazdal" :key="index" :value="item">
                {{ item }} {{' Минуты'}}
              </a-select-option>
            </a-select>
          </div>
          <div
            slot="аккаунта"
            style="padding: 8px"
          >
            <a-input-number
              :placeholder="`ИД. аккаунта`"
              v-debounce="AccountSearch"
              style="width: 188px; margin-bottom: 8px; display: block;"
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
              @change="searchBranchId"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              :placeholder="`Филиал`"
              :options="branchList"
              @search="searchBranch"
              v-model="params.branch_id"
            />
          </div>
          <div
            slot="userDropdown"
            style="padding: 8px"
          >
            <a-select
              style="width: 200px"
              show-search
              allowClear
              @change="searchUsersId"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              :placeholder="`Сотрудник`"
              :options="userList"
              @search="searchUsers"
              v-model="params.user_id"
            />
          </div>
          <a-icon
            style="font-size: 20px; color: transparent; background-color: transparent"
            slot="filterIcon"
            class="filter-dropdown-icon"
            :component="$myIcons.filterDownIcon"
          />
          <template slot="Филиал" slot-scope="text, row">
            <span v-if="row.user.branch_name.length">{{ row.user.branch_name}}</span>
            <span v-else style="color: gray">Нет филиала...</span>
          </template>
          <template slot="Сотрудник" slot-scope="text, row">
            <table-user-column :image="row.user.profile_image.includes('https') ? row.user.profile_image : img" :name="`${row.user.last_name } ${row.user.first_name}`" :type="userType[row.user.user_type]" :phone="row.user.phone_number"/>
<!--            <span>{{ row.user.first_name }} {{ row.user.last_name }}</span>-->
          </template>
          <template slot="Должность" slot-scope="text, row">
            <span>{{  userType[row.user.user_type]}}</span>
          </template>
          <template slot="Отсутствующие" slot-scope="text, row">
            <span>{{ checkField(row.visit_report, 'absent', 'total_days') }}</span>
          </template>
          <template slot="Опоздал" slot-scope="text, row">
            <span>{{ checkField(row.visit_report, 'absent', 'total_diff') }}</span>
          </template>
        </a-table>
      </div>
    </a-card>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import myIcons from '@/core/icons'
import img from '../../../assets/Ellipse 9.png'
import TableUserColumn from '@/components/TableUserColumn/TableUserColumn.vue'
export default {
  components: {
    TableUserColumn
  },
  data () {
    return {
      img: img,
      fetching: false,
      branchList: [],
      userList: [],
      prcalichkaList: [],
      myIcons,
      AccountGrups: [
        { id: 'director', name: 'Директор' },
        { id: 'consultant', name: 'Консультант' },
        { id: 'counteragent', name: 'Контрагент' },
        { id: 'admin', name: 'Кассир' },
        { id: 'manager', name: 'Администратор' },
        { id: 'courier', name: 'Менеджер' },
        { id: 'client', name: 'Курьер' },
        { id: 'postavshik', name: 'Клиент' },
        { id: 'investor', name: 'Поставщик' },
        { id: 'cashier', name: 'Кассир' }
      ],
      userType: {
        'director': 'Директор',
          'consultant': 'Консультант',
          'counteragent': 'Контрагент',
          'cashier': 'Кассир',
          'admin': 'Администратор',
          'manager': 'Менеджер',
          'courier': 'Курьер',
          'client': 'Клиент',
          'postavshik': 'Поставщик',
          ' investor': 'Инвестор'
      },
      page: { current: 1, pageSize: 10, total: null },
      params: {
        search: '',
        branch_id: '',
        company_id: '',
        user_type: '',
        user_id: '',
        late_time_diff: '',
        absent_days_diff: '',
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        limit: 10,
        page: 1
      },
      loading: true,
      columns: [
        {
          title: this.$t('Филиал'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'branchDropdown',
            filterIcon: 'filterIcon',
            customRender: 'Филиал'
          },
          width: 220
        },
        {
          title: this.$t('Сотрудник'),
          scopedSlots: {
            customRender: 'Сотрудник',
            filterDropdown: 'userDropdown',
            filterIcon: 'filterIcon'
          },
          width: 220
        },
        {
          title: this.$t('Должность'),
          scopedSlots: {
            filterDropdown: 'userType',
            filterIcon: 'filterIcon',
            customRender: 'Должность' },
          width: 220
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Отсутствующие дни'),
          key: 'action',
          scopedSlots: {
            filterDropdown: 'minutes',
            filterIcon: 'filterIcon',
            customRender: 'Отсутствующие'
          },
          width: 210
        },
        {
          title: this.$t('Опоздал(а) на х минут'),
          key: 'werree',
          scopedSlots: {
            filterDropdown: 'opazdal',
            filterIcon: 'filterIcon',
            customRender: 'Опоздал'
          },
          width: 210
        }
      ],
      listmitut: [1, 3, 5, 10],
      opazdal: [5, 10, 15, 20, 30]
    }
  },
  computed: {
    ...mapGetters(['rollCollList', 'rollcollPagination']),
    getPagination () {
      return this.rollcollPagination
    },
    getUserListTable () {
      return this.rollCollList
    }
  },
  methods: {
    ...mapActions(['getBranchList', 'getUserList']),
    searchBranchId (val, data) {
      this.params.branch_id = val === undefined ? '' : val
      this.params.company_id = data === undefined ? '' : data.data.props.companyId
      this.rollCallGetListAll()
    },
    searchUsersId (val, data) {
      console.log('=====', val, data)
      this.params.user_id = val === undefined ? '' : val
      this.params.company_id = data === undefined ? '' : data.data.props.companyId
      this.rollCallGetListAll()
    },
    searchUsersIdCansled (val, data) {
      console.log('=====', val, data)
      this.params.late_time_diff = val
      this.params.company_id = data.data.props.companyId
      this.rollCallGetListAll()
    },
    searchUsersCanceld (val) {
      console.log('=====', val)
      this.params.late_time_diff = val
      // this.params.company_id = data.data.props.companyId
      this.rollCallGetListAll()
    },
    searchBranch (value) {
      this.getBranchList({ name: value }).then(res => {
        console.log(res.branches)
        const branches = res.branches
        this.branchList = branches.map(branch => ({
          label: branch.name,
          value: branch.warehouse_id,
          companyId: branch.company_id
        }))
      })
    },
    searchUsers (value) {
      this.loading = true
      this.getUserList({ search: value }).then(res => {
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
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push({ name: 'rollCallListMainItem', params: { company_id: record.user.company_id, branch_id: record.user.branch_id, user_id: record.user.id } })
          }
        }
      }
    },
    checkField (obj, name, field) {
      return obj?.[name] ? obj[name][field] : 0
    },
    rangepicker (val, data) {
      console.log(val, data)
      this.params.from_date = data[0]
      this.params.to_date = data[1]
      this.rollCallGetListAll()
    },
    SearchRollCallList (val) {
      console.log(val)
      this.params.search = val
      console.log(this.params)
      this.rollCallGetListAll()
    },
    userTypeSearch (val, data) {
      console.log(data)
      this.params.user_type = val
      this.rollCallGetListAll()
    },
    userTypeSearchC (val) {
      this.params.late_time_diff = val
      this.rollCallGetListAll()
    },
    userTypeSearchA (val) {
      this.params.absent_days_diff = val
      this.rollCallGetListAll()
    },
    CancelMiut (val) {
      this.params.absent_days_diff = val
      this.rollCallGetListAll()
    },
    CancelMiutC (val) {
      this.params.late_time_diff = val
      this.rollCallGetListAll()
    },
    AccountSearch (val) {
      this.params.account_number = val
      this.rollCallGetListAll()
    },
    moment,
    ...mapActions(['getRollCollAll']),
    rollCallGetListAll () {
      this.loading = true
      this.getRollCollAll(this.params)
        .finally(() => {
          this.loading = false
        })
    },
    onSearch (value) {
      console.log(value)
      this.params.search = value
      this.rollCallGetListAll()
    },
    handleTableChange (pagination) {
      this.params.page = { ...pagination }
      console.log(pagination)
      // this.rollCallGetListAll()
    }
  },
  mounted () {
    this.rollCallGetListAll()
    this.searchBranch()
    this.searchUsers()
  },
  created () {
  }
}
</script>

<style scoped>
.fonSize {
  font-size: 16px;
  cursor: pointer;
}
</style>
