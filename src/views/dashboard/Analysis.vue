<template>
  <div>
<!--    <a-card>-->

<!--      <div slot="title">-->
<!--        <span>Сумма Продаж</span>-->
<!--      </div>-->
<!--      <div slot="extra">-->
<!--        <a-date-picker @change="onChange" placeholder='DD/MM/YYYY'>-->
<!--          <a-icon slot="calendar" type="smile" />-->
<!--        </a-date-picker>-->
<!--      </div>-->
<!--    </a-card>-->
<!--  </div>-->
        <a-row :gutter="24">
          <a-col :sm="24" :style="{ marginBottom: '24px' }">
            <chart-card :loading="ordersLoading" :title="$t('sum_stat')" :total="numToPrice(sum)">
              <a-tooltip :title="$t('sum_stat')" slot="action">
                <a-icon type="info-circle-o" />
              </a-tooltip>
              <template slot="footer">{{ $t('sum_average') }} <span>{{ this.numToPrice((this.sum / this.ordersInterval ).toFixed(0)) }}</span></template>
            </chart-card>
            <a-card>
              <line-chart :title="$t('sum_stat')" v-if="!ordersLoading" :data="sumData" :labels="ordersLabels"></line-chart>
            </a-card>
          </a-col>
          <a-col :sm="24" :style="{ marginBottom: '24px' }">
            <chart-card :loading="ordersLoading" :title="$t('orders_stat')" :total="ordersCount">
              <a-tooltip :title="$t('orders_stat')" slot="action">
                <a-icon type="info-circle-o" />
              </a-tooltip>
              <template slot="footer">{{ $t('orders_average') }} <span>{{ (this.ordersCount / this.ordersInterval ).toFixed(2) }}</span></template>
            </chart-card>
            <a-card>
              <line-chart :title="$t('orders_stat')" v-if="!ordersLoading" :data="ordersData" :labels="ordersLabels"></line-chart>
            </a-card>
          </a-col>
          <a-col :sm="24" :style="{ marginBottom: '24px' }">
            <chart-card :loading="clientsLoading" :title="$t('clients_stat')" :total="clientsCount">
              <a-tooltip :title="$t('clients_stat')" slot="action">
                <a-icon type="info-circle-o" />
              </a-tooltip>
              <div>
              </div>
              <template slot="footer">{{ $t('orders_average') }} <span> {{ (this.clientsCount / this.clientsInterval).toFixed(2) }}</span></template>
            </chart-card>
            <a-card>
              <line-chart :title="$t('clients_stat')" v-if="!clientsLoading" :data="clientsData" :labels="clientsLabels"></line-chart>
            </a-card>
          </a-col>
        </a-row>
  </div>
</template>

<script>
import {
  ChartCard
} from '@/components'
import LineChart from '@/utils/lineChart'
// import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
import { filterLastWeekOrders, getChartData, getChartLabels, getInterval, getSumOfOrders, getSumChartData, getClientChartData } from '@/utils/weekFilters'
import numberToPrice from '@/utils/numberToPrice'

export default {
  name: 'Analysis',
  components: {
    ChartCard,
    LineChart
  },
  data () {
    return {
      // orders
      orders: null,
      ordersCount: null,
      ordersData: null,
      ordersLabels: null,
      ordersInterval: null,
      ordersLoading: true,
      // clients
      clients: null,
      clientsCount: null,
      clientsData: null,
      clientsLabels: null,
      clientsInterval: null,
      clientsLoading: true,
      // sum
      sum: 1,
      sumData: null
    }
  },
  computed: {},
  mounted () {
    request({
    url: '/order?limit=1000',
    method: 'get'
    }).then(res => {
        this.orders = res.orders
        this.ordersCount = res.count
        const weeklyFiltered = filterLastWeekOrders(this.orders)
        this.ordersData = getChartData(weeklyFiltered)
        this.ordersLabels = getChartLabels(weeklyFiltered)
        this.ordersInterval = getInterval(this.orders)
        this.sum = getSumOfOrders(weeklyFiltered)
        this.sumData = getSumChartData(weeklyFiltered)
      })
      .catch(err => console.error(err))
      .finally(() => (this.ordersLoading = false))
    request({
      url: '/user',
      method: 'get',
      parmas: { user_type: 'client' }
    }).then(res => {
        this.clients = res.users
        this.clientsCount = res.count
        const weeklyFiltered = filterLastWeekOrders(this.clients)
        this.clientsData = getClientChartData(weeklyFiltered)
        this.clientsLabels = getChartLabels(weeklyFiltered)
        this.clientsInterval = getInterval(this.clients)
      })
      .catch(err => console.error(err))
      .finally(() => (this.clientsLoading = false))
  },
  methods: {
    numToPrice (num) {
      return numberToPrice(num)
    },
    onChange (date, dateString) {
      console.log(date, dateString)
    }
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
