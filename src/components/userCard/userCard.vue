<template>
  <div>
    <div style="display: flex; justify-content: space-between;">
      <div class="min_card_wrapper">
        <min-client-card
          :name="`${list.cashier.first_name} ${list.cashier.last_name}`"
          :type="list.cashier.user_type"
          :image="list.cashier.profile_image"/>
      </div>
      <div style="display: flex;  flex: 0 0 23%;">
        <div class="two_card">
          <div style="display: flex;  align-items: center;  margin-left: 10px; gap: 5px">
            <img :src="img" alt="">
            <span>{{ list.counter_agent.first_name }}{{ ' ' }}{{ list.counter_agent.last_name }}<br> <span
              style="color: #818C99; font-size: 16px">{{ dataUseType.userType[list.counter_agent.user_type] }}</span></span>
          </div>
        </div>
        <div class="inside_wrapper">
          <div style="display: flex;  align-items: center;  margin-left: 10px; gap: 5px">
            <span style="color: red">{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.billing.total_amount) }} <br> <span style="color: #818C99; font-size: 16px; padding-right: 10px">{{summ(list.items).total}}/{{summ(list.items).total_ammount}} Сканировано</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mincard from '@/components/mincard/mincard'
import dataUseType from '@/constants/constdata'
import img from '../../assets/Ellipse 9.png'
import minClientCard from '@/components/clientCard/minClientCard'

export default {
  props: ['list'],
  components: {
    mincard,
    'min-client-card': minClientCard
  },
  data () {
    return {
      dataUseType,
      img
    }
  },
  methods: {
    summ (item) {
      const sum = item.map((element) => {
        const sumone = element.bar_code_count + element.imei_code_count
        return sumone
      }).reduce((sum, val) => sum + val)
      return {
        total: sum,
        total_ammount: item[0].count
      }
    }
  },
  mounted () {
    console.log(this.list)
  }
}
</script>

<style scoped>
.card_flex {
  display: flex;
  background-color: #F5F5F5;
  flex: 0 0 20%;
  border-radius: 9px;
  align-items: center;
  padding: 5px;
}

.minc_card_setion {
  display: flex;
  background-color: #F5F5F5;
  border-bottom-left-radius: 9px;
  border-top-left-radius: 9px;
  align-items: center;
}

.wrapper {
  display: flex;
  align-items: center;
  margin-left: 10px;
  gap: 5px
}
.min_card_wrapper {
  display: flex;
  background-color: #F5F5F5;
  flex: 0 1 17%;
  border-radius: 9px;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
}
.two_card{
  display: flex;
  flex: 0 0 50%;
  background-color: #F5F5F5;
  border-bottom-left-radius: 9px;
  border-top-left-radius: 9px;
  align-items: center;
}
.inside_wrapper {
  display: flex;
  background-color: rgba(255, 239, 235, 1);
  border-bottom-right-radius: 9px;
  border-top-right-radius: 9px;
  align-items: center;
}
</style>
