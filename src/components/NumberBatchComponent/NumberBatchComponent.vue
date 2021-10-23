<template>
  <a-card style="border-right: none; border-left: none">
    <div slot="title">
      <h3 class="card__header">ИД партии: {{ number }}</h3>
    </div>
  </a-card>
</template>

<script>
export default {
  props: ['number']
}
</script>

<style scoped>
.card__header {
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  color: #000000;
}
</style>
