<template>
  <div class="wraper_card">
    <span><img class="img" :src="image.length > 0 ? image : img" alt=""></span>
    <span class="user_name">{{name}} <br>
      <span
      style="color: #818C99; font-size: 16px">{{dataUseType.userType[type]}}
    </span>
    </span>
  </div>
</template>

<script>
import dataUseType from '@/constants/constdata'
export default {
  data () {
    return {
      dataUseType
    }
  },
props: ['name', 'image', 'type']
}
</script>

<style scoped>
.img{
  position: static;
  max-width: 40px;
  max-height: 40px;
  top: 0px;
  flex: none;
  order: 0;
  flex-grow: 0;
  border-radius: 50%;
}
.wraper_card {
  background: #F5F5F5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.user_name {
  margin-left:12px;
}
</style>
