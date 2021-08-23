<template>
  <a-card>
    <div slot="title">
      <a-page-header style="width: 60%">
        <div slot="title">
          <a-button type="link" icon="arrow-left" style="color: black" @click="() => $router.go(-1)"></a-button>
          <span class="fonSize" @click="() => $router.push({ name: 'transactionsListMain'})">{{ $t('report') }} / </span>
          <router-link :to="{name: 'subacountListMainList'}" style="color: black" class="fonSize">{{ $t('subacounts') }}</router-link>
        </div>
      </a-page-header>
    </div>
    <div slot="extra"> <a-input-search :placeholder="'Search'" enter-button @search="onSearch" v-debounce="SubAcountGlobslSearch"></a-input-search></div>
    <div>
      <a-card :bordered="false">
        <div slot="title">
          {{ $t('subacounts') }}
        </div>
        <div slot="extra">
          <a-button @click="SubAcountCreate" type="primary" icon="plus">{{ $t('add') }}</a-button>
        </div>
        <div>
        </div>
        <a-table
          style="margin-top: 30px; cursor: pointer"
          :columns="columns"
          :rowKey="record => record.id"
          :dataSource="getUserListTable"
          :pagination="getPagination"
          :loading="loading"
          @change="handleTableChange"
          test-attr="list-customer"
          bordered
          :customRow="customRowClick"
          class="pointer"
        >
          <div slot="Суб_Категория" style="padding: 8px; width: 230px;">
            <a-select
              :placeholder="$t('Суб-Категория')"
              style="width: 220px"
              @change="handleChangeSelect"
              allowClear
            >
              <a-select-option v-for="(catigoriya, index) in sub_account_category" :key="index" :value="catigoriya.id">
                {{ catigoriya.name }}
              </a-select-option>

            </a-select>
          </div>
          <div slot="Категория" style="padding: 8px; width: 230px;">
            <a-select
              :placeholder="$t('Категория')"
              style="width: 220px"
              @change="handleChangeSelectcatigory"
              allowClear
            >
              <a-select-option v-for="(catigoriya, index) in category" :key="index" :value="catigoriya.id">
                {{ catigoriya.name }}
              </a-select-option>

            </a-select>
          </div>
          <div slot="Dropdowns" style="padding: 8px; width: 230px;">
            <a-input-number
              v-debounce="NumberAcountSearch"
              :placeholder="$t('numbertransactions')"
              style="width: 220px; margin-bottom: 0px; display: block;"
            />
          </div>
          <div
            slot="Dropdown"
            style="padding: 8px"
          >
            <a-input
              :placeholder="`Search`"
              style="width: 188px; margin-bottom: 8px; display: block;"
            />
          </div>
          <a-icon
            style="font-size: 20px; color: transparent; background-color: transparent"
            slot="filterIcon"
            class="filter-dropdown-icon"
            :component="$myIcons.filterDownIcon"
          />
          <template slot="account_number" slot-scope="text, row">
            <span>{{ row.account_number }}</span>
          </template>
          <template slot="type" slot-scope="text, row">
            <a-tag v-if="row.type === 'auto'" color="blue"><span>Авто</span></a-tag>
          </template>
          <template slot="nameКатегория" slot-scope="text, row">
            <a-tag v-if="row.category.name === 'purchase'"><span>Покупка</span></a-tag>
            <a-tag v-if="row.category.name === 'sale'" color="blue"><span> Продажа</span></a-tag>
            <a-tag v-if="row.category.name === 'expenditure'" color="red"><span>Расходы</span></a-tag>
            <!--            <span>{{ row.billing_info.type }}</span>-->
          </template>
          <template slot="sub_account_category" slot-scope="text, row">
            <a-tag v-if="row.sub_account_category.name === 'purchase'"><span>Покупка</span></a-tag>
            <a-tag v-if="row.sub_account_category.name === 'sale'" color="blue"><span>Продажа</span></a-tag>
            <a-tag v-if="row.sub_account_category.name === 'other'" color="red"><span>Другие</span></a-tag>
            <a-tag v-if="row.sub_account_category.name === 'mortgage'" color="green"><span>Ипотека</span></a-tag>
            <a-tag v-if="row.sub_account_category.name === 'obed'" color="#D4B483"><span>Подчиняться</span></a-tag>
            <a-tag v-if="row.sub_account_category.name === 'cleaning'" color="#87C38F"><span>Уборка</span></a-tag>
            <a-tag v-if="row.sub_account_category.name === 'products'" color="#F4F0BB"><span>Продукты</span></a-tag>
            <a-tag v-if="row.sub_account_category.name === 'advertisement'" color="#48A9A6"><span>Рекламное объявление</span></a-tag>
            <a-tag v-if="row.sub_account_category.name === 'taxi'" color="#ffb703"><span>Такси</span></a-tag>
            <a-tag v-if="row.sub_account_category.name === 'salary'" color="#ffcdb2"><span>Зарплата</span></a-tag>
            <a-tag v-if="row.sub_account_category.name === 'rent'" color="#a8dadc"><span>Арендовать</span></a-tag>
            <!--            <span>{{ row.billing_info.type }}</span>-->
          </template>
        </a-table>
      </a-card>
    </div>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import cash from '../../../assets/cash.svg'
import Payment from '../../../assets/payment.svg'
import Vise from '../../../assets/Frame 56143-5.svg'
import Click from '../../../assets/clck.svg'
export default {
  data () {
    return {
      Imgs: {
        cash: cash,
        payment: Payment,
        Vise: Vise,
        click: Click
      },
      sub_account_category: [
        { id: 'a7116be6-9a57-4f51-888e-0820f5c8f3f6', name: 'Продажа' },
        { id: 'c12f9ee7-0388-46fa-8c9b-b23a71cb9f9e', name: 'Покупка' },
        { id: '236c315f-e3f7-4b69-b28d-c2cdaafcba21', name: 'Другие' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a43', name: 'Подчиняться' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a44', name: 'Уборка' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a49', name: 'Продукты' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a50', name: 'Рекламное объявление' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a45', name: 'Такси' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a51', name: 'Зарплата' },
        { id: '6303addd-d9cb-4ea6-957f-63f7858e4a46', name: 'Арендовать' }
      ],
      category: [
        { id: '1', name: 'Продажа' },
        { id: '2', name: 'Покупка' },
        { id: '3', name: 'Расходы' }
      ],
      params: {
        search: '',
        page: { current: 1, pageSize: 10, total: null },
        account_number: null,
        category_id: '',
        sub_account_category_id: ''
      },
      loading: true,
      columns: [
        {
          title: this.$t('Номер аккаунта'),
          // dataIndex: 'first_name',
          scopedSlots: {
            filterDropdown: 'Dropdowns',
            filterIcon: 'filterIcon',
            customRender: 'account_number'
          },
          align: 'center'
        },
        {
          title: this.$t('Название'),
          dataIndex: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('Категория'),
          align: 'center',
          scopedSlots: {
            filterDropdown: 'Категория',
            filterIcon: 'filterIcon',
            customRender: 'nameКатегория' }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Суб-Категория'),
          align: 'center',
          scopedSlots: {
            filterDropdown: 'Суб_Категория',
            filterIcon: 'filterIcon',
            customRender: 'sub_account_category' }
          // dataIndex: 'account_number',
        },
        {
          title: this.$t('Тип суб-аккаунта'),
          align: 'center',
          scopedSlots: {
            // filterDropdown: 'Категория',
            // filterIcon: 'filterIcon',
            customRender: 'type' }
          // dataIndex: 'account_number',
        }
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: 120,
        //   scopedSlots: { customRender: 'action' }
        // }
      ]
    }
  },
  computed: {
    ...mapGetters(['SubAcountList', 'SunPagnation']),
    getPagination () {
      return this.SunPagnation
    },
    getUserListTable () {
      return this.SubAcountList
    }
  },
  methods: {
    SubAcountGlobslSearch (val) {
      this.params.search = val
      this.SubAcountGetListAll()
    },
    NumberAcountSearch (val, e) {
      console.log(val)
      this.params.account_number = val === '' ? null : val
      this.SubAcountGetListAll()
    },
    handleChangeSelect (val, event) {
      this.params.sub_account_category_id = val
      this.SubAcountGetListAll()
    },
    handleChangeSelectcatigory (val) {
      this.params.category_id = val
      this.SubAcountGetListAll()
    },
    SubAcountCreate () {
      this.$router.push({ name: 'SubacountCreate' })
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
    ...mapActions(['GetSubAcountListAll']),
    SubAcountGetListAll () {
      this.loading = true
      this.GetSubAcountListAll(this.params)
        .finally(() => {
          this.loading = false
        })
    },
    customRowClick (val) {
      return {
        on: {
          click: (event) => {
            this.$router.push({ name: 'SubacountUpdate', params: { id: val.id } })
          }
        }
      }
      // console.log(val.id)
    },
    onSearch (value) {
      console.log(value)
      this.params.search = value
      this.SubAcountGetListAll()
    },
    handleTableChange (pagination) {
      this.params.page = { ...pagination }
      console.log(pagination)
      this.SubAcountGetListAll()
    }
  },
  mounted () {
  },
  created () {
    this.SubAcountGetListAll()
  }
}
</script>
<style scoped>
.fonSize {
  font-size: 16px;
}
.pointer {
  cursor: pointer;
}

</style>
