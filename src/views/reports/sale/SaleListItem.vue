<template>
  <div v-if="render" style='background-color: transparent; position: relative'>
    <a-spin style='z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)'  size="large" />
  </div>
  <a-card v-else>
    <div slot="title">
      <a-page-header
        @back="() => $router.go(-1)"
      >
        <div slot="subTitle" style="cursor: pointer">
          <span @click="() => $router.push({name: 'SaleMain'})">{{ 'Отчеты /' }}</span> <span @click="() => $router.push({name: 'SaleMain'})">{{ 'Продажа /' }} </span><span>{{ clientname }}</span>
        </div>
      </a-page-header>
    </div>
    <div slot="extra"><a-button icon="dowlond" style="background-color: #1890FF; color: white; border:none">
      <a-icon :component="myIcons.excal"></a-icon></a-button></div>
    <a-card style="border-left: 1px solid white; border-right: 1px solid white">
      <div slot="title"><h4>ИД заказа: {{ list.number }}</h4></div>
    </a-card>
    <a-card style="border-left: 1px solid white; border-right: 1px solid white">
      <div slot="title" style='display: flex; gap: 7px; align-items: center'>
        <img style='max-height: 30px; max-width: 30px; min-height: 30px; min-width: 30px;  border-radius: 50%' :src='list.client.profile_image' alt='clientimage'>
        <div>
          <h5 style='font-size: 14px'>{{ list.client.first_name }} {{ list.client.last_name }}</h5>
          <h6 style='background-color: #F2F3F5; text-align: center; color:#818C99; border-radius: 2px; font-size: 12px '>{{ list.cashier.user_type }}</h6>
        </div>
<!--        <p>{{ list.client.first_name }} {{ list.client.last_name }}</p>-->
<!--        <a-tag > <span style="font-size: 18px">{{ list.cashier.user_type }}</span></a-tag>-->
      </div>
      <div slot="extra">
        <a-tag style="padding: 12px"><span style=" font-size: 18px; color: black">Баланс: {{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.total_amount) }}</span></a-tag>
      </div>
    </a-card>
    <div style="display: flex; margin-top: 10px; gap: 15px">
      <div style="flex: 0 0 30%; border: 1px solid #EEEEEE; border-radius: 5px; padding: 15px; display: flex; justify-content: space-between ">
        <div>
          <p><a-icon type="shop" style="color: #00A0E9"></a-icon> <span>Филиал</span></p>
          <p><a-icon type="calendar" style="color: #00A0E9"></a-icon> <span>Дата</span></p>
          <p><a-icon type="dollar" style="color: #00A0E9"></a-icon> <span>Итого</span></p>
        </div>
        <div>
          <p><b>{{ list.branch.name }}</b></p>
          <p><b>{{ moment(list.billing.created_at).format('YYYY-MM-DD') }}</b></p>
          <p><b> {{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.total_amount) }}</b></p>

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
          <p><b>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.paid_amount.usd) }}</b></p>
          <p><b>{{ new Intl.NumberFormat().format(list.billing.paid_amount.uzs) }} {{ "so'm" }}</b></p>

        </div>
      </div>

    </div>
    <!--    tabs-->
    <div style="margin-top: 20px">
      <a-tabs type="card" @change="Callback">
        <a-tab-pane v-if="$route.query.id === 1" key="1" tab="Список товаров">
          <a-table
            style="margin-top: 30px"
            :columns="columnsTabOne"
            :rowKey="() => Math.random()"
            :dataSource="list.items"
            :loading="loading"
            test-attr="list-customer"
            :pagination="false"
            bordered
          >
            <!--                <div slot="Aккаунта" style="padding: 8px; width: 230px;">-->
            <!--                  <a-select-->
            <!--                    :placeholder="$t('Тип аккаунта')"-->
            <!--                    style="width: 220px"-->
            <!--                    @change="AccountTypeSearch"-->
            <!--                    allowClear-->
            <!--                  >-->
            <!--                    <a-select-option v-for="(catigoriya, index) in AccountGrups" :key="index" :value="catigoriya.id">-->
            <!--                      {{ catigoriya.name }}-->
            <!--                    </a-select-option>-->
            <!--                  </a-select>-->
            <!--                </div>-->
            <!--                <div-->
            <!--                  slot="аккаунта"-->
            <!--                  style="padding: 8px"-->
            <!--                >-->
            <!--                  <a-input-number-->
            <!--                    :placeholder="`ИД. аккаунта`"-->
            <!--                    v-debounce="AccountSearch"-->
            <!--                    style="width: 188px; margin-bottom: 8px; display: block;"-->
            <!--                  />-->
            <!--                </div>-->
            <!--                <a-icon-->
            <!--                  style="font-size: 20px; color: transparent; background-color: transparent"-->
            <!--                  slot="filterIcon"-->
            <!--                  class="filter-dropdown-icon"-->
            <!--                  :component="$myIcons.filterDownIcon"-->
            <!--                />-->
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
            :columns="columnsTabTwo"
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
        </a-tab-pane>
      </a-tabs>
    </div>
    <br>
    <h1 style='color: black'><b>Фото по тип оплаты</b></h1> <br>
<a-card style='border-left: none; border-right: none; border-bottom: none'>
  <div style='display: flex; gap: 30px'>
    <div>
      <p style='color: black'>Payme</p>
      <p>$500</p>
      <img src='../../../assets/colorwhite.png' alt=''>
    </div>
    <div>
      <p style='color: black'>Payme</p>
      <p>$500</p>
      <img src='../../../assets/Rectangle1487.png' alt=''>
    </div>
    <div>
      <p style='color: black'>Payme</p>
      <p>$500</p>
      <img src='../../../assets/colorwhite.png' alt=''>
    </div>
<!--    <div><img src='../../../assets/Rectangle1487.png' alt=''></div>-->
  </div>
</a-card>
    <h1 style='color: black;'><b>Комментарии</b></h1> <br>
<a-card style='border-left: none; border-right: none; border-bottom: none'>
  <p style='width: 55%; padding: 9px; background-color:#F7F7FB; color: black; border-radius: 3px; '>At enim feugiat at dolor dictum. Eu amet nec lorem eget eget ut malesuada facilisi. Cras lorem est ultricies vitae facilisi dis in nisl turpis. Mattis amet quam id id turpis quam scelerisque. Nulla sapien aenean natoque massa, odio dolor, est imperdiet. Nisi, suscipit ipsum semper sagittis. Vulputate dignissim vitae eget quam sagittis.</p>
</a-card>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment/moment'
import myIcons from '@/core/icons'

export default {
data () {
  return {
    myIcons,
    render: true,
    list: {},
    clientname: '',
    tableListone: [],
    tableListtwo: [],
    columnsTabOne: [
      {
        title: this.$t('Товары'),
        // dataIndex: 'first_name',
        scopedSlots: {
          filterDropdown: 'аккаунта',
          filterIcon: 'filterIcon',
          customRender: 'tavar'
        }
      },
      {
        title: this.$t('Кол-во '),
        scopedSlots: { customRender: 'kol' }
      },
      {
        title: this.$t('Цена '),
        scopedSlots: { customRender: 'sena' }
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
    ],
    loading: false
  }
},
  computed: {
  getListTabOne () {
    return this.tableListone
  },
    getListTabTwo () {
    return this.tableListtwo
    }
  },
  methods: {
  ...mapActions(['itemGetAllList', 'itemsIpatekaList']),
    moment,
    format (res) {
      this.list = res
      this.clientname = `${res.client.first_name}${' '}${res.client.last_name}`
    },
    Callback (key) {
      console.log(key)
    },
    itemGetOrderList (id) {
      this.itemGetAllList(id)
      .then(res => {
        console.log('res =>>', res)
        this.list = res
        this.tableList = res.items
        this.clientname = `${res.client.first_name}${' '}${res.client.last_name}`
        this.render = false
      })
    },
    itemIpatekaList (id) {
    this.itemsIpatekaList(id)
      .then(res => {
        console.log('res =>>', res)
        this.list = res
        this.tableListone = res.items
        this.render = false
        this.tableListtwo = [res.billing]
        this.clientname = `${res.client.first_name}${' '}${res.client.last_name}`
      })
    }
   },
  mounted () {
  },
  created () {
    if (this.$route.query.id === 1) {
      this.itemGetOrderList(this.$route.params.id)
    } else {
      this.itemIpatekaList(this.$route.params.id)
    }
  }
}
</script>

<style scoped>
.ant-table-row ant-table-row-level-0 {
  height: 10px !important;
}
</style>
