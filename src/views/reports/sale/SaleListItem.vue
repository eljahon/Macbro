<template>
  <detalniy-page
    :list="list"
    :render="render"
    :tabnot="false"
    :columnsone="columnsTabOne"
    :columnstwo="columnsTabTwo"
    :router="router"/>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment/moment'
import myIcons from '@/core/icons'
import detalniypage from '@/components/deltaniypagesreports/detalniypage'
// import maxcard from '@/components/maxcard/maxcard'
export default {
  components: {
   'detalniy-page': detalniypage
  },
data () {
  return {
    myIcons,
    render: true,
    list: {},
    router: {
      name: 'SaleListMain',
      path: this.$t('Продажа')
    },
    clientname: '',
    tableListone: [],
    tableListtwo: [],
    columnsTabOne: [
      {
        title: this.$t('Товары'),
        // dataIndex: 'first_name',
        scopedSlots: {
          filterDropdown: 'аккаунта',
          filterIcon: 'filterIcon',
          customRender: 'tavar'
        }
      },
      {
        title: this.$t('Кол-во '),
        scopedSlots: { customRender: 'kol' },
        align: 'center'
      },
      {
        title: this.$t('Цена '),
        scopedSlots: { customRender: 'sena' },
        align: 'center'
      }
    ],
    columnsTabTwo: [
      {
        title: this.$t('Дата'),
        // dataIndex: 'first_name',
        scopedSlots: {
          filterDropdown: 'аккаунта',
          filterIcon: 'filterIcon',
          customRender: 'data'
        }
      },
      {
        title: this.$t('Филиал '),
        scopedSlots: { customRender: 'branch' }
      },
      {
        title: this.$t('Сумма '),
        scopedSlots: { customRender: 'sena' }
      },
      {
        title: this.$t('Тип оплаты '),
        scopedSlots: { customRender: 'payment' }
      }
    ],
    loading: false
  }
},
  computed: {
  getListTabOne () {
    return this.tableListone
  },
    getListTabTwo () {
    return this.tableListtwo
    }
  },
  methods: {
  ...mapActions(['itemGetAllList', 'itemsIpatekaList']),
    moment,
    format (res) {
      this.list = res
      this.clientname = `${res.client.first_name}${' '}${res.client.last_name}`
    },
    Callback (key) {
      console.log(key)
    },
    itemGetOrderList (id) {
      this.itemGetAllList(id)
      .then(res => {
        console.log('res =>>', res)
        this.list = res
        this.tableList = res.items
        this.clientname = `${res.client.first_name}${' '}${res.client.last_name}`
        this.render = false
      })
    },
    itemIpatekaList (id) {
    this.itemsIpatekaList(id)
      .then(res => {
        console.log('res =>>', res)
        this.list = res
        this.render = false
      })
    }
   },
  mounted () {
  },
  created () {
    if (parseInt(this.$route.query.id) === 1) {
      this.itemGetOrderList(this.$route.params.id)
    } else {
      this.itemIpatekaList(this.$route.params.id)
    }
  }
}
</script>

<style scoped>
.ant-table-row ant-table-row-level-0 {
  height: 10px !important;
}
.headerImg {
  display: flex;
  gap: 7px;
  align-items: center
}
.border {
  border-left: 1px solid white;
  border-right: 1px solid white;
  justify-content: space-between
}
.image {
  max-height: 30px;
  max-width: 30px;
  min-height: 30px;
  min-width: 30px;
  border-radius: 50%
}
.hsex{
  background-color: #F2F3F5;
  text-align: center;
  color:#818C99;
  border-radius: 2px;
  font-size: 12px
}
.cardmin {
  flex: 0 0 30%;
  border: 1px solid #EEEEEE;
  border-radius: 5px;
  padding: 15px; display: flex;
  justify-content: space-between
}
</style>
