<template>
  <div class="block" >
    <img v-if="image" :src="image" alt="" class="image" >
    <img v-else :src="require(`../../assets/profile-mock.png`)" alt="" class="image" >
    <div class="text-block">
      <div class="name">{{ name }}</div>
      <div class="phone secondary-text">{{ phone }}</div>
      <div class="type secondary-text">{{ $t(type) }}</div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['image', 'name', 'phone', 'type']
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
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }

  .name {
    font-size: 15px;
    line-height: 25px;
  }

  .text-block {
    flex: 1;
  }

  .secondary-text {
    font-size: 13px;
    line-height: 20px;
    color: #5B6871;
    white-space: nowrap;
  }

</style>
