<template>
  <a-button @click="dowlondData" class="excel_icon_style">
    <a-icon style="fontSize:24px" class="excel_icon" :component="myIcons.excal"></a-icon>
  </a-button>
</template>
<script>
import myIcons from '@/core/icons'
export default {
  data () {
    return {
      myIcons
    }
  },
 methods: {
   dowlondData () {
     this.$emit('handleclick')
   }
 }
}
</script>

<style scoped>
.excel_icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.excel_icon_style {
  background-color: #1890FF;
  height: 40px;
  width: 40px;
  position: relative;
}
</style>
