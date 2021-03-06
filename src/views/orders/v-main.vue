<template>
  <div>
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="order"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey" style="padding: 0 15px">
        <a-tab-pane key="1" :tab="$t('order_data')">
          <a-row>
            <a-col
              style="padding: 0 15px 0 0; margin-bottom: 30px"
              :lg="12"
              :md="24"
            >
              <a-table
                bordered
                :columns="[{ title: 'Общие сведение', dataIndex: 'text' }, { title: '', dataIndex: 'orderNumber' }]"
                :dataSource="[{ text: 'Номер заказа', orderNumber: orderNumber }, { text: 'Сумма заказа', orderNumber: numberToPrice(calcTotalPrice(this.items)) }]"
                :pagination="false"
              >
              </a-table>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" style="padding: 0 15px 0 0">
              <a-form-model-item ref="status" :label="$t('status')" prop="status">
                <a-select v-model="order.status" size="large" @change="handleStatus" test-attr="status-order">
                  <a-icon slot="suffixIcon" :component="$myIcons.arrowDown" />
                  <a-select-option value="in-process">
                    В обработке
                  </a-select-option>
                  <a-select-option value="cancelled">
                    Отменен
                  </a-select-option>
                  <a-select-option value="finished">
                    Завершено
                  </a-select-option>
                  <a-select-option value="order_accepted">
                    Заказ принят
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px 0 0">
              <a-form-model-item ref="deliveryMethod" :label="$t('delivery_method')" prop="deliveryMethod">
                <a-select
                  v-model="order.delivery_method"
                  size="large"
                  @change="handleDeliveryMethod"
                  test-attr="delivery-order">
                  <a-icon slot="suffixIcon" :component="$myIcons.arrowDown" />
                  <a-select-option value="self">
                    Самовывоз
                  </a-select-option>
                  <a-select-option value="dayDelivery">
                    Доставка в течении дня
                  </a-select-option>
                  <a-select-option value="expressDelivery">
                    Экспресс-доставка
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px 0 0">
              <a-form-model-item ref="paymentMethod" :label="$t('payment_method')" prop="paymentMethod">
                <a-select
                  v-model="order.payment_method"
                  size="large"
                  @change="handlePaymentMethod"
                  test-attr="payment-order">
                  <a-icon slot="suffixIcon" :component="$myIcons.arrowDown" />
                  <a-select-option value="cash" :disabled="this.isUnired">
                    Наличные
                  </a-select-option>
                  <a-select-option value="terminal" :disabled="this.isUnired">
                    Терминал
                  </a-select-option>
                  <a-select-option value="card" :disabled="this.isUnired">
                    Карта
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
                  size="large"
                  test-attr="address-order"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px 0 0">
              <a-form-model-item ref="customerNote" :label="$t('note')" prop="customerNote">
                <a-input
                  size="large"
                  v-model="order.note"
                  test-attr="note-order"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" style="padding: 0 15px 0 0">
              <a-form-model-item ref="map" :label="$t('map')" prop="map">
                <yandex-map
                  :coords="coords"
                  v-model="coords"
                  :zoom="18"
                  @click="onLocationChange"
                  searchControlProvider="yandex#search"
                  style="width: 100%; max-width: 1000px; height: 40vh;"
                  test-attr="coords-order"
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
              <a-form-model
                ref="productRuleForm"
                :model="editingKey !== '' ? items[editingKey] : {}"
                :rules="productRules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-table
                  @change="handleTableChange"
                  :rowKey="record => record.product_id"
                  :columns="columns"
                  :data-source="items"
                  bordered
                  test-attr="products-list-order"
                  class="pointer"
                >
                  <template
                    v-for="col in ['product_name', 'price', 'quantity']"
                    :slot="col"
                    slot-scope="text, record, index"
                  >
                    <div :key="col">
                      <template v-if="record.editable">
                        <a-form-model-item :ref="col" :prop="col">
                          <a-select
                            v-if="col === 'product_name'"
                            show-search
                            :auto-clear-search-value="false"
                            @search="onProductSearch"
                            :value="record.product_name"
                            :filter-option="false"
                            @popupScroll="onScrollBottom"
                            placeholder="product"
                            @change="e => handleChange(e, index, col)"
                          >
                            <a-select-option
                              v-for="product in productList"
                              :title="product.name"
                              :key="product.id"
                              :value="product.id">
                              {{ product.name }}
                            </a-select-option>
                            <a-select-option key="fetching" v-if="productParams.total > productList.length || fetching">
                              <a-spin slot="notFoundContent" size="small" />
                            </a-select-option>
                          </a-select>
                          <a-input-number
                            v-else
                            style="margin: -5px 0"
                            :min="col === 'price' ? 0 : 1"
                            :disabled="col === 'price'"
                            :value="col === 'price' ? record.price : record.quantity"
                            @change="e => handleChange(e, index, col)"
                          />
                        </a-form-model-item>
                      </template>
                      <template v-else>
                        {{ col === 'price' ? numberToPrice(record.price) : text }}
                      </template>
                    </div>
                  </template>
                  <template slot="operation" slot-scope="text, record, index">
                    <div class="editable-row-operations">
                      <span v-if="record.editable">
                        <a @click="() => save(index)">{{ $t('save') }}</a>
                        <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(index)">
                          <a>{{ $t('cancel') }}</a>
                        </a-popconfirm>
                      </span>
                      <span v-else>
                        <!-- <a :disabled="editingKey !== '' || order.status !== 'in-process'" @click="() => edit(index)">{{ $t('update') }}</a> -->
                        <a-tooltip>
                          <template slot="title">{{ $t('update') }}</template>
                          <a-button
                            @click="() => edit(index)"
                            :disabled="editingKey !== '' || order.status !== 'in-process'"
                            id="buttonOrderDetails"
                            type="primary"
                            icon="edit"></a-button>
                        </a-tooltip>
                        <a-popconfirm
                          placement="topRight"
                          slot="extra"
                          :title="$t('deleteMsg')"
                          :disabled="editingKey !== ''|| items.length === 1 || order.status !== 'in-process'|| items.length === 1"
                          @confirm="deleteProduct(index)"
                          :okText="$t('yes')"
                          :cancelText="$t('no')"
                        >
                          <a-tooltip>
                            <template slot="title">{{ $t('delete') }}</template>
                            <a-button
                              id="buttonDelete"
                              type="danger"
                              icon="delete"
                              :disabled="editingKey !== '' || order.status !== 'in-process'"></a-button>
                          </a-tooltip>
                        </a-popconfirm>
                      </span>
                    </div>
                  </template>
                </a-table>
              </a-form-model>
            </a-col>
          </a-row>
          <!-- <a-row>
              <a-col :span="24">
                <a-table
                  @change="handleTableChange"
                  :rowKey="record => record.product_id"
                  :columns="columns"
                  :data-source="items"
                  bordered
                  test-attr="products-list-order"
                >
                  <template slot="price" slot-scope="text, row">
                    {{ numberToPrice(row.price) }}
                  </template>
                </a-table>
              </a-col>
            </a-row> -->
        </a-tab-pane>
        <a-tab-pane key="3" :tab="$t('customer')">
          <a-row>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="customerName" :label="$t('firstName')" prop="customerName">
                <a-input
                  size="large"
                  v-model="order.customer_name"
                  test-attr="customer_name-order"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="phone" :label="$t('phone')" prop="phone">
                <a-input
                  size="large"
                  disabled
                  v-model="order.phone"
                  test-attr="phone-order"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="4" :tab="$t('activities')">
          <user-activities />
        </a-tab-pane>
      </a-tabs>
    </a-form-model>
  </div>
</template>

<script>
import request from '@/utils/request'
import numberToPrice from '@/utils/numberToPrice'
import calcTotalPrice from '@/utils/calcTotalPrice'
import { mapActions, mapGetters, mapState } from 'vuex'
import userActivities from './UserActivities'
import { pointSearch } from '@/utils/yandexMap'
import debounce from 'lodash/debounce'

export default {
  watch: {
    items: (values) => {
      console.log('===>>', values)
    }
  },
  components: {
    'user-activities': userActivities
  },
  data () {
    this.onProductSearch = debounce(this.onProductSearch, 400)
    this.getProductsList = debounce(this.getProductsList, 100)
    return {
      productList: [],
      productParams: {
        limit: 10,
        page: 1,
        total: null
      },
      id: null,
      status: null,
      fetching: false,
      cacheData: [],
      editingKey: '',
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
      productRules: {
        product_name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        quantity: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        price: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      columns: [
        {
          title: this.$t('product_name'),
          dataIndex: 'product_name',
          width: '50%',
          scopedSlots: { customRender: 'product_name' }
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
          width: '20%',
          scopedSlots: { customRender: 'quantity' }
        },
        {
          title: this.$t('operation'),
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  mounted () {
    this.onProductSearch()
    // this.getAdmin().then(res => {
    //   console.log('this.admin', this.admin)
    // })
  },
  computed: {
    ...mapGetters(['admin', 'tabId']),
    ...mapState({
      userId: state => state.user.userId
    }),
    getProducts () {
      return this.items
    },
    isUnired () {
      return this.order.payment_method === 'unired'
    }
  },
  methods: {
    ...mapActions(['getAdmin', 'getCustomerOrdersitem']),
    onLocationChange (e) {
      // var eMap = e.get('target')
      this.coords = e.get('coords')
      // console.log('MAP', e)
      const searchCoord = [this.coords[0], this.coords[1]]
      // console.log(searchCoord)
      pointSearch(searchCoord.toString()).then(result => {
        // this.order.address = result[0].name
        this.order.address = this.arrangeAddress(result)
      })
    },
    arrangeAddress (addressArray) {
      if (addressArray.length === 1) {
        return addressArray[0].name
      }
      return `${this.arrangeAddress(addressArray.slice(1, addressArray.length))}, ${addressArray[0].name}`
    },
    deleteProduct (index) {
      // console.log('Delete product', index)
      const newData = [...this.items]
      const newCacheData = [...this.cacheData]
      const target = newData[index]
      const targetCache = newCacheData[index]
      if (target) {
        newData.splice(index, 1)
        this.items = newData
      }
      if (targetCache) {
        newCacheData.splice(index, 1)
        this.cacheData = newCacheData
      }
    },
    addProduct () {
      this.items.unshift({
        image: '',
        price: null,
        product_id: '',
        product_name: '',
        quantity: 1,
        editable: true
      })
      this.$emit('addProduct')
      this.editingKey = this.items.length - 1
    },
    onScrollBottom (event) {
      var target = event.target
      if (!this.fetching && target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (this.productParams.total > this.productList.length) {
          this.productParams.page += 1
          this.productParams.lang = this.lang || 'ru'
          target.scrollTo(0, target.scrollHeight)
          this.getProductsList()
        }
      }
    },
    getProductsList () {
      this.fetching = true
      request({
        url: '/product-variant',
        method: 'get',
        params: this.productParams
      })
        .then(response => {
          this.fetching = false
          this.productList.push(...response.product_variants)
          this.productParams.total = response.count
        })
        .catch(() => {
          this.fetching = false
        })
    },
    onProductSearch (value) {
      // console.log(value, 'value')
      this.fetching = true
      this.productList = []
      this.productParams = { search: value, lang: this.lang, limit: 10, page: 1 }
      this.getProductsList()
    },
    handleChange (value, index, column) {
      // console.log('CHANGE', index, value)
      console.log('=>>>>', this.items)
      const newData = [...this.items]
      const target = newData[index]
      if (target) {
        if (column === 'product_name') {
          const product = this.productList.find(item => item.id === value)
          target[column] = product.name
          target.product_id = product.id
          target.image = product.image
          target.price = parseInt(product.price.uzs_price)
          this.items = newData
        } else {
          target[column] = value
          this.items = newData
        }
      }
    },
    edit (index) {
      const newData = [...this.items]
      const target = newData[index]
      this.editingKey = index
      if (target) {
        target.editable = true
        this.items = newData
      }
    },
    save (index) {
      this.$refs.productRuleForm.validate(valid => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          // this.item[index].quantity === '' ? this.item[index].quantity = 1 : this.item[index].quantity
          const newData = [...this.items]
          const newCacheData = [...this.cacheData]
          const target = newData[index]
          let targetCache = newCacheData[index]
          if (target && targetCache) {
            // console.log('Kevoti 1chisi', targetCache, newCacheData)
            delete target.editable
            this.items = newData
            console.log('=====>>item', newData)
            Object.assign(targetCache, target)
            this.cacheData = newCacheData
          } else {
            targetCache = {}
            delete target.editable
            this.items = newData
            Object.assign(targetCache, target)
            newCacheData.push(targetCache)
            // console.log('Kevoti', targetCache, newCacheData)
            this.cacheData = newCacheData
          }
          this.editingKey = ''
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    cancel (index) {
      const newData = [...this.items]
      const newCacheData = [...this.cacheData]
      const target = newData[index]
      const targetCache = newCacheData[index]
      this.editingKey = ''
      if (target && targetCache) {
        Object.assign(target, this.cacheData[index])
        delete target.editable
        this.items = newData
      } else {
        newData.splice(index, 1)
        this.items = newData
      }
    },
    getOrderAttrs () {
      request({
        url: `/order/${this.orderNumber}`,
        method: 'get'
      }).then((response) => {
        console.log('response customer data===========>', response)
        this.id = response.id
        this.status = response.status
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
        console.log('this.cooords==>', this.coords)
        // eslint-disable-next-line no-undef
        // response.items.map(e => this.items.push(e))
        this.items = items && items.length ? items : []
        // console.log(items, 'itemss====>')
        // this.items.push(items)
        this.cacheData = JSON.parse(JSON.stringify(items)) || []
        this.order.customer_name = customerName
        this.order.address = address
        this.order.phone = phone
        this.order.note = note
        this.order.status = status
        this.order.delivery_method = deliveryMethod
        this.order.payment_method = paymentMethod
        this.coords = longlat && longlat.length > 2 ? [Number(longlat.split(',')[0]), Number(longlat.split(',')[1])] : this.coords
        console.log('this.coords', this.coords)
        this.handleStatus(status)
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
      this.$router.push({
        name: this.$route.name,
        params: {
          id: this.$route.params.id
        },
        query: {
          id: this.id,
          tab: _activeTabKey
        }
      })
      if (_activeTabKey === '4') {
        const paylod = {
          element: 'order',
          element_id: this.$route.params.id,
          // element_id: this.$route.query.id,
          limit: 10,
          page: 1,
          total: null
        }
        this.getCustomerOrdersitem(paylod).then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
      }
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
      this.$store.dispatch('saveButton', status)
      console.log('this.order', this.order)
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = `/order/${this.orderNumber}`
          console.log('user_id===>', localStorage.getItem('user_id'))
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
              user_id: JSON.parse(localStorage.getItem('user_id')),
              items: this.items
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
  },
  created () {
    this.getOrderAttrs()
  }
}
</script>

<style>
.pointer:hover{
cursor: pointer;
}
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
