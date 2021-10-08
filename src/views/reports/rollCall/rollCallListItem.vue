<template>
  <a-card>
    <div slot="title">
      <a-page-header
        @back="() => $router.go(-1)"
      >
        <div slot="subTitle" style="cursor: pointer">
          <span @click="() => $router.push({name: 'SaleMain'})">{{'Отчеты / '}}</span><span>{{$t('rollCall')}}</span>
        </div>
      </a-page-header>
    </div>
    <div slot="extra" style="display: flex; gap: 9px">
      <a-range-picker
        :placeholder="['от даты ', 'до даты']"
        @change="rangepicker"
      >
        <a-icon type="calendar" style="color: blue" slot="suffixIcon"/>
      </a-range-picker>
<!--      <a-select-->
<!--        label-in-value-->
<!--        :default-value="{ key: 'lucy' }"-->
<!--        style="width: 180px"-->
<!--      >-->
<!--        <a-icon slot="suffixIcon" style="color: blue" type="down" />-->
<!--        <a-select-option value="jack">-->
<!--          Jack (100)-->
<!--        </a-select-option>-->
<!--        <a-select-option value="lucy">-->
<!--          Lucy (101)-->
<!--        </a-select-option>-->
<!--      </a-select>-->
      <a-button style="padding: 2px" type="primary" icon="download" size="small" />
    </div>
    <div>
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
        <template slot="data" slot-scope="text, row">
          <span>{{ moment(row.leave_time).format('YYYY-MM-DD') }}</span>
        </template>
        <template slot="start" slot-scope="text, row">
          <span>{{ moment(row.start_time).format('YYYY-MM-DD') }}</span>
        </template>
        <template slot="Должность" slot-scope="text, row">
          <span>{{ row.user.user_type === 'consultant'? 'консультант': row.user.user_type === 'cashier' ? 'кассир': row.user.user_type}}</span>
        </template>
        <template slot="Отсутствующие" slot-scope="text, row">
          <span>{{ checkField(row.visit_report, 'absent', 'total_days') }}</span>
        </template>
        <template slot="Опоздал" slot-scope="text, row">
          <span>{{ FormatDate(moment(row.start_time).format('hh:mm:ss'), moment(row.visit_time).format('hh:mm:ss')) }}</span>
        </template>
        <!--          <template slot="account_group_id" slot-scope="text, row">-->
        <!--            &lt;!&ndash;            <a-tag color="blue"><span v-for="(account,index) in row.subaccounts" :key="index">{{ row.subaccounts.length ? account.type : 'Кассир' }}</span></a-tag>&ndash;&gt;-->
        <!--            <a-tag color="blue"><span>{{ row.subaccounts.length ? account.type : 'Кассир' }}</span></a-tag>-->
        <!--          </template>-->
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      loading: false,
      rallCallItemList: [],
      pageCount: {},
      count: 23,
      AccountGrups: [
        { id: '1', name: 'Касса' },
        { id: '2', name: 'Контрагент' },
        { id: '3', name: 'Клиент' },
        { id: '4', name: 'Сотрудники' },
        { id: '5', name: 'Компания' }
      ],
      params: {
        company_id: this.$route.params.company_id,
        branch_id: this.$route.params.branch_id,
        user_id: this.$route.params.user_id,
        from_date: '2021-09-01',
        to_date: '2021-09-30',
        page: { current: 1, pageSize: 10, total: null }
      },
      columns: [
        {
          title: this.$t('Дата'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'data'
          },
          align: 'center'
        },
        {
          title: this.$t('Время приезда'),
          // dataIndex: 'start_time',
          align: 'center',
          scopedSlots: { customRender: 'start' }
        },
        {
          title: this.$t('Опоздал(а) на х минут'),
          align: 'center',
          scopedSlots: {
            customRender: 'Опоздал' }
          // dataIndex: 'account_number',
        }
      ]
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    getUserListTable () {
      return this.rallCallItemList
    },
    // eslint-disable-next-line vue/return-in-computed-property
    getPagination () {
      return this.pageCount
    }
  },
  methods: {
    ...mapActions(['rollCallItemListGet']),
    rollCallItemList () {
      this.loading = true
      this.rollCallItemListGet(this.params)
      .then(res => {
        this.params.page.total = parseInt(res.count)
        this.pageCount = this.params.page
        this.rallCallItemList = res.journaling_items
        console.log('res.journaling_items=======>>', res.journaling_items)
      })
      .finally(() => {
        this.loading = false
      })
    },
    handleTableChange (pagination) {
      this.params.page = { ...pagination }
      console.log(pagination)
      this.rollCallItemList()
    },
    moment,
    FormatDate (startTime, visitTime) {
      // eslint-disable-next-line no-unused-vars
      let hour = ''
      let min = ''
      let sec = ''
      hour = hour + this.format(parseInt(startTime.split(':')[0]) - parseInt(visitTime.split(':')[0]))
      min = min + this.format(parseInt(startTime.split(':')[1]) - parseInt(visitTime.split(':')[1]))
      sec = sec + this.format(parseInt(startTime.split(':')[2]) - parseInt(visitTime.split(':')[2]))
      return `${hour}:${min}:${sec}`
    },
    format (a) {
     const hour = Math.abs(a)
     return (hour < 10 ? '0' + hour : hour)
    },
    rangepicker (val, data) {
      this.params.from_date = data[0]
      this.params.to_date = data[1]
      this.rollCallItemList()
    },
    AccountTypeSearch () {
    },
    AccountSearch () {}
  },
  mounted () {
    this.rollCallItemList()
  },
  created () {
  }
}

</script>

<style scoped>

</style>
