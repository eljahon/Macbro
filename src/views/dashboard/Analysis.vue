<template>
  <div>
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
      <!-- <a-col :sm="24" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="orders" :total="this.ordersCount | NumberFormat">
          <a-tooltip title="orders" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
          </div>
          <template slot="footer">daily orders <span>60</span></template>
        </chart-card>
        <a-card>
          <line-chart line-chart v-if="!loading" :data="lineChartData" :labels="labels"></line-chart>
        </a-card>
      </a-col> -->
      <!-- <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="运营活动效果" total="78%">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col> -->
    </a-row>
    <!-- <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>Today</a>
              <a>This week</a>
              <a>This month月</a>
              <a>This year</a>
            </div>
            <a-range-picker :style="{width: '256px'}" />
          </div>
          <a-tab-pane loading="true" tab="Sales" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData" title="Sales ranking" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="Clients" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData2" title="Clients" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card> -->

    <!-- <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" title="线上热门搜索" :style="{ height: '100%' }">
            <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
              <a class="ant-dropdown-link" href="#">
                <a-icon type="ellipsis" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">操作一</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">操作二</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-row :gutter="68">
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <number-info :total="12321" :sub-total="17.1">
                  <span slot="subtitle">
                    <span>搜索用户数</span>
                    <a-tooltip title="指标说明" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }" />
                    </a-tooltip>
                  </span>
                </number-info>
                miniChart
                <div>
                  <mini-smooth-area :style="{ height: '45px' }" :dataSource="searchUserData" :scale="searchUserScale" />
                </div>
              </a-col>
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <number-info :total="2.7" :sub-total="26.2" status="down">
                  <span slot="subtitle">
                    <span>人均搜索次数</span>
                    <a-tooltip title="指标说明" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }" />
                    </a-tooltip>
                  </span>
                </number-info>
                miniChart
                <div>
                  <mini-smooth-area :style="{ height: '45px' }" :dataSource="searchUserData" :scale="searchUserScale" />
                </div>
              </a-col>
            </a-row>
            <div class="ant-table-wrapper">
              <a-table
                row-key="index"
                size="small"
                :columns="searchTableColumns"
                :dataSource="searchData"
                :pagination="{ pageSize: 5 }"
              >
                <span slot="range" slot-scope="text, record">
                  <trend :flag="record.status === 0 ? 'up' : 'down'">
                    {{ text }}%
                  </trend>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="销售额类别占比" :style="{ height: '100%' }">
            <div slot="extra" style="height: inherit;">
              style="bottom: 12px;display: inline-block;"
              <span class="dashboard-analysis-iconGroup">
                <a-dropdown :trigger="['click']" placement="bottomLeft">
                  <a-icon type="ellipsis" class="ant-dropdown-link" />
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a href="javascript:;">操作一</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">操作二</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
              <div class="analysis-salesTypeRadio">
                <a-radio-group defaultValue="a">
                  <a-radio-button value="a">全部渠道</a-radio-button>
                  <a-radio-button value="b">线上</a-radio-button>
                  <a-radio-button value="c">门店</a-radio-button>
                </a-radio-group>
              </div>

            </div>
            <h4>销售额</h4>
            <div>
              style="width: calc(100% - 240px);"
              <div>
                <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="item*percent" />
                  <v-axis />
                  position="right" :offsetX="-140"
                  <v-legend dataKey="item"/>
                  <v-pie position="percent" color="item" :vStyle="pieStyle" />
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                </v-chart>
              </div>

            </div>
          </a-card>
        </a-col>
      </a-row>
    </div> -->
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
