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
        <a-tabs type="card" v-model="activeTabKey">
          <a-tab-pane key="1" :tab="$t('basicSettings')">
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('name')" prop="name">
                <a-input
                  v-model="customer.name"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="lastname" :label="$t('lastName')" prop="lastname">
                <a-input
                  v-model="customer.lastname"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" style="padding: 0 15px">
              <a-form-model-item ref="phone" :label="$t('phone')" prop="phone">
                <a-input
                  v-model="customer.phone"
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
                <a-button type="primary" html-type="submit" @click="onSubmit">
                  {{ $t('save') }}
                </a-button>
                <a-button style="margin-left: 10px;" @click="resetForm">
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
            >
              <template slot="action" slot-scope="text, row">
                <router-link :to="`/order/details/${row.number}`" >
                  <a-tooltip><template slot="title">{{ $t('read') }}</template>
                    <a-button type="primary" icon="link"></a-button>
                  </a-tooltip>
                </router-link>
              </template>
              <template slot="status" slot-scope="text, row">
                <a-tag v-if="row.status === 'cancelled'" color="red">{{ statusTranslator(row.status) }}</a-tag>
                <a-tag v-if="row.status === 'in-process'" color="blue">{{ statusTranslator(row.status) }}</a-tag>
                <a-tag v-if="row.status === 'finished'" color="green">{{ statusTranslator(row.status) }}</a-tag>
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
        lastname: '',
        phone: ''
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
        lastname: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        phone: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      orderStatus: {
        'in-process': 'В обработке',
        'finished': 'Завершено',
        'cancelled': 'Отменен'
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
        url: `/customer/profile/${this.customerId}`,
        method: 'get'
      }).then((response) => {
          const { customer: { name, lastname, phone } } = response
          console.log('response', response)
          this.customer.name = name
          this.customer.lastname = lastname
          this.customer.phone = phone
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
            var url = `/customer/profile/${this.customerId}`
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
