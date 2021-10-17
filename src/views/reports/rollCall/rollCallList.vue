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
          <div slot="Aккаунта" style="padding: 8px; width: 230px;">
            <a-select
              :placeholder="$t('Тип аккаунта')"
              style="width: 220px"
              @change="AccountTypeSearch"
              allowClear
            >
              <a-select-option v-for="(catigoriya, index) in AccountGrups" :key="index" :value="catigoriya.id">
                {{ catigoriya.name }}
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
            <span>{{ row.user.first_name }} {{ row.user.last_name }}</span>
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
          <!--          <template slot="account_group_id" slot-scope="text, row">-->
          <!--            &lt;!&ndash;            <a-tag color="blue"><span v-for="(account,index) in row.subaccounts" :key="index">{{ row.subaccounts.length ? account.type : 'Кассир' }}</span></a-tag>&ndash;&gt;-->
          <!--            <a-tag color="blue"><span>{{ row.subaccounts.length ? account.type : 'Кассир' }}</span></a-tag>-->
          <!--          </template>-->
        </a-table>
      </div>
    </a-card>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import myIcons from '@/core/icons'
export default {
  data () {
    return {
      myIcons,
      AccountGrups: [
        { id: '1', name: 'Касса' },
        { id: '2', name: 'Контрагент' },
        { id: '3', name: 'Клиент' },
        { id: '4', name: 'Сотрудники' },
        { id: '5', name: 'Компания' }
      ],
      userType: {
        'director': 'Директор',
          'consultant': 'Консультант',
          'counteragent': 'Встречный агент',
          'cashier': 'Кассир',
          'admin': 'Администратор',
          'manager': 'Менеджер',
          'courier': 'Курьер',
          'client': 'Клиент',
          'postavshik': 'Поставщик',
          ' investor': 'Инвестор'
      },
      params: {
        search: '',
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        page: { current: 1, pageSize: 10, total: null }
      },
      loading: true,
      columns: [
        {
          title: this.$t('Филиал'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Филиал'
          }
        },
        {
          title: this.$t('Сотрудник'),
          scopedSlots: { customRender: 'Сотрудник' }
        },
        {
          title: this.$t('Должность'),
          scopedSlots: {
            filterDropdown: 'Aккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Должность' }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Отсутствующие дни'),
          key: 'action',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Отсутствующие'
          },
          width: 210
        },
        {
          title: this.$t('Опоздал(а) на х минут'),
          key: 'werree',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Опоздал'
          },
          width: 210
        }
      ]
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
    // userType (item) {
    //   switch (item) {
    //     case 'director': return
    //     case 'consultant': return 'Консультант'
    //     case 'counteragent': return 'Встречный агент'
    //   }
    // },
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
    AccountTypeSearch (val) {
      this.params.account_group_id = val
      this.rollCallGetListAll()
    },
    AccountSearch (val) {
      this.params.account_number = val
      this.rollCallGetListAll()
    },
    // AcountCreate () {
    //   this.$router.push({ name: 'AcountCreate' })
    // // },
    // onChangepicker (val, event) {
    //   console.log(val, event)
    //   this.params.start_date = event[0]
    //   this.params.end_date = event[1]
    //   this.TrGetListAll()
    // },
    // sortDublicat (array) {
    //   const unique = []
    //   array.forEach((item) => {
    //     if (!unique.includes(item.payment_type)) {
    //       unique.push(item.payment_type)
    //     }
    //   })
    //   return unique
    // },
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
    // AccountGlobalSeach (val) {
    //   this.params.search = val
    //   this.rollCallGetListAll()
    // },
    handleTableChange (pagination) {
      this.params.page = { ...pagination }
      console.log(pagination)
      // this.rollCallGetListAll()
    }
  },
  mounted () {
    this.rollCallGetListAll()
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
