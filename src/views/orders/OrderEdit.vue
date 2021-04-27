<template>
  <div>
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/orders/list" test-attr="prev-link-order">{{ $t('orders') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('update') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card :title="this.$route.params.id ? $t('update') : $t('fillIn')" class="breadcrumb-row" :bordered="false">
    </a-card>

    <a-card :bordered="false">
      <a-row>
        <v-main ref="orderDetailsEdit"></v-main>
      </a-row>
    </a-card>
    <a-row class="edit-btns">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button type="primary" html-type="submit" @click.prevent="submit" test-attr="save-order">
            {{ $t('save') }}
          </a-button>
          <a-button style="margin-left: 10px;" @click.prevent="resetForm" test-attr="reset-order">
            {{ $t('reset') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
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
  components: { 'v-main': vMain },
  methods: {
    submit () {
      console.log('submit')
        this.$refs.orderDetailsEdit.onSubmit()
    },
    resetForm () {
        this.$refs.orderDetailsEdit.resetForm()
    }
  }
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
