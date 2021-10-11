<template>
  <a-card>
    <a-card :bordered="false">
      <div slot="title">
        {{ $t('sale') }}
      </div>
      <div slot="extra">
        <div slot="extra" style="display: flex; gap: 5%">
          <!--          <a-input v-model="paramsOfline.search" v-debounce="Search">-->
          <!--            <a-icon @click="Searches" style="color: blue" slot="addonAfter" type="search" />-->
          <!--          </a-input>-->
          <a-range-picker
            :defaultValue="[moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]"
            :placeholder="['от даты ', 'до даты']"
            @change="rangePicer"
          >
            <a-icon type="calendar" style="color: blue" slot="suffixIcon"/>
          </a-range-picker>
          <!--          <img src="../../../assets/Vector.svg" alt="excel">-->
          <a-button icon="dowlond" style="background-color: #1890FF; color: white; border:none">
            <a-icon :component="myIcons.excal"></a-icon></a-button>
        </div>

      </div>
      <div>
      </div>
      <a-tabs type="card" @change="callback">
        <!--        <a-tab-pane key="1" tab="Онлайн">-->
        <!--          <a-table-->
        <!--            style="margin-top: 30px; cursor: pointer"-->
        <!--            :columns="columns"-->
        <!--            :rowKey="() => Math.random()"-->
        <!--            :dataSource="getUserListTableOne"-->
        <!--            :pagination="getPagination"-->
        <!--            :loading="loading"-->
        <!--            @change="handleTableChange"-->
        <!--            :customRow="customRowClick"-->
        <!--            test-attr="list-customer"-->
        <!--            bordered-->
        <!--          >-->
        <!--            <div slot="Aккаунта" style="padding: 8px; width: 230px;">-->
        <!--              <a-select-->
        <!--                :placeholder="$t('Тип аккаунта')"-->
        <!--                style="width: 220px"-->
        <!--                allowClear></a-select>-->
        <!--&lt;!&ndash;              >&ndash;&gt;-->
        <!--&lt;!&ndash;                <a-select-option v-for="(catigoriya, index) in AccountGrups" :key="index" :value="catigoriya.id">&ndash;&gt;-->
        <!--&lt;!&ndash;                  {{ catigoriya.name }}&ndash;&gt;-->
        <!--&lt;!&ndash;                </a-select-option>&ndash;&gt;-->
        <!--&lt;!&ndash;              </a-select>&ndash;&gt;-->
        <!--            </div>-->
        <!--            <div-->
        <!--              slot="аккаунта"-->
        <!--              style="padding: 8px"-->
        <!--            >-->
        <!--              <a-input-number-->
        <!--                :placeholder="`ИД. аккаунта`"-->
        <!--                style="width: 188px; margin-bottom: 8px; display: block;"-->
        <!--              />-->
        <!--            </div>-->
        <!--            <a-icon-->
        <!--              style="font-size: 20px; color: transparent; background-color: transparent"-->
        <!--              slot="filterIcon"-->
        <!--              class="filter-dropdown-icon"-->
        <!--              :component="$myIcons.filterDownIcon"-->
        <!--            />-->
        <!--            <template slot="client" slot-scope="text, row">-->
        <!--              <span>{{ row.client.first_name }} {{ row.client.last_name }}</span>-->
        <!--            </template>-->
        <!--            <template slot="cashier" slot-scope="text, row">-->
        <!--              <span>{{ row.cashier.first_name }} {{ row.cashier.last_name }}</span>-->
        <!--            </template>-->
        <!--            <template slot="Оператор" slot-scope="text, row">-->
        <!--              <span>{{ row.operator_name ? row.operator_name : " " }}</span>-->
        <!--            </template>-->
        <!--            <template slot="Кол" slot-scope="text, row">-->
        <!--              <span v-if="row.items.length ===1">-->
        <!--                <span v-for="(item, index)  in row.items" :key="index">-->
        <!--                <span>{{item.quantity}}</span>-->
        <!--              </span>-->
        <!--              </span>-->
        <!--              <span v-else>{{row.items.map((element) => element.quantity).reduce((summ, val) => summ + val)}}</span>-->
        <!--            </template>-->
        <!--            <template slot="Сумма" slot-scope="text, row">-->
        <!--              <span v-if="row.items.length === 1">-->
        <!--                <span v-for="(item, index ) in row.items " :key="index">-->
        <!--                <span>{{'$  '}}{{ item.price }}</span>-->
        <!--              </span>-->
        <!--              </span>-->
        <!--              <span v-else>-->
        <!--               {{'$'}} {{ reducer(row.items) }}-->
        <!--              </span>-->
        <!--            </template>-->
        <!--          </a-table>-->
        <!--        </a-tab-pane>-->
        <a-tab-pane key="1" tab="Офлайн">
          <a-table
            style="margin-top: 30px; cursor: pointer"
            :columns="columnsOflineTab"
            :rowKey="() => Math.random()"
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
                v-debounce='numberSearch'
                :placeholder="`ИД. аккаунта`"
              />
            </div>
            <a-icon
              style="font-size: 20px; color: transparent; background-color: transparent"
              slot="filterIcon"
              class="filter-dropdown-icon"
              :component="$myIcons.filterDownIcon"
            />
            <template slot="Статус" slot-scope="text, row">
              <a-tag :color="row.status === 'sold' ? 'blue' : ''">{{ row.status === 'sold' ? 'Продано' : 'Бронировано' }}</a-tag>

              <!--                    <span>{{ row.merchant.firstname === '' ? '' : row.merchant.firstname}} {{ row.merchant.last_name === '' ? '' : row.merchant.last_name }}</span>-->
            </template>
            <template slot="cutomer" slot-scope="text, row">
              <span>{{ row.customer.firstname === '' ? '' : row.customer.firstname }}{{ row.customer.lastname === '' ? '' :row.customer.lastname }}</span>
            </template>
            <template slot="Кол" slot-scope="text, row">
              <span>{{ SummCount(row.items) }}</span>
            </template>
            <template slot="Сумма" slot-scope="text, row">
              <!--              <span>{{'$'}}{{ numberToPrices(row.total_amount) }}</span>-->
              <span>{{ new Intl.NumberFormat('en-En', { style: 'currency', currency: 'USD' }).format(row.total_amount) }}</span>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Заклад">
          <a-table
            style="margin-top: 30px"
            :columns="ipatekacolums"
            :rowKey="() => Math.random()"
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
                :placeholder="$t('Филиал')"
                style="width: 220px"
                allowClear
              >
              </a-select>
            </div>
            <div
              slot="заказа"
              style="padding: 8px"
            >
              <a-input-number
                :placeholder="`ИД. аккаунта`"
              />
            </div>
            <a-icon
              style="font-size: 20px; color: transparent; background-color: transparent"
              slot="filterIcon"
              class="filter-dropdown-icon"
              :component="$myIcons.filterDownIcon"
            />
            <a-icon
              slot="order"
              :component="$myIcons.filter"
              style="font-size: 20px; color: transparent; background-color: transparent"

            />
            <template slot="Комментария" slot-scope="text, row">
              <!--              <a-tag :color=" === 'sold' ? 'blue' : ''">{{row.status === 'sold' ? 'Продано' : 'Бронировано'}}</a-tag>-->
              <span>{{ row.comment === '' ? '' : row.comment }}</span>
            </template>
            <template slot="client" slot-scope="text, row">
              <span>{{ row.client.first_name === '' ? '' : row.client.first_name }} {{ ' ' }} {{ row.client.last_name === '' ? '' :row.client.last_name }}</span>
            </template>
            <template slot="Кол" slot-scope="text, row">
              <span>{{ row.items_count }}</span>
            </template>
            <template slot="Сумма" slot-scope="text, row">
              <span>{{ row.total_amount }}</span>
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
import myIcons from '@/core/icons'
export default {
  data () {
    return {
      myIcons,
      statuse: [
        {
          name: 'Продано',
          id: 'booked,solid'
        },
        {
          name: 'Бронировано',
          id: 'solid'
        }
      ],
      ipatekaparams: {
        search: '',
        from_date: '',
        to_date: '',
        page: { current: 1, pageSize: 10, total: null }
      },
      branchList: [],
      paramsOfline: {
        number: '',
        sender_warehouse_id: '',
        statuses: 'booked,solid',
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        page: { current: 1, pageSize: 10, total: null }
      },
      OflineTabTwo: [],
      params: {
        search: '',
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        page: { current: 1, pageSize: 10, total: null }
      },
      loading: true,
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
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'заказа'
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
          scopedSlots: { customRender: 'Покупатель' }
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
            filterDropdown: 'Aккаунта',
            filterIcon: 'filterIcon',
            customRender: 'cutomer' }
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
              filterDropdown: 'аккаунта',
              filterIcon: 'filterIcon',
              customRender: 'заказа'
            },
            align: 'center'
          },
          {
            title: this.$t('Филиал'),
            dataIndex: 'branch_name',
            align: 'center'
            // scopedSlots: { customRender: 'Покупатель' }
          },
          {
            title: this.$t('Покупатель'),
            align: 'center',
            scopedSlots: {
              filterDropdown: 'Aккаунта',
              filterIcon: 'filterIcon',
              customRender: 'client' }
            // dataIndex: 'account_number',
          },
          { title: this.$t('Комментария'),
            // dataIndex: 'account_number',
            scopedSlots: {
              filterDropdown: 'AccountNumber',
              filterIcon: 'filterIcon',
              customRender: 'Комментария' },
            align: 'center'
          },
          // {
          //   title: this.$t('Кол-во'),
          //   key: 'action',
          //   scopedSlots: {
          //     filterDropdown: 'аккаунта',
          //     filterIcon: 'filterIcon',
          //     customRender: 'Кол'
          //   },
          //   align: 'center'
          // },
          {
            title: this.$t('Сумма'),
            key: 'werree',
            dataIndex: 'total_amount',
            scopedSlots: {
              filterDropdown: 'аккаунта',
              filterIcon: 'filterIcon',
              customRender: 'Сумма'
            },
            align: 'center'
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
    ...mapActions(['getSaleListAllTabOne', 'getBranchList', 'setAcriveTab', 'OflineTwoInsideTabs', 'oflineListTab', 'OflineTabList', 'IpatekaListgetAll', 'oflineListPagination']),
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
    numberSearch (val) {
      console.log('===', val)
      this.paramsOfline.number = val
      this.OflinFuntction()
    },
    selectBranchChange (val) {
      console.log('===', val)
      this.paramsOfline.sender_warehouse_id = val
      this.OflinFuntction()
    },
    selectStarus (val) {
      console.log('===', val)
      this.paramsOfline.statuses = val
      this.OflinFuntction()
    },
    Search (val) {
      alert(val)
    },
    Searches (val) {
      console.log(val)
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
    reducer (array) {
      console.log('================================', array)
      const summ = array.map((element) => element.price).reduce((summ, val) => summ + val)
    return summ
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
    AccountGlobalSeach (val) {
      this.params.search = val
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
  }
}
</script>
<style scoped>
.fonSize {
  font-size: 16px;
  cursor: pointer;
}
</style>
