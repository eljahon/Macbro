<template>
  <div v-if="render" style="background-color: transparent; position: relative">
    <a-spin style="z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" size="large" />
  </div>
  <a-card v-else>
    <div slot="title">
      <back-Router-Name :router="router"/>
    </div>
    <div slot="extra">
      <excel-button @handleclick="excelDowlond"/>
    </div>
    <a-card style="border-left: none; border-right: none; border-bottom: none">
      <div slot="title"> <span class="style_party_id">ИД партии: {{ list.number }}</span></div>
    </a-card>
    <a-card style=" border-left: none; border-right: none; border-bottom: none">
      <client-card :list="list"/>
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
                <img style="object-fit: cover" :src="row.product_image.length > 0 ?row.product_image : defoultImg" alt="imgId">
              </span>
              <span style="margin-left:5px; position: relative; top: -20px">{{ row.product_name }}</span>
            </template>
            <template slot="status" slot-scope="text, row">
              <a-tag :color="towarState.status[row.product_state].color">{{ towarState.status[row.product_state].name }}</a-tag>
            </template>
            <template slot="imstatus" slot-scope="text, row">
              <a-tag :color="towarState.imstatus[row.imei_status].color">{{ towarState.imstatus[row.imei_status].name }}</a-tag>
            </template>
<!--            <div v-for="(item, index) in list.items" :key="index">-->
<!--              <div v-if="item.payment_type === 'cash'">-->
                <template slot="number" slot-scope="text, row">
                  <span>{{ numberFormat(row.buy_price) }}</span>
                </template>
                <template slot="kol" slot-scope="text, row">
                  <span>{{ row.count }}</span>
                </template>
<!--              </div>-->
<!--              <div v-if="item.payment_type === 'real'">-->
<!--                <template slot="realone" slot-scope="text, row">-->
<!--                  <span>{{ numberFormat(row.buy_price) }}</span>-->
<!--                </template>-->
<!--                <template slot="realtwo" slot-scope="text, row">-->
<!--                  <span>{{ row.count }}</span>-->
<!--                </template>-->
<!--              </div>-->
<!--              <div v-if="item.payment_type === 'consignation'">-->
<!--                <template slot="consignationone" slot-scope="text, row">-->
<!--                  <span>{{ numberFormat(row.buy_price) }}</span>-->
<!--                </template>-->
<!--                <template slot="consignationtwo" slot-scope="text, row">-->
<!--                  <span>{{ row.count }}</span>-->
<!--                </template>-->
<!--              </div>-->
<!--            </div>-->
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="IMEI">
          <a-table
            style="margin-top: 30px"
            :columns="columns"
            :rowKey="() => Math.random()"
            :dataSource="getWritingList"
            :loading="loading"
            test-attr="list-customer"
            :pagination="false"
            bordered >
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Оплата">
          <div style="display: flex; margin-top: 10px; gap: 15px">
            <div style="flex: 0 0 30%; border: 1px solid #EEEEEE; border-radius: 5px; padding: 15px; display: flex; justify-content: space-between ">
              <div>
                <p><a-icon type="shop" style="color: #00A0E9"></a-icon> <span>Филиал</span></p>
                <p><a-icon type="calendar" style="color: #00A0E9"></a-icon> <span>Дата</span></p>
                <p><a-icon type="dollar" style="color: #00A0E9"></a-icon> <span>Итого</span></p>
              </div>
              <div>
                <!--                <p><b>{{ list.branch.name }}</b></p>-->
                <!--                <p><b>{{ moment(list.billing.created_at).format('YYYY-MM-DD') }}</b></p>-->
                <!--                <p><b> {{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.total_amount) }}</b></p>-->

              </div>
            </div>
            <div style="flex: 0 0 30%; border: 1px solid #EEEEEE; border-radius: 5px; padding: 15px; display: flex; justify-content: space-between ">
              <div>
                <!--          <p><a-icon type="shop" style="color: #00A0E9"></a-icon> <span>Филиал</span></p>-->
                <!--          <p><a-icon type="calendar" style="color: #00A0E9"></a-icon> <span>Дата</span></p>-->
                <p><a-icon type="dollar" style="color: #00A0E9"></a-icon> <span>Оплачено</span></p>
                <p><a-icon type="dollar" style="color: #00A0E9"></a-icon> <span>сумма</span></p>
              </div>
              <div>
                <!--          <p><b>Макбро Малика</b></p>-->
                <!--          <p><b>10.03.2021, 17:30</b></p>-->
                <!--                <p><b>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.paid_amount.usd) }}</b></p>-->
                <!--                <p><b>{{ new Intl.NumberFormat().format(list.billing.paid_amount.uzs) }} {{ "so'm" }}</b></p>-->

              </div>
            </div>

          </div>
          <a-table
            style="margin-top: 30px"
            :columns="columns"
            :rowKey="() => Math.random()"
            :dataSource="getWritingList"
            :loading="loading"
            test-attr="list-customer"
            :pagination="false"
            bordered >
          </a-table>
          <!--            <template slot="tavar" slot-scope="text, row">-->
          <!--              <span style="width: 50px; height: 50px; display: inline-flex; border-radius: 50%">-->
          <!--                <img style="object-fit: cover" :src="row.product_image" alt="imgId">-->
          <!--              </span>-->
          <!--              <span style="margin-left:5px; position: relative; top: -20px">{{ row.product_name }}</span>-->
          <!--            </template>-->
          <!--            <template slot="kol" slot-scope="text, row">-->
          <!--              <span>{{ row.count }}</span>-->
          <!--            </template>-->
          <!--            <template slot="sena" slot-scope="text, row">-->
          <!--              <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.price.usd_price) }}</span>-->
          <!--            </template>-->
          <div style="margin-top: 20px"><span style="font-size: 20px; color: black">Фото по тип оплаты</span></div>
          <a-card style="border-left: none; border-right: none; border-bottom: none">
            <div style="display: flex; gap: 30px">
              <div>
                <p style="color: black">Payme</p>
                <p>$500</p>
                <img src="../../../assets/colorwhite.png" alt="">
              </div>
              <div>
                <p style="color: black">Payme</p>
                <p>$500</p>
                <img src="../../../assets/Rectangle1487.png" alt="">
              </div>
              <div>
                <p style="color: black">Payme</p>
                <p>$500</p>
                <img src="../../../assets/colorwhite.png" alt="">
              </div>
              <!--    <div><img src='../../../assets/Rectangle1487.png' alt=''></div>-->
            </div>
          </a-card>

          <div style="margin-top: 20px"><span style="font-size: 20px; color: black">Комментарии</span></div>
          <br>
          <a-card style="border-bottom: none; border-left: none; border-right: none">
            <div style="background-color: #F7F7FB; padding: 10px; border-radius: 8px"><p>At enim feugiat at dolor dictum
              Eu amet nec lorem eget eget ut malesuada facilisi
              Cras lorem est ultricies vitae facilisi dis in nisl turpis
              Mattis amet quam id id turpis quam scelerisque. Nulla sapien aenean natoque
              massa, odio dolor, est imperdiet. Nisi, suscipit ipsum semper sagittis.
              Vulputate dignissim vitae eget quam sagittis.</p></div>
          </a-card>
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
export default {
  components: { mincard, excelButton, backRouterName, clientCard },
  data () {
    return {
      myIcons,
      render: true,
      dataUseType,
      towarState,
      img,
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
      columns: [
        {
          title: this.$t('Дата'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'tavar'
          }
        },
        {
          title: this.$t('Кассир '),
          scopedSlots: { customRender: 'kol' }
        },
        {
          title: this.$t('Тип оплаты '),
          scopedSlots: { customRender: 'sena' }
        },
        {
          title: this.$t('Сумма '),
          scopedSlots: { customRender: 'sena' }
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
    ...mapActions(['getItemParishesList']),
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
