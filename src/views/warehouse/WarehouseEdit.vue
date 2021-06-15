<template>
  <div class="mainIconChange">
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/company/list" test-attr="prev-link-company">{{ $t('companies') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <a @click="$router.go(-1)" test-attr="branches-warehouse">{{ $t('coming') }}</a>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :bordered="false" :title=" $t('coming')">
    </a-card>
    <a-card :bordered="false" class="no-space-tab">
      <a-tabs v-model="actiontab" type="card" @change="callback">
        <a-tab-pane key="1" tab="Основные сведения">
          <a-card :bordered="false">
            <a-row>
              <div class="span">
                <a-col :span="8">
                  <div class="cardlist" style="overflow: hidden">
                    <div>
                      <p>
                        <img src="../../assets/Vector.svg" alt="">
                        <span>{{ $t('Bartchnumber') }}</span></p>
                      <p>
                        <a-icon type="shop" class="globalColor"></a-icon>
                        <span>Филиал</span></p>
                      <p>
                        <a-icon type="user"></a-icon>
                        <span>Клиент</span></p>
                      <p>
                        <a-icon type="user"></a-icon>
                        <span>Кассир</span></p>
                    </div>
                    <div style="margin-left: 80px">
                      <p><strong>{{ cardlist.number }}</strong></p>
                      <p><strong>Громов Даниил</strong></p>
                      <p><strong>{{ cardlist.counter_agent.firstname }} {{ cardlist.counter_agent.lastname }}</strong>
                      </p>
                      <p><strong class="colorblue"> {{ cardlist.counter_agent.lastname }}</strong></p>
                    </div>
                  </div>
                </a-col
                >
                <a-col :span="8" :offset="1">
                  <div class="cardlist" style="overflow: hidden">
                    <div>
                      <p>
                        <a-icon type="calendar" class="globalColor"></a-icon>
                        <span>{{ $t('data') }}</span></p>
                      <p>
                        <a-icon type="number"></a-icon>
                        <span>{{ $t('total_amount') }}</span></p>
                      <p>
                        <a-icon type="dollar"></a-icon>
                        <span>Сумма</span></p>
                      <p>
                        <a-icon type="flag"></a-icon>
                        <span>{{ $t('Scanned') }}</span></p>
                    </div>
                    <div style="margin-left: 80px">
                      <p><strong>{{ moment(cardlist.created_at).format('YYYY-MM-DD hh:mm') }}</strong></p>
                      <p><strong>{{ cardlist.total_amount }}</strong></p>
                      <p><strong>{{ cardlist.count }}</strong></p>
                      <p><strong>{{ cardlist.bar_code_count + cardlist.imei_code_count }}/{{ item_amount }}</strong></p>
                    </div>
                  </div>
                </a-col
                >
              </div>
            </a-row>
          </a-card>
          <a-table
            :columns="columns"
            :data-source="ItemTabledata"
            bordered
            style="margin: 20px">
            <template slot="imei_status" slot-scope="text">
              <a-tag :color="text === 'not_registered' ? '#E7F4FF' :'#FFF0D9' ">{{ text }}</a-tag>
            </template>
            <template slot="product_state" slot-scope="text">
              <a-tag :color="text === 'new' ? '#E7F4FF' :'#FFF0D9' ">{{ text }}</a-tag>
            </template>
            <template slot="tags" slot-scope="text">
              <a-tag v-if="text" color="#E7F4FF">Cash</a-tag>
            </template>
            <span slot="state" slot-scope="text, record">
              {{ record }}
            </span>
          </a-table>
        </a-tab-pane>
        <!--        <a-tab-pane :key="2" :tab="$t('prixod')">-->
        <!--          <inventory-item />-->
        <!--        </a-tab-pane>-->
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
// import vMain from './v-main'
import { langMapper, flagMapper } from '@/utils/mappers'
import moment from 'moment'

export default {
  data () {
    return {
      columns: [
        {
          title: 'Товар',
          dataIndex: 'product_name',
          key: 'product_name',
          scopedSlots: { customRender: 'product_name' }
        },
        {
          title: 'Кол-во',
          dataIndex: 'count',
          key: 'age'
        },
        {
          title: this.$t('price'),
          dataIndex: 'buy_price',
          key: 'buy_price'
        },
        {
          title: this.$t('typeofinterparas'),
          key: 'tags',
          scopedSlots: { customRender: 'tags' }
        },
        {
          title: this.$t('product_state'),
          key: 'product_state',
          dataIndex: 'product_state',
          scopedSlots: { customRender: 'product_state' }
        },
        {
          title: this.$t('imei'),
          key: 'imei_status',
          dataIndex: 'imei_status',
          scopedSlots: { customRender: 'imei_status' }
        }
      ],
      ItemTabledata: [],
      data: [
        {
          key: '1',
          name: 'iPhone 12 Pro 128GB Green',
          age: 2356858110348209,
          address: '$1 000',
          condition: 'Новая',
          state: 'Регистрирован',
          tags: ['Наличные']
        },
        {
          key: '2',
          name: 'iPhone 12 Pro 128GB Green',
          age: 2356858110348209,
          address: '$1 000',
          condition: 'Б/У',
          state: 'Будет регистр',
          tags: ['Консегнация']
        },
        {
          key: '3',
          name: 'iPhone 12 Pro 128GB Green',
          age: 2356858110348209,
          address: '$1 000',
          condition: 'Реставразия',
          state: 'Регистрирован',
          tags: ['Реализация']
        }
      ],
      btnLoading: false,
      actiontab: '1',
      item_amount: null,
      cardlist: {},
      activeTabKey: 1,
      edit: !!this.$route.params.id,
      langs: ['ru', 'uz', 'en'],
      page: { limit: 1, pageSize: 10, total: null, search: '' }
    }
  },
  mounted () {
    // console.log('$refs', this.$refs)
    console.log('ROUTES', this.$route)
  },
  // updated() {
  //   console.warn('$refs', this.$refs)
  // },
  methods: {
    reduceItemAmount (newarray) {
    this.item_amount = newarray.reduce((total, amount) => {
            return total + amount.count
      }, 0)
    },
    moment,
    callback (value) {
      console.log(value)
    },
    onChange (value, dateString) {
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
    },
    onOk (value) {
      console.log('onOk: ', value)
    },
    getWerhousListIdUi (page) {
      this.$store.dispatch('getWerhousListId', page)
        .then(res => {
          this.cardlist = res
          this.ItemTabledata = res.items
          this.reduceItemAmount(res.items)
          console.log(res)
        })
    },
    langMapper,
    flagMapper,
    clickParent (e) {
      this.btnLoading = e
    },
    submit () {
      console.log('submit')
      if (this.edit) {
        Object.values(this.$refs).forEach(form => {
          console.log('form', form)
          // if (form) form[0].onSubmit()
          if (form) form.onSubmit()
        })
      } else {
        this.$refs.createForm.onSubmit()
      }
    },
    resetForm () {
      if (this.edit) {
        Object.entries(this.$refs).forEach(form => {
          console.log(form)
          if (form) form[1].resetForm()
        })
      } else {
        this.$refs.createForm.resetForm()
      }
    }
  },
  created () {
    this.getWerhousListIdUi(this.$route.params.id)
  }
  // components: { 'v-main': vMain }
}
</script>
<style>
.cardlist {
  display: flex;
  padding: 10px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}

</style>
