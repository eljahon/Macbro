<template>
  <div
    class="object_card"
    :style="[
      {
        'border-bottom-right-radius': (displayRightBlock ? 0 : 8) + 'px',
        'border-top-right-radius': (displayRightBlock ? 0 : 8) + 'px',
        'max-width': (displayRightBlock ? 352 : 256) + 'px'
      }
    ]"
  >
    <div class="object_card__user">
      <img v-if="image != ''" :src="image" class="image" />
      <img v-else :src="require(`../../assets/profile-mock.png`)" class="image" />
      <div class="object_card__user_info">
        <div class="name">{{ firstName }} {{ lastName }}</div>
        <div class="phone secondary-text">{{ phone }}</div>
        <div class="type secondary-text">{{ $t(userType) }}</div>
      </div>
    </div>
    <div v-if="displayRightBlock" class="object_card__info">
      <div class="info__number">{{ number }}</div>
      <div class="info__word">{{ wordDisplayed }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    firstName: {
      default: 'Freeman'
    },
    lastName: {
      default: 'Ryder'
    },
    userType: {
      default: 'Кассир'
    },
    phone: {
      default: '+9989012345678'
    },
    image: {
      default: ''
    },
    number: {
      default: 0
    },
    wordDisplayed: {
      default: 'Принято'
    },
    displayRightBlock: {
      default: false
    }
  }
}
</script>

<style scoped>
.object_card {
  display: flex;
  height: 80px;
  flex-direction: row;

  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
}

.object_card__user {
  width: 256px;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  grid-gap: 12px;
  padding: 12px;
}

.object_card__info {
  height: 100%;
  width: 96px;
  background: #ebf7ff;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: left;
  padding-left: 12px;
  justify-content: center;
}

.info__number {
  font-family: Roboto, sans-serif;
  font-weight: normal;
  font-size: 17px;
  line-height: 22px;
  color: #1890ff;
}

.info__word {
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 22px;

  display: flex;
  align-items: center;

  color: #9aa6ac;
}

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
