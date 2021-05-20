<template>
  <div style="display: flex; flex-direction: column">
    <breadcrumb-row>
      <a-breadcrumb style="margin: 10px 5px" slot="links">
        <a-breadcrumb-item>
          <router-link to="/orders/list" test-attr="prev-link-order">{{ $t('orders') }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('update') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </breadcrumb-row>

    <a-card class="breadcrumb-row" :bordered="false" >
      <div slot="title">
        <p>{{ this.$route.params.id ? $t('update') : $t('fillIn') }}</p>
      </div>
      <div slot="extra">
        <a-button type="primary" v-if="$route.query.tab === '2'" @click="update"><a-icon type="plus"></a-icon>{{ $t('add') }} </a-button>
        <a-button type="primary" v-if="$route.query.tab === '3'"><a-icon type="download"></a-icon></a-button>
      </div>
    </a-card>

    <a-card :bordered="false" style="flex: 1">
      <a-row>
        <v-main ref="newordercreate"></v-main>
      </a-row>
    </a-card>
    <a-row class="edit-btns">
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button @click.prevent="resetForm" test-attr="reset-order">
            {{ $t('reset') }}
          </a-button>
          <a-button type="primary" style="margin-left: 10px;" html-type="submit" @click.prevent="submit" test-attr="save-order">
            {{ $t('save') }}
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
      console.log('submit=======>')
        this.$refs.newordercreate.onSubmit()
    },
    resetForm () {
        this.$refs.newordercreate.resetForm()
    },
    update () {
      this.$refs.newordercreate.addProduct()
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
