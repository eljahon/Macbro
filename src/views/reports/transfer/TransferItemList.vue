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
          <span @click="() => $router.push({ name: 'TransferListMain' })">{{ 'Отчеты / ' }}</span>
          <span @click="() => $router.push({ name: 'TransferListMain' })">{{ $t('transfer') }}</span>
        </div>
      </a-page-header>
    </div>
    <div slot="extra">
      <downloadExcellIcon />
    </div>
    <numberBatchCard :number="transfer.number" />
    <a-card class="custom_border">
      <div class="user_info_board">
        <objectCard
          :displayRightBlock="true"
          :phone="transfer.merchant.phone_number"
          :firstName="transfer.merchant.firstname"
          :lastName="transfer.merchant.lastname"
          :objectType="$t(transfer.merchant.user_type)"
          :image="transfer.merchant.image"
          :wordDisplayed="$t(transfer.status)"
          :number="transfer.items_count"
        />
        <div class="branches_list">
          <objectCard
            :displayRightBlock="false"
            :firstName="transfer.sending_warehouse.name"
            :objectType="$t('sender')"
            :image="warehouseImage"
          />
          <a-icon type="arrow-right" style="font-size: 36px; color: #1890FF;" />
          <objectCard
            :displayRightBlock="false"
            :firstName="transfer.accepting_warehouse.name"
            :objectType="$t('receiver')"
            :image="warehouseImage"
          />
        </div>
      </div>
    </a-card>
    <a-card style="margin: 1px; border:none">
      <a-table
        :columns="itemsTableColumns"
        :rowKey="() => Math.random()"
        :dataSource="transfer.items"
        :pagination="false"
        bordered
      >
        <template slot="Товары" slot-scope="text, row">
          <productComponent
            :productName="row.product_name"
            :barCode="row.bar_code"
            :imeiCode="row.imei_code"
            :productImage="row.product_image"
          />
        </template>
        <template slot="Сумма" slot-scope="price">
          {{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(price.usd_price) }}
        </template>
        <template slot="Статус" slot-scope="text, row">
          <a-tag :color="StatusSwitch(row.status).color">{{ StatusSwitch(row.status).name }}</a-tag>
        </template>
        <template slot="Состояние" slot-scope="text, row">
          <a-tag :color="ProductStateSwitch(row.product_state).color">{{ ProductStateSwitch(row.product_state).name }}</a-tag>
        </template>
      </a-table>
    </a-card>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'

import downloadExcellIcon from '../../../components/downloadExcellIcon/DownlodExcellIcon'
import numberBatchCard from '../../../components/NumberBatchComponent/NumberBatchComponent'
import productComponent from '../../../components/productComponent/productComponent'
import objectCard from '../../../components/objectCard/objectCard'

import warehouseImage from '../../../assets/macbro.jpg'
import myIcons from '@/core/icons'
import image from '../../../assets/phone.svg'

export default {
  components: {
    downloadExcellIcon,
    productComponent,
    numberBatchCard,
    objectCard
  },
  data () {
    return {
      warehouseImage,
      myIcons,
      image,
      render: true,
      itemsTableColumns: [
        {
          title: this.$t('Товары'),
          scopedSlots: {
            customRender: 'Товары'
          }
        },
        {
          title: this.$t('Кол-во'),
          dataIndex: 'count',
          width: 120,
          align: 'center'
        },
        {
          title: this.$t('Сумма'),
          dataIndex: 'price',
          width: 120,
          align: 'center',
          scopedSlots: {
            customRender: 'Сумма'
          }
        },
        {
          title: this.$t('Состояние'),
          width: 120,
          align: 'center',
          scopedSlots: {
            customRender: 'Состояние'
          }
        },
        {
          title: this.$t('Статус'),
          width: 120,
          align: 'center',
          scopedSlots: {
            customRender: 'Статус'
          }
        }
      ],
      pagename: '',
      transfer: {},
      loading: false
    }
  },
  methods: {
    ...mapActions(['TransferListIdget']),
    TrasferItemListId (id) {
      this.loading = true
      this.TransferListIdget(id)
        .then(res => {
          this.transfer = res
          this.render = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    StatusSwitch (item) {
      switch (item) {
        case 'accepted':
          return { color: 'blue', name: 'Принято' }
        case 'in-process':
          return { color: 'orange', name: 'В процессе' }
        case 'incomplete':
          return { color: 'gray', name: 'Неполный' }
        case 'rejected':
          return { color: 'red', name: 'Отклоненный' }
      }
    },
    ProductStateSwitch (state) {
      switch (state) {
        case 'new':
          return { color: 'blue', name: 'Новый' }
        case 'used':
          return { color: 'orange', name: 'Б.У' }
        case 'restoration':
          return { color: 'gray', name: 'Реставрация' }
        case 'defect':
          return { color: 'red', name: 'Дефект' }
      }
    }
  },
  created () {
    this.TrasferItemListId(this.$route.params.id)
  }
}
</script>

<style scoped>
.user_info_board {
  display: flex;
  justify-content: space-between;
}

.custom_border {
  border-top: none;
  border-left: none;
  border-right: none;
}

.branches_list {
  display: flex;
  align-items: center;
  grid-gap: 12px;
}
</style>
