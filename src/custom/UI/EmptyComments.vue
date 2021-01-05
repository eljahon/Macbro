<template>
  <a-row type="flex" :style="`height: ${height/1.5}px`" justify="center" align="middle">
    <a-col :span="'auto'">
      <img width="200" :src="require('@/assets/empty.svg')" alt="asa">
      <h3 class="my-1" style="text-align: center; color: grey; font-weight: 300">No comments to discuss</h3>
    </a-col>
  </a-row>
</template>

<script>

export default {
data () {
    return {
         height: window.innerHeight
    }
}
}
</script>

<style>

</style>
