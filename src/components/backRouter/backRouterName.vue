<template>
  <div class="text">
    <a-page-header @back="() => $router.go(-1)">
      <div slot="subTitle" class="route_style">
        <span @click="() => $router.push({ name: 'SaleListMain' })">Отчеты / </span>
        <span @click="() => $router.push({ name: router.name })">{{ router.text }}{{ ' / ' }}</span>
        <span
          class="bold_color"
        ><b>{{ router.userName }}</b></span
        >
        <span></span>
      </div>
    </a-page-header>
  </div>
</template>

<script>
export default {
  props: ['router']
}
</script>

<style scoped>
.route_style {
  margin-top: 1px;
  font-family: Roboto, Arial, serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
}
.bold_color {
  color: black;
}
.text {
  position: relative;
  top: 10px;
}
</style>
