<template>
  <div>
    <div class="mincard">
      <div style="display: flex;  align-items: center;  margin-left: 10px; gap: 5px">
        <img class="image" :src="image.length > 0 ? image : img" alt="img">
        <span class="user_name" style="font-size: 16px; color: black">{{ name === undefined || name === '' ? names : name }} <br>
          <span
          class="user_type">{{ datauserType.userType[type === undefined ? '' :type]
        }}</span></span>
      </div>
    </div>
  </div>
</template>

<script>
import datauserType from '../../constants/constdata'
import img from '../../assets/grilsimg231.jpg'

export default {
  props: ['name', 'type', 'image', 'color', 'tabnot'],
  data () {
    return {
      datauserType,
      img,
      names: 'Autest Anutest2'
    }
  }
}
</script>

<style scoped>
.mincard {
  display: flex;
  flex: 0 0 20%;
  border-radius: 9px;
  align-items: center;
  padding: 4px;
  margin-top: -16px;
  margin-left: -20px;
}

.mincardfalse {
  display: flex;
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
  position: static;
  left: 0px;
  top: -5px;
  right: 16px;
  border-radius: 50%;
  margin: 0px 16px;
}
.text_wrapaer {
  position: static;
  width: 94px;
  height: 22px;
  left: 0px;
  color: black;
  top: 0px;
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 22px;
}

.wrapper_mini_card {
  display: flex;
  flex: 0 0 50%;
}
.user_type {
  color: #818C99;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 5px 12px;
  position: static;
  background: #F2F3F5;
  border-radius: 4px;
  width: 68px;
  height: 28px;
  left: 0px;
  top: 28px;
  margin-top: 10px;
}
.user_name {
}
</style>
