<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/customers/list" test-attr="prev-link-customer">{{ $t('customers') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :title="$t('update')" class="breadcrumb-row" :bordered="false">
    </a-card>

    <a-card :bordered="false">
      <v-main></v-main>
    </a-card>
  </div>
</template>
<script>
import vMain from './v-main'
export default {
  data () {
    return {
      // activeTabKey: '1'
    }
  },
  components: { 'v-main': vMain }
}
</script>
<style>
/* .ant-tabs-tab {
  min-width: 150px;
}
.ant-tabs-tab span {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active span{
  color: red;
}
.flag-icon {
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
} */
</style>
