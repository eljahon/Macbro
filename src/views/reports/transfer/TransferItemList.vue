<template>
  <div v-if="render" style="background-color: transparent; position: relative">
    <a-spin
      style="z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
      size="large"
    />
  </div>
  <a-card v-else>
    <div slot="title">
      <a-page-header @back="() => $router.go(-1)">
        <div slot="subTitle" style="cursor: pointer">
          <span @click="() => $router.push({ name: 'SaleMain' })">{{ 'Отчеты / ' }}</span
          ><span @click="() => $router.push({ name: 'TransferListMain' })">{{ $t('transfer') }}</span
          ><span>{{ pagename }}</span>
        </div>
      </a-page-header>
    </div>
    <div slot="extra">
      <a-button size="small" icon="dowlond" style="background-color: #1890FF; color: white; border: none">
        <a-icon :component="myIcons.excal"></a-icon
        ></a-button>
    </div>
    <a-card style="border-right: none; border-left: none">
      <div slot="title">
        <h3>ИД партии: {{ list.number }}</h3>
      </div>
      <a-card style="border-right: none; border-left: none">
        <div slot="title">
          <div style="display: flex; justify-content: space-between;">
            <div
              style="
          display: flex;
          flex: 0 0 20%;
          border-radius: 9px;
          align-items: center;
"
            >
              <div
                style="display: flex;  border-top-left-radius: 5px; border-bottom-right-radius: 5px; align-items: center; padding: 5px;background-color: #F5F5F5;"
              >
                <img
                  :src="list.merchant.image"
                  style="max-width: 30px; max-height: 30px; min-width: 30px; min-height: 30px; border-radius: 50%"
                  alt=""
                />
                <span
                  style="font-size: 15px;margin-left: 10px"
                >{{ list.merchant.firstname }}{{ ' ' }}{{ list.merchant.lastname }}<br />
                  <span style="color: #818C99; font-size: 12px">Кассир</span></span
                >
              </div>
              <div
                style="display: flex;  padding: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; align-items: center;background-color: #EBF7FF"
              >
                <!--                <img :src="list.merchant.image" style='max-width: 30px; max-height: 30px; min-width: 30px; min-height: 30px; border-radius: 50%' alt="">-->
                <span
                  style="font-size: 15px;margin-left: 10px; color: blue"
                >{{ list.items_count }} шт.<br />
                  <span style="color: #818C99; font-size: 12px">Принято</span></span
                >
              </div>
            </div>
            <div
              style="
          display: flex;
          flex: 0 0 20%;
          border-radius: 9px;
          align-items: center;
"
            >
              <div
                style="display: flex; border-radius: 7px; align-items: center; padding: 5px;background-color: #F5F5F5;"
              >
                <img
                  :src="list.merchant.image"
                  style="max-width: 30px; max-height: 30px; min-width: 30px; min-height: 30px; border-radius: 50%"
                  alt=""
                />
                <span
                  style="font-size: 15px;margin-left: 10px"
                >Darlene Robertson <br />
                  <span style="color: #818C99; font-size: 12px">Кассир</span></span
                >
              </div>
              <a-icon type="arrow-right" />
              <div
                style="display: flex;border-radius: 7px; align-items: center; padding: 5px;background-color: #F5F5F5;"
              >
                <img
                  :src="list.merchant.image"
                  style="max-width: 30px; max-height: 30px; min-width: 30px; min-height: 30px; border-radius: 50%"
                  alt=""
                />
                <span
                  style="font-size: 15px; margin-left: 10px"
                >Darlene Robertson <br />
                  <span style="color: #818C99; font-size: 12px">Кассир</span></span
                >
              </div>
            </div>
          </div>
        </div>
        <div slot="extra"></div>
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
        <span style="display: inline; border-radius: 50%">
          <img
            style="object-fit: cover; max-height: 40px"
            :src="row.product_image.length ? row.product_image.length : image"
            alt="imgId"
          />
        </span>
        <span v-if="row.product_image.length" style="margin-left:10px;">{{ row.product_name }}</span>
        <span v-else style="margin-left:5px; position: relative;">{{ row.product_name }}</span>
      </template>
      <template slot="Состояние" slot-scope="text, row">
        <span v-if="row.product_state === 'new'"> <a-tag :color="'rgba(76, 217, 100, 0.1)'">Новый</a-tag></span>
        <span v-if="row.product_state === 'used'"> <a-tag :color="'rgba(0, 0, 0, 0.1)'">Б/У</a-tag></span>
      </template>
      <template slot="Сумма" slot-scope="text, row">
        <span>{{
          new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.price.usd_price)
        }}</span>
      </template>
      <template slot="Статус" slot-scope="text, row">
        <span v-if="row.status === 'in-process'"><a-tag :color="'rgba(24, 144, 255, 0.1)'">Принято</a-tag></span>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import myIcons from '@/core/icons'
import image from '../../../assets/phone.svg'
export default {
  components: {},
  data () {
    return {
      myIcons,
      image,
      render: true,
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
          dataIndex: 'count',
          scopedSlots: { customRender: 'Кол' }
        },
        {
          title: this.$t('Сумма'),
          dataIndex: 'branch_name',
          scopedSlots: {
            filterDropdown: 'Aккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Сумма'
          }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Состояние'),
          key: 'action',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Состояние'
          }
        },
        {
          title: this.$t('Статус'),
          key: 'werree',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Статус'
          }
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
          this.render = false
        })
        .finally(() => {
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

<style scoped></style>
