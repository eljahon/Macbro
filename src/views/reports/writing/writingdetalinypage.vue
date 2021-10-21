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
      <div slot="extra">
        <!--        <min-card :tabnot="tabnot" :name="`${list.cashier.first_name} ${list.cashier.last_name}`" :type="list.cashier.user_type" :image="list.cashier.profile_image"/>-->
      </div>
    </a-card>
  </a-card>
</template>

<script>
export default {
props: ['render']
}
</script>

<style scoped>

</style>
