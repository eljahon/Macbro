<template>
  <a-card>
    <div slot="title">
      <a-page-header style="width: 80%">
        <div slot="title">
          <a-button type="link" icon="arrow-left" style="color: black" @click="() => $router.go(-1)"></a-button>
          <span class="fonSize" @click="() => $router.push({ name: 'transactionsListMain'})">{{ $t('report') }} /</span>
          <router-link :to="{ name: 'acountListMainList'}" style="color: black" class="fonSize">{{ $t('acount') }}</router-link>
        </div>
      </a-page-header>
    </div>
    <div slot="extra"> <a-input-search :placeholder="'Search'" enter-button @search="onSearch" v-debounce="AccountGlobalSeach"></a-input-search></div>
    <div>
      <a-card :bordered="false">
        <div slot="title">
          {{ $t('acount') }}
        </div>
<!--        <div slot="extra">-->
<!--          <a-button @click="AcountCreate" type="primary" icon="plus">{{ $t('add') }}</a-button>-->
<!--        </div>-->
        <div>
        </div>
        <a-table
          style="margin-top: 30px"
          :columns="columns"
          :rowKey="() => Math.random()"
          :dataSource="getUserListTable"
          :pagination="getPagination"
          :loading="loading"
          @change="handleTableChange"
          test-attr="list-customer"
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
          <template slot="number" slot-scope="text, row">
            <span>{{ row.number }}</span>
          </template>
          <template slot="name" slot-scope="text, row">
            <span>{{ row.name }}</span>
          </template>
          <template slot="account_group_id" slot-scope="text, row">
<!--            <a-tag color="blue"><span v-for="(account,index) in row.subaccounts" :key="index">{{ row.subaccounts.length ? account.type : 'Кассир' }}</span></a-tag>-->
            <a-tag color="blue"><span>{{ row.subaccounts.length ? account.type : 'Кассир' }}</span></a-tag>
          </template>
        </a-table>
      </a-card>
    </div>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import cash from '../../../assets/cash.svg'
import Payment from '../../../assets/payment.svg'
import Vise from '../../../assets/Frame 56143-5.svg'
import Click from '../../../assets/clck.svg'
export default {
  data () {
    return {
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
        account_group_id: '',
        account_number: '',
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
          title: this.$t('ИД. аккаунта'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'number'
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
          title: this.$t('Название'),
          dataIndex: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('Тип аккаунта'),
          align: 'center',
          scopedSlots: {
            filterDropdown: 'Aккаунта',
            filterIcon: 'filterIcon',
            customRender: 'account_group_id' }
          // dataIndex: 'account_number',
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: 120,
        //   scopedSlots: { customRender: 'action' }
        // }
      ]
    }
  },
  computed: {
    ...mapGetters(['AcountList', 'AcPagination']),
    getPagination () {
      return this.AcPagination
    },
    getUserListTable () {
      return this.AcountList
    }
  },
  methods: {
    AccountTypeSearch (val) {
      this.params.account_group_id = val
      this.AcountGetListAll()
    },
    AccountSearch (val) {
      this.params.account_number = val
      this.AcountGetListAll()
    },
    AcountCreate () {
      this.$router.push({ name: 'AcountCreate' })
    },
    onChangepicker (val, event) {
      console.log(val, event)
      this.params.start_date = event[0]
      this.params.end_date = event[1]
      this.TrGetListAll()
    },
    sortDublicat (array) {
      const unique = []
      array.forEach((item) => {
        if (!unique.includes(item.payment_type)) {
          unique.push(item.payment_type)
        }
      })
      return unique
    },
    moment,
    ...mapActions(['GetAcountAllList']),
    AcountGetListAll () {
      this.loading = true
      this.GetAcountAllList(this.params)
        .finally(() => {
          this.loading = false
        })
    },
    customRowClick (val, even, data) {
      // console.log(val, even, data)
    },
    onSearch (value) {
      console.log(value)
      this.params.search = value
      this.AcountGetListAll()
    },
    AccountGlobalSeach (val) {
      this.params.search = val
      this.AcountGetListAll()
    },
    handleTableChange (pagination) {
      this.params.page = { ...pagination }
      console.log(pagination)
      this.AcountGetListAll()
    }
  },
  mounted () {
  },
  created () {
    this.AcountGetListAll()
  }
}
</script>

<style scoped>
.fonSize {
  font-size: 16px;
  cursor: pointer;
}
</style>
