<template>
  <div style="display: flex; margin-top: 10px; gap: 25px">
    <div class="cardmin">
      <div class="wrapper_class">
        <p><a-icon class="icon_style" type="shop" style="color: #00A0E9"></a-icon> <span>Филиал</span></p>
        <p><a-icon class="icon_style" type="calendar" style="color: #00A0E9"></a-icon> <span>Дата</span></p>
        <p><a-icon class="icon_style" type="dollar" style="color: #00A0E9"></a-icon> <span>Итого</span></p>
      </div>
      <div class="wrapper_class">
        <p class="text_claor"><b>{{ list.branch.name }}</b></p>
        <p class="text_claor"><b>{{ moment(list.billing.created_at).format('YYYY-MM-DD') }}</b></p>
        <p class="text_claor"><b> {{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.total_amount) }}</b></p>

      </div>
    </div>
    <div class="cardmin">
      <div class="wrapper_class">
        <p><a-icon class="icon_style" type="dollar" style="color: #00A0E9"></a-icon> <span>Оплачено</span></p>
        <p><a-icon class="icon_style" type="dollar" style="color: #00A0E9"></a-icon> <span>сумма</span></p>
      </div>
      <div class="wrapper_class">
        <p class="text_claor"><b>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.paid_amount.usd) }}</b></p>
        <p class="text_claor"><b>{{ new Intl.NumberFormat().format(list.billing.paid_amount.uzs) }} {{ "so'm" }}</b></p>

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
  padding: 15px;
  display: flex;
  justify-content: space-between;
  font-family: Roboto, sans-serif;
  font-style: normal;
  box-sizing: border-box;
  border-radius: 4px;
}
.wrapper_class {
  margin-top: 20px;
  padding-right: 24px;
  padding-left: 25px;
  color: rgba(153, 153, 153, 1);
}
.text_claor {
  color: rgba(0, 0, 0, 1);
}
.icon_style {
  margin-right: 16px;
}
</style>
