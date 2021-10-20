<template>
  <div
    class="mincard"><div style="display: flex;  align-items: center;  margin-left: 10px; gap: 5px">
      <img class="image" :src="image.length > 0 ? image : img" alt="img">
    <span style="font-size: 16px">{{ name.length > 0 ? name : names }} <br> <span style="color: #818C99; font-size: 14px">{{ datauserType.userType[type. length >0 ?type : 'admins'] }}</span></span>
  </div>
  </div>
</template>

<script>
import datauserType from '../../constants/constdata'
import img from '../../assets/grilsimg231.jpg'
export default {
  props: ['name', 'type', 'image', 'color'],
  data () {
    return {
      datauserType,
      img,
      names: 'Au test Anu test2'
    }
  }
}
</script>

<style scoped>
.mincard{
  display: flex;
  background-color: #F5F5F5;
  flex: 0 0 20%;
  border-radius: 9px;
  align-items: center;
  padding: 4px;
}
.image {
  max-height: 40px;
  max-width: 40px;
  min-height: 40px;
  min-width: 40px;
  border-radius: 50%
}
</style>
