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
          <span @click="() => $router.push({ name: 'SaleMain' })">{{ 'Отчеты / ' }}</span>
          <span @click="() => $router.push({ name: 'TransferListMain' })">{{ $t('transfer') }}</span>
        </div>
      </a-page-header>
    </div>
    <div slot="extra">
      <downloadExcellIcon />
    </div>
    <numberBatchCard :number="list.number" />
    <a-card class="custom_border">
      <div class="user_info_board">
        <objectCard :displayRightBlock="true" />
        <div class="branches_list">
          <objectCard />
          <a-icon type="arrow-right" style="font-size: 36px; color: #1890FF;" />
          <objectCard />
        </div>
      </div>
    </a-card>
  </a-card>
</template>

<script>
import downloadExcellIcon from '../../../components/downloadExcellIcon/DownlodExcellIcon'
import numberBatchCard from '../../../components/NumberBatchComponent/NumberBatchComponent'
import objectCard from '../../../components/objectCard/objectCard'

import { mapActions } from 'vuex'
import myIcons from '@/core/icons'
import image from '../../../assets/phone.svg'
export default {
  components: {
    downloadExcellIcon,
    numberBatchCard,
    objectCard
  },
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
