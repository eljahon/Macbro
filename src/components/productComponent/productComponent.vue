<template>
  <div class="block">
    <img v-if="productImage" :src="productImage" alt="" class="image" />
    <img v-else :src="require(`@/assets/model-image.jpg`)" alt="" class="image" />
    <div class="text-block">
      <div class="name">{{ productName }}</div>
      <div v-if="imeiCode" class="secondary-text"><b>IMEI: </b> {{ imeiCode }}</div>
      <div v-if="barCode" class="secondary-text"><b>BAR CODE: </b> {{ barCode }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    productName: {
      default: 'Нет названия продукта (что-то пошло не так)'
    },
    productImage: {
      default: ''
    },
    imeiCode: {
      default: ''
    },
    barCode: {
      default: ''
    }
  }
}
</script>
<style scoped>
.block {
  display: flex;
  align-items: center;
  grid-gap: 12px;
}

.image {
  width: 50px;
  height: 50px;
  object-fit: scale-down;
}

.name {
  font-size: 15px;
  line-height: 25px;
  white-space: nowrap;
}

.text-block {
  flex: 1;
}

.secondary-text {
  font-size: 13px;
  line-height: 20px;
  color: #5b6871;
  white-space: nowrap;
}
</style>
