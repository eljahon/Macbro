<template>
  <div v-if="render" style="background-color: transparent; position: relative">
    <a-spin
      style="z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
      size="large" />
  </div>
  <a-card v-else>
    <div slot="title">
      <back-Router-Name :router="router" />
    </div>
    <div slot="extra">
      <excel-button @handleclick="excelDowlond" />
    </div>
    <a-card style="border-left: none; border-right: none; border-bottom: none">
      <div slot="title"><span class="style_party_id">ИД партии: {{ list.number }}</span></div>
    </a-card>
    <a-card style=" border-left: none; border-right: none; border-bottom: none">
      <client-card :list="list" />
    </a-card>
    <a-card style=" border-bottom: none; border-left: none; border-right: none">
      <a-tabs type="card" @change="callbak">
        <a-tab-pane key="1" tab="Основные сведения">
          <a-table
            style="margin-top: 30px; cursor: pointer"
            :columns="columnsparisherItem"
            :rowKey="() => Math.random()"
            :dataSource="list.items"
            :pagination="getPagination"
            :loading="loading"
            @change="handleTableChange"
            test-attr="list-customer"
            bordered
          >
            <template slot="name" slot-scope="text, row">
              <span style="width: 50px; height: 50px; display: inline-flex; border-radius: 50%">
                <img
                  style="object-fit: cover"
                  :src="row.product_image.length > 0 ?row.product_image : defoultImg"
                  alt="imgId">
              </span>
              <span style="margin-left:5px; position: relative; top: -20px">{{ row.product_name }}</span>
            </template>
            <template slot="status" slot-scope="text, row">
              <a-tag :color="towarState.status[row.product_state].color">{{ towarState.status[row.product_state].name
              }}
              </a-tag>
            </template>
            <template slot="imstatus" slot-scope="text, row">
              <a-tag :color="towarState.imstatus[row.imei_status].color">{{ towarState.imstatus[row.imei_status].name
              }}
              </a-tag>
            </template>
            <!--            <div v-for="(item, index) in list.items" :key="index">-->
            <!--              <div v-if="item.payment_type === 'cash'">-->
            <template slot="number" slot-scope="text, row">
              <span>{{ numberFormat(row.buy_price) }}</span>
            </template>
            <template slot="kol" slot-scope="text, row">
              <span>{{ row.count }}</span>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="IMEI">
          <a-table
            style="margin-top: 30px"
            :columns="columns"
            :rowKey="() => Math.random()"
            :dataSource="imicode"
            :loading="loading"
            test-attr="list-customer"
            :pagination="false"
            bordered>
            <template slot="tavar" slot-scope="text, row">
              <span style="width: 50px; height: 50px; display: inline-flex; border-radius: 50%">
                <img
                  style="object-fit: cover"
                  :src="imgSelect(row.product_image)"
                  alt="imgId">
              </span>
              <span style="margin-left:5px; position: relative; top: -20px">{{ row.product_name }}</span>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Оплата">
          <maxcard :list="list" />
          <payment-type :list="list" :columnstwo="columnsTabTwo" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
</template>

<script>
import myIcons from '@/core/icons'
import img from '../../../assets/Ellipse 9.png'
import dataUseType from '@/constants/constdata'
import { mapActions } from 'vuex'
import defoultImg from '../../../assets/phone.svg'
import excelButton from '@/components/excelButton/excelButton'
import backRouterName from '@/components/backRouter/backRouterName'
// import { mapActions } from 'vuex'
import mincard from '@/components/mincard/mincard'
import clientCard from '@/components/clientCard/clientCard'
import towarState from '@/constants/towarState'
import Maxcard from '@/components/maxcard/maxcard'
// eslint-disable-next-line import/no-duplicates
import PaymentType from '@/components/paymentType/paymentType'

export default {
  components: { PaymentType, Maxcard, mincard, excelButton, backRouterName, clientCard },
  data () {
    return {
      myIcons,
      render: true,
      dataUseType,
      towarState,
      img,
      columns: [
        {
          title: this.$t('Товары'),
          scopedSlots: { customRender: 'tavar' }
        },
        {
          title: this.$t('IMEI'),
          dataIndex: 'imei_code',
          scopedSlots: { customRender: 'imei' }
        }
      ],
      imparams: {
        limit: 1000,
        page: 1,
        party_id: this.$route.params.id
      },
      imicode: [],
      defoultImg,
      router: {
        name: 'parishesListMain',
        text: 'приходов',
        userName: ''
      },
      loading: false,
      list: [],
      params: {
        page: { current: 1, pageSize: 10, total: null }
      },
      columnsparisherItem: [
        {
          title: 'Товары',
          dataIndex: 'product_name',
          key: 'name',
          width: 400,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Наличные',
          children: [
            {
              title: 'Кол-во',
              key: 'age',
              scopedSlots: { customRender: 'kol' }
            },
            {
              title: 'Цена',
              scopedSlots: { customRender: 'number' }
            }
          ]
        },
        {
          title: 'Реализация',
          children: [
            {
              title: 'Кол-во',
              dataIndex: 'asdasddsad',
              key: 'dadfsfgfdfgdg',
              scopedSlots: { customRender: 'realone' }
            },
            {
              title: 'Цена',
              dataIndex: 'companyName',
              key: 'companyName',
              scopedSlots: { customRender: 'realtwo' }
            }
          ]
        },
        {
          title: 'Консегнация',
          children: [
            {
              title: 'Кол-во',
              dataIndex: 'asdadsd',
              key: 'companyAddress',
              scopedSlots: { customRender: 'consignationone' }
            },
            {
              title: 'Цена',
              dataIndex: 'companyAddress',
              key: 'dssdfdfsfs',
              scopedSlots: { customRender: 'consignationtwo' }
            },
            {
              title: 'Дата ',
              dataIndex: 'companyName',
              key: 'dfgdfdsfg'
            }
          ]
        },
        {
          title: 'Состояние',
          dataIndex: 'gender',
          key: 'gender',
          width: 200,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'IMEI',
          dataIndex: 'gender',
          key: 'imstatus',
          width: 120,
          scopedSlots: { customRender: 'imstatus' }

        }
      ],
      columnsTabTwo: [
        {
          title: this.$t('Дата'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'data'
          }
        },
        {
          title: this.$t('Филиал '),
          scopedSlots: { customRender: 'branch' }
        },
        {
          title: this.$t('Сумма '),
          scopedSlots: { customRender: 'sena' }
        },
        {
          title: this.$t('Тип оплаты '),
          scopedSlots: { customRender: 'payment' }
        }
      ]
    }
  },
  computed: {
    // ...mapGetters(['getItemParishesList']),
    getParishesList () {
      return []
    },
    getPagination () {
      return {}
    },
    getWritingList () {
      return []
    },
    getwrititngPaginotin () {
      return {}
    }
  },
  methods: {
    ...mapActions(['getItemParishesList', 'gerImacodeListAll']),
    getItemParishes () {
      this.getItemParishesList(this.$route.params.id)
        .then(res => {
          this.list = res
          this.router.userName = `${res.counter_agent.first_name}${' '}${res.counter_agent.last_name}`
          this.render = false
          console.log('res ====>>>', res)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getImacodeList () {
      this.gerImacodeListAll(this.imparams)
        .then(res => {
          this.imicode = res.items
        })
    },
    imgSelect (img) {
      if (img === '') {
        return this.defoultImg
      } else {
        return img
      }
    },
    callbak (key) {
      console.log(key)
    },
    handleTableChange (pagination) {
      this.params.page = { ...pagination }
    },
    excelDowlond () {
      console.log('excelDowlonds')
    },
    numberFormat (number) {
      return new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(number)
    }
  },
  mounted () {
    console.log('=======')
    this.getItemParishes()
    this.getImacodeList()
  }
}
</script>

<style scoped>
.style_party_id {
  position: static;
  width: 236px;
  height: 22px;
  left: 32px;
  top: 25px;

  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height, or 122% */

  display: flex;
  align-items: center;

  color: #000000;
}
</style>
