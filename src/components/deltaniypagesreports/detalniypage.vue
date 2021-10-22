<template>
  <div v-if="render" style="background-color: transparent; position: relative">
    <a-spin style="z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" size="large" />
  </div>
  <a-card v-else>
    <div slot="title">
      <a-page-header
        @back="() => $router.go(-1)"
      >
        <div slot="subTitle" style="cursor: pointer" class="route_style">
          <span @click="() => $router.push({name: 'SaleMain'})">{{ 'Отчеты /' }}</span>
          <span @click="() => $router.push({name: router.name})">{{ `${router.path}`+ ' /' }} </span>
          <span><b class="bold_user_name">{{ list.client.first_name + ' ' + list.client.first_name }}</b></span>
        </div>
      </a-page-header>
    </div>
    <div slot="extra">
      <dowlon-Button-excle @handleclick="handleClick" :data="list"/>
    </div>
    <a-card class="card_custom_border">
      <div slot="title" class="order_number"><h4>ИД заказа: {{ list.number }}</h4></div>
      <div slot="extra">
      </div>
    </a-card>
    <a-card class="card_custom_border">
      <div class="wrapper_cashier_and_customer">
        <min-card :name="`${list.cashier.first_name} ${list.cashier.last_name}`" :image="list.cashier.profile_image" :type=" list.cashier.user_type"/>
        <mincard-Rigith :name="`${list.client.first_name} ${' '}${ list.client.last_name}`" :type="list.client.user_type" :image="list.client.profile_image"/>
      </div>
    </a-card>
    <a-card class="card_custom_border">
      <max-card :list="list"/>
    </a-card>
    <a-card class="card_custom_border">
      <div class="tab_card_style">
        <a-tabs type="card" @change="callback">
          <a-tab-pane v-if="$route.query.id === 1|| $route.query.id === '1'" key="1" tab="Список товаров">
            <a-table
              v-if="list.items.length >=0"
              style="margin-top: 30px"
              :columns="columnsone"
              :rowKey="() => Math.random()"
              :dataSource="list.items"
              :loading="loading"
              test-attr="list-customer"
              :pagination="false"
              bordered
            >
              <template slot="tavar" slot-scope="text, row">
                <span style="width: 50px; height: 50px; display: inline-flex; border-radius: 50%">
                  <img style="object-fit: cover" :src="row.product_image" alt="imgId">
                </span>
                <span style="margin-left:5px; position: relative; top: -20px">{{ row.product_name }}</span>
              </template>
              <template slot="kol" slot-scope="text, row">
                <span>{{ row.count }}</span>
              </template>
              <template slot="sena" slot-scope="text, row">
                <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.price.usd_price) }}</span>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane  key="2" tab="Оплата">
            <a-table
              v-if=" list.billing.payment===null|| list.billing.payment.length >= 0"
              style="margin-top: 30px"
              :columns="columnstwo"
              :rowKey="() => Math.random()"
              :dataSource="list.billing.payment"
              :loading="loading"
              test-attr="list-customer"
              :pagination="false"
              bordered
            >
              <template slot="data" slot-scope="text, row">
                <span style="margin-left:5px; position: relative;">{{ moment(row.date).format('YYYY-MM-DD') }}</span>
              </template>
              <template slot="branch" slot-scope="text, row" class="branch_select_style">
                <span class="image_wrapper">
                  <img style="object-fit: cover" :src="row.images === null||row.images === '' ? img : row.images" alt="imgId">
                </span>
                <span class="image_inside_text"  v-if="row">{{ list.branch.name }} {{row.images}}</span>
              </template>
              <template slot="sena" slot-scope="text, row">
                <span v-if="row.currency_type === 'usd'">{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.credit_amount) }}</span>
                <p v-if="row.currency_type === 'uzs'"><b>{{ new Intl.NumberFormat().format(row.credit_amount) }} {{ "so'm" }}</b></p>

              </template>
              <template slot="payment" slot-scope="text, row">
                <span>{{ paymentType[row.payment_type] }}</span>
                <span><img src="" alt=""></span>
              </template>
            </a-table>
            <br>
            <h1 style="color: black"><b>Фото по тип оплаты</b></h1> <br>
            <a-card style="border-left: none; border-right: none; border-bottom: none">
              <div style="display: flex; gap: 30px" >
                <div v-for="(item, index) in list.billing.payment" :key="index">
                  <p style="color: black">{{ paymentType[item.payment_type] }}</p>
                  <p v-if="item.currency_type === 'usd'">{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(item.credit_amount) }}</p>
                  <p v-if="item.currency_type === 'uzs'"><b>{{ new Intl.NumberFormat().format(item.credit_amount) }} {{ "so'm" }}</b></p>

                  <img v-if="length(item.images)" :src="item.images" alt="">
                  <img v-else src="../../assets/colorwhite.png" alt="">
                </div>
              </div>
            </a-card>
            <h1 style="color: black;"><b>Комментарии</b></h1> <br>
            <a-card style="border-left: none; border-right: none; border-bottom: none">
              <p class="commitariy">{{ list.branch.description }}</p>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </a-card>

</template>

<script>
import mincard from '@/components/mincard/mincard'
import myIcons from '@/core/icons'
import moment from 'moment'
import maxcard from '@/components/maxcard/maxcard'
import dowlonButtonexcel from '../../components/excelButton/excelButton'
import mincardRigith from '@/components/minCardRigjth/mincardRigith'
import img from '../../assets/Ellipse 9.png'
export default {
props: ['router', 'list', 'myicons', 'render', 'columnsone', 'loading', 'columnstwo', 'tabnot'],
  components: {
  'min-card': mincard,
    'max-card': maxcard,
    'dowlon-Button-excle': dowlonButtonexcel,
    'mincard-Rigith': mincardRigith
  },
  data () {
  return {
    img,
    myIcons,
    paymentType: {
      'cash': 'Наличные',
      'payme': 'Payme',
      'click': 'Click',
      'uzcard': 'Терминал',
      'humo': 'Терминал',
      'visa': 'Виза',
      'p2p': 'Виза',
       'virtual': 'P2P',
      'balance': 'Остаток'
    }
  }
  },
  methods: {
    callback (key) {
      console.log(key)
    },
    moment,
    length (item) {
      if (item > 0) {
        return true
      } else {
        return false
      }
    },
    handleClick () {
      console.log('excelDowloand')
    }
  },
  mounted () {
  },
  computed: {}
}
</script>

<style scoped>
.tab_card_style {
  margin-top: 36px;
}
.flex{
}
.headerImg {
  display: flex;
  justify-content: space-between
}
.extra {
  display: flex;
}
.spanbalnce {
  position: relative;
  top: 20%;
  padding-right: 5px;
  padding-left: 5px;
}
.wraperbalance {
  background: #F5F5F5;
  border-radius: 6px;
}
.cardmin {
  flex: 0 0 30%;
  border: 1px solid #EEEEEE;
  border-radius: 5px;
  padding: 15px; display: flex;
  justify-content: space-between
}
.commitariy {
  width: 45%;
  padding: 9px;
  background-color:#F7F7FB;
  color: black;
  border-radius: 3px;
}

.route_style {
  margin-top: 1px;
  font-family: Roboto, Arial,serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
}

.bold_user_name {
  color: black;
}

.excel_icon_style {
  background-color: #1890FF;
  height: 40px;
  width: 40px;
  position: relative;
}

  .excel_icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }

.order_number {
  font-family: Roboto,Arial,sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  color: #000000;
  margin-top: 0.5%;
}

.card_custom_border {
  border-right: none;
  border-left: none;
}

.wrapper_cashier_and_customer {
  display: flex;
  justify-content: space-between
}
.image_wrapper {
  width: 50px; height: 50px; display: inline-flex; border-radius: 50%
}
.image_inside_text {
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.85);
  width: 85px;
  margin-left: 12px;
  position: relative;
  top: -21px
}
.branch_select_style {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
