<template>
  <a-card>
    <div slot="title">{{ $t('settlemet') }}</div>
    <div slot="extra" style="display: flex; gap: 5px">
      <a-input v-model="params.search" v-debounce="Search">
        <a-icon @click="Searches" style="color: blue" slot="addonAfter" type="search" />
      </a-input>
      <a-button icon="dowlond" style="background-color: #1890FF; color: white; border:none">
        <a-icon :component="myIcons.excal"></a-icon></a-button>
    </div>
    <div>
      <a-tabs type="card" @change="callbac">
        <a-tab-pane key="1" tab="Поставщик">
          <a-table></a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Контрагент"><a-table></a-table></a-tab-pane>
        <a-tab-pane key="3" tab="Клиент"><a-table></a-table></a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script>
import myIcons from '@/core/icons'
export default {
 data () {
   return {
     myIcons,
     params: {
       search: ''
     }
   }
 },
  computed: {},
 methods: {
   callbac (key) {
     console.log(key)
   },
   Searches (val) {
     console.log(val)
   },
   Search (val) {
     console.log(val)
   }
 },
  mounted () {
  }
}
</script>

<style scoped>

</style>
