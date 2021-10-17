<template>
  <a-card>
    <a-card :bordered="false">
      <div slot="title">
        {{ $t('transfer') }}
      </div>
      <div slot="extra">
        <div slot="extra" style="display: flex; gap: 5%">
          <div style="display: flex; gap: 5%; justify-content: flex-end">
            <a-range-picker
              style="width: 260px"
              :defaultValue="[moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]"
              @change="rangePickerDate"
            ><a-icon type="calendar" style="color: blue" slot="suffixIcon"/></a-range-picker>
            <a-button icon="dowlond" style="background-color: #1890FF; color: white; border: none">
              <a-icon :component="myIcons.excal"></a-icon></a-button>
          </div>
        </div>

      </div>
      <a-tabs type="card" @change="callback">
        <a-tab-pane key="1" tab="Всё">
          <everything ref="everything" :statustype="`accepted`"></everything>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Принято">
          <Accepted ref="accepted"></Accepted>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Отклоненный">
          <Rejected ref="rejected"></Rejected>
        </a-tab-pane>
        <a-tab-pane key="4" tab="В процессе">
          <During ref="during"></During>
        </a-tab-pane>
        <a-tab-pane key="5" tab="Не полные">
          <Complited ref="complited"></Complited>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
</template>

<script>
import moment from 'moment'
import TabTwoList from '../transfer/transferTwoTabsList'
import myIcons from '@/core/icons'
import everything from '@/views/reports/transfer/everything'
import accepted from '@/views/reports/transfer/accepted'
import rejected from '@/views/reports/transfer/rejected'
import during from '@/views/reports/transfer/during'
import complietd from '@/views/reports/transfer/complietd'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    TabTwoList,
    everything,
   'Accepted': accepted,
    'Rejected': rejected,
    'During': during,
    'Complited': complietd
  },
  data () {
    return {
      myIcons,
      active: 1
    }
  },
  computed: {
...mapGetters(['activTab'])
  },
  methods: {
    ...mapActions(['setAtiveTab']),
    callback (key) {
      this.active = parseInt(key)
      this.setAtiveTab(parseInt(key))
    },
    rangePickerDate (val, data) {
      const fromdate = data[0]
      const todate = data[1]
      console.log('dataaaaaa ====', data)
      if (this.active === 1) {
        this.$refs.everything.SearchData({ from_date: fromdate, to_date: todate })
      }
      if (this.active === 2) {
        this.$refs.accepted.SearchData({ from_date: fromdate, to_date: todate })
      }
      if (this.active === 3) {
        this.$refs.rejected.SearchData({ from_date: fromdate, to_date: todate })
      }
      if (this.active === 4) {
        this.$refs.during.SearchData({ from_date: fromdate, to_date: todate })
      }
      if (this.active === 5) {
        this.$refs.complited.SearchData({ from_date: fromdate, to_date: todate })
      }
      // everything accepted rejected during complited
    },
    moment },
  mounted () {
  },
  created () {
  }
}
</script>

<style scoped>
.fonSize {
  font-size: 16px;
  cursor: pointer;
}
</style>
