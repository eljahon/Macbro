<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/customers/list" test-attr="prev-link-customer">{{ $t('customers') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :title="$t('update')" class="breadcrumb-row" :bordered="false">
      <a-popconfirm
        placement="topRight"
        slot="extra"
        :title="$t('deleteMsg')"
        @confirm="userCustomeItem"
        :okText="$t('yes')"
        :cancelText="$t('no')"
      >
        <a-button type="danger" html-type="submit" test-attr="save-customer">
          <a-icon :component="$myIcons.binSvg" /> {{ $t('delete') }}
        </a-button>
      </a-popconfirm>
    </a-card>

    <a-card :bordered="false" style="flex: 1">
      <a-form-model
        @submit="onSubmit"
        ref="ruleForm"
        :model="customer"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-tabs type="card" v-model="activeTabKey" @change="callback">
          <a-tab-pane key="1" :tab="$t('basicSettings')">
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="name" :label="$t('name')" prop="name">
                  <a-input
                    size="large"
                    v-model="customer.name"
                    test-attr="name-customer"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="lastname" :label="$t('lastName')" prop="last_name">
                  <a-input
                    size="large"
                    v-model="customer.last_name"
                    test-attr="lastname-customer"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="phone" :label="$t('phone')" prop="phone_number">
                  <a-input
                    size="large"
                    v-model="customer.phone_number"
                    test-attr="phone-customer"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="phone" label="Рейтинг клиента">
                  <a-rate :value="5" >
                    <a-icon
                      slot="character"
                      style="font-size: 30px"
                      allowClear
                      theme="filled"
                      type="star"></a-icon>
                  </a-rate>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item ref="phone" :label="'Баланс'" prop="phone_number">
                  <a-input
                    size="large"
                    disabled
                    test-attr="balance-customer"
                    v-model="customer.balance"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
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
          <a-tab-pane key="3">
            <div slot="tab">
              <span>
                {{ $t('customerstab4') }}<span class="custom-badge" style="margin-left: 10px;">1</span>
              </span>
            </div>
          </a-tab-pane>

        </a-tabs>
      </a-form-model>
    </a-card>
    <a-row class="edit-btns" style="margin-top: 10px">
      <a-col :span="24">
        <a-form-model-item>
          <a-button type="primary" html-type="submit" @click="onSubmit" test-attr="save-customer">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm" test-attr="reset-customer">
            {{ $t('reset') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import calcTotalPrice from '@/utils/calcTotalPrice'
import numberToPrice from '@/utils/numberToPrice'
import notification from 'ant-design-vue/lib/notification'
export default {
  data () {
    return {
      page: { limit: 1, pageSize: 10, total: null },
      customerId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      activeTabKey: '1',
      customer: {
        name: '',
        'last_name': '',
        'phone_number': '',
        balance: ''
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
    if (this.$route.params.id) {
this.getUserListItem(this.$route.params.id).then(res => {
  // eslint-disable-next-line camelcase,no-unused-vars,standard/object-curly-even-spacing
  const { first_name, last_name, phone_number } = res
  // eslint-disable-next-line camelcase
  this.customer.name = res.first_name
  this.customer.phone_number = res.phone_number
  this.customer.last_name = res.last_name
  this.customer.balance = res.balance ? res.balance : '0'
}).catch(err => {
  console.log(err)
}).finally(() => (this.loading = false))
    }
      console.log('this.customerOrders', this.customerOrders)
      // this.getCustomerAttrs()
      // this.getCustomerOrders({ page: null, customerId: this.customerId })
      //   .then((res) => console.log('this.customerOrders', this.customerOrders))
      //   .catch(err => console.error(err))
      //   .finally(() => (this.loading = false))
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
    ...mapActions(['getCustomerOrders', 'getUserListItem']),
    callback (e) {
      // const paylod = {
      //   element: 'order',
      //   element_id: this.$route.params.id,
      //   user_id:
      //   limit: 1,
      //   page: 10,
      //   total: null
      // }
      console.log(e)
      // if (e === '2') {
      //   this.getCustomerOrders(paylod).then(res => {
      //     console.log('order===========>', res)
      //   })
      // }
    },
    userCustomeItem () {
      console.log('hello =======> delete')
      this.$store.dispatch('getUserListItemRemove', this.$route.params.id).then(res => {
        if (res) {
          this.$router.push({ name: 'CustomersList' })
          notification.success({
            message: 'Forbidden',
            description: 'success'
          })
        }
      }).catch(err => {
        console.log(err)
        notification.error({
          message: 'Forbidden',
          description: 'error'
        })
      })
    },
    deleteCustomer (e) {
      this.loading = true
      request({
        url: `/client/${this.customerId}`,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.$router.push('/customers/list')
      })
      .catch(err => {
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => (this.loading = false))
    },
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
          delete this.customer.balance
            var url = `/user/${this.customerId}`
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
</style>
