<template>
  <a-card>
    <div slot="title">
      <a-page-header style="width: 40%">
        <div slot="title">
          <a-button type="link" icon="arrow-left" style="color: black" @click="() => $router.go(-1)"></a-button>
          <span class="fonSize">{{ $t('report') }} / </span>
          <router-link to="/report/transactions/list" style="color: black" class="fonSize">{{ $t('transactions') }}</router-link>
        </div>
      </a-page-header>
    </div>
    <div slot="extra"> <a-input-search :placeholder="'Search'" enter-button @search="onSearch"></a-input-search></div>
    <div>
      <a-card :bordered="false">
        <div slot="title">
          {{ $t('transactions') }}
        </div>
        <div style="display: flex">
          <!--          <a-row>-->
          <!--            <a-col :span="7" >-->
          <div class="mulitiCard">
            <div style="display: flex; margin-top: 15px">
              <div style=" margin-left: 10px;"><a-icon :style="{fontSize: '20px', color: 'blue'}" type="dollar"></a-icon> <span style="margin-left: 10px">Продажа</span></div>
              <div style="30%; float: right;margin-left: 170px"><strong>+$250</strong></div>
            </div>
          </div>
          <!--            </a-col>-->
          <!--            <a-col :span="7" :offset="1">-->
          <div class="mulitiCard">
            <div style="display: flex; margin-top: 15px">
              <div style="width: 30%; margin-left: 10px;"><a-icon :style="{fontSize: '20px', color: 'red'}" type="dollar"></a-icon> <span style="margin-left: 10px">Продажа</span></div>
              <div style="30%; float: right;margin-left: 170px"><strong>+$250</strong></div>
            </div>
          </div>
          <!--            </a-col>-->
          <!--            <a-col :span="7" :offset="1">-->
          <div class="mulitiCard">
            <div style="display: flex; margin-top: 15px">
              <div style="width: 30%; margin-left: 10px;"><a-icon :style="{fontSize: '20px'}" type="dollar"></a-icon> <span style="margin-left: 10px">Продажа</span></div>
              <div style="30%; float: right;margin-left: 170px"><strong>+$250</strong></div>
            </div>
          </div>
          <!--            </a-col>-->
          <!--          </a-row>-->
        </div>
        <a-table
          style="margin-top: 30px"
          :columns="columns"
          :rowKey="record => record.id"
          :dataSource="getUserListTable"
          :pagination="getPagination"
          :loading="loading"
          @change="handleTableChange"
          test-attr="list-customer"
          bordered
          :customRow="customRowClick"
          class="pointer"
        >
          <div slot="Dropdowns" style="padding: 8px; width: 230px;">
            <a-range-picker @change="onChangepicker" style="width: 220px" />
          </div>
          <div slot="TransactionNumber" style="padding: 8px; width: 230px;">
            <a-input
              :placeholder="$t('numbertransactions')"
              style="width: 220px; margin-bottom: 0px; display: block;"
              v-debounce="NumberTransactionSearch"
            />
          </div>
          <div slot="AccountNumber" style="padding: 8px; width: 230px;">
            <a-input
              :placeholder="$t('acountnumber')"
              style="width: 220px; margin-bottom: 0px; display: block;"
              v-debounce="AccountNumberSearch"
            />
          </div>
          <div slot="TypeTransaction" style="padding: 8px; width: 230px;">
            <a-select
              :placeholder="$t('typetransactions')"
              style="width: 220px"
              @change="handleChangeSelectcatigory"
              allowClear
            >
              <a-select-option v-for="(catigoriya, index) in category" :key="index" :value="catigoriya.id">
                {{ catigoriya.name }}
              </a-select-option>

            </a-select>
          </div>
          <div
            slot="Dropdown"
            style="padding: 8px"
          >
            <a-input
              :placeholder="`Search`"
              style="width: 188px; margin-bottom: 8px; display: block;"
            />
            <!--            <a-button-->
            <!--              type="primary"-->
            <!--              icon="search"-->
            <!--              size="small"-->
            <!--              style="width: 90px; margin-right: 8px"-->
            <!--              @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"-->
            <!--            >-->
            <!--              Search-->
            <!--            </a-button>-->
            <!--            <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">-->
            <!--              Reset-->
            <!--            </a-button>-->
          </div>
          <a-icon
            style="font-size: 20px; color: transparent; background-color: transparent"
            slot="filterIcon"
            class="filter-dropdown-icon"
            :component="$myIcons.filterDownIcon"
          />
          <template slot="data" slot-scope="text, row">
            <span>{{ moment(row.date).format('YYYY-MM-DD') }}</span>
          </template>
          <template slot="total_amount" slot-scope="text, row">
            <span>{{ row.billing_info.total_amount }}</span>
          </template>
          <template slot="currency" slot-scope="text, row">
            <span v-for="(payment, index) in sortDublicat(row.billing_info.payment)" :key="index">
              <img class="imgBorderRaidus" style="width: 50px" v-if="payment === 'payme'" :src="Imgs.payment" alt="Payment">
              <img class="imgBorderRaidus" v-if="payment === 'cash'" :src="Imgs.cash" alt="Payment">
              <img class="imgBorderRaidus" v-if="payment === 'click'" :src="Imgs.click" alt="Payment">
              <img class="imgBorderRaidus" v-if="payment === 'p2p'" :src="Imgs.Vise" alt="Payment">
              <!--              <img v-if="payment === 'terminal'" :src="Imgs.Vise" alt="Payment">-->
            </span>
          </template>
          <template slot="type" slot-scope="text, row">
            <a-tag v-if="row.billing_info.type === 'order'"><span>Приход</span></a-tag>
            <a-tag v-if="row.billing_info.type === 'sale'" color="blue"><span>продажа</span></a-tag>
            <a-tag v-if="row.billing_info.type === 'inventory'" color="red"><span>Расход</span></a-tag>
            <!--            <span>{{ row.billing_info.type }}</span>-->
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
      category: [
        { id: '1', name: 'Продажа' },
        { id: '3', name: 'Покупка' },
        { id: '2', name: 'Расходы' }
      ],
      Imgs: {
        cash: cash,
        payment: Payment,
        Vise: Vise,
        click: Click
      },
      params: {
        currency_type: '',
        end_date: '',
        payment_type: '',
        transaction_number: '',
        account_number: '',
        start_date: '',
        type: '',
        page: { current: 1, pageSize: 10, total: null }
      },
      loading: true,
      columns: [
        {
          title: this.$t('data'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'Dropdowns',
            filterIcon: 'filterIcon',
            customRender: 'data'
          },
          align: 'center'
        },
        {
          title: this.$t('numbertransactions'),
          dataIndex: 'transaction_number',
          scopedSlots: {
            filterDropdown: 'TransactionNumber',
            filterIcon: 'filterIcon',
            customRender: 'transaction_number' },
          align: 'center'
        },
        {
          title: this.$t('acountnumber'),
          dataIndex: 'account_number',
          scopedSlots: {
            filterDropdown: 'AccountNumber',
            filterIcon: 'filterIcon',
            customRender: 'transaction_number' },
          align: 'center'
        },
        {
          title: this.$t('amount'),
          dataIndex: 'total_amount',
          scopedSlots: { customRender: 'total_amount' }
        },
        {
          title: this.$t('typetransactions'),
          scopedSlots: {
            filterDropdown: 'TypeTransaction',
            filterIcon: 'filterIcon',
            customRender: 'type'
          }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Тип оплаты'),
          // dataIndex: 'currency'
          scopedSlots: { customRender: 'currency' },
          align: 'center',
          width: '200px'
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
    ...mapGetters(['transactionList', 'TrPagination']),
    getPagination () {
      return this.TrPagination
    },
    getUserListTable () {
      return this.transactionList
    }
  },
  methods: {
    handleChangeSelectcatigory (val) {
      this.params.type = val
      this.TrGetListAll()
    },
    AccountNumberSearch (val) {
      this.params.account_number = val
      this.TrGetListAll()
    },
    NumberTransactionSearch (value) {
      this.params.transaction_number = value
      this.TrGetListAll()
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
    ...mapActions(['GetTrListAll']),
    TrGetListAll () {
      this.loading = true
      this.GetTrListAll(this.params)
      .finally(() => {
        this.loading = false
      })
    },
    customRowClick (val, even, data) {
      // console.log(val, even, data)
    },
    onSearch (value) {
      console.log(value)
    },
    handleTableChange (pagination) {
      this.params.page = { ...pagination }
      console.log(pagination)
      this.TrGetListAll()
    }
  },
  mounted () {
  },
  created () {
    this.TrGetListAll()
  }
}
</script>

<style scoped>
.imgBorderRaidus {
  margin-left: 5px;
  background: rgba(250, 250, 250, 1);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  height: 30px;
  width: 30px;
  left: 80px;
  top: 0px;
  border-radius: 30px;
  padding: 4px, 8px, 4px, 8px;

}
.mulitiCard{
  display: flex;
  position: static;
  width: 357px;
  height: 56px;
  left: 20px;
  top: 0px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  box-sizing: border-box;
  border-radius: 8px;
  margin-left: 20px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
.gutter-box {
  padding: 5px 0;
}
.fonSize {
  font-size: 16px;
  cursor: pointer;
}

</style>
