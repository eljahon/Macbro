<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/orders/list">{{ $t('orders') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('details') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card :title="$t('fillIn')">
      <a-row>
        <div>
          <!-- <a-switch
      slot="extra"
      v-model="brand.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px 0"
    /> -->

          <a-row>
            <a-col :span="12" style="padding: 0 15px">
              <a-input
                disabled
                type="number"
                v-model="orderNumber"
              />
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              СУММА ЗАКАЗА:
              <div>{{ this.items ? numberToPrice(calcTotalPrice(this.items)) : null }}</div>
            </a-col>
          </a-row>
          <a-row>
            <!-- tabs -->
            <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey" style="padding: 0 15px">
              <a-tab-pane key="1" :tab="$t('order_data')">
                <a-row>
                  <a-col :span="24" style="padding: 0 15px 0 0">
                    <a-descriptions layout="horizontal" bordered>
                      <a-descriptions-item :span="24" :label="$t('customer_name')">
                        {{ order.customer_name }}
                      </a-descriptions-item>
                      <a-descriptions-item :span="24" :label="$t('order_number')">
                        <div v-html="orderNumber"></div>
                      </a-descriptions-item>
                      <a-descriptions-item :span="24" :label="$t('payment_method')">
                        {{ this.paymentMethods[order.payment_method] }}
                      </a-descriptions-item>
                      <a-descriptions-item :span="24" :label="$t('delivery_method')">
                        {{ this.deliveryMethods[order.delivery_method] }}
                      </a-descriptions-item>
                      <a-descriptions-item :span="24" :label="$t('address')">
                        {{ order.address }}
                      </a-descriptions-item>
                      <a-descriptions-item :span="24" :label="$t('note')">
                        {{ order.note }}
                      </a-descriptions-item>
                      <a-descriptions-item :span="24" :label="$t('status')">
                        {{ this.orderStatus[order.status] }}
                      </a-descriptions-item>
                    </a-descriptions>
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane key="2" :tab="$t('products')">
                <a-row>
                  <a-col :span="24">
                    <a-table
                      @change="handleTableChange"
                      :rowKey="record => record.product_id"
                      :columns="columns"
                      :data-source="getProducts"
                      bordered
                    >
                      <template slot="price" slot-scope="text, row">
                        {{ numberToPrice(row.price) }}
                      </template>
                      <template slot="image" slot-scope="product">
                        <img class="product-image" :src="product.image" alt="product image">
                      </template>
                    </a-table>
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane key="3" :tab="$t('activities')">
                <user-activities />
              </a-tab-pane>
            </a-tabs>
          </a-row>
        </div>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import request from '@/utils/request'
import userActivities from './UserActivities'
import calcTotalPrice from '@/utils/calcTotalPrice'
import numberToPrice from '@/utils/numberToPrice'
export default {
  components: {
    'user-activities': userActivities
  },
  data () {
    return {
      activeTabKey: '1',
      orderNumber: this.$route.params.id,
      items: null,
      order: {
          customer_name: '',
          address: '',
          phone: '',
          note: '',
          status: '',
          delivery_method: '',
          payment_method: ''
      },
      columns: [
        {
          title: this.$t('product_name'),
          dataIndex: 'product_name'
        },
        {
          title: this.$t('price'),
          key: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$t('image'),
          key: 'image',
          scopedSlots: { customRender: 'image' }
        },
        {
          title: this.$t('quantity'),
          dataIndex: 'quantity'
        }
      ],
      paymentMethods: {
          cash: 'Наличные',
          card: 'Терминал',
          click: 'Click',
          payme: 'Payme',
          unired: 'Unired'
      },
      orderStatus: {
          'in-process': 'В обработке',
          'finished': 'Завершено',
          'cancelled': 'Отменен'
      },
      deliveryMethods: {
          self: 'Самовывоз',
          delivery: 'Доставка в течении дня'
      }
    }
  },
  mounted () {
      this.getOrderAttrs()
  },
  computed: {
      getProducts () {
          return this.items
      }
  },
  methods: {
      getOrderAttrs () {
        request({
            url: `/order/${this.orderNumber}`,
            method: 'get'
        }).then((response) => {
            console.log('response', response)
            const {
                items,
                customer_name: customerName,
                address,
                phone,
                note,
                status,
                longlat,
                delivery_method: deliveryMethod,
                payment_method: paymentMethod
            } = response
            this.items = items
            this.order.customer_name = customerName
            this.order.address = address
            this.order.phone = phone
            this.order.note = note
            this.order.status = status
            this.order.delivery_method = deliveryMethod
            this.order.payment_method = paymentMethod
            this.coords = [Number(longlat.split(',')[1]), Number(longlat.split(',')[0])]
        })
    },
    activeTabHandler (_activeTabKey) {
        this.activeTabKey = _activeTabKey
    },
    calcTotalPrice (arrOfItems) {
      return calcTotalPrice(arrOfItems)
    },
     numberToPrice (number) {
      return numberToPrice(number)
    },
    handleTableChange (pagination) {
       console.log('pagination', pagination)
    }
  }
}
</script>
<style>
.product-image {
    max-width: 150px;
}
</style>
