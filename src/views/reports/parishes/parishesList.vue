<template>
  <a-card>
    <a-card>
      <div slot="title">
        {{ $t('Перекличка') }}
      </div>
      <div slot="extra">
        <div slot="extra" style="display: flex; gap: 5%">
          <a-input>
            <a-icon style="color: blue" slot="addonAfter" type="search" />
          </a-input>
          <a-range-picker
            :placeholder="['от даты ', 'до даты']"
            @change="rangePicer"
          >
            <a-icon type="calendar" style="color: blue" slot="suffixIcon"/>
          </a-range-picker>
          <a-select
            label-in-value
            :default-value="{ key: 'lucy' }"
            style="width: 180px"
          >
            <a-icon slot="suffixIcon" style="color: blue" type="down" />
            <a-select-option value="jack">
              Jack (100)
            </a-select-option>
            <a-select-option value="lucy">
              Lucy (101)
            </a-select-option>
          </a-select>
          <a-button style="padding: 5px" type="primary" icon="download" size="large" />
        </div>

      </div>
      <div>
      </div>
      <a-table
        style="margin-top: 30px"
        :columns="columnsparisher"
        :rowKey="() => Math.random()"
        :dataSource="getParishesList"
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
            allowClear
          >
          </a-select>
        </div>
        <div
          slot="аккаунта"
          style="padding: 8px"
        >
          <a-input-number
            :placeholder="`ИД. аккаунта`"
          />
        </div>
        <a-icon
          style="font-size: 20px; color: transparent; background-color: transparent"
          slot="filterIcon"
          class="filter-dropdown-icon"
          :component="$myIcons.filterDownIcon"
        />
        <template slot="Статус" slot-scope="text, row">
          <a-tag :color="row.items_count === row.scanned_count  ? 'blue' : 'red'">{{ row.items_count === row.scanned_count ? 'Сканировано' : `${'Не сканировано'}${row.items_count}/${row.scanned_count}` }}</a-tag>

          <!--                    <span>{{ row.merchant.firstname === '' ? '' : row.merchant.firstname}} {{ row.merchant.last_name === '' ? '' : row.merchant.last_name }}</span>-->
        </template>
        <template slot="seller" slot-scope="text, row">
          <span>{{row.seller.first_name}}{{' '}}{{row.seller.last_name}}</span>
        </template>
        <template slot="buyers" slot-scope="text, row">
          <span>{{row.buyer.first_name}}{{' '}}{{row.buyer.last_name}}</span>
        </template>
        <template slot="Кол" slot-scope="text, row">
          <span>{{ row.items_count }}</span>
        </template>
        <template slot="Сумма" slot-scope="text, row">
          <span>{{ '$'}}{{ row.total_amount }}</span>
        </template>
      </a-table>
    </a-card>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
 data () {
   return {
     columnsparisher: [
       {
         title: this.$t('ИД заказа'),
         dataIndex: 'number',
         scopedSlots: {
           filterDropdown: 'аккаунта',
           filterIcon: 'filterIcon',
           customRender: 'заказа'
         },
         align: 'center'
       },
       {
         title: this.$t('Филиал'),
         dataIndex: 'branch_name',
         align: 'center'
       },
       {
         title: this.$t('Поставщики'),
         align: 'center',
         scopedSlots: {
           filterDropdown: 'Aккаунта',
           filterIcon: 'filterIcon',
           customRender: 'seller' }
         // dataIndex: 'account_number',
       },
       {
         title: this.$t('Кассир'),
         align: 'center',
         key: 'buyers',
         scopedSlots: {
           filterDropdown: 'Aккаунта',
           filterIcon: 'filterIcon',
           customRender: 'buyers' }
         // dataIndex: 'account_number',
       },
       {
         title: this.$t('Кол-во'),
         key: 'action',
         scopedSlots: {
           filterDropdown: 'аккаунта',
           filterIcon: 'filterIcon',
           customRender: 'Кол'
         },
         align: 'center'
       },
       {
         title: this.$t('Сумма'),
         key: 'werree',
         dataIndex: 'total_amount',
         scopedSlots: {
           filterDropdown: 'аккаунта',
           filterIcon: 'filterIcon',
           customRender: 'Сумма'
         },
         align: 'center'
       },
       { title: this.$t('Статус'),
         // dataIndex: 'account_number',
         scopedSlots: {
           filterDropdown: 'AccountNumber',
           filterIcon: 'filterIcon',
           customRender: 'Статус' },
         align: 'center'
       }
     ],
     params: {
       from_date: moment().startOf().format('YYYY-MM-DD'),
       to_date: moment().endOf().format('YYYY-MM-DD'),
       page: { current: 1, pageSize: 10, total: null }
     },
     loading: false
   }
 },
  computed: {
   ...mapGetters(['parishesPagination', 'parishesList', 'AllParishesList']),
    getPagination () {
     return this.parishesPagination
    },
    getParishesList () {
     return this.parishesList
    }
  },
  methods: {
   ...mapActions(['getAllListParishes']),
   parishesGetList () {
     this.loading = true
     this.getAllListParishes(this.params)
  .finally(() => {
    this.loading = false
  })
   },
    handleTableChange (pagination) {
      this.params.page = { ...pagination }
      this.parishesGetList()
    },
    rangePicer (val, data) {
      console.log(val, data)
      this.params.from_date = data[0]
        this.params.to_date = data[1]
      this.parishesGetList()
    }
  },
  created () {
   this.parishesGetList()
  }
}
</script>

<style scoped>

</style>
