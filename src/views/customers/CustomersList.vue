<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px">
        <a-breadcrumb-item>{{ $t('customers') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :title="$t('customers')" class="breadcrumb-row" :bordered="false">
      <div slot="extra">
        <a-form layout="horizontal" :form="form" @submit="search">
          <a-row type="flex">
            <a-col span="auto">
              <a-form-item style="margin: 0">
                <a-input
                  test-attr="search-customer"
                  id="inputSearch"
                  :placeholder="`${$t('phone')}...`"
                  v-decorator="['search', { initialValue: this.getSearchQuery }]"
                  v-debounce="debouncedSearch"
                />
              </a-form-item>
            </a-col>
            <a-col span="auto">
              <a-form-item style="margin: 0">
                <a-button id="buttonSearch" type="default" html-type="submit" icon="search" test-attr="search-btn-customer">{{ $t('search') }}</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllCustomers"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        test-attr="list-customer"
      >
        <template slot="action" slot-scope="text, row, index">
          <!-- <preview-btn @click="showPreviewModal(row.id)" test-attr="preview-customer"/> -->
          <!-- <a-tooltip>
            <template slot="title">{{ $t('read') }}</template>
            <a-button
              id="buttonPreview"
              type="default"
              @click="showPreviewModal(row.id)"
              icon="eye"
            ></a-button>
          </a-tooltip> -->
          <router-link :to="`./update/${row.id}`">
            <edit-btn :test-attr="`edit-customer${index}`"/>
          </router-link>
          <delete-btn @confirm="deleteCustomer($event, row.id)" :test-attr="`delete-customer${index}`"/>
          <!-- <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteCustomer($event, row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm> -->
        </template>
      </a-table>
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedCustomer"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('customer_name')">
          {{ `${selectedCustomer.name} ${selectedCustomer.lastname}` }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('phone')">
          <div v-html="selectedCustomer.phone"></div>
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel" test-attr="cancel-customer">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
import calcTotalPrice from '@/utils/calcTotalPrice'
import numberToPrice from '@/utils/numberToPrice'
export default {
  data () {
    return {
      value: '',
      data: [],
      loading: true,
       columns: [
        {
          title: this.$t('firstName'),
          dataIndex: 'name'
        },
        {
          title: this.$t('lastName'),
          dataIndex: 'lastname'
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedCustomer: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['customersData', 'customersPagination', 'searchQuery']),
    getPagination () {
      return this.customersPagination
    },
    getAllCustomers () {
      return this.customersData
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    this.getCustomers({ page: this.customersPagination })
      .then((res) => console.log('customers', this.customersData))
      .catch((err) => console.error(err))
      .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getCustomers', 'setSearchQuery']),
    handleTableChange (pagination) {
      this.loading = true
      this.getCustomers({ page: pagination })
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
    },
    calcTotalPrice (arrOfItems) {
      return calcTotalPrice(arrOfItems)
    },
    numberToPrice (number) {
      return numberToPrice(number)
    },
    showPreviewModal (customerId) {
      this.previewVisible = true
      this.getSelectedCustomer(customerId)
    },
    getSelectedCustomer (selectedCustomerId) {
      request({
        url: `/customer/profile/${selectedCustomerId}`,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedCustomer = response.customer
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedCustomer = null
    },
    debouncedSearch (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getCustomers()
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteCustomer (e, id) {
      this.loading = true
      request({
        url: `/customer/profile/${id}`,
        method: 'delete'
      })
      .then(res => {
        console.log(res)
        this.$message.success(this.$t('successfullyDeleted'))
        this.getCustomers({ page: this.customersPagination })
      })
      .catch(err => {
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => (this.loading = false))
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        this.loading = true
        if (!err) {
          this.filterParams = values
          this.getCustomers()
            .then(res => console.log('res', res))
            .catch(err => console.error('err', err))
            .finally(() => (this.loading = false))
        }
      })
    }
  }
}
</script>
