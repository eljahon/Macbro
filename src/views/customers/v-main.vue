<template>
  <div>
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="customer"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-tabs v-model="activeTabKey">
          <a-tab-pane key="1" :tab="$t('basicSettings')">
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('name')" prop="name">
                <a-input
                  v-model="customer.name"
                  test-attr="name-customer"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="lastname" :label="$t('lastName')" prop="last_name">
                <a-input
                  v-model="customer.last_name"
                  test-attr="lastname-customer"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="phone" :label="$t('phone')" prop="phone_number">
                <a-input
                  v-model="customer.phone_number"
                  test-attr="phone-customer"
                />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="12" style="padding: 0 15px">
          <a-form-model-item ref="address" :label="$t('address')" prop="address">
            <a-input
              v-model="customer.address"
            />
          </a-form-model-item>
        </a-col> -->
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item>
                <a-button type="primary" html-type="submit" @click="onSubmit" test-attr="save-customer">
                  {{ $t('save') }}
                </a-button>
                <a-button style="margin-left: 10px;" @click="resetForm" test-attr="reset-customer">
                  {{ $t('reset') }}
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="$t('orderHistory')">
            <a-table
              :columns="columns"
              :rowKey="record => record.id"
              :dataSource="getAllCustomerOrders"
              :pagination="getOrdersPagination"
              :loading="loading"
              @change="handleTableChange"
              test-attr="history-list-customer"
            >
              <template slot="action" slot-scope="text, row">
                <router-link :to="`/order/details/${row.number}`" >
                  <preview-btn test-attr="order-detail-customer"/>
                </router-link>
              </template>
              <template slot="status" slot-scope="text, row">
                <a-tag
                  :color="statusColor[row.status]"
                >
                  {{ statusTranslator(row.status) }}
                </a-tag>
              </template>
              <template slot="tag" slot-scope="tag">
                <a-tag color="red">{{ tag }}</a-tag>
              </template>
              <template slot="total" slot-scope="text, row">
                <div>{{ numberToPrice(calcTotalPrice(row.items)) }} </div>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import calcTotalPrice from '@/utils/calcTotalPrice'
import numberToPrice from '@/utils/numberToPrice'
export default {
  data () {
    return {
      customerId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      activeTabKey: '1',
      customer: {
        name: '',
        'last_name': '',
        'phone_number': ''
        // address: ''
      },
      columns: [
        {
          title: this.$t('order_number'),
          key: 'tag',
          dataIndex: 'number',
          scopedSlots: { customRender: 'tag' }
        },
        {
          title: this.$t('status'),
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('date'),
          dataIndex: 'created_at'
        },
        {
          title: this.$t('total'),
          key: 'total',
          width: '20%',
          scopedSlots: { customRender: 'total' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        'last_name': [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        'phone_number': [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      orderStatus: {
        'in-process': 'В обработке',
        'finished': 'Завершено',
        'cancelled': 'Отменен'
      },
      statusColor: {
        'in-process': 'blue',
        'finished': 'green',
        'cancelled': 'red'
      }
    }
  },
  mounted () {
      console.log('this.customerOrders', this.customerOrders)
      this.getCustomerAttrs()
      this.getCustomerOrders({ page: null, customerId: this.customerId })
        .then((res) => console.log('this.customerOrders', this.customerOrders))
        .catch(err => console.error(err))
        .finally(() => (this.loading = false))
  },
  computed: {
    ...mapGetters(['customerOrders', 'customerOrdersPagination']),
    getOrdersPagination () {
      return this.customerOrdersPagination
    },
    getAllCustomerOrders () {
      return this.customerOrders
    }
  },
  methods: {
    ...mapActions(['getCustomerOrders']),
    getCustomerAttrs () {
      request({
        url: `/get/client/${this.customerId}`,
        method: 'get'
      }).then((response) => {
          const { name } = response
          console.log('response', response)
          this.customer.name = name
          this.customer.last_name = response.last_name
          this.customer.phone_number = response.phone_number
          // this.customer.address = address
      })
    },
    handleTableChange (pagination) {
      this.loading = true
      this.getCustomerOrders({ page: pagination, customerId: this.customerId })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            var url = `/client/${this.customerId}`
            var method = 'put'
            const headers = {
                'Content-Type': 'application/json'
            }
          request({
              url,
              method,
              data: this.customer,
              headers
          })
          .then(res => {
            console.log(res)
            this.$router.replace('/customers/list')
            this.$message.success(this.$t('successfullyUpdated'))
          })
          .catch(err => {
            console.log(err)
            this.$message.error(this.$t('error'))
          })
        } else {
          console.log('error submit, validation failed')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    statusTranslator (status) {
      return this.orderStatus[status]
    },
    calcTotalPrice (arrOfItems) {
      return calcTotalPrice(arrOfItems)
    },
     numberToPrice (number) {
      return numberToPrice(number)
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
