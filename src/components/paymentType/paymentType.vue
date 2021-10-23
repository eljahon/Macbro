<template>
  <div>
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
        <span class="image_inside_text" v-if="row">{{ branchName(list) }} {{ row.images }}</span>
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
      <p class="commitariy">{{ branchName(list) }}</p>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import img from '../../assets/Ellipse 9.png'

export default {
 props: ['list', 'columnstwo'],
  data () {
   return {
     img,
     loading: false,
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
    length (item) {
      if (item > 0) {
        return true
      } else {
        return false
      }
    },
    moment,
    branchName (name) {
      return name?.branch?.name
    }
  }
}
</script>

<style scoped>

</style>
