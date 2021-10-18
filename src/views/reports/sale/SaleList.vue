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
              style="width: 260px"
              :value="date"
              :placeholder="['от даты ', 'до даты']"
              v-model="date"
            >
              <a-icon type="calendar" style="color: #1890FF" slot="suffixIcon"/>
            </a-range-picker>
            <a-button icon="dowlond" style="background-color: #1890FF; color: white; border:none">
              <a-icon :component="$myIcons.excal"></a-icon></a-button>
          </div>
        </div>
      </div>

      <a-tabs type="card" @change="callback">
        <a-tab-pane key="1" tab="Офлайн">
          <offline-orders-tab :date="date" />
        </a-tab-pane>

        <a-tab-pane key="2" tab="Заклад">
          <bookmark-tab :date="date" />
        </a-tab-pane>
      </a-tabs>

    </a-card>
  </a-card>
</template>

<script>
import moment from 'moment'
import OfflineOrdersTab from './tabs/OfflineOrdersTab.vue'
import BookmarkTab from './tabs/BookmarkTab.vue'

export default {
  components: {
    OfflineOrdersTab,
    BookmarkTab
  },
  data: () => ({
    date: [moment().startOf('month'), moment().endOf('month')]
  }),
  methods: {
    callback (key) {
      console.log(key)
    }
  }
}
</script>
