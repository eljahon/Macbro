<template>
  <a-card>
    <a-card :bordered="false">
      <div slot="title">
        {{ $t('transfer') }}
      </div>
      <div slot="extra">
        <div slot="extra" style="display: flex; gap: 5%">
          <a-input size="small" @search="onSearch" :placeholder="'Search'" v-debounce="AccountGlobalSeach">
            <a-icon style="color: blue" slot="addonAfter" type="search" />

          </a-input>
          <a-range-picker
            size="small"
            @change="rangePickerDate"
          ><a-icon type="calendar" style="color: blue" slot="suffixIcon"/></a-range-picker>
<!--          <a-select-->
<!--            size="large"-->
<!--            label-in-value-->
<!--            :default-value="{ key: 'lucy' }"-->
<!--            style="width: 180px"-->
<!--          >-->
<!--            <a-select-option value="jack">-->
<!--              Jack (100)-->
<!--            </a-select-option>-->
<!--            <a-select-option value="lucy">-->
<!--              Lucy (101)-->
<!--            </a-select-option>-->
<!--          </a-select>-->
          <a-button style="padding: 2px" type="primary" icon="file-excel" size="small" />

        </div>

      </div>
      <a-tabs type="card" @change="callback">
<!--        <a-tab-pane key="1" tab="Tab 1">-->
        <a-tab-pane key="1" tab="В процессе">
          <a-table
            style="margin-top: 30px"
            :columns="columns"
            :rowKey="() => Math.random()"
            :dataSource="getUserListTable"
            :pagination="getPagination"
            :loading="loading"
            @change="handleTableChangeTabOne"
            test-attr="list-customer"
            bordered
          >
            <div slot="Aккаунта" style="padding: 8px; width: 230px;">
              <a-select
                :placeholder="$t('Тип аккаунта')"
                style="width: 220px"
                @change="AccountTypeSearch"
                allowClear
              >
                <a-select-option v-for="(catigoriya, index) in AccountGrups" :key="index" :value="catigoriya.id">
                  {{ catigoriya.name }}
                </a-select-option>
              </a-select>
            </div>
            <div
              slot="аккаунта"
              style="padding: 8px"
            >
              <a-input-number
                :placeholder="`ИД. аккаунта`"
                v-debounce="AccountSearch"
                style="width: 188px; margin-bottom: 8px; display: block;"
              />
            </div>
            <a-icon
              style="font-size: 20px; color: transparent; background-color: transparent"
              slot="filterIcon"
              class="filter-dropdown-icon"
              :component="$myIcons.filterDownIcon"
            />
            <template slot="Время" slot-scope="text, row">
              <span>{{moment(row.create_at).format('hh:mm DD-MM-YYYY')}}</span>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Законченные">
          <a-table
            style="margin-top: 30px"
            :columns="columnsTwo"
            :rowKey="() => Math.random()"
            :dataSource="getTabTwoList"
            :pagination="getPaginationTwo"
            :loading="loading"
            @change="handleTableChangeTabTwo"
            test-attr="list-customer"
            bordered
          >
            <div slot="Aккаунта" style="padding: 8px; width: 230px;">
              <a-select
                :placeholder="$t('Тип аккаунта')"
                style="width: 220px"
                @change="AccountTypeSearch"
                allowClear
              >
                <a-select-option v-for="(catigoriya, index) in AccountGrups" :key="index" :value="catigoriya.id">
                  {{ catigoriya.name }}
                </a-select-option>
              </a-select>
            </div>
            <div
              slot="аккаунта"
              style="padding: 8px"
            >
              <a-input-number
                :placeholder="`ИД. аккаунта`"
                v-debounce="AccountSearch"
                style="width: 188px; margin-bottom: 8px; display: block;"
              />
            </div>
            <a-icon
              style="font-size: 20px; color: transparent; background-color: transparent"
              slot="filterIcon"
              class="filter-dropdown-icon"
              :component="$myIcons.filterDownIcon"
            />
            <template slot="Время" slot-scope="text, row">
              <span>{{moment(row.create_at).format('hh:mm DD-MM-YYYY')}}</span>
            </template>
            <template slot="прихода" slot-scope="text, row">
              <span>{{moment(row.updated_at).format('hh:mm DD-MM-YYYY')}}</span>
            </template>
            <template slot="Статус" slot-scope="text, row">
              <a-tag :color="row.status ==='rejected' ? 'red' : 'green' "><span>{{row.status === 'rejected' ? 'Отказано' : 'Принято'}}</span></a-tag>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Не полные">
          <a-table
            style="margin-top: 30px"
            :columns="columnsThee"
            :rowKey="() => Math.random()"
            :dataSource="getUserListTableThee"
            :pagination="getPaginationThee"
            :loading="loading"
            @change="handleTableChangeTabThee"
            test-attr="list-customer"
            bordered
          >
            <div slot="Aккаунта" style="padding: 8px; width: 230px;">
              <a-select
                :placeholder="$t('Тип аккаунта')"
                style="width: 220px"
                @change="AccountTypeSearch"
                allowClear
              >
                <a-select-option>
                </a-select-option>
              </a-select>
            </div>
            <div
              slot="аккаунта"
              style="padding: 8px"
            >
              <a-input-number
                :placeholder="`ИД. аккаунта`"
                v-debounce="AccountSearch"
                style="width: 188px; margin-bottom: 8px; display: block;"
              />
            </div>
            <a-icon
              style="font-size: 20px; color: transparent; background-color: transparent"
              slot="filterIcon"
              class="filter-dropdown-icon"
              :component="$myIcons.filterDownIcon"
            />
            <template slot="Время" slot-scope="text, row">
              <span>{{moment(row.create_at).format('hh:mm DD-MM-YYYY')}}</span>
            </template>
            <template slot="прихода" slot-scope="text, row">
              <span>{{moment(row.updated_at).format('hh:mm DD-MM-YYYY')}}</span>
            </template>
            <template slot="Статус" slot-scope="text, row">
              <a-tag><span>{{Count(row.items).c}}/{{Count(row.items).s}}</span></a-tag>
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
import cash from '../../../assets/cash.svg'
import Payment from '../../../assets/payment.svg'
import Vise from '../../../assets/Frame 56143-5.svg'
import Click from '../../../assets/clck.svg'
import TabTwoList from '../transfer/transferTwoTabsList'
export default {
  components: {
    TabTwoList
  },
  data () {
    return {
      AccountGrups: [
        { id: '1', name: 'Касса' },
        { id: '2', name: 'Контрагент' },
        { id: '3', name: 'Клиент' },
        { id: '4', name: 'Сотрудники' },
        { id: '5', name: 'Компания' }
      ],
      Imgs: {
        cash: cash,
        payment: Payment,
        Vise: Vise,
        click: Click
      },
      params: {
        search: '',
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        statuses: 'in-process',
        // from_date: moment().startOf('month').format('YYYY-MM-DD'),
        // to_date: moment().endOf('month').format('YYYY-MM-DD'),
        page: { current: 1, pageSize: 10, total: null }
      },
      paramsthee: {
        statuses: 'incomplete',
        from_date: moment().startOf('month').format('YYYY-MM-DD'),
        to_date: moment().endOf('month').format('YYYY-MM-DD'),
        page: { current: 1, pageSize: 10, total: null }
      },
      loading: true,
      columns: [
        {
          title: this.$t('ID партии'),
          dataIndex: 'number',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'партии'
          },
          align: 'center'
        },
        {
          title: this.$t('Отправитель'),
          dataIndex: 'accepting_warehouse.name',
          align: 'center',
          scopedSlots: { customRender: 'Отправитель' }
        },
        {
          title: this.$t('Получатель'),
          align: 'center',
          dataIndex: 'branch_name',
          scopedSlots: {
            filterDropdown: 'Aккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Получатель' }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Время отправки'),
          key: 'action',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Время'
          },
          align: 'center'
        }
        // {
        //   title: this.$t('Опоздал(а) на х минут'),
        //   key: 'werree',
        //   scopedSlots: {
        //     filterDropdown: 'аккаунта',
        //     filterIcon: 'filterIcon',
        //     customRender: 'Опоздал'
        //   },
        //   align: 'center'
        // }
      ],
      columnsTwo: [
        {
          title: this.$t('ID партии'),
          dataIndex: 'number',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'партии'
          },
          align: 'center'
        },
        {
          title: this.$t('Отправитель'),
          dataIndex: 'accepting_warehouse.name',
          align: 'center',
          scopedSlots: { customRender: 'Отправитель' }
        },
        {
          title: this.$t('Получатель'),
          align: 'center',
          dataIndex: 'branch_name',
          scopedSlots: {
            filterDropdown: 'Aккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Получатель' }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Время отправки'),
          key: 'action',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Время'
          },
          align: 'center'
        },
        {
          title: this.$t('Время прихода'),
          key: 'werree',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'прихода'
          },
          align: 'center'
        },
        {
          title: this.$t('Статус'),
          key: 'fsfdsf',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Статус'
          },
          align: 'center'
        }
      ],
      columnsThee: [
        {
          title: this.$t('ID партии'),
          dataIndex: 'number',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'партии'
          },
          align: 'center'
        },
        {
          title: this.$t('Отправитель'),
          dataIndex: 'accepting_warehouse.name',
          align: 'center',
          scopedSlots: { customRender: 'Отправитель' }
        },
        {
          title: this.$t('Получатель'),
          align: 'center',
          dataIndex: 'branch_name',
          scopedSlots: {
            filterDropdown: 'Aккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Получатель' }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Время отправки'),
          key: 'action',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Время'
          },
          align: 'center'
        },
        {
          title: this.$t('Время прихода'),
          key: 'werree',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'прихода'
          },
          align: 'center'
        },
        {
          title: this.$t('Статус'),
          key: 'fsfdsf',
          scopedSlots: {
            filterDropdown: 'аккаунта',
            filterIcon: 'filterIcon',
            customRender: 'Статус'
          },
          align: 'center'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['tronferPagination', 'activTab', 'tronferPaginationTabLisThee', 'trnseferListTabLisThee', 'trnseferList', 'trnseferListTabLisTwo', 'tronferPaginationTabLisTwo']),
    getPagination () {
      return this.tronferPagination
    },
    getUserListTable () {
      return this.trnseferList
    },
    getTabTwoList () {
      return this.trnseferListTabLisTwo
    },
    getPaginationTwo () {
      return this.tronferPaginationTabLisTwo
    },
    getUserListTableThee () {
      return this.trnseferListTabLisThee
},
    getPaginationThee () {
      return this.tronferPaginationTabLisThee
    }

  },
  methods: {
    ...mapActions(['TransferGetAll', 'setAtiveTab', 'TransferGetAllTwoTab', 'TransferGetAllTheeTab']),
    callback (key) {
      this.setAtiveTab(parseInt(key))
      console.log(key)
      if (key === '2') {
        this.loading = true
        this.params.statuses = 'rejected,accepted'
        this.TransferGetAllTwoTab(this.params)
        .finally(() => {
          this.loading = false
        })
      }
      if (key === '3') {
        this.loading = true
        this.TransferGetAllTheeTab(this.paramsthee)
          .finally(() => {
            this.loading = false
          })
      }
    },
    checkField (obj, name, field) {
      return obj?.[name] ? obj[name][field] : 0
    },
    rangePickerDate (val, data) {
      this.params.from_date = data[0]
      this.params.to_date = data[1]
      if (this.activTab === 1) {
this.TransferGetListAll(this.params)
      }
      if (this.activTab === 2) {
        this.loading = true
        this.params.statuses = 'rejected'
        this.TransferGetAllTwoTab(this.params)
          .finally(() => {
            this.loading = false
          })
      }
      if (this.activTab === 3) {
        this.loading = true
        this.paramsthee.statuses = 'incomplete'
        this.paramsthee.from_date = data[0]
        this.paramsthee.to_date = data[1]
        this.TransferGetAllTheeTab(this.paramsthee)
          .finally(() => {
            this.loading = false
          })
      }
    },
    AccountTypeSearch (val) {
      this.params.account_group_id = val
      this.rollCallGetListAll()
    },
    AccountSearch (val) {
      this.params.account_number = val
      this.rollCallGetListAll()
    },
    AcountCreate () {
      this.$router.push({ name: 'AcountCreate' })
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
    TransferGetListAll () {
      this.loading = true
      this.TransferGetAll(this.params)
        .finally(() => {
          this.loading = false
        })
    },
    customRowClick (val, even, data) {
      // console.log(val, even, data)
    },
    Count (array) {
      let count = 0
      const newarray = array.map((element) => element.count).reduce((summ, val) => summ + val)
      for (let i = 0; i < array.length; i++) {
        if (array[i].status === 'accepted') {
          count++
        }
      }
      return {
        c: count,
        s: newarray
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
    handleTableChangeTabOne (pagination) {
      this.params.page = { ...pagination }
      console.log(pagination)
      this.TransferGetListAll()
    },
    handleTableChangeTabThee (pagination) {
      this.loading = true
      this.params.page = { ...pagination }
      this.params.statuses = 'incomplete'
      this.TransferGetAllTheeTab(this.params)
        .finally(() => {
          this.loading = false
        })
    },
    handleTableChangeTabTwo (pagination) {
      this.params.page = { ...pagination }
      console.log(pagination)
      this.loading = true
      this.params.statuses = 'rejected,accepted'
      this.TransferGetAllTwoTab(this.params)
      .finally(() => {
        this.loading = false
      })
    }
  },
  mounted () {
  },
  created () {
    this.TransferGetListAll()
  }
}
</script>

<style scoped>
.fonSize {
  font-size: 16px;
  cursor: pointer;
}
</style>
