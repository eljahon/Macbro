<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px">
        <a-breadcrumb-item>
          <router-link to="/catalog/brands/list" test-attr="prev-link-brand">{{ $t('brands') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <v-main></v-main>
  </div>
</template>
<script>
import vMain from './v-main'
export default {
  data () {
    return {
      // activeTabKey: '1'
      edit: !!this.$route.params.id
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
