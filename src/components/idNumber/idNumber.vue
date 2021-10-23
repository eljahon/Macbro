<template>
  <a-card class="card_custom_border">
    <div slot="title" class="order_number"><h4>ИД заказа: {{ number }}</h4></div>
  </a-card>
</template>

<script>
export default {
props: ['number']
}
</script>

<style scoped>
.card_custom_border {
  border-right: none;
  border-left: none;
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
</style>
