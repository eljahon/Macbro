<template>
  <div v-if="render" style="background-color: transparent; position: relative">
    <a-spin
      style="z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
      size="large"/>
  </div>
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
