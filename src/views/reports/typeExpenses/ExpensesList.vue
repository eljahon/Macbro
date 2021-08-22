<template>
  <a-card>
    <div slot="title">
      <a-page-header style="width: 40%">
        <div slot="title">
          <a-button type="link" icon="arrow-left" style="color: black" @click="() => $router.go(-1)"></a-button>
          <span class="fonSize">{{ $t('report') }} /</span>
          <router-link :to="{name: 'expensesListMainList'}" style="color: black" class="fonSize">{{ $t('typeExpenses') }}</router-link>
        </div>
      </a-page-header>
    </div>
    <div slot="extra"> <a-input-search :placeholder="'Search'" enter-button @search="onSearch"></a-input-search></div>
    <div>
      <a-card :bordered="false">
        <div slot="title">
          {{ $t('typeExpenses') }}
        </div>
        <div slot="extra">
          <a-button type="primary" icon="plus" @click="EspenCreateListPush">{{ $t('add') }}</a-button>
        </div>
        <div>
<!--          <a-row :gutter="16">-->
<!--            <a-col :xs="{ span: 7, offset: 1 }" :lg="{ span: 7, offset: 2 }" :md="{span: 7, offset: 1 }" :xl="{span: 7, offset: 1 }">-->
<!--              <div class="mulitiCard">-->
<!--                <div style="display: flex; margin-top: 15px">-->
<!--                  <div style="width: 30%; margin-left: 10px;"><a-icon :style="{fontSize: '20px', color: 'blue'}" type="dollar"></a-icon> <span style="margin-left: 10px">Продажа</span></div>-->
<!--                  <div style="30%; float: right;margin-left: 170px"><strong>+$250</strong></div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </a-col>-->
<!--            <a-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }" :md="{span: 7, offset: 1 }" :xl="{span: 7, offset: 1 }">-->
<!--              <div class="mulitiCard">-->
<!--                <div style="display: flex; margin-top: 15px">-->
<!--                  <div style="width: 30%; margin-left: 10px;"><a-icon :style="{fontSize: '20px', color: 'red'}" type="dollar"></a-icon> <span style="margin-left: 10px">Продажа</span></div>-->
<!--                  <div style="30%; float: right;margin-left: 170px"><strong>+$250</strong></div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </a-col>-->
<!--            <a-col class="gutter-row" :span="7" :offset="1">-->
<!--              <div class="mulitiCard">-->
<!--                <div style="display: flex; margin-top: 15px">-->
<!--                  <div style="width: 30%; margin-left: 10px;"><a-icon :style="{fontSize: '20px'}" type="dollar"></a-icon> <span style="margin-left: 10px">Продажа</span></div>-->
<!--                  <div style="30%; float: right;margin-left: 170px"><strong>+$250</strong></div>-->
<!--                </div>-->
<!--              </div>-->
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
<!--          <div slot="Dropdowns" style="padding: 8px; width: 230px;">-->
<!--            <a-range-picker @change="onChangepicker" style="width: 220px" />-->
<!--          </div>-->
<!--          <div slot="Категория" style="padding: 8px; width: 230px;">-->
<!--            <a-input-->
<!--              :placeholder="$t('numbertransactions')"-->
<!--              style="width: 220px; margin-bottom: 0px; display: block;"-->
<!--            />-->
<!--          </div>-->
<!--          <div slot="AccountNumber" style="padding: 8px; width: 230px;">-->
<!--            <a-input-->
<!--              :placeholder="$t('acountnumber')"-->
<!--              style="width: 220px; margin-bottom: 0px; display: block;"-->
<!--            />-->
<!--          </div>-->
          <div
            slot="Категория"
            style="padding: 8px"
          >
            <a-select
              :placeholder="$t('Суб-Категория')"
              style="width: 220px"
              @change="handleChangeSelectcatigory"
              allowClear
            >
              <a-select-option v-for="(catigoriya, index) in sub_account_category" :key="index" :value="catigoriya.id">
                {{ catigoriya.name }}
              </a-select-option>

            </a-select>
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
            <span>{{ moment(row.data).format('YYYY-MM-DD') }}</span>
          </template>
          <template slot="order" slot-scope="text, row">
            <span>{{ row.order }}</span>
          </template>
          <template slot="currency" slot-scope="text, row">
            <!--            <span v-for="(payment, index) in sortDublicat(row.billing_info.payment)" :key="index">-->
            <!--              <img class="imgBorderRaidus" style="width: 50px" v-if="payment === 'payme'" :src="Imgs.payment" alt="Payment">-->
            <img v-if="row.icon" class="imgBorderRaidus"  :src="Imgs.cash" alt="Payment">
            <!--              <img class="imgBorderRaidus" v-if="payment === 'click'" :src="Imgs.click" alt="Payment">-->
            <!--              <img class="imgBorderRaidus" v-if="payment === 'p2p'" :src="Imgs.Vise" alt="Payment">-->
            <!--              <img v-if="payment === 'terminal'" :src="Imgs.Vise" alt="Payment">-->
            <!--            </span>-->
          </template>
          <template slot="type" slot-scope="text, row">
            <a-tag v-if="row.name === 'purchase'"><span>Покупка</span></a-tag>
            <a-tag v-if="row.name === 'sale'" color="blue"><span>Продажа</span></a-tag>
            <a-tag v-if="row.name === 'other'" color="red"><span>Другие</span></a-tag>
            <a-tag v-if="row.name === 'mortgage'" color="green"><span>Ипотека</span></a-tag>
            <a-tag v-if="row.name === 'obed'" color="#D4B483"><span>Подчиняться</span></a-tag>
            <a-tag v-if="row.name === 'cleaning'" color="#87C38F"><span>Уборка</span></a-tag>
            <a-tag v-if="row.name === 'products'" color="#F4F0BB"><span>Продукты</span></a-tag>
            <a-tag v-if="row.name === 'advertisement'" color="#48A9A6"><span>Рекламное объявление</span></a-tag>
            <a-tag v-if="row.name === 'taxi'" color="#ffb703"><span>Такси</span></a-tag>
            <a-tag v-if="row.name === 'salary'" color="#ffcdb2"><span>Зарплата</span></a-tag>
            <a-tag v-if="row.name === 'rent'" color="#a8dadc"><span>Арендовать</span></a-tag>
            <a-tag v-if="row.name === 'communal'" color="#fcd5ce"><span>Коммунальный</span></a-tag>
            <a-tag v-if="row.name === 'internet'" color="#ffafcc"><span>Интернет</span></a-tag>
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
      sub_account_category: [
        { id: 'a7116be6-9a57-4f51-888e-0820f5c8f3f6', name: 'Продажа' },
        { id: 'c12f9ee7-0388-46fa-8c9b-b23a71cb9f9e', name: 'Покупка' },
        { id: '236c315f-e3f7-4b69-b28d-c2cdaafcba21', name: 'Другие' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a43', name: 'Подчиняться' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a44', name: 'Уборка' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a49', name: 'Продукты' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a50', name: 'Рекламное объявление' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a45', name: 'Такси' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a51', name: 'Зарплата' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a46', name: 'Арендовать' }
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
        start_date: '',
        page: { current: 1, pageSize: 10, total: null }
      },
      loading: true,
      columns: [
        {
          title: this.$t('Иконка'),
          // dataIndex: 'currency'
          scopedSlots: { customRender: 'currency' },
          align: 'center',
          width: '200px'
        },
        // {
        //   title: this.$t('data'),
        //   // dataIndex: 'first_name',
        //   scopedSlots: {
        //     filterDropdown: 'Dropdowns',
        //     filterIcon: 'filterIcon',
        //     customRender: 'data'
        //   },
        //   align: 'center'
        // },
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
          // dataIndex: 'total_amount',
          align: 'center',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: this.$t('Суб-Категория'),
          align: 'center',
          scopedSlots: {
            filterDropdown: 'Категория',
                filterIcon: 'filterIcon',
            customRender: 'type' }
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
    ...mapGetters(['EspaneGetAllList', 'EspenPagination']),
    getPagination () {
      return this.EspenPagination
    },
    getUserListTable () {
      return this.EspaneGetAllList
    }
  },
  methods: {
    EspenCreateListPush () {
      this.$router.push({ name: 'expensesCreateListMainList' })
    },
    handleChangeSelectcatigory (val) {
      // this.params.category_id = val
      console.log(val)
      // this.SubAcountGetListAll()
    },
    onChangepicker (val, event) {
      console.log(val, event)
      this.params.start_date = event[0]
      this.params.end_date = event[1]
      this.EspenGetListAll()
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
    ...mapActions(['GetEspenListAll']),
    EspenGetListAll () {
      this.loading = true
      this.GetEspenListAll(this.params)
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
      this.EspenGetListAll()
    }
  },
  mounted () {
  },
  created () {
    this.EspenGetListAll()
  }
}
</script>

<style scoped>
.imgBorderRaidus {
  /*display: flex;*/
  flex-direction: row;
  align-items: flex-start;
  padding: 6px;

  position: static;
  width: 40px;
  height: 40px;
  left: 28px;
  top: 8px;

  /* Blue */

  /*background: #1890FF;*/
  border-radius: 8px;
  /*margin-left: 5px;*/
  /*background: blue;*/
  /*color: white;*/
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  /*height: 30px;*/
  /*width: 30px;*/
  /*left: 80px;*/
  /*top: 0px;*/
  /*border-radius: 30px;*/
  /*padding: 4px, 8px, 4px, 8px;*/

}
.mulitiCard{
  display: flex;
  position: static;
  width: 357.33px;
  height: 56px;
  left: 0px;
  top: 0px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
.gutter-box {
  padding: 5px 0;
}
.fonSize {
  font-size: 16px;
}

</style>
