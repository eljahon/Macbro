<template>
  <a-card>
    <div slot="title">
      <a-page-header
        @back="() => $router.go(-1)"
      >
        <div slot="subTitle" style="cursor: pointer">
          <span @click="() => $router.push({name: 'SaleMain'})">{{ 'Отчеты / ' }}</span><span @click="() => $router.push({name: 'TransferListMain'})">{{ $t('transfer') }}</span><span>{{ pagename }}</span>
        </div>
      </a-page-header>
    </div>
    <div slot="extra">
      <a-button style="padding: 2px" type="primary" icon="file-excel" size="small" />
    </div>
    <a-card style="border-right: none; border-left: none">
      <div slot="title">
        <h3>ИД партии: {{ list.number }}</h3>
      </div>
      <a-card style="border-right: none; border-left: none">
        <div slot="title" style="display: flex;">
          <a-tag color="#F5F5F5" style="border: none;">
            <div style="display: flex; justify-content: flex-start">
              <span style="width: 30px; height: 30px; margin-top: 5px; display: inline-flex; border-radius: 50%; margin-left: -10px">
                <img v-if="list.merchant.image.length" style="object-fit: cover; border-radius:50%" :src="list.merchant.image " alt="imgId" >
              </span>
              <span style="margin-left:50px; margin-top: 4px ">
                {{ list.merchant.firstname }}{{ ' ' }}{{ list.merchant.lastname }} <br>
                <span style="padding:6px; background-color: rgba(255, 59, 48, 0.1); color: red; border-radius: 5px;">{{ list.merchant.user_type }}</span>
              </span>
            </div>

          </a-tag>
          <a-tag color="blue" style="margin-left: -8px;border: none;">
            <span>{{ list.items_count }} шт. <br> {{'Принято'}}</span>
          </a-tag>
        </div>
        <div slot="extra">
          <a-tag color="rgba(245, 245, 245, 1)" style="border: none; padding: 15px">
            <div style="display: flex;">
              <img :src="list.accepting_warehouse.image" alt="img"> <br>
              <span>{{ list.accepting_warehouse.name }}</span>
              <span></span></div>
          </a-tag>
          <a-icon type="arrow-right" />
          <a-tag color="rgba(245, 245, 245, 1)" style="border: none; position: relative; left: 10px">
            <div style="display: flex; padding: 10px">
              <!--              <img :src="list.accepting_warehouse.image" alt="img"> <br>-->
              <span>{{ list.sending_warehouse.name }}</span>
              <span></span></div>
            <!--            <span>{{}}</span> <br>-->
            <!--            <span>Принято</span>-->
          </a-tag>
        </div>
      </a-card>
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
      <span style="width: 50px; height: 50px; display: inline-flex; border-radius: 50%">
                <img style="object-fit: cover" :src="row.product_image" alt="imgId">
              </span>
      <span v-if="row.product_image.length" style="margin-left:5px; position: relative; top: -20px">{{ row.product_name }}</span>
      <span v-else style="margin-left:5px; position: relative;">{{ row.product_name }}</span>
      </template>
      <template slot="Состояние" slot-scope="text, row">
        <span v-if="row.product_state === 'new'"> <a-tag :color="'rgba(76, 217, 100, 0.1)'">Новый</a-tag></span>
        <span v-if="row.product_state === 'used'"> <a-tag :color="'rgba(0, 0, 0, 0.1)'">Б/У</a-tag></span>
      </template>
      <template slot="Сумма" slot-scope="text, row">
        <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.price.usd_price) }}</span>
      </template>
      <template slot="Статус" slot-scope="text, row">
        <span v-if="row.status === 'in-process'"><a-tag :color="'rgba(24, 144, 255, 0.1)'">Принято</a-tag></span>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {},
  data () {
    return {
      columnsTwo: [
        {
          title: this.$t('Товары'),
          dataIndex: 'number',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Товары'
          },
          align: 'center'
        },
        {
          title: this.$t('Кол-во'),
          dataIndex: 'count',
          align: 'center',
          scopedSlots: { customRender: 'Кол' }
        },
        {
          title: this.$t('Сумма'),
          align: 'center',
          dataIndex: 'branch_name',
          scopedSlots: {
            filterDropdown: 'Aккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Сумма' }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Состояние'),
          key: 'action',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Состояние'
          },
          align: 'center'
        },
        {
          title: this.$t('Статус'),
          key: 'werree',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Статус'
          },
          align: 'center'
        }
      ],
pagename: '',
      list: {},
      loading: false
    }
  },
  computed: {},
  methods: {
    ...mapActions(['TransferListIdget']),
    TrasferItemListId (id) {
      this.loading = true
      this.TransferListIdget(id)
      .then(res => {
        this.list = res
        console.log('res=====>>>', res)
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    console.log('====>>', this.$route.query)
  },
  created () {
    this.TrasferItemListId(this.$route.params.id)
  }
}
</script>

<style scoped>

</style>
