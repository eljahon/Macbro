<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/customers/list">{{ $t('customers') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card :title="$t('fillIn')">
      <a-row>
        <v-main></v-main>
      </a-row>
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
