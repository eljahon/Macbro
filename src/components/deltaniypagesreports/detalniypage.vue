<template>
  <div v-if="render" style="background-color: transparent; position: relative">
    <a-spin style="z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" size="large" />
  </div>
  <a-card v-else>
    <div slot="title">
      <a-page-header
        @back="() => $router.go(-1)"
      >
        <div slot="subTitle" style="cursor: pointer">
          <span @click="() => $router.push({name: 'SaleMain'})">{{ 'Отчеты /' }}</span> <span @click="() => $router.push({name: router.name})">{{ `${router.path}`+ ' /' }} </span><span>{{ this.list.client.first_name + ' ' + this.list.client.first_name }}</span>
        </div>
      </a-page-header>
    </div>
    <div slot="extra"><a-button icon="dowlond" style="background-color: #1890FF; color: white; border:none">
      <a-icon :component="myIcons.excal"></a-icon></a-button></div>
    <a-card class="border">
      <div slot="title"><h4>ИД заказа: {{ list.number }}</h4></div>
    </a-card>
    <a-card class="border">
      <div slot="title" class="headerImg">
        <min-card :name="`${list.cashier.first_name} ${list.cashier.last_name}`" :type="list.cashier.user_type" :image="list.cashier.profile_image"/>
        <div style="flex: 0 0 30%; display: flex;justify-content: flex-end; gap: 10px">
          <div style="flex: 0 0 50%">  <min-card :name="`${list.client.first_name} ${list.client.last_name}`" :type="list.client.user_type" :image="list.client.profile_image"/>
          </div>
          <div style="flex: 0 0 20%" class="wraperbalance"><span class="spanbalnce">Баланс: {{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.total_amount) }}</span>
          </div>
        </div>
      </div>
    </a-card>
    <max-card :list="list"/>
    <div style="margin-top: 20px">
      <a-tabs type="card" @change="callback">
        <a-tab-pane v-if="$route.query.id === 1|| $route.query.id === '1'" key="1" tab="Список товаров">
          <a-table
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
        <a-tab-pane key="2" tab="Оплата">
          <a-table
            style="margin-top: 30px"
            :columns="columnstwo"
            :rowKey="() => Math.random()"
            :dataSource="[list.billing]"
            :loading="loading"
            test-attr="list-customer"
            :pagination="false"
            bordered
          >
            <template slot="data" slot-scope="text, row">
              <span style="margin-left:5px; position: relative;">{{ moment(row.payment[0].date).format('YYYY-MM-DD') }}</span>
            </template>
            <template slot="branch" slot-scope="text, row">
              <span v-if="row">{{ list.branch.name }}</span>
            </template>
            <template slot="sena" slot-scope="text, row">
              <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.payment[0].credit_amount) }}</span>
            </template>
            <template slot="payment" slot-scope="text, row">
              <span>{{ row.payment[0].payment_type }}</span>
            </template>
          </a-table>
          <br>
          <h1 style="color: black"><b>Фото по тип оплаты</b></h1> <br>
          <a-card style="border-left: none; border-right: none; border-bottom: none">
            <div style="display: flex; gap: 30px">
              <div>
                <p style="color: black">Payme</p>
                <p>$500</p>
                <!--                <img src='../../../assets/colorwhite.png' alt=''>-->
              </div>
              <div>
                <p style="color: black">Payme</p>
                <p>$500</p>
                <!--                <img src='../../../assets/Rectangle1487.png' alt=''>-->
              </div>
              <div>
                <p style="color: black">Payme</p>
                <p>$500</p>
                <!--                <img src='../../../assets/colorwhite.png' alt=''>-->
              </div>
              <!--    <div><img src='../../../assets/Rectangle1487.png' alt=''></div>-->
            </div>
          </a-card>
          <h1 style="color: black;"><b>Комментарии</b></h1> <br>
          <a-card style="border-left: none; border-right: none; border-bottom: none">
            <p style="width: 55%; padding: 9px; background-color:#F7F7FB; color: black; border-radius: 3px; ">{{ list.branch.description }}</p>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>

</template>

<script>
import mincard from '@/components/mincard/mincard'
import myIcons from '@/core/icons'
import moment from 'moment'
import maxcard from '@/components/maxcard/maxcard'
export default {
props: ['router', 'list', 'myicons', 'render', 'columnsone', 'loading', 'columnstwo'],
  components: {
  'min-card': mincard,
    'max-card': maxcard
  },
  data () {
  return {
    myIcons
  }
  },
  methods: {
    callback (key) {
      console.log(key)
    },
    moment
  },
  mounted () {
  },
  computed: {}
}
</script>

<style scoped>
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
</style>
