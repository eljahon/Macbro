<template>
  <div>
    <breadcrumb-row :hasBack="false">
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>{{ $t('orders') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div slot="extra" style="display: flex; margin-left: 180px">
        <a-date-picker @change="onChange" placeholder="DD/MM/YYYY" />
        <a-input
          style=" width: 200px; margin-left: 10px"
          :placeholder="$t('search') + '...'"
          v-model="params.search"
          v-debounce="debouncedSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="debouncedSearch(getSearchQuery)" />
        </a-input>
      </div>
    </breadcrumb-row>

    <a-card :title="$t('orders')" class="breadcrumb-row" :bordered="false">
    </a-card>

    <a-card :bordered="false" style="flex: 1" >
      <a-tabs default-active-key="1" type="card" @change="callback">
        <a-tab-pane key="1">
          <div slot="tab">
            <span>
              Все заказы <span class="custom-badge" style="margin-left: 10px;">1</span>
            </span>
          </div>
          <a-table
            :columns="columns"
            :rowKey="record => record.id"
            :dataSource="getAllOrders"
            :pagination="getPagination"
            :loading="loading"
            @change="handleTableChange"
            showPagination="auto"
            test-attr="list-order"
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
              style="font-size: 20px; color: transparent; background-color: transparent"
              slot="filterIcon"
              class="filter-dropdown-icon"
              :component="$myIcons.filterDownIcon"
            />
            <span style="color: #1890FF" slot="tag" slot-scope="tag">
              {{ tag }}
            </span>
            <!-- <template slot="tag" slot-scope="tag">
              <a-tag color="red">{{ tag }}</a-tag>
            </template> -->
            <template slot="status" slot-scope="text, row" style="cursor: pointer">
              <status-tag
                :color="statusColor[row.status]"
                :text="statusTranslator(row.status)"
              />
            </template>
            <template slot="action" slot-scope="text, row, index">
              <!-- <router-link :to="`/order/details/${row.number}`">
                <preview-btn :test-attr="`preview-order${index}`"/>
              </router-link> -->
              <div style="display: flex; justify-content: space-around;">
                <router-link :to="`/order/edit/${row.number}`" :test-attr="`edit-order${index}`">
                  <edit-btn/>
                </router-link>
              </div>
            </template>
            <template slot="total" slot-scope="text, row">
              <div>{{ numberToPrice(calcTotalPrice(row.items)) }} </div>
            </template>
          </a-table>
        </a-tab-pane>
        <!--        <a-tab-pane key="2">-->
        <!--          <div slot="tab">-->
        <!--            <span>-->
        <!--              {{ $t('orederstab2') }} <span class="custom-badge" style="margin-left: 10px;">2</span>-->
        <!--            </span>-->
        <!--          </div>-->
        <!--        </a-tab-pane>-->
        <!--        <a-tab-pane key="3">-->
        <!--          <div slot="tab">-->
        <!--            <span>-->
        <!--              {{ $t('orederstab3') }} <span class="custom-badge" style="margin-left: 10px;">3</span>-->
        <!--            </span>-->
        <!--          </div>-->
        <!--        </a-tab-pane>-->
        <!--        <a-tab-pane key="4">-->
        <!--          <div slot="tab">-->
        <!--            <span>-->
        <!--              {{ $t('orederstab4') }}<span class="custom-badge" style="margin-left: 10px;">4</span>-->
        <!--            </span>-->
        <!--          </div>-->
        <!--        </a-tab-pane>-->
        <!--        <a-tab-pane key="5" >-->
        <!--          <div slot="tab">-->
        <!--            <span>-->
        <!--              {{ $t('orederstab5') }} <span class="custom-badge" style="margin-left: 10px;">5</span>-->
        <!--            </span>-->
        <!--          </div>-->
        <!--        </a-tab-pane>-->
      </a-tabs>

      <!-- <a-pagination show-quick-jumper :default-current="getPagination.current" :total="getPagination.total" @change="handleTableChange" /> -->
    </a-card>
    <a-modal
      @cancel="handleCloseModal"
      v-if="selectedOrder"
      v-model="previewVisible"
      width="800px"
      :title="$t('previewBranch')"
    >
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel">
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
// import debounce from 'vue-debounce'
export default {
  data () {
    return {
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      value: '',
      excelFile: null,
      data: [],
      loading: true,
      columns: [
        {
          title: this.$t('order_number'),
          key: 'tag',
          width: '10%',
          dataIndex: 'number',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            customRender: 'tag',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) =>
            record.number
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: this.$t('customer_name'),
          dataIndex: 'customer_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) =>
            record.customer_name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
              onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }

        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) =>
            record.phone
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: this.$t('date'),
          dataIndex: 'created_at',
          width: '20%',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) =>
            record.customer_name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: this.$t('total'),
          key: 'total',
          width: '20%',
          scopedSlots: {
            customRender: 'total',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          }
        },
        {
          title: this.$t('status'),
          key: 'status',
          scopedSlots: {
            customRender: 'status',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          }
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: '10%',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedOrder: null,
      filterParams: {},
      orderStatus: {
          'in-process': 'В обработке',
          'finished': 'Завершено',
          'cancelled': 'Отменен',
          'payment': 'Оплачено',
          'order_accepted': 'Заказ принят'
      },
      statusColor: {
          'in-process': 'blue',
          'finished': 'green',
          'cancelled': 'red',
          'payment': 'orange',
          'order_accepted': 'purple'
      },
      params: {
        page: {
          current: 1,
          pageSize: 10,
          total: null
        },
        search: ''
      }
    }
  },
  computed: {
    ...mapGetters(['ordersData', 'ordersPagination', 'searchQuery']),
    getPagination () {
      return this.ordersPagination
    },
    getAllOrders () {
      return this.ordersData
    },
    getSearchQuery () {
      return this.searchQuery
    }
  },
  mounted () {
    // this.exportExcel()
    this.params.page = { ...this.ordersPagination }
    this.setSearchQuery('')
    this.params.page = { ...this.ordersPagination }
    // console.log('this.ordersPagination', this.ordersPagination)
    this.getOrders(this.params)
      .then((res) => res
        // console.log('res', res)
      )
      .catch((err) => console.error(err))
      .finally(() => (this.loading = false))
  },
  beforeDestroy () {
    this.setSearchQuery('')
  },
  methods: {
    ...mapActions(['getOrders', 'setSearchQuery']),
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push({ name: 'OrderEdit', params: { id: record.number }, query: { tab: '1' } })
          }
        }
      }
    },
    callback (value) {
      console.log(value)
    },
    debouncedSearchDate (searchQuery) {
      this.setSearchQuery(searchQuery)
      this.loading = true
      this.getOrders(this.params)
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    onChange (date, dateString) {
      console.log(dateString)
      this.debouncedSearch(dateString)
    },
    handleTableChange (pagination) {
      // console.log('Pagination', pagination)
      this.params.page = pagination
      this.loading = true
      this.getOrders(this.params)
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
    exportExcel () {
      request({
        url: '/order-report-excel',
        method: 'GET'
      }).then(res => {
        this.excelFile = res.filename
        console.log(res)
      })
      .catch(err => {
        this.$message.error('Системная ошибка' + ' ' + err.message)
      })
    },
    // showPreviewModal (orderNumber) {
    //   this.previewVisible = true
    //   this.getSelectedOrder(orderNumber)
    // },
    getSelectedOrder (selectedOrderNumber) {
      request({
        url: `/order/${selectedOrderNumber}`,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.selectedOrder = response
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleCloseModal () {
      this.selectedOrder = null
    },
    debouncedSearch (searchQuery) {
      // this.setSearchQuery(searchQuery)
      this.loading = true
      this.params.page = { ...this.ordersPagination }
      this.getOrders(this.params)
        .then((res) => console.log(res))
        .catch(err => this.requestFailed(err))
        .finally(() => (this.loading = false))
      console.log('debounce')
    },
    deleteOrder (e, slug) {
      this.loading = true
      request({
        url: `/order/${slug}`,
        method: 'delete'
      })
      .then(res => {
        this.$message.success(this.$t('successfullyDeleted'))
        this.getOrders(this.params)
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
          this.getOrders(this.params)
            .then(res => console.log('res', res))
            .catch(err => console.error('err', err))
            .finally(() => (this.loading = false))
        }
      })
    },
    statusTranslator (status) {
      return this.orderStatus[status]
    },
    handleSearch (selectedKeys, confirm, dataIndex) {
      confirm()
      this.searchText = selectedKeys[0]
      this.searchedColumn = dataIndex
    },
    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
    }
  }
}
</script>
<style>
img.order-preview-image {
    display: block !important;
    margin: 0 auto !important;
    max-width: 600px !important;
    width: auto !important;
    height: auto !important;
}
.pointer:hover {
cursor: pointer;
}
</style>
