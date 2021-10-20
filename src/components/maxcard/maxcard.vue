<template>
  <div style="display: flex; margin-top: 10px; gap: 15px">
    <div class="cardmin">
      <div>
        <p><a-icon type="shop" style="color: #00A0E9"></a-icon> <span>Филиал</span></p>
        <p><a-icon type="calendar" style="color: #00A0E9"></a-icon> <span>Дата</span></p>
        <p><a-icon type="dollar" style="color: #00A0E9"></a-icon> <span>Итого</span></p>
      </div>
      <div>
        <p><b>{{ list.branch.name }}</b></p>
        <p><b>{{ moment(list.billing.created_at).format('YYYY-MM-DD') }}</b></p>
<!--        <p><b> {{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.total_amount) }}</b></p>-->

      </div>
    </div>
    <div class="cardmin">
      <div>
        <p><a-icon type="dollar" style="color: #00A0E9"></a-icon> <span>Оплачено</span></p>
        <p><a-icon type="dollar" style="color: #00A0E9"></a-icon> <span>сумма</span></p>
      </div>
      <div>
        <p><b>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.paid_amount.usd) }}</b></p>
        <p><b>{{ new Intl.NumberFormat().format(list.billing.paid_amount.uzs) }} {{ "so'm" }}</b></p>

      </div>
    </div>

  </div>

</template>

<script>
import moment from 'moment'
export default {
 props: ['list'],
  mounted () {
    console.log('this.list =>', this.list)
  },
  methods: {
    moment
  }
}
</script>

<style scoped>
.cardmin {
  flex: 0 0 30%;
  border: 1px solid #EEEEEE;
  border-radius: 5px;
  padding: 15px; display: flex;
  justify-content: space-between
}
</style>
