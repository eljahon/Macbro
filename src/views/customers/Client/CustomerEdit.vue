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
      <div slot="title"><span>Добавить в черный список</span>
        <a-switch
          style="margin-left: 30px"
          :checked-children="$t('active')"
          :un-checked-children="$t('inactive')"
          default-checked/></div>

      <a-tabs type="card" v-model="activeTabKey" @change="callback">
        <a-tab-pane key="1" :tab="$t('basicSettings')">
          <a-form-model
            @submit="onSubmit"
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row>
              <a-row>
                <a-col :span="12" style="padding: 0 15px;">
                  <a-upload
                    class="posiation"
                    :custom-request="uploadImage"
                    list-type="picture-card"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                  >
                    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                    <div v-else>
                      <a-icon :type="loading ? 'loading' : 'plus'" />
                      <div class="ant-upload-text">
                        {{ $t('uploadCategoryImage') }}
                      </div>
                    </div>
                  </a-upload>
<!--                  &lt;!&ndash;                              <img src="../../../assets/img.png" alt="" style="width: 170px">&ndash;&gt;-->
<!--                  &lt;!&ndash;                              <p style="margin-top: 15px; color: #00A0E9" >&ndash;&gt;-->
<!--                  &lt;!&ndash;                                <span>Загрузить изображение</span>&ndash;&gt;-->
<!--                  &lt;!&ndash;                              </p>&ndash;&gt;-->
                </a-col>
              </a-row>

              <a-col :md="24" :lg="8" style="padding: 0 15px">
                <a-form-model-item ref="first_name" :label="$t('firstName')" prop="first_name">
                  <a-input
                    size="large"
                    v-model="form.first_name"
                    :placeholder="$t('firstName')"
                  > </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :lg="8" style="padding: 0 15px">
                <a-form-model-item ref="last_name" :label="$t('lastName')" prop="last_name">
                  <a-input
                    size="large"
                    style="width: 100%"
                    :placeholder="$t('lastName')"
                    v-model="form.last_name"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :lg="8" style="padding: 0 15px">
                <a-form-model-item ref="phone_number" :label="$t('phone_number')" prop="phone_number">
                  <a-input
                    :placeholder="$t('phone_number')"
                    style="width: 100%"
                    size="large"
                    :disabled="this.$route.params.id"
                    v-model="form.phone_number"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :lg="8" style="padding: 0 15px">
                <a-form-model-item :label="$t('email')">
                  <a-input
                    :placeholder="$t('email')"
                    size="large"
                    :disabled="false"
                    v-model="form.email"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :lg="8" style="padding: 0 15px">
                <a-form-model-item ref="middel_name" :label="$t('middelname')" prop="middel_name">
                  <a-input v-model="form.middle_name" size="large" :placeholder="$t('middelname')"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
              <a-row v-if="$route.params.id">
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
              <a-row v-if="$route.params.id">
                <a-col :span="12" style="padding: 0 15px">
                  <a-form-model-item ref="phone_number" :label="'Баланс'" prop="phone_number">
                    <a-input
                      size="large"
                      v-model="form.balance"
                      :disabled="this.$route.params.id"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('orderHistory')">
          <a-table
            class="pointer"
            :columns="columns"
            :customRow="customRowClick"
            :rowKey="record => record.id"
            :dataSource="getAllCustomerOrders"
            :pagination="getOrdersPagination"
            :loading="loading"
            @change="handleTableChange"
            test-attr="history-list-customer"
          >
            <!--              <template slot="action" slot-scope="text, row">-->
            <!--                <router-link :to="`/order/details/${row.number}`" >-->
            <!--                  <preview-btn test-attr="order-detail-customer"/>-->
            <!--                </router-link>-->
            <!--              </template>-->
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

    </a-card>
    <a-row class="edit-btns" style="margin-top: 10px">
      <a-col :span="24">

        <a-button type="primary" html-type="submit" @click="onSubmit" test-attr="save-customer">
          {{ $t('save') }}
        </a-button>
        <a-button style="margin-left: 10px;" @click="resetForm" test-attr="reset-customer">
          {{ $t('reset') }}
        </a-button>
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
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  watch: {
    'form.profile_image': (e) => {
      console.log(e)
    }
  },
  data () {
    const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    }
    return {
      requesting: false,
      imageUrl: '',
      page: { current: 1, limit: 10, total: null },
      customerId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      activeTabKey: '1',
      form: {
        // company_id: localStorage.getItem('company_id'),
        // date_of_birth: '',
        email: '',
        first_name: '',
        id: '',
        inn: '',
        last_name: '',
        middle_name: '',
        // passport_number: '',
        phone_number: '',
        profile_image: '',
        user_type: 'client',
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
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: '20%',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      rules: {
        first_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        last_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone_number: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validatePhone, trigger: 'change' }],
        inn: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        middle_name: [{ required: true, message: this.$t('required'), trigger: 'change' }]

      },
      orderStatus: {
        'in-process': 'В обработке',
        'finished': 'Завершено',
        'cancelled': 'Отменен',
        'order_accepted': 'Заказ принят'
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
  console.log('==>>', res)
  Object.keys(this.form).map(key => {
    if (res[key]) this.form[key] = res[key]
  })
  this.imageUrl = res.profile_image
  this.form.balance = res.balance ? res.balance : '0'
}).catch(err => {
  console.log(err)
}).finally(() => (this.loading = false))
    }
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
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push(`/order/details/${record.number}`)
          }
        }
      }
    },
    uploadImage (e) {
      this.loading = true
      this.$store.dispatch('setButton', this.loading)
      var data = new FormData()
      data.append('file', e.file)
      request({
        url: '/upload',
        method: 'post',
        data: data
      }).then(response => {
        console.log('respons==>>>', response)
        getBase64(e.file, imageUrl => {
          this.imageUrl = imageUrl
        })
        setTimeout(() => {
          this.loading = false
          this.$store.dispatch('setButton', this.loading)
        }, 3000)
        this.form.profile_image = response.filename
      }).catch(error => {
        console.error(error)
        setTimeout(() => {
          this.loading = false
          this.$store.dispatch('setButton', this.loading)
        }, 3000)
      })
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG, WEBP file!')
      }
      return isJpgOrPng
    },
    callback (e) {
        this.page.customer_id = this.$route.params.id
      // console.log(e)
      if (e === '2') {
        this.getCustomerOrders(this.page).then(res => {
          console.log('order===========>', res)
        })
      }
    },
    userCustomeItem () {
      // console.log('hello =======> delete')
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
        // console.log(res)
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
      console.log(pagination)
      this.page = pagination
      this.loading = true
      this.getCustomerOrders(this.page)
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          delete this.form.balance
          if (this.$route.params.id) {
            var url = `/user/${this.customerId}`
            var method = 'put'
            const headers = {
              'Content-Type': 'application/json'
            }
            delete this.form.id
            this.profile_image = ''
            request({
              url,
              method,
              data: this.form,
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
         this.$store.dispatch('getCustomers', this.form).then(res => {
           console.log('res==>>', res)
           this.form.id = res.data
           const headers = {
             'Content-Type': 'application/json'
           }
           request({
             url: `/user`,
             method: 'post',
             data: this.form,
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
         })
          }
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
.posiation  {
  position: relative;
  width: 100px;
}
.iconloading  {
  color:#222222;
  position: absolute;
  top:40% ;
  left:100%;
  transform: translate(-50% -50%);
}
.pointer {
  cursor: pointer;
}
</style>
