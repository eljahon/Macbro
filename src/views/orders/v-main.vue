<template>
  <div>
    <!-- <a-switch
      slot="extra"
      v-model="brand.active"
      :checked-children="$t('active')"
      :un-checked-children="$t('inactive')"
      default-checked
      style="margin: 15px 0"
    /> -->
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="order"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="orderNumber" :label="$t('order_number')" prop="orderNumber">
            <a-input
              disabled
              type="number"
              v-model="orderNumber"
            />
          </a-form-model-item>
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
              <a-col :span="12" style="padding: 0 15px 0 0">
                <a-form-model-item ref="status" :label="$t('status')" prop="status">
                  <a-select v-model="order.status" @change="handleStatus">
                    <a-select-option value="in-process">
                      В обработке
                    </a-select-option>
                    <a-select-option value="cancelled">
                      Отменен
                    </a-select-option>
                    <a-select-option value="finished">
                      Завершено
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12" style="padding: 0 15px 0 0">
                <a-form-model-item ref="deliveryMethod" :label="$t('delivery_method')" prop="deliveryMethod">
                  <a-select v-model="order.delivery_method" @change="handleDeliveryMethod">
                    <a-select-option value="self">
                      Самовывоз
                    </a-select-option>
                    <a-select-option value="delivery">
                      Доставка в течении дня
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12" style="padding: 0 15px 0 0">
                <a-form-model-item ref="paymentMethod" :label="$t('payment_method')" prop="paymentMethod">
                  <a-select v-model="order.payment_method" @change="handlePaymentMethod">
                    <a-select-option value="cash" :disabled="this.isUnired">
                      Наличные
                    </a-select-option>
                    <a-select-option value="card" :disabled="this.isUnired">
                      Терминал
                    </a-select-option>
                    <a-select-option value="click" :disabled="this.isUnired">
                      Click
                    </a-select-option>
                    <a-select-option value="payme" :disabled="this.isUnired">
                      PayMe
                    </a-select-option>
                    <a-select-option value="unired" :disabled="!this.isUnired">
                      Unired
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12" style="padding: 0 15px 0 0">
                <a-form-model-item ref="address" :label="$t('address')" prop="address">
                  <a-input
                    v-model="order.address"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="24" style="padding: 0 15px">
                <a-form-model-item ref="map" :label="$t('map')" prop="map">
                  <yandex-map
                    :coords="coords"
                    v-model="coords"
                    :zoom="18"
                    style="width: 100%; max-width: 1000px; height: 80vh;"
                  >
                    <ymap-marker
                      :coords="coords"
                      marker-id="123"
                      hint-content="point"
                    />
                  </yandex-map>
                </a-form-model-item>
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
                </a-table>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="$t('customer')">
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="customerName" :label="$t('firstName')" prop="customerName">
                  <a-input
                    v-model="order.customer_name"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="phone" :label="$t('phone')" prop="phone">
                  <a-input
                    disabled
                    v-model="order.phone"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="customerNote" :label="$t('note')" prop="customerNote">
                  <a-input
                    v-model="order.note"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="4" :tab="$t('activities')">
            <user-activities/>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import request from '@/utils/request'
import numberToPrice from '@/utils/numberToPrice'
import calcTotalPrice from '@/utils/calcTotalPrice'
import { mapActions, mapGetters } from 'vuex'
import userActivities from './UserActivities'
export default {
  components: {
    'user-activities': userActivities
  },
  data () {
    return {
      orderNumber: this.$route.params.id,
      activeTabKey: '1',
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      loading: false,
      coords: [41.31, 69.28],
      items: null,
      order: {
        status: '',
        customer_name: '',
        address: '',
        note: '',
        phone: '',
        payment_method: '',
        delivery_method: ''
      },
      rules: {
        number: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      columns: [
        {
          title: this.$t('product_name'),
          dataIndex: 'product_name',
          width: '50%'
        },
        {
          title: this.$t('price'),
          key: 'price',
          width: '30%',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$t('quantity'),
          dataIndex: 'quantity',
          width: '20%'
        }
      ]
    }
  },
  mounted () {
    this.getOrderAttrs()
    this.getAdmin().then(res => {
      console.log('this.admin', this.admin)
    })
  },
  computed: {
      ...mapGetters(['admin']),
      getProducts () {
          return this.items
      },
      isUnired () {
        return this.order.payment_method === 'unired'
      }
  },
  methods: {
    ...mapActions(['getAdmin']),
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
          console.log('this.cooords', this.coords)
        this.items = items
        this.order.customer_name = customerName
        this.order.address = address
        this.order.phone = phone
        this.order.note = note
        this.order.status = status
        this.order.delivery_method = deliveryMethod
        this.order.payment_method = paymentMethod
        this.coords = longlat ? [Number(longlat.split(',')[0]), Number(longlat.split(',')[1])] : this.coords
        console.log('this.coords', this.coords)
      })
    },
    numberToPrice (number) {
      return numberToPrice(number)
    },
    calcTotalPrice (arrOfItems) {
      return calcTotalPrice(arrOfItems)
    },
    activeTabHandler (_activeTabKey) {
        this.activeTabKey = _activeTabKey
    },
    handleTableChange (pagination) {
       console.log('pagination', pagination)
    },
    getPagination (pagination) {
        return pagination
    },
    handlePaymentMethod (payMethod) {
      this.order.payment_method = payMethod
      console.log('this.order', this.order)
    },
    handleDeliveryMethod (deliveryMethod) {
      this.order.delivery_method = deliveryMethod
      console.log('this.order', this.order)
    },
    handleStatus (status) {
      this.order.status = status
      console.log('this.order', this.order)
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = `/order/${this.orderNumber}`
          var method = 'put'
          const headers = {
            'Content-Type': 'application/json'
          }
          request({
              url: url,
              method: method,
              data: {
                ...this.order,
                longlat: `${this.coords[0]},${this.coords[1]}`,
                user_id: this.admin.id
              },
              headers: headers
          }).then(res => {
            this.$router.replace('/orders/list')
            console.log('response after submit', res)
          }).catch(err => {
              console.log(err)
              this.$message.error(this.$t('error'))
            }
          )
          console.log('valid')
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style>
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

/* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
</style>
