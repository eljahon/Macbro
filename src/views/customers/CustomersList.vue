<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('customers') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra">
        <a-input
          style="float: right; width: 200px"
          test-attr="search-order"
          id="inputSearch"
          :placeholder="$t('search') + '...'"
          v-model="params.search"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('customers')" class="breadcrumb-row" :bordered="false">
      <!-- <div slot="extra">
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
      </div> -->
    </a-card>

    <a-card :bordered="false" style="flex: 1">
      <a-tabs default-active-key="1" type="card">
        <a-tab-pane key="1">
          <div slot="tab">
            <span>
              Клиенты <span class="custom-badge" style="margin-left: 10px;">1</span>
            </span>
          </div>
          <a-table
            :columns="columns"
            :rowKey="record => record.id"
            :dataSource="user_List"
            :pagination="getPagination"
            :loading="loading"
            @change="handleTableChange"
            test-attr="list-customer"
            bordered
            :customRow="customRowClick"
            class="pointer"
          >
            <div
              slot="filterDropdown"
              slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
              style="padding: 8px"
            >
              <a-input
                v-ant-ref="c => (searchInput = c)"
                :placeholder="`Search ${column.dataIndex}`"
                :value="selectedKeys[0]"
                style="width: 188px; margin-bottom: 8px; display: block;"
                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
              />
              <a-button
                type="primary"
                icon="search"
                size="small"
                style="width: 90px; margin-right: 8px"
                @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
              >
                Search
              </a-button>
              <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
                Reset
              </a-button>
            </div>
            <a-icon
              slot="filterIcon"
              slot-scope="filtered"
              type="search"
              :style="{ color: filtered ? '#108ee9' : undefined }"
            />
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
              <div style="display: flex; justify-content: space-around;">
                <router-link :to="`./update/${row.id}`" style="margin-right: 10px">
                  <edit-btn :test-attr="`edit-customer${index}`"/>
                </router-link>
                <delete-btn @confirm="deleteCustomer($event, row.id)" :test-attr="`delete-customer${index}`"/>
              </div>
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
        </a-tab-pane>
        <a-tab-pane key="2">
          <div slot="tab">
            <span>
              {{ $t('customerstab2') }}<span class="custom-badge" style="margin-left: 10px;">1</span>
            </span>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3">
          <div slot="tab">
            <span>
              {{ $t('customerstab3') }}<span class="custom-badge" style="margin-left: 10px;">1</span>
            </span>
          </div>
        </a-tab-pane>
      </a-tabs>
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
      params: {
        page: { current: 1, pageSize: 10, total: null },
        search: ''
      },
      loading: true,
       columns: [
        {
          title: this.$t('firstName'),
          dataIndex: 'first_name'
        },
        {
          title: this.$t('lastName'),
          dataIndex: 'last_name'
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone_number'
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: 120,
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedCustomer: null,
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['customersData', 'customersPagination', 'searchQuery', 'user_List']),
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
    // this.getCustomers({ page: this.customersPagination })
    //   .then((res) => console.log('customers', this.customersData))
    //   .catch((err) => console.error(err))
    //   .finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions(['getCustomers', 'setSearchQuery', 'getUserList']),
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push(`/customers/update/${record.id}`)
          }
        }
      }
    },
    // getUsrList () {
    //   // eslint-disable-next-line no-unused-vars
    //   const page = {
    //     page: 10,
    //     user_type: 'client',
    //     search: ''
    //   }
    //   this.$store.dispatch('getUserListAll' page)
    // },
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
      this.params.page = { ...this.customersPagination }
      this.$router.push({
        name: this.$route.name,
        query: {
          page: 1,
          limit: 10,
          search: this.params.search
        }
      })
      console.log(this.params.page)
      this.loading = true
      this.getUserList(this.params)
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteCustomer (e, id) {
      this.loading = true
      request({
        url: `/client/${id}`,
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
  },
  created () {
    this.params.page = { ...this.customersPagination }
    if (this.$route.query.page && this.$route.query.limit) {
      this.params.page.current = parseInt(this.$route.query.page)
      this.params.page.pageSize = parseInt(this.$route.query.limit)
      this.params.search = this.$route.query.search
    }
    this.getUserList(this.params).then(res => console.log(res))
      .finally(() => (this.loading = false))
  }
}
</script>
<style lang="less" scoped>
.pointer:hover{
cursor: pointer;
}
</style>
