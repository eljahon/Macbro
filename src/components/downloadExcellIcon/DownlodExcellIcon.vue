<template>
  <a-button class="btn__background" size="small" icon="dowlond">
    <a-icon class="icn__custom" :component="myIcons.excal" />
  </a-button>
</template>

<script>
import myIcons from '@/core/icons'

export default {
  data () {
    return {
      myIcons
    }
  }
}
</script>

<style scoped>
.btn__background{
    background: #1890FF;
    border-radius: 4px;
    width: 40px;
    height: 40px;
}

.icn__custom {
    font-size: 22px;
}

</style>
