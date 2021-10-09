<template>
  <a-card>
    <a-card :bordered="false">
      <div slot="title">
        {{ $t('Перекличка') }}
      </div>
      <div slot="extra">
        <div slot="extra" style="display: flex; gap: 5%">
          <!--          <a-input-search :placeholder="$t('Перекличка')" :loading="false" enter-button />-->
          <!--                    <a-input style="color: blue" size="small" @search="onSearch" :placeholder="'Search'" v-debounce="AccountGlobalSeach">-->
          <!--                      <a-icon size="small" type="search" style="color: blue; " slot="suffix"/>-->
          <!--                    </a-input>-->
          <a-input v-debounce="SearchRollCallList">
            <a-icon style="color: blue" slot="addonAfter" type="search" />
          </a-input>
          <a-range-picker
            :defaultValue="[moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]"
            :placeholder="['от даты ', 'до даты']"
            @change="rangepicker"
          >
            <a-icon type="calendar" style="color: blue" slot="suffixIcon"/>
          </a-range-picker>
          <!--          <a-select-->
          <!--            label-in-value-->
          <!--            :default-value="{ key: 'lucy' }"-->
          <!--            style="width: 180px"-->
          <!--          >-->
          <!--            <a-icon slot="suffixIcon" style="color: blue" type="down" />-->
          <!--            <a-select-option value="jack">-->
          <!--              Jack (100)-->
          <!--            </a-select-option>-->
          <!--            <a-select-option value="lucy">-->
          <!--              Lucy (101)-->
          <!--            </a-select-option>-->
          <!--          </a-select>-->
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
            <span>{{ row.user.branch_name }}</span>
          </template>
          <template slot="Сотрудник" slot-scope="text, row">
            <span>{{ row.user.first_name }} {{ row.user.last_name }}</span>
          </template>
          <template slot="Должность" slot-scope="text, row">
            <span>{{ row.user.user_type === 'consultant'? 'консультант': row.user.user_type === 'cashier' ? 'кассир': row.user.user_type }}</span>
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
import cash from '../../../assets/cash.svg'
import Payment from '../../../assets/payment.svg'
import Vise from '../../../assets/Frame 56143-5.svg'
import Click from '../../../assets/clck.svg'
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
      Imgs: {
        cash: cash,
        payment: Payment,
        Vise: Vise,
        click: Click
      },
      params: {
        search: '',
        // from_date: '2021-09-01',
        // to_date: '2021-09-30',
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        page: { current: 1, pageSize: 10, total: null }
      },
      loading: true,
      columns: [
        // {
        //   title: this.$t('Иконка'),
        //   // dataIndex: 'currency'
        //   scopedSlots: { customRender: 'currency' },
        //   align: 'center',
        //   width: '200px'
        // },
        {
          title: this.$t('Филиал'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Филиал'
          },
          align: 'center'
        },
        // {
        //   title: this.$t('numbertransactions'),
        //   dataIndex: 'transaction_number',
        //   scopedSlots: {
        //     filterDropdown: 'TransactionNumber',
        //     filterIcon: 'filterIcon',
        //     customRender: 'transaction_number' },
        //   align: 'center'
        // },
        // {
        //   title: this.$t('acountnumber'),
        //   dataIndex: 'account_number',
        //   scopedSlots: {
        //     filterDropdown: 'AccountNumber',
        //     filterIcon: 'filterIcon',
        //     customRender: 'transaction_number' },
        //   align: 'center'
        // },
        {
          title: this.$t('Сотрудник'),
          // dataIndex: 'name',
          align: 'center',
          scopedSlots: { customRender: 'Сотрудник' }
        },
        {
          title: this.$t('Должность'),
          align: 'center',
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
          align: 'center'
        },
        {
          title: this.$t('Опоздал(а) на х минут'),
          key: 'werree',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Опоздал'
          },
          align: 'center'
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
