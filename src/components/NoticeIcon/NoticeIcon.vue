<!--<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '400px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loading">
        <a-tabs>
          <a-tab-pane :tab="$t('new')" key="1">
            <a-list>
              <a-list-item>
                <a-list-item-meta :title="$t('new')" >
                  <router-link slot="avatar" to="/orders/new">
                    <a-avatar style="background-color: white" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                  </router-link>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="Fuqaro" key="2">
            <a-list>
              <a-list-item>
                <a-list-item-meta title="Fuqaro ariza">
                  <router-link slot="avatar" to="/">
                    <a-avatar style="background-color: white" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                  </router-link>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="Fuqaro ariza">
                  <router-link slot="avatar" to="/settings">
                    <a-avatar style="background-color: white" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                  </router-link>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="Fuqaro ariza">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge :count="getTotal">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HeaderNotice',
  data () {
    return {
      loading: false,
      visible: false
    }
  },
  computed: {
    ...mapGetters(['new', 'new_pagination']),
    getTotal () {
      return this.new_pagination.total
    }
  },
  methods: {
    fetchNotice () {
      // this.visible = !this.visible
      // setTimeout(() => {
      //   this.visible = false
      // }, 5000)
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style> -->
