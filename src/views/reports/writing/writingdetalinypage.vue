<template>
  <div v-if="render" style="background-color: transparent; position: relative">
    <a-spin style="z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" size="large" />
  </div>
  <div v-else>
    <a-card>
      <div slot="title">
        <back-router-name :router="router"/>
      </div>
      <div slot="extra">
        <dowlon-button-excel/>
      </div>
      <a-card class="card_user_id">
        <div slot="title">
          <id-number :text="router.text" :number="list.cashier.account_number"/>

        </div>
        <div slot="extra">
          <div class="wrapper_calss">
            <span class="user_name">
              <span class="user_Full_name">{{ list.cashier.first_name }} {{ list.cashier.last_name }}</span>
              <span class="user_type" style="float: right">{{ dataUseType.userType[list.cashier.user_type] }}</span>
            </span>
            <img class="image" :src="list.cashier.profile_image" alt="">
          </div>
        <!--        <min-card-rigth class="mincard" :name="`${list.cashier.first_name}${}`" :type="list.cashier.user_type" :image="list.cashier.profile_image"/>-->
        </div>
      </a-card>
      <a-table
        style="margin-top: 30px"
        :columns="columnsTwo"
        :rowKey="() => Math.random()"
        :dataSource="list.items"
        :loading="loading"
        test-attr="list-customer"
        :pagination="false"
        bordered
      >
        <template slot="Товары" slot-scope="text, row">
          <span style="display: inline; border-radius: 50%">
            <img
              style="object-fit: cover; max-height: 40px"
              :src="row.product_image === ''? image :row.product_image"
              alt="imgId">
          </span>
          <span v-if="row.product_image.length" style="margin-left:10px;">{{ row.product_name }}</span>
          <span v-else style="margin-left:5px; position: relative;">{{ row.product_name }}</span>
        </template>
        <template slot="Состояние" slot-scope="text, row">
          <table-user-column :image="row.causer.profile_image" :name="`${row.causer.first_name} ${row.causer.last_name}`" :phone="row.causer.phone_number" :type="row.causer.user_type" />
        </template>
        <template slot="Сумма" slot-scope="text, row">
          <span v-if="row">{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(list.sum)
          }}</span>
        </template>
        <template slot="Статус" slot-scope="text, row">
          <a-tag :color="row.status === 'active' ? 'blue' : 'red'">{{ row.status === 'active' ? 'Активный' : 'Не активный' }}</a-tag>

        <!--        <span v-if="row.status === 'in-process'"><a-tag :color="'rgba(24, 144, 255, 0.1)'">Принято</a-tag></span>-->
        </template>
        <template slot="kolvo" slot-scope="text, row">
          <span v-if="row">{{ length(list.items) }}</span>
          <!--        <a-tag :color="row.status === 'active' ? 'blue' : 'red'">{{ row.status === 'active' ? 'Активный' : 'Не активный' }}</a-tag>-->

        <!--        <span v-if="row.status === 'in-process'"><a-tag :color="'rgba(24, 144, 255, 0.1)'">Принято</a-tag></span>-->
        </template>
      </a-table>
      <br>
    </a-card>
    <br>

    <a-card class="car_commit">
      <div style="margin-top: 10px" slot="title" class="commit"><h2>Комментарии</h2></div>
    </a-card>
    <a-card class="car_commit_one">
      <p class="comit_text">{{list.comment.length > 0? list.comment : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores atque commodi culpa cum cumque dolore est eum explicabo hic, nostrum possimus quam quasi quisquam repellendus, repudiandae sequi suscipit veritatis voluptatum?'}}</p>
      <br>
      <div v-for="(item,index) in (list.comment_images.length>0 ? list.comment_images : imagearray)" :key="index">
 <div style="display:flex; gap: 20px">
   <div><img :src="item" alt=""></div>
 </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import BackRouterName from '@/components/backRouter/backRouterName'
import { mapActions } from 'vuex'
import IdNumber from '@/components/idNumber/idNumber'
import excelButton from '@/components/excelButton/excelButton'
import mincardRigith from '@/components/minCardRigjth/mincardRigith'
import dataUseType from '@/constants/constdata'
import TableUserColumn from '@/components/TableUserColumn/TableUserColumn.vue'
import phone from '../../../assets/Rectangle11487.jpg'
export default {
  components: { IdNumber,
    BackRouterName,
    'dowlon-button-excel': excelButton,
    'min-card-rigth': mincardRigith,
TableUserColumn },
  data () {
    return {
      list: {},
      render: true,
      loading: false,
      imagearray: [phone],
      router: {
        name: 'writingListMain',
        text: 'Списание',
        userName: ''
      },
      dataUseType,
      columnsTwo: [
        {
          title: this.$t('Товары'),
          dataIndex: 'number',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Товары'
          }
        },
        {
          title: this.$t('Кол-во'),
          // dataIndex: 'cash',
          scopedSlots: { customRender: 'kolvo' }
        },
        {
          title: this.$t('Цена'),
          dataIndex: 'branch_name',
          scopedSlots: {
            filterDropdown: 'Aккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Сумма'
          }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Обвиняемый'),
          key: 'action',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Состояние'
          },
          width: 170
        },
        {
          title: this.$t('Статус'),
          key: 'werree',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Статус'
          },
          width: 170
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getWritingListItemId']),
    getWritingListItem () {
      this.getWritingListItemId(this.$route.params.id)
      .then(res => {
        this.list = res
        this.router.userName = `${res.cashier.first_name}${' '}${res.cashier.last_name}`
        console.log(res)
        this.render = false
      })
    },
    length (item) {
      return item.length
    }
  },
  mounted () {
    this.getWritingListItem()
  }
}
</script>

<style scoped>
.section{
  display: flex;
  justify-content: space-between;
}
.mincard{
}
.card_user_id {
  border-left: none;
  border-right: none;
}
.image{
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
.user_Full_name{
  white-space: nowrap;
  height: 22px;
  font-family: Roboto,sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 22px;
  color: black;
  /* identical to box height, or 129% */

  display: flex;
  align-items: center;
  text-align: right;
}
.wrapper_calss{
  display: flex;
  align-items: flex-end
}
.user_type{
  position: static;
  width: 141px;
  height: 16px;
  left: 0px;
  top: 24px;
  font-family: Roboto,sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 22px;
  text-align: right;
  color: #818C99;
}
.user_name{
  flex: 0 0 30%;
}
.commit {
  position: static;
  width: 118px;
  height: 22px;
  left: 32px;
  top: 25px;
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  align-items: center;
  color: #000000;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 24px;
}
.commit {
  background-color: white;
  width: 100%;
}
.car_commit {
  border-right: none;
  border-left: none;
  border-top: none;
}
.car_commit_one {
  border-right: none;
  border-left: none;
  border-top: none;
}
.comit_text {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 16px;

  position: static;
  width: 688px;
  height: 120px;
  left: 0px;
  top: 0px;
  background: #F7F7FB;
  border-radius: 8px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;

}
</style>
