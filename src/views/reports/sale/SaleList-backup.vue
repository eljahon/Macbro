<template>
  <a-card>
    <a-card :bordered="false">
      <div slot="title">
        {{ $t('sale') }}
      </div>
      <div slot="extra">
        <div slot="extra" style="display: flex; justify-content: right">
          <div style="display: flex; gap: 5%; justify-content: flex-end">
            <a-range-picker
              style="width: 300px"
              :defaultValue="[moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]"
              :placeholder="['от даты ', 'до даты']"
              @change="rangePicer"
            >
              <a-icon type="calendar" style="color: blue" slot="suffixIcon"/>
            </a-range-picker>
            <a-button icon="dowlond" style="background-color: #1890FF; color: white; border:none">
              <a-icon :component="myIcons.excal"></a-icon></a-button>
          </div>
        </div>
      </div>
      <div>
      </div>
      <a-tabs type="card" @change="callback">
        <a-tab-pane key="1" tab="Офлайн">
          <a-table
            style="margin-top: 30px; cursor: pointer"
            :columns="columnsOflineTab"
            :rowKey="(_, index) => index"
            :dataSource="oflineListTabData"
            :pagination="getFullPagination"
            :loading="loading"
            :customRow="customRowClick"
            @change="handleTableChangeOfline"
            test-attr="list-customer"
            bordered
          >
            <div slot="Филиал" style="padding: 8px; width: 230px;">
              <a-select
                @change="selectBranchChange"
                :placeholder="$t('Филиал')"
                style="width: 220px"
                allowClear
              >
                <a-select-option v-for="item in branchList" :key="item.id+Math.round().toString()" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <!-- thiiiiiiiiiiiiiiiii -->
            <div slot="Покупатель" style="padding: 8px; width: 230px;">
              <a-select
                allowClear
                show-search
                label-in-value
                :filter-option="false"
                style="width: 220px"
                @change="selectCustomerChange"
                v-debounce="onModelSearch"
                :not-found-content="fetching ? undefined : null"
                :placeholder="$t('Покупатель')"
                :auto-clear-search-value="false"
              >
                <a-select-option v-for="item in datasOptions" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <div slot="merchantDropdown" style="padding: 8px; width: 230px;">
              <a-select
                allowClear
                show-search
                label-in-value
                :filter-option="false"
                style="width: 220px"
                @change="selectCustomerChange"
                v-debounce="onMerchantSearch"
                :not-found-content="fetching ? undefined : null"
                :placeholder="$t('Продавец')"
                :auto-clear-search-value="false"
              >
                <a-select-option v-for="item in userList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <div slot="status" style="padding: 8px; width: 230px;">
              <a-select
                @change="selectStarus"
                :placeholder="$t('Статус')"
                style="width: 220px"
                allowClear
              >
                <a-select-option v-for="item in statuse" :key="item.id+Math.round().toString()" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <div
              slot="ИД заказа"
              style="padding: 8px"
            >
              <a-input-number
                style="width: 200px"
                v-debounce="numberSearch"
                :placeholder="`ИД. аккаунта`"
              />
            </div>
            <a-icon
              slot="filterIcon"
              class="filter-dropdown-icon"
              :component="$myIcons.filterDownIcon"
            />
            <template slot="Статус" slot-scope="text, row">
              <a-tag v-if="row.status === 'sold'" color="blue">Продано</a-tag>
              <a-tag v-else :color="'rgba(0, 0, 0, 0.1)'"><span style="color: black">Бронировано</span></a-tag>
            </template>
            <template slot="branch_name" slot-scope="value" >
              <span style="white-space: nowrap" >{{ value }}</span>
            </template>
            <template slot="cutomer" slot-scope="row" >
              <table-user-column :image="row.customer.image" :name="`${row.customer.firstname} ${row.customer.lastname}`" :phone="row.customer.phone_number" :type="row.customer.user_type" />
            </template>
            <template slot="merchant" slot-scope="row">
              <table-user-column v-if="row.merchant.id.length" :image="row.merchant.image" :name="`${row.merchant.firstname} ${row.merchant.lastname}`" :phone="row.merchant.phone_number" :type="row.merchant.user_type" />
              <table-user-column v-else :image="row.initiator.image" :name="`${row.initiator.firstname} ${row.initiator.lastname}`" :phone="row.initiator.phone_number" :type="row.initiator.user_type" />
            </template>
            <template slot="Кол" slot-scope="text, row">
              <span>{{ SummCount(row.items) }}</span>
            </template>
            <template slot="Сумма" slot-scope="text, row">
              <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.total_amount) }}</span>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Заклад">
          <a-table
            style="margin-top: 30px"
            :columns="ipatekacolums"
            :rowKey="(_, index) => index"
            :dataSource="ipatekaList"
            :pagination="getPaginationIpateka"
            :loading="loading"
            @change="handleTableChangeIpateka"
            test-attr="list-customer"
            :customRow="customRowClickzaklad"
            bordered
          >
            <div slot="Филиал" style="padding: 8px; width: 230px;">
              <a-select
                @change="serachSelectsBranche"
                allowClear
                :placeholder="$t('Филиал')"
                style="width: 220px"
              >
                <a-select-option v-for="item in branchList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <div slot="Покупатель" style="padding: 8px; width: 230px;">
              <a-select
                allowClear
                show-search
                label-in-value
                :filter-option="false"
                :value="valuearray"
                style="width: 220px"
                @change="selectUserChange"
                v-debounce="onModelSearch"
                :not-found-content="fetching ? undefined : null"
                :placeholder="$t('Покупатель')"
                :auto-clear-search-value="false"
              >
                <a-select-option v-for="item in userList" :key="item.id+Math.round().toString()" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <div
              slot="заказа"
              style="padding: 8px"
            >
              <a-input-number
                style="width: 200px"
                v-debounce="OrderNumberSeracher"
                :placeholder="`ИД. заказа`"
              />
            </div>
            <a-icon
              slot="filterIcon"
              class="filter-dropdown-icon"
              :component="$myIcons.filterDownIcon"
            />
            <template slot="Комментария" slot-scope="text, row">
              <!--              <a-tag :color=" === 'sold' ? 'blue' : ''">{{row.status === 'sold' ? 'Продано' : 'Бронировано'}}</a-tag>-->
              <span>{{ row.comment === '' ? '' : row.comment }}</span>
            </template>
            <template slot="client" slot-scope="row">
              <table-user-column :image="row.client.profile_image" :name="`${row.client.first_name}  ${row.client.last_name}`" :phone="row.client.phone_number" :type="row.client.user_type" />
            </template>
            <template slot="Кол" slot-scope="text, row">
              <span>{{ row.items_count }}</span>
            </template>
            <template slot="Сумма" slot-scope="text, row">
              <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.total_amount )}}</span>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { debounce } from 'vue-debounce'
// import { jsontoexcel } from 'vue-table-to-excel'
import myIcons from '@/core/icons'
// import customers from '@/store/modules/customers'
import images from '../../../assets/Ellipse 9.png'
import TableUserColumn from '@/components/TableUserColumn/TableUserColumn.vue'

export default {
  components: {
    TableUserColumn
  },
  data () {
    this.fetchCustomer = debounce(this.fetchCustomer, 2000)
    return {
      images,
      fetching: false,
      userList: [],
      valuearray: [],
      datasOptions: [],
      myIcons,
      statuse: [
        {
          name: 'Продано',
          id: 'sold'
        },
        {
          name: 'Бронировано',
          id: 'booked'
        }
      ],
      ipatekaparams: {
        customer_id: '',
        merchant_id: '',
        number: '',
        warehouse_id: '',
        search: '',
        from_date: '',
        to_date: '',
        page: { current: 1, pageSize: 10, total: null }
      },
      branchList: [],
      paramsOfline: {
        number: null,
        receiver_warehouse_id: null,
        statuses: 'booked,sold',
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        page: { current: 1, pageSize: 10, total: null },
        customer_id: null,
        merchant_id: null
      },
      OflineTabTwo: [],
      params: {
        search: '',
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        page: { current: 1, pageSize: 10, total: null }
      },
      loading: true,
      userparams: {
        user_type: 'cashier,consultant',
        search: ''
      },
      columns: [
        // {
        //   title: this.$t('Иконка'),
        //   // dataIndex: 'currency'
        //   scopedSlots: { customRender: 'currency' },
        //   align: 'center',
        //   width: '200px'
        // },
        {
          title: this.$t('ИД заказа'),
          dataIndex: 'number',
          scopedSlots: {
            filterDropdown: 'заказа',
            filterIcon: 'filterIcon',
            customRender: 'number'
          },
          align: 'center'
        },
        // {
        //   title: this.$t('numbertransactions'),
        //   dataIndex: 'transaction_number',
        //   scopedSlots: {
        //     filterDropdown: 'TransactionNumber',
        //     filterIcon: 'filterIcon',
        //     customRender: 'transaction_number' },
        //   align: 'center'
        // },
        // {
        //   title: this.$t('acountnumber'),
        //   dataIndex: 'account_number',
        //   scopedSlots: {
        //     filterDropdown: 'AccountNumber',
        //     filterIcon: 'filterIcon',
        //     customRender: 'transaction_number' },
        //   align: 'center'
        // },
        {
          title: this.$t('Покупатель'),
          dataIndex: 'customer_name',
          align: 'center',
          scopedSlots: { customRender: 'customer_name',
            filterDropdown: 'Покупатель',
            filterIcon: 'filterIcon'
          }
        },
        {
          title: this.$t('Оператор'),
          align: 'center',
          scopedSlots: {
            filterDropdown: 'Aккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Оператор' }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Кол-во'),
          key: 'action',
          dataIndex: 'items_count',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Кол'
          },
          align: 'center'
        },
        {
          title: this.$t('Сумма'),
          key: 'werree',
          // dataIndex: 'total_amount',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Сумма'
          },
          align: 'center'
        }
      ],
      columnsOflineTab: [
        {
          title: this.$t('ИД заказа'),
          dataIndex: 'number',
          scopedSlots: {
            customRender: 'number',
            filterDropdown: 'ИД заказа',
            filterIcon: 'filterIcon'
          }
        },
        {
          title: this.$t('Филиал'),
          dataIndex: 'branch_name',
          scopedSlots: { customRender: 'branch_name',
            filterDropdown: 'Филиал',
            filterIcon: `filterIcon`
          }
        },
        {
          title: this.$t('Покупатель'),
          scopedSlots: {
            filterDropdown: 'Покупатель',
            filterIcon: 'filterIcon',
            customRender: 'cutomer' }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Продавец'),
          scopedSlots: {
            filterDropdown: 'merchantDropdown',
            filterIcon: 'filterIcon',
            customRender: 'merchant' }
          // dataIndex: 'account_number',
        },
        { title: this.$t('Статус'),
          // dataIndex: 'account_number',
          scopedSlots: {
            filterDropdown: 'status',
            filterIcon: 'filterIcon',
            customRender: 'Статус' }
        },
        {
          title: this.$t('Кол-во'),
          key: 'action',
          width: 100,
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Кол'
          }
        },
        {
          title: this.$t('Сумма'),
          key: 'werree',
          dataIndex: 'total_amount',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Сумма'
          }
        }
      ],
      ipatekacolums: [
          {
            title: this.$t('ИД заказа'),
            dataIndex: 'number',
            scopedSlots: {
              filterDropdown: 'заказа',
              filterIcon: 'filterIcon',
              customRender: 'number'
            }
          },
          {
            title: this.$t('Филиал'),
            dataIndex: 'branch_name',
            scopedSlots: {
              customRender: 'branch_name',
              filterDropdown: 'Филиал',
              filterIcon: 'filterIcon'
            }
          },
          {
            title: this.$t('Покупатель'),
            scopedSlots: {
              filterDropdown: 'Покупатель',
              filterIcon: 'filterIcon',
              customRender: 'client' }
            // dataIndex: 'account_number'
          },
          { title: this.$t('Комментария'),
            // dataIndex: 'account_number',
            scopedSlots: {
              filterDropdown: 'AccountNumber',
              filterIcon: 'filterIcon',
              customRender: 'Комментария' }
          },
          {
            title: this.$t('Сумма'),
            key: 'werree',
            dataIndex: 'total_amount',
            scopedSlots: {
              filterDropdown: 'аккаунта',
              filterIcon: 'filterIcon',
              customRender: 'Сумма'
            }
          }
        ]
    }
  },
  computed: {
    ...mapGetters(['saleTabListOne', 'ipatekaPagination', 'ipatekaList',
      'oflinePagination', 'oflineListTabData', 'activTab', 'saleTabListOnePagination', 'saleTabListTwo', 'saleTabListTwoPagination', 'saleTabListThee', 'saleTabListTheePagination']),
    getPagination () {
      return this.saleTabListOnePagination
    },
    getUserListTableOne () {
      return this.saleTabListOne
    },
    getFullPagination () {
      return this.oflinePagination
    },
    getPaginationIpateka () {
     return this.ipatekaPagination
    }
  },
  methods: {
    ...mapActions(['getSaleListAllTabOne', 'mortgageUserList', 'customersSearch', 'getBranchList', 'setAcriveTab', 'OflineTwoInsideTabs', 'oflineListTab', 'OflineTabList', 'IpatekaListgetAll', 'oflineListPagination']),
    callback (key) {
      console.log(key)
      this.setAcriveTab(parseInt(key))
      if (key === '1') {
        this.OflinFuntction()
      }
      if (key === '2') {
        this.IpatekaList()
      }
    },
    onModelSearch (val) {
      const data = this.datasOptions
      const user = this.userList
      console.log(val)
      if (this.activTab === 1) {
        this.customersSearch(val)
          .then(res => {
            this.datasOptions = res.clients.length ? res.clients.map((element) => {
              return {
                name: element.middle_name,
                id: element.id
              }
            }) : data
          })
      } else {
        this.userparams.search = val
        this.mortgageUserList(this.userparams)
          .then(res => {
            this.userList = res.users.length > 0 ? res.users.map((element) => {
              return {
                id: element.id,
                name: element.middle_name
              }
            }) : user
            console.log('resssssss userList', res)
          })
          .finally(() => {
          })
      }
    },
    onMerchantSearch (val) {
      
    },
    onPopupScroll (val) { console.log(val) },
    numberSearch (val) {
      this.paramsOfline.number = val
      this.OflinFuntction()
    },
    selectUserChange (val, options) {
      this.userparams.search = val
      this.valuearray = val
      if (this.activTab === 2) {
        this.MortgageTableUserList()
      }
    },
    OrderNumberSeracher (val) {
      this.ipatekaparams.number = val
      this.IpatekaList()
    },
    selectBranchChange (val, options) {
      this.valuearray = val
      this.paramsOfline.receiver_warehouse_id = val
      this.OflinFuntction()
    },
    selectCustomerChange (val) {
      this.paramsOfline.page.current = 1
      this.paramsOfline.customer_id = val?.key ?? null
      this.OflinFuntction()
    },
    selectMerchantChange (val) {
      this.paramsOfline.page.current = 1
      this.paramsOfline.merchant_id = val?.key ?? null
      this.OflinFuntction()
    },
    selectStarus (val) {
      console.log('===', val)
      this.paramsOfline.statuses = val === undefined ? 'booked,sold' : val
      this.OflinFuntction()
    },
    serachSelectsBranche (val) {
this.ipatekaparams.warehouse_id = val
      this.IpatekaList()
    },
    Search (val) {
      alert(val)
    },
    Searches (val) {
      console.log(val)
    },
    MortgageTableUserList () {
      this.loading = true
      this.mortgageUserList(this.userparams)
      .then(res => {
        this.userList = res.users.map((element) => {
          return {
            id: element.id,
            name: element.first_name + element.last_name
          }
        })
        console.log('resssssss userList', res)
      })
      .finally(() => {
        this.loading = false
      })
    },
    fetchCustomer (searchvalue) {
      this.fetching = true
      this.loading = true
      this.customersSearch(searchvalue)
      .then(res => {
        this.datasOptions = res.clients
      })
    },
    defoultCustomer () {
      this.customersSearch('')
        .then(res => {
          this.datasOptions = res.clients.map((element) => {
            return {
              name: element.middle_name,
              id: element.id
            }
          })
        })
    },
    OflinFuntction () {
      this.loading = true
      this.OflineTabList(this.paramsOfline)
        .finally(() => {
          this.loading = false
        })
    },
    IpatekaList () {
      this.loading = true
      this.IpatekaListgetAll(this.ipatekaparams)
      .finally(() => {
        this.loading = false
      })
    },
    rangePicer (val, data) {
      console.log(data)
      // eslint-disable-next-line no-unused-expressions
 //      if (this.activTab === 1) {
 //        this.loading = true
 //        this.params.from_date = data[0]
 //        this.params.to_date = data[1]
 // this.saleGetListAllOne()
 //      }
      if (this.activTab === 1) {
        this.paramsOfline.from_date = data[0]
        this.paramsOfline.to_date = data[1]
        this.OflinFuntction()
      }
      if (this.activTab === 2) {
        this.ipatekaparams.from_date = data[0]
        this.ipatekaparams.to_date = data[1]
        this.IpatekaList()
      }
    },
    SummCount (array) {
      if (array.length === 1) {
        return array[0].count
      } else {
        return array.map((element) => element.count).reduce((summ, value) => summ + value)
      }
    },
    onChangepicker (val, event) {
      console.log(val, event)
      this.params.start_date = event[0]
      this.params.end_date = event[1]
      this.TrGetListAll()
    },
    sortDublicat (array) {
      const unique = []
      array.forEach((item) => {
        if (!unique.includes(item.payment_type)) {
          unique.push(item.payment_type)
        }
      })
      return unique
    },
    moment,
    saleGetListAllOne () {
      this.OflinFuntction()
      // this.getSaleListAllTabOne(this.params)
      //   .finally(() => {
      //     this.loading = false
      //   })
    },
    customRowClick (record) {
      return {
        on: {
          click: (e) => {
            console.log('Category id', record.id)
            this.$router.push({ name: 'SaleItemListMain', params: { id: record.id }, query: { id: 1 } })
          }
        }
      }
    },
    customRowClickzaklad (record) {
      return {
        on: {
          click: (e) => {
            console.log('Category id', record.id)
            this.$router.push({ name: 'SaleItemListMain', params: { id: record.id }, query: { id: 2 } })
          }
        }
      }
    },
    onSearch (value) {
      console.log(value)
      this.params.search = value
      this.rollCallGetListAll()
    },
    handleTableChange (pagination) {
      this.params.page = { ...pagination }
      console.log(pagination)
      this.saleGetListAllOne()
    },
    handleTableChangeOfline (pagination) {
      this.paramsOfline.page = { ...pagination }
      this.OflinFuntction()
    },
    handleTableChangeIpateka (pagination) {
      this.ipatekaparams.page = { ...pagination }
      this.IpatekaList()
    },
    branchListAll () {
      this.getBranchList()
      .then(res => {
      this.branchList = res.branches.map((element) => {
          return {
            name: element.name,
            id: element.warehouse_id
          }
        })
      })
    }
  },
  mounted () {
    console.log('this.rollCollList=====>', this.rollCollList)
  },
  created () {
    this.saleGetListAllOne()
    this.branchListAll()
    this.defoultCustomer()
    this.MortgageTableUserList()
  }
}
</script>
<style scoped>
.fonSize {
  font-size: 16px;
  cursor: pointer;
}

.filter-dropdown-icon {
  font-size: 20px !important;;
  color: transparent !important;
  background-color: transparent !important;
  margin: 0 10px !important;;
  transform: translateY(-3px) !important;;
}

</style>
