<template>
  <a-card>
    <div slot="title">{{$t('writing')}}</div>
    <div slot="extra" style="display: flex; gap: 5px">
      <a-input v-model="params.search" v-debounce="Search">
        <a-icon @click="Searches" style="color: blue" slot="addonAfter" type="search" />
      </a-input>
      <a-button  icon="dowlond" style="background-color: #1890FF; color: white; border:none">
        <a-icon :component="myIcons.excal"></a-icon></a-button>
    </div>
    <a-card>
      <a-table
        style="margin-top: 30px; cursor: pointer"
        :columns="columns"
        :rowKey="() => Math.random()"
        :dataSource="GetwritingData"
        :pagination="getFullPagination"
        :loading="loading"
        :customRow="customRowClick"
        @change="handleTableChangeOfline"
        test-attr="list-customer"
        bordered
      >
        <div slot="Aккаунта" style="padding: 8px; width: 230px;">
          <a-select
            :placeholder="$t('Тип аккаунта')"
            style="width: 220px"
            allowClear
          >
          </a-select>
        </div>
        <div
          slot="аккаунта"
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
    </a-card>
  </a-card>
</template>

<script>
import myIcons from '@/core/icons'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      myIcons,
      loading: false,
      columns: [],
      params: {
        search: '',
        page: { current: 1, pageSize: 10, total: null }
      }
    }
  },
  computed: {
    GetwritingData () {
      return []
    }
  },
  methods: {
    ...mapActions(['writingList']),
    handleTableChangeOfline (paginotion) {
      this.loading = true
      this.params.page = { ...paginotion }
      this.writingGetAllList()
    },
    customRowClick (record) {
      return {
        on: {
          click: (event) => {
          }
        }
      }
    },
    Search (val) {
      console.log(val)
    },
    Searches (val) {
      console.log(val)
    },
    writingGetAllList () {
      this.loading = true
      this.writingList(this.params)
      .finally(() => {
        this.loading = false
      })
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
